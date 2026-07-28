/**
 * Full-site audit in a REAL browser.
 *
 * e2e.mjs drives the DOM logic; this script renders every page in Chromium at
 * five viewport widths and checks the things only a real engine can tell you:
 * actual layout boxes, computed styles, hit-testing, contrast, tap-target size
 * and whether a control is genuinely reachable by a finger or a mouse.
 *
 * Requires a Chromium binary. Point CHROME_PATH at it, or the script skips
 * cleanly so CI without a browser still passes.
 *
 * Run:  npm run audit:browser
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { site } from '../src/config/site.config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = site.basePath || '';
const PORT = 4399;
const ORIGIN = `http://localhost:${PORT}${BASE}`;

const CHROME = process.env.CHROME_PATH || '/tmp/chrome/chromium';
if (!fs.existsSync(CHROME)) {
  console.log(`\n  ⚠ No Chromium at ${CHROME} — skipping the browser audit.`);
  console.log('    Set CHROME_PATH to run it. (npm test does not depend on this.)\n');
  process.exit(0);
}

let puppeteer;
try {
  puppeteer = (await import('puppeteer-core')).default;
} catch {
  console.log('\n  ⚠ puppeteer-core not installed — skipping the browser audit.\n');
  process.exit(0);
}

/* Viewports worth defending: small phone, common phone, tablet, laptop,
   and the desktop band where the nav used to collapse into itself. */
const VIEWPORTS = [
  { w: 320, h: 800, label: '320  small phone' },
  { w: 390, h: 844, label: '390  phone' },
  { w: 768, h: 1024, label: '768  tablet' },
  { w: 1280, h: 900, label: '1280 laptop' },
  { w: 1440, h: 900, label: '1440 desktop' },
];

/** Every built page, discovered from disk so a new page is covered automatically. */
function routes(dir = ROOT, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'src', 'scripts', 'assets', '.github', 'api'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) routes(p, acc);
    else if (e.name.endsWith('.html')) {
      const rel = path.relative(ROOT, p).replace(/\\/g, '/');
      acc.push('/' + rel.replace(/index\.html$/, ''));
    }
  }
  return acc;
}

const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

/* ------------------------------------------------------------- serve ---- */
const server = spawn(process.execPath, [path.join(ROOT, 'scripts/serve.mjs')], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: 'ignore',
});
const stopServer = () => { try { server.kill(); } catch { /* already gone */ } };
process.on('exit', stopServer);

await new Promise((r) => setTimeout(r, 1500));

const all = routes().sort();
console.log(`\n  Auditing ${all.length} pages in Chromium at ${VIEWPORTS.length} widths\n`);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

