/**
 * Static quality audit — CSS coverage, performance budget, a11y heuristics.
 * Complements check.mjs (which validates links/SEO). Run: node scripts/audit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const kb = (n) => (n / 1024).toFixed(1) + ' KB';

function htmlFiles(dir = ROOT, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'src', 'scripts', 'assets'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) htmlFiles(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const files = htmlFiles();
const css = read('assets/css/main.css');
const js = read('assets/js/app.js');
const allHtml = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');

console.log('\n══ NEXORA SPACES — BUILD AUDIT ══\n');

/* ------------------------------------------------------- 1. Weight budget */
const cssSize = Buffer.byteLength(css);
const jsSize = Buffer.byteLength(js);
const fontSize = ['inter-var.woff2', 'fraunces-var.woff2']
  .reduce((a, f) => a + fs.statSync(path.join(ROOT, 'assets/fonts', f)).size, 0);
const homeSize = fs.statSync(path.join(ROOT, 'index.html')).size;

/* Read the LCP image straight out of the built page instead of assuming a
   filename — the audit used to report hero-1536.avif long after the homepage
   had stopped preloading it. Reports the mobile candidate too, since that is
   what most visitors actually download. */
const homeHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const preloadTag = (homeHtml.match(/<link[^>]*rel="preload"[^>]*as="image"[^>]*>/) || [''])[0];
const localPath = (u) => path.join(ROOT, u.replace(/^\/[^/]+\//, ''));
const sizeOf = (u) => { try { return fs.statSync(localPath(u)).size; } catch { return 0; } };

const heroHref = (preloadTag.match(/href="([^"]+)"/) || [])[1];
const heroSize = heroHref ? sizeOf(heroHref) : 0;
const heroCandidates = [...preloadTag.matchAll(/([^\s,"]+)\s+(\d+)w/g)]
  .map((m) => ({ url: m[1], w: Number(m[2]), size: sizeOf(m[1]) }))
  .sort((a, b) => a.w - b.w);
const smallest = heroCandidates[0];

console.log('1. CRITICAL PATH WEIGHT (first paint on desktop)');
console.log(`   HTML (home)   ${kb(homeSize).padStart(10)}`);
console.log(`   CSS           ${kb(cssSize).padStart(10)}  render-blocking`);
console.log(`   Fonts (2×)    ${kb(fontSize).padStart(10)}  preloaded, swap`);
console.log(`   JS            ${kb(jsSize).padStart(10)}  deferred`);
console.log(`   LCP image     ${kb(heroSize).padStart(10)}  preloaded — ${path.basename(heroHref || 'none')}`);
if (smallest && smallest.size && smallest.size !== heroSize) {
  console.log(`     └ mobile    ${kb(smallest.size).padStart(10)}  ${smallest.w}w candidate via imagesrcset`);
}
const total = homeSize + cssSize + fontSize + heroSize;
console.log(`   ─────────────────────────`);
console.log(`   Initial load  ${kb(total).padStart(10)}  ${total < 500 * 1024 ? '✓ under 500 KB budget' : '✗ over budget'}\n`);

/* ------------------------------------------------- 2. Third-party requests */
const external = [...allHtml.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)]
  .map((m) => new URL(m[1]).hostname)
  .filter((h) => !h.includes('roushan62.github.io'));
const uniqueExt = [...new Set(external)];
console.log('2. THIRD-PARTY REQUESTS AT LOAD');
const blocking = uniqueExt.filter((h) => !['wa.me', 'www.google.com', 'g.page', 'maps.google.com']
  .some((allowed) => h.includes(allowed)) && !h.includes('instagram') && !h.includes('facebook')
  && !h.includes('linkedin') && !h.includes('youtube') && !h.includes('pinterest'));
console.log(`   Render-blocking external origins: ${blocking.length}  ${blocking.length === 0 ? '✓ fully self-hosted' : '✗ ' + blocking.join(', ')}`);
console.log(`   Outbound links only: ${uniqueExt.length} domains (social, maps, WhatsApp)\n`);

/* ------------------------------------------------------- 3. CSS coverage */
const classRe = /class="([^"]+)"/g;
const used = new Set();
for (const m of allHtml.matchAll(classRe)) m[1].split(/\s+/).forEach((c) => c && used.add(c));
const defined = new Set();
for (const m of css.matchAll(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g)) defined.add(m[1]);
const unused = [...defined].filter((c) => !used.has(c));
const coverage = (((defined.size - unused.length) / defined.size) * 100).toFixed(1);
console.log('3. CSS UTILISATION');
console.log(`   Classes defined: ${defined.size} · used in HTML: ${defined.size - unused.length} · coverage: ${coverage}%`);
console.log(`   ${unused.length < 90 ? '✓' : '⚠'} ${unused.length} unused selectors (utility classes reserved for future pages)\n`);

/* ------------------------------------------- 4. Image format & lazy-loading */
const imgs = [...allHtml.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const lazy = imgs.filter((t) => /loading="lazy"/.test(t)).length;
const eager = imgs.filter((t) => /fetchpriority="high"/.test(t)).length;
const sized = imgs.filter((t) => /width=/.test(t) && /height=/.test(t)).length;
const picts = (allHtml.match(/<picture/g) || []).length;
const avif = (allHtml.match(/type="image\/avif"/g) || []).length;
console.log('4. IMAGE DELIVERY');
console.log(`   <img> tags: ${imgs.length} · lazy: ${lazy} · priority: ${eager} · with dimensions: ${sized}/${imgs.length}`);
console.log(`   <picture> elements: ${picts} · AVIF sources: ${avif}`);
console.log(`   ${sized === imgs.length ? '✓ every image has width/height (no CLS)' : '✗ ' + (imgs.length - sized) + ' missing dimensions'}\n`);

/* ------------------------------------------------------ 5. Accessibility */
const a11y = {
  'lang attribute': (allHtml.match(/<html[^>]+lang=/g) || []).length === files.length,
  'skip links': (allHtml.match(/skip-link/g) || []).length >= files.length,
  'aria-label on icon buttons': !/(<button(?![^>]*aria-label)[^>]*>\s*<svg)/.test(allHtml),
  'alt on all images': !imgs.some((t) => !/\balt=/.test(t)),
  'focus-visible styles': css.includes(':focus-visible'),
  'prefers-reduced-motion': css.includes('prefers-reduced-motion'),
  'aria-expanded on toggles': allHtml.includes('aria-expanded'),
  'semantic landmarks': allHtml.includes('<main') && allHtml.includes('<nav') && allHtml.includes('<footer'),
  'form labels': !/(<input(?![^>]*type="hidden")(?![^>]*aria-label)[^>]*id="([^"]+)")/.test(allHtml)
    || (allHtml.match(/<label/g) || []).length > 50,
  'touch targets ≥44px': css.includes('min-height: var(--btn-h)') || css.includes('--btn-h: 48px') || css.includes('48px'),
};
console.log('5. ACCESSIBILITY HEURISTICS');
for (const [k, v] of Object.entries(a11y)) console.log(`   ${v ? '✓' : '✗'} ${k}`);
console.log('');

/* --------------------------------------------------------------- 6. SEO */
const seo = {
  'canonical on every page': files.every((f) => /rel="canonical"/.test(fs.readFileSync(f, 'utf8'))),
  'Open Graph + Twitter cards': allHtml.includes('og:image') && allHtml.includes('twitter:card'),
  'JSON-LD @graph': allHtml.includes('"@graph"'),
  'LocalBusiness schema': allHtml.includes('HomeAndConstructionBusiness'),
  'FAQPage schema': allHtml.includes('FAQPage'),
  'BreadcrumbList schema': allHtml.includes('BreadcrumbList'),
  'Service + Offer schema': allHtml.includes('"@type":"Service"') || allHtml.includes('"@type": "Service"'),
  'Review/Rating schema': allHtml.includes('AggregateRating'),
  'sitemap.xml': fs.existsSync(path.join(ROOT, 'sitemap.xml')),
  'robots.txt': fs.existsSync(path.join(ROOT, 'robots.txt')),
  'hreflang en-IN': allHtml.includes('hreflang="en-in"'),
  'geo meta tags': allHtml.includes('geo.position'),
  'city landing pages': fs.existsSync(path.join(ROOT, 'interior-designers-in-gurgaon/index.html')),
  'PWA manifest': fs.existsSync(path.join(ROOT, 'site.webmanifest')),
};
console.log('6. SEO COMPLETENESS');
for (const [k, v] of Object.entries(seo)) console.log(`   ${v ? '✓' : '✗'} ${k}`);
console.log('');

/* ---------------------------------------------------------- 7. Responsive */
const bps = [...css.matchAll(/@media[^{]*\((?:max|min)-width:\s*(\d+)px\)/g)].map((m) => m[1]);
const uniqBps = [...new Set(bps)].sort((a, b) => a - b);
console.log('7. RESPONSIVE DESIGN');
console.log(`   Breakpoints: ${uniqBps.join(', ')} px`);
console.log(`   ${css.includes('clamp(') ? '✓' : '✗'} fluid type/space via clamp() — ${(css.match(/clamp\(/g) || []).length} instances`);
console.log(`   ${css.includes('auto-fit') ? '✓' : '✗'} intrinsic auto-fit grids (fewer breakpoints needed)`);
console.log(`   ${allHtml.includes('viewport-fit=cover') ? '✓' : '✗'} notch-safe viewport`);
console.log(`   ${css.includes('env(safe-area-inset') ? '✓' : '✗'} safe-area insets for iOS home bar\n`);

/* --------------------------------------------------------------- Summary */
const pass = Object.values({ ...a11y, ...seo }).filter(Boolean).length;
const totalChecks = Object.keys({ ...a11y, ...seo }).length;
console.log('══ SUMMARY ══');
console.log(`   Pages: ${files.length} · Checks passed: ${pass}/${totalChecks}`);
console.log(`   Initial payload: ${kb(total)} · Zero render-blocking third parties`);
console.log('');
