/**
 * Headless functional test of the BUILT site.
 *
 * check.mjs validates markup/links, verify.mjs validates the brief.
 * THIS script boots every built page in a DOM, runs the real assets/js/app.js,
 * and drives the interactive components the way a visitor would — so a handler
 * that throws, a selector that matches nothing or a control that is wired to
 * the wrong element fails the build instead of shipping silently.
 *
 * Run:  npm run e2e
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';
import { site } from '../src/config/site.config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = site.basePath || '';

const errors = [];
const passes = [];
const fail = (m) => errors.push(m);
const pass = (m) => passes.push(m);

function htmlFiles(dir = ROOT, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'src', 'scripts', 'assets', '.github'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const files = htmlFiles().sort();
const rel = (f) => '/' + path.relative(ROOT, f).replace(/\\/g, '/');
const appJs = fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8');

/* --------------------------------------------------------------- DOM boot */

/** Load a built page, execute app.js, return { dom, win, doc, jsErrors }. */
async function boot(file) {
  const html = fs.readFileSync(file, 'utf8');
  const jsErrors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => jsErrors.push(e.message));
  vc.on('error', (m) => jsErrors.push(String(m)));

  const dom = new JSDOM(html, {
    url: `https://example.test${BASE}${rel(file).replace(/index\.html$/, '')}`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole: vc,
    resources: undefined,
  });

  const win = dom.window;

  /* Let jsdom finish parsing before the runtime boots, exactly like a browser */
  if (win.document.readyState !== 'complete') {
    await new Promise((resolve) => win.addEventListener('load', resolve, { once: true }));
  }

  /* jsdom gaps that the runtime legitimately uses */
  if (!win.matchMedia) {
    win.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
  win.scrollTo = () => {};
  win.HTMLElement.prototype.scrollBy = function (opts) {
    this.scrollLeft = Math.max(0, this.scrollLeft + ((opts && opts.left) || 0));
    this.dispatchEvent(new win.Event('scroll'));
  };
  win.HTMLElement.prototype.scrollIntoView = function () {};
  if (!win.Element.prototype.setPointerCapture) win.Element.prototype.setPointerCapture = function () {};
  if (!win.Element.prototype.releasePointerCapture) win.Element.prototype.releasePointerCapture = function () {};

  /* Give laid-out elements a non-zero box so visibility filters behave */
  Object.defineProperty(win.HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get() { return this.ownerDocument.body; },
  });

  win.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; this.targets = []; }
    observe(t) {
      this.targets.push(t);
      this.cb([{ isIntersecting: true, target: t, intersectionRatio: 1 }], this);
    }
    unobserve() {} disconnect() {} takeRecords() { return []; }
  };
  win.requestIdleCallback = (fn) => win.setTimeout(() => fn({ didTimeout: false, timeRemaining: () => 10 }), 0);
  win.cancelIdleCallback = (id) => win.clearTimeout(id);

  /* Record what the page tries to POST + where it tries to navigate */
  const net = [];
  win.fetch = (url, opts) => {
    net.push({ url: String(url), opts });
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }), text: () => Promise.resolve('{}') });
  };
  win.__net = net;

  const opened = [];
  win.open = (u) => { opened.push(String(u)); return null; };
  win.__opened = opened;

  try {
    win.eval(appJs);
  } catch (e) {
    jsErrors.push(`app.js threw at boot: ${e.message}`);
  }

  return { dom, win, doc: win.document, jsErrors, net, opened };
}