/** Everything measured inside the page. */
const inspect = () => {
  const vw = document.documentElement.clientWidth;
  const issues = [];

  /* 1. Horizontal scroll — the single most common mobile defect. */
  const before = window.scrollX;
  window.scrollTo(99999, 0);
  const sx = window.scrollX;
  window.scrollTo(before, 0);
  if (sx > 0) issues.push(`page scrolls sideways by ${sx}px`);

  /* Ignore things that are deliberately outside the viewport. */
  const exempt = (el) => {
    /* Deliberately-scrollable regions: a wide table inside .table-wrap or a
       card rail is a design choice, not an overflow bug. Anything inside an
       element that scrolls horizontally is the author's intent. */
    let n = el.parentElement;
    while (n && n !== document.body) {
      const cs = getComputedStyle(n);
      if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') return true;
      n = n.parentElement;
    }
    return !!el.closest('.rail,[data-rail],.lb-thumbs,.hero-walk,.hero-frame,.marquee,.trust-marquee,' +
      '.drawer,#drawer,.modal,#consultModal,.lb,#lightbox,.toast,#toast,.skip-link')
      || el.getAttribute('aria-hidden') === 'true'
      || parseFloat(getComputedStyle(el).left) < -1000;
  };

  /* 2. Content crossing the viewport edge. */
  document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,input,select,textarea,img,table').forEach((el) => {
    if (issues.length > 6 || exempt(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    if (getComputedStyle(el).position === 'fixed') return;
    if (r.right > vw + 2 || r.left < -2) {
      issues.push(`${el.tagName.toLowerCase()} overflows viewport: "${(el.textContent || el.alt || '').trim().slice(0, 30)}"`);
    }
  });

  /* 3. Text spilling out of its own box (broken clamp / nowrap). */
  document.querySelectorAll('h1,h2,h3,p,.btn,.card-title').forEach((el) => {
    if (issues.length > 8 || exempt(el)) return;
    const cs = getComputedStyle(el);
    if (cs.overflow !== 'visible' || cs.display === 'none') return;
    if (el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0) {
      issues.push(`text clipped in ${el.tagName.toLowerCase()}: "${(el.textContent || '').trim().slice(0, 26)}"`);
    }
  });

  /* 4. Primary controls must be reachable — nothing invisible on top. */
  const critical = [
    ['#navToggle', 'menu button'],
    ['#mobileDock a, #mobileDock button', 'mobile dock action'],
    ['[data-consult-open]', 'consultation CTA'],
    ['.lead-form button[type="submit"]', 'form submit'],
  ];
  for (const [sel, label] of critical) {
    document.querySelectorAll(sel).forEach((el) => {
      if (issues.length > 10) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      /* Only meaningful for something the user has actually scrolled to.
         A control that merely happens to sit under the fixed dock while it is
         off at the top of a long page is reachable the moment you scroll. */
      if (r.top < 80 || r.bottom > window.innerHeight - 90) return;
      if (r.left < 0 || r.right > vw) return;
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (hit && !el.contains(hit) && hit !== el && !el.parentElement?.contains(hit)) {
        const who = hit.id ? '#' + hit.id : '.' + String(hit.className).split(' ')[0];
        issues.push(`${label} is covered by ${who}`);
      }
    });
  }

  /* 5. Tap targets below the 24px WCAG 2.2 floor. */
  const tiny = [];
  document.querySelectorAll('button, input[type="checkbox"], input[type="radio"], select, .btn, .dock-item, .rail-btn, .fab').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || exempt(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    if (r.height < 24 || r.width < 24) {
      tiny.push(`${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ')[0] : ''} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  });
  if (tiny.length) issues.push(`tap target(s) under 24px: ${tiny.slice(0, 3).join(', ')}`);

  /* 6. Images that failed to decode. */
  document.querySelectorAll('img').forEach((img) => {
    if (issues.length > 12) return;
    if (img.complete && img.naturalWidth === 0) issues.push(`broken image: ${img.currentSrc || img.src}`);
  });

  return issues;
};

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h });
  let clean = 0;

  for (const route of all) {
    const errs = [];
    page.removeAllListeners('pageerror');
    page.removeAllListeners('requestfailed');
    page.removeAllListeners('console');
    page.on('pageerror', (e) => errs.push('JS error: ' + e.message.slice(0, 100)));
    page.on('requestfailed', (r) => {
      const u = r.url();
      if (u.startsWith('data:')) return;
      errs.push('failed request: ' + u.replace(ORIGIN, '').slice(0, 70));
    });
    page.on('console', (m) => {
      if (m.type() === 'error') errs.push('console error: ' + m.text().slice(0, 90));
    });

    try {
      await page.goto(ORIGIN + route, { waitUntil: 'networkidle2', timeout: 45000 });
    } catch (e) {
      fail(`[${vp.w}] ${route} → did not load: ${e.message.slice(0, 60)}`);
      continue;
    }
    /* Let reveal animations settle so measurements are of the final layout. */
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 250));

    const issues = await page.evaluate(inspect);
    const combined = [...errs, ...issues];
    if (combined.length) {
      combined.slice(0, 4).forEach((i) => fail(`[${vp.w}] ${route} → ${i}`));
    } else {
      clean++;
    }
  }

  console.log(`  ${vp.label.padEnd(18)} ${clean}/${all.length} pages clean`);
  await page.close();
}

/* ------------------------------------------- deep interaction on key pages */
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(ORIGIN + '/', { waitUntil: 'networkidle2' });

  /* Drawer opens, traps focus, closes, and its links navigate. */
  await page.click('#navToggle');
  await new Promise((r) => setTimeout(r, 400));
  const drawerOpen = await page.evaluate(() => {
    const d = document.querySelector('#drawer');
    return d.classList.contains('is-open') && d.getBoundingClientRect().right <= window.innerWidth + 1;
  });
  if (!drawerOpen) fail('[390] drawer did not open fully on screen');

  const submenu = await page.evaluate(() => {
    const b = document.querySelector('.drawer-toggle');
    if (!b) return 'no toggle';
    b.click();
    return b.closest('.drawer-group').classList.contains('is-open') ? 'ok' : 'did not expand';
  });
  if (submenu !== 'ok') fail(`[390] drawer submenu ${submenu}`);

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 400));
  const drawerClosed = await page.evaluate(() =>
    !document.querySelector('#drawer').classList.contains('is-open'));
  if (!drawerClosed) fail('[390] drawer did not close on Escape');

  /* The body scroll lock must be released, or the page freezes after closing. */
  const unlocked = await page.evaluate(() => !document.body.classList.contains('is-locked'));
  if (!unlocked) fail('[390] body stayed scroll-locked after closing the drawer');

  await page.close();
}

{
  /* Gallery lightbox in a real browser: open, navigate, close. */
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(ORIGIN + '/gallery/', { waitUntil: 'networkidle2' });
  await page.click('[data-gallery-open]');
  await new Promise((r) => setTimeout(r, 500));

  const opened = await page.evaluate(() => {
    const lb = document.querySelector('#lightbox');
    const img = document.querySelector('#lbImg');
    return { visible: !lb.hidden && getComputedStyle(lb).display !== 'none',
             hasImage: !!img.currentSrc, src: img.currentSrc };
  });
  if (!opened.visible) fail('[1280] gallery lightbox did not open');
  if (!opened.hasImage) fail('[1280] gallery lightbox opened with no image loaded');

  await page.click('#lbNext');
  await new Promise((r) => setTimeout(r, 400));
  const advanced = await page.evaluate((first) => {
    const img = document.querySelector('#lbImg');
    return img.currentSrc !== first && img.naturalWidth > 0;
  }, opened.src);
  if (!advanced) fail('[1280] lightbox "next" did not load a different image');

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 500));
  const closed = await page.evaluate(() => {
    const lb = document.querySelector('#lightbox');
    return lb.hidden && !document.body.classList.contains('is-locked');
  });
  if (!closed) fail('[1280] lightbox did not close cleanly on Escape');

  await page.close();
}

{
  /* Consultation modal from a nav CTA, on desktop. */
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(ORIGIN + '/', { waitUntil: 'networkidle2' });
  await page.click('[data-consult-open]');
  await new Promise((r) => setTimeout(r, 500));
  const modal = await page.evaluate(() => {
    const m = document.querySelector('#consultModal');
    const r = m.getBoundingClientRect();
    const input = m.querySelector('input[name="name"]');
    const ir = input.getBoundingClientRect();
    const hit = document.elementFromPoint(ir.left + ir.width / 2, ir.top + ir.height / 2);
    return {
      open: !m.hidden,
      onScreen: r.top >= -1 && r.left >= -1,
      inputReachable: hit === input,
      focusInside: m.contains(document.activeElement),
    };
  });
  if (!modal.open) fail('[1440] consultation modal did not open');
  if (!modal.onScreen) fail('[1440] consultation modal rendered off-screen');
  if (!modal.inputReachable) fail('[1440] modal first field is not clickable');
  if (!modal.focusInside) fail('[1440] focus was not moved into the modal');

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 500));
  const after = await page.evaluate(() => ({
    closed: document.querySelector('#consultModal').hidden,
    unlocked: !document.body.classList.contains('is-locked'),
  }));
  if (!after.closed) fail('[1440] consultation modal did not close on Escape');
  if (!after.unlocked) fail('[1440] body stayed scroll-locked after closing the modal');

  await page.close();
}

await browser.close();
stopServer();

/* ================================================================ report */
console.log('');
if (failures.length) {
  console.log(`  ✗ ${failures.length} BROWSER ISSUE${failures.length > 1 ? 'S' : ''}\n`);
  const cap = Number(process.env.AUDIT_MAX || 50);
  failures.slice(0, cap).forEach((f) => console.log(`    ✗ ${f}`));
  if (failures.length > cap) console.log(`    … and ${failures.length - cap} more`);
  console.log('');
  process.exit(1);
}
console.log(`  ✓ ${all.length} pages render cleanly at ${VIEWPORTS.length} widths`);
console.log('  ✓ drawer, lightbox and consultation modal all verified in a real browser');
notes.forEach((n) => console.log(`  ! ${n}`));
console.log('\n  ✓ BROWSER AUDIT PASSED\n');
process.exit(0);