const $ = (doc, sel) => doc.querySelector(sel);
const $$ = (doc, sel) => Array.from(doc.querySelectorAll(sel));
const click = (win, el) => el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }));
const key = (win, target, k) => target.dispatchEvent(new win.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

console.log(`\n  Functionally testing ${files.length} built pages\n`);

/* ============================================================ 1. Every page */
let bootFailures = 0;
const pageCache = new Map();

for (const file of files) {
  const page = rel(file);
  let ctx;
  try {
    ctx = await boot(file);
  } catch (e) {
    fail(`${page} → could not boot: ${e.message}`);
    bootFailures++;
    continue;
  }
  const { win, doc, jsErrors } = ctx;

  if (jsErrors.length) {
    bootFailures++;
    jsErrors.slice(0, 3).forEach((m) => fail(`${page} → JS error: ${m}`));
  }

  /* The runtime must mark itself booted by dropping .no-js */
  if (doc.documentElement.classList.contains('no-js')) {
    fail(`${page} → app.js did not boot (html.no-js still present)`);
  }

  /* ---- Reveal animations must have fired (they gate content visibility) */
  const reveals = $$(doc, '.reveal, .reveal-stagger');
  const notRevealed = reveals.filter((el) => !el.classList.contains('is-in'));
  if (reveals.length && notRevealed.length) {
    fail(`${page} → ${notRevealed.length}/${reveals.length} .reveal elements never became visible`);
  }

  /* ---- Consultation modal opens from every trigger and closes on ESC */
  const trigger = $(doc, '[data-consult-open]');
  const modal = $(doc, '#consultModal');
  if (trigger && modal) {
    click(win, trigger);
    if (modal.hidden) fail(`${page} → consultation modal did not open on click`);
    key(win, doc, 'Escape');
    win.__advance = true;
    if (!modal.classList.contains('is-open') === false) {
      fail(`${page} → consultation modal did not start closing on Escape`);
    }
  }

  /* ---- Accordions toggle (pick one that starts closed) */
  const accBtn = $$(doc, '.acc-btn').find((b) => !b.closest('.acc-item').classList.contains('is-open'));
  if (accBtn) {
    const item = accBtn.closest('.acc-item');
    click(win, accBtn);
    if (!item.classList.contains('is-open')) fail(`${page} → accordion did not open`);
    if (accBtn.getAttribute('aria-expanded') !== 'true') fail(`${page} → accordion aria-expanded not synced`);
    click(win, accBtn);
    if (item.classList.contains('is-open')) fail(`${page} → accordion did not close`);
    if (accBtn.getAttribute('aria-expanded') !== 'false') fail(`${page} → accordion aria-expanded not reset`);
  }

  /* ---- Mobile drawer opens, traps and closes */
  const navToggle = $(doc, '#navToggle');
  const drawer = $(doc, '#drawer');
  if (navToggle && drawer) {
    click(win, navToggle);
    if (!drawer.classList.contains('is-open')) fail(`${page} → mobile drawer did not open`);
    if (navToggle.getAttribute('aria-expanded') !== 'true') fail(`${page} → drawer aria-expanded not synced`);
    key(win, doc, 'Escape');
    if (drawer.classList.contains('is-open')) fail(`${page} → mobile drawer did not close on Escape`);

    const dToggle = $(doc, '.drawer-toggle');
    if (dToggle) {
      click(win, navToggle);
      click(win, dToggle);
      const grp = dToggle.closest('.drawer-group');
      if (!grp.classList.contains('is-open')) fail(`${page} → drawer submenu did not expand`);
      key(win, doc, 'Escape');
    }
  }

  /* ---- Carousel rails: arrows must actually scroll the rail */
  $$(doc, '[data-rail]').forEach((wrap, i) => {
    const prev = wrap.querySelector('[data-rail-prev]');
    const next = wrap.querySelector('[data-rail-next]');
    if (!prev && !next) return;               // a rail body without controls is fine
    const railSel = wrap.getAttribute('data-rail');
    const rail = wrap.querySelector('.rail') || (railSel ? doc.querySelector(railSel) : null);
    if (!rail) {
      fail(`${page} → rail #${i}: arrows present but no .rail found (arrows are dead)`);
      return;
    }
    Object.defineProperty(rail, 'scrollWidth', { configurable: true, value: 3000 });
    Object.defineProperty(rail, 'clientWidth', { configurable: true, value: 1000 });
    rail.scrollLeft = 0;
    click(win, next);
    if (rail.scrollLeft <= 0) fail(`${page} → rail #${i}: "next" arrow did not scroll`);
    click(win, prev);
  });

  /* ---- Tabs switch panels */
  const tabWrap = $(doc, '[data-tabs]');
  if (tabWrap) {
    const tabs = $$(tabWrap, '.tab');
    if (tabs.length > 1) {
      const target = tabs[1];
      click(win, target);
      if (!target.classList.contains('is-active')) fail(`${page} → tab did not activate`);
      const id = target.dataset.tab;
      const panel = doc.querySelector(`.tab-panel[data-panel="${id}"]`);
      if (!panel) fail(`${page} → tab "${id}" has no matching panel`);
      else if (!panel.classList.contains('is-active')) fail(`${page} → tab "${id}" panel did not activate`);
    }
  }

  /* ---- Filters actually filter — EVERY pill, not just the first */
  const fGroup = $(doc, '[data-filter-group]');
  if (fGroup) {
    const pills = $$(fGroup, '.filter-pill');
    const targetSel = fGroup.dataset.filterTarget;
    const items = targetSel ? $$(doc, `${targetSel} [data-tags]`) : [];
    if (!targetSel) fail(`${page} → filter group has no data-filter-target`);
    else if (!items.length) fail(`${page} → filter target "${targetSel}" matches no items`);
    else {
      for (const pill of pills) {
        const f = pill.dataset.filter;
        if (!f) { fail(`${page} → filter pill "${pill.textContent.trim()}" has no data-filter`); continue; }
        click(win, pill);
        const expected = f === 'all' ? items : items.filter((it) => (it.dataset.tags || '').split(' ').includes(f));
        const shown = items.filter((it) => it.style.display !== 'none');
        if (!expected.length) {
          fail(`${page} → filter "${f}" (${pill.textContent.trim()}) matches ZERO items — dead filter shows an empty grid`);
        } else if (shown.length !== expected.length) {
          fail(`${page} → filter "${f}" showed ${shown.length}, expected ${expected.length}`);
        }
        if (pill.getAttribute('aria-pressed') !== 'true') fail(`${page} → filter "${f}" aria-pressed not synced`);
      }
      const all = pills.find((p) => p.dataset.filter === 'all');
      if (all) {
        click(win, all);
        if (items.some((it) => it.style.display === 'none')) fail(`${page} → "All" filter did not restore every item`);
      }
    }
  }

  /* ---- Map / video facades swap in an iframe on click */
  const facade = $(doc, '[data-embed]');
  if (facade) {
    click(win, facade);
    if (!facade.querySelector('iframe')) fail(`${page} → embed facade did not load an iframe on click`);
  }

  /* ---- Active nav state resolves for the current URL */
  const currentPath = win.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  const navLinks = $$(doc, '.nav-link[href], .drawer-link[href]');
  const shouldMatch = navLinks.some((a) => {
    const h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#') return false;
    return new win.URL(h, win.location.origin + win.location.pathname).pathname
      .replace(/index\.html$/, '').replace(/\/$/, '') === currentPath;
  });
  if (shouldMatch && !$(doc, '[aria-current="page"]')) {
    fail(`${page} → nav link for this page exists but was not marked aria-current`);
  }

  pageCache.set(page, true);
  ctx.dom.window.close();
}

if (!bootFailures) pass(`${files.length} pages boot with zero JS errors`);
pass(`${files.length} pages: modal, drawer, accordion, tabs, filters, rails and facades all respond`);

/* ================================================== 2. Lead form behaviour */
{
  const file = path.join(ROOT, 'contact/index.html');
  const { win, doc, net, opened } = await boot(file);
  const form = $(doc, 'form[data-lead-form]');

  if (!form) {
    fail('/contact/ → no lead form found');
  } else {
    /* a. empty submit must be blocked and must flag every required field */
    form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
    const required = $$(form, '[required]');
    const flagged = $$(form, '.has-error');
    if (net.length) fail('/contact/ → empty form was submitted to the network');
    if (!flagged.length) fail('/contact/ → empty submit produced no validation errors');
    else pass(`lead form blocks an empty submit and flags ${flagged.length} field(s)`);

    /* b. a bad phone number must be rejected */
    const phone = form.querySelector('[name="phone"]');
    phone.value = '123';
    phone.dispatchEvent(new win.Event('blur', { bubbles: true }));
    if (!phone.closest('.field').classList.contains('has-error')) {
      fail('/contact/ → 3-digit phone number was accepted as valid');
    } else pass('lead form rejects an invalid phone number');

    /* c. a complete, valid submit must reach the endpoint */
    form.querySelector('[name="name"]').value = 'Test Buyer';
    phone.value = '9811099110';
    form.querySelector('[name="city"]').value = 'Gurugram';
    form.querySelector('[name="home_type"]').value = 'Flat / Apartment';
    const consent = form.querySelector('[name="consent"]');
    if (consent) consent.checked = true;
    const emailField = form.querySelector('[name="email"]');
    if (emailField) emailField.value = 'buyer@example.com';

    net.length = 0;
    form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
    /* The WhatsApp fallback is deliberately delayed ~700ms so the user reads
       the toast first; wait past that before asserting. */
    await new Promise((r) => setTimeout(r, 1100));

    const action = form.getAttribute('action');
    if (!action || action === '#') {
      /* No endpoint configured yet. That is a valid pre-launch state — the
         form must then hand the enquiry to WhatsApp so no lead is lost.
         Verify that fallback actually fires. */
      if (!form.dataset.waFallback) {
        fail('/contact/ → no endpoint AND no WhatsApp fallback: leads would be lost');
      } else if (!opened.length) {
        fail('/contact/ → endpoint unset but the WhatsApp fallback never opened');
      } else {
        const waUrl = opened[0];
        for (const k of ['name', 'phone', 'city']) {
          if (!decodeURIComponent(waUrl).toLowerCase().includes(k)) {
            fail(`/contact/ → WhatsApp fallback message is missing "${k}"`);
          }
        }
        pass('lead form falls back to a pre-filled WhatsApp message when no endpoint is set');
        console.log('    ! site.forms.endpoint is empty — set it after deploying to Vercel');
      }
    } else if (!net.length) {
      fail('/contact/ → valid submit did not POST anywhere');
    } else {
      const req = net[0];
      if (!/^POST$/i.test(req.opts?.method || '')) fail('/contact/ → submit did not use POST');
      const body = req.opts?.body;
      const keys = body && typeof body.forEach === 'function' ? Array.from(body.keys()) : [];
      for (const k of ['name', 'phone', 'city', 'home_type', 'consent']) {
        if (!keys.includes(k)) fail(`/contact/ → submitted payload is missing "${k}"`);
      }
      pass(`lead form POSTs a complete payload to ${action}`);
    }

    /* d. the honeypot must silently drop a bot */
    const hp = form.querySelector('[name="_gotcha"]');
    if (!hp) fail('/contact/ → honeypot field missing');
    else {
      hp.value = 'spam';
      net.length = 0;
      form.dispatchEvent(new win.Event('submit', { bubbles: true, cancelable: true }));
      if (net.length) fail('/contact/ → honeypot did not block a bot submission');
      else pass('honeypot silently drops bot submissions');
      hp.value = '';
    }
  }
  win.close();
}

/* ============================================ 3. Gallery lightbox behaviour */
{
  const file = path.join(ROOT, 'gallery/index.html');
  const { win, doc } = await boot(file);
  const lb = $(doc, '#lightbox');
  const opener = $(doc, '[data-gallery-open]');

  if (!lb || !opener) {
    fail('/gallery/ → lightbox or trigger missing');
  } else {
    click(win, opener);
    if (lb.hidden) fail('/gallery/ → lightbox did not open');
    const img = $(doc, '#lbImg');
    const first = img.getAttribute('src');
    if (!first) fail('/gallery/ → lightbox opened with no image');
    const count = $(doc, '#lbCount').textContent;
    if (!/^1 \/ \d+$/.test(count)) fail(`/gallery/ → lightbox counter wrong: "${count}"`);

    const thumbs = $$(doc, '#lbThumbs .lb-thumb');
    if (thumbs.length < 8) fail(`/gallery/ → only ${thumbs.length} room thumbnails built (expected 8)`);

    click(win, $(doc, '#lbNext'));
    if (img.getAttribute('src') === first) fail('/gallery/ → "next" did not advance the image');
    if ($(doc, '#lbCount').textContent !== `2 / ${thumbs.length}`) fail('/gallery/ → counter did not follow "next"');

    key(win, doc, 'ArrowLeft');
    if (img.getAttribute('src') !== first) fail('/gallery/ → ArrowLeft did not go back to the first image');

    key(win, doc, 'ArrowLeft');
    if ($(doc, '#lbCount').textContent !== `${thumbs.length} / ${thumbs.length}`) {
      fail('/gallery/ → lightbox does not wrap around to the last image');
    }

    if (thumbs[3]) {
      click(win, thumbs[3]);
      if (!thumbs[3].classList.contains('is-active')) fail('/gallery/ → thumbnail click did not select that room');
    }

    key(win, doc, 'Escape');
    pass('gallery lightbox: opens, advances, wraps, keyboard + thumbnails all work');

    /* Every image the lightbox can show must exist on disk */
    const data = JSON.parse($(doc, '#galleryData').textContent);
    let missing = 0;
    for (const p of data) {
      for (const r of p.rooms) {
        for (const src of [r.src, r.thumb]) {
          const f = path.join(ROOT, String(src).replace(BASE, '').replace(/^\//, ''));
          if (!fs.existsSync(f)) { missing++; if (missing < 4) fail(`/gallery/ → missing asset ${src}`); }
        }
      }
    }
    if (!missing) pass(`gallery: all ${data.length} packages resolve every image on disk`);
  }
  win.close();
}

/* ==================================================== 4. Deep-link handling */
{
  const html = fs.readFileSync(path.join(ROOT, 'gallery/index.html'), 'utf8');
  const dom = new JSDOM(html, {
    url: `https://example.test${BASE}/gallery/#aurelia`,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(),
  });
  const win = dom.window;
  if (win.document.readyState !== 'complete') {
    await new Promise((resolve) => win.addEventListener('load', resolve, { once: true }));
  }
  win.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  win.IntersectionObserver = class { observe(t) { t.classList.add('is-in'); } unobserve() {} disconnect() {} };
  win.requestIdleCallback = (fn) => win.setTimeout(fn, 0);
  win.scrollTo = () => {};
  Object.defineProperty(win.HTMLElement.prototype, 'offsetParent', { configurable: true, get() { return this.ownerDocument.body; } });
  try { win.eval(appJs); } catch (e) { fail(`/gallery/#aurelia → app.js threw: ${e.message}`); }
  const lb = win.document.querySelector('#lightbox');
  if (lb && lb.hidden) fail('/gallery/#aurelia → deep link did not open the package');
  else pass('gallery deep link /gallery/#aurelia opens that package directly');
  win.close();
}

/* ======================================================== 5. Contract check
   Every data-* hook used in the markup must have a handler in app.js. */
{
  const hooks = new Set();
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\sdata-([a-z0-9-]+)(?==|[\s>])/g)) hooks.add(m[1]);
  }
  const ignore = new Set(['count', 'decimals', 'tags', 'panel', 'tab', 'src', 'success', 'wa-fallback',
    'embed-title', 'min-width', 'single', 'filter', 'filter-target', 'filter-empty', 'label', 'theme',
    'nosnippet', 'parallax', 'rail-prev', 'rail-next', 'lead-form', 'gallery-open', 'consult-open',
    'hero-video', 'hero-walk', 'copy', 'tabs', 'rail', 'embed', 'toc']);
  const orphans = [...hooks].filter((h) => !ignore.has(h) && !appJs.includes(`data-${h}`) && !appJs.includes(camel(h)));
  if (orphans.length) fail(`markup uses data-${orphans.join(', data-')} with no handler in app.js`);
  else pass('every data-* hook in the markup maps to a handler');
}
function camel(s) { return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase()); }

/* ================================================================= Report */
console.log('');
if (errors.length) {
  console.log(`  ✗ ${errors.length} FUNCTIONAL FAILURE${errors.length > 1 ? 'S' : ''}\n`);
  errors.slice(0, 60).forEach((e) => console.log(`    ✗ ${e}`));
  if (errors.length > 60) console.log(`    … and ${errors.length - 60} more`);
  console.log('');
  process.exit(1);
}
console.log(`  ✓ ${passes.length} functional checks passed\n`);
passes.forEach((p) => console.log(`    ✓ ${p}`));
console.log('\n  ✓ ALL INTERACTIONS WORK\n');
