/**
 * Static site build.
 *   src/pages/*.js  →  rendered HTML at the repo root (GitHub Pages ready)
 * Also bundles + minifies CSS/JS and writes sitemap.xml, robots.txt, manifest.
 *
 * Run:  npm run build
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import CleanCSS from 'clean-css';
import { minify as minifyJs } from 'terser';
import { minify as minifyHtml } from 'html-minifier-terser';

import { site, absoluteUrl, currentYear } from '../src/config/site.config.js';
import { renderPage } from '../src/layouts/base.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEV = process.argv.includes('--dev');

/* The deploy host (used to avoid rewriting canonical/OG/schema URLs that are
   already origin-absolute). */
const HOST = (() => { try { return new URL(site.baseUrl).host; } catch { return ''; } })();

/**
 * Rewrite the hard-coded `basePath` prefix in rendered HTML to a path that is
 * RELATIVE to the page, so the static output works when opened via file://,
 * served from GitHub Pages, or hosted anywhere — no rebuild or server needed.
 *
 * Only bare `basePath/` occurrences (navigation, assets, embedded JSON) are
 * rewritten. Origin-absolute URLs (canonical, Open Graph, JSON-LD, hreflang)
 * keep their leading host and are left untouched — which is what SEO expects.
 */
function relativize(html, route) {
  const depth = route.replace(/^\/|\/$/g, '').split('/').filter(Boolean).length;
  const prefix = depth === 0 ? './' : '../'.repeat(depth);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(?<!' + esc(HOST) + ')' + esc(site.basePath) + '/', 'g');
  return html.replace(re, prefix);
}

const read = (p) => fs.readFile(path.join(ROOT, p), 'utf8');
const write = async (p, c) => {
  const full = path.join(ROOT, p);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, c);
  return Buffer.byteLength(c);
};

/* ------------------------------------------------------------------- CSS */
async function buildCss() {
  const files = [
    '00-fonts.css', '01-tokens.css', '02-base.css', '03-layout.css',
    '04-components.css', '05-navigation.css', '06-sections.css',
    '07-utilities.css', '08-pages.css', '09-gallery.css',
  ];
  let css = '';
  for (const f of files) {
    try { css += (await read(`src/styles/${f}`)) + '\n'; }
    catch { /* optional file */ }
  }
  /* Font URLs are relative to the CSS file at /assets/css/, so rewrite them
     to be absolute from the deploy root. */
  css = css.replace(/url\('assets\/fonts\//g, "url('../fonts/");

  const out = DEV ? css : new CleanCSS({ level: 2, returnPromise: false }).minify(css).styles;
  const size = await write('assets/css/main.css', out);
  return { size, raw: css.length };
}

/* -------------------------------------------------------------------- JS */
async function buildJs() {
  const src = await read('src/scripts/app.js');
  let out = src;
  if (!DEV) {
    const res = await minifyJs(src, {
      compress: { passes: 2, drop_console: true },
      mangle: true,
      format: { comments: false },
    });
    out = res.code;
  }
  const size = await write('assets/js/app.js', out);
  return { size, raw: src.length };
}

/* ------------------------------------------------------------------ Pages */
async function loadPages() {
  const dir = path.join(ROOT, 'src/pages');
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.js'));
  const pages = [];
  for (const f of files) {
    const mod = await import(path.join(dir, f) + `?t=${Date.now()}`);
    const entries = Array.isArray(mod.default) ? mod.default : [mod.default];
    for (const p of entries) if (p && p.route) pages.push(p);
  }
  return pages;
}

/** Map a route to its output file: '/' → index.html, '/about/' → about/index.html */
function routeToFile(route) {
  if (route === '/') return 'index.html';
  if (route === '/404') return '404.html';
  return path.join(route.replace(/^\/|\/$/g, ''), 'index.html');
}

async function buildPages(pages) {
  const results = [];
  for (const page of pages) {
    let html = relativize(renderPage(page), page.route);
    if (!DEV) {
      html = await minifyHtml(html, {
        collapseWhitespace: true,
        conservativeCollapse: false,
        removeComments: true,
        removeRedundantAttributes: false,
        minifyCSS: true,
        minifyJS: true,
        useShortDoctype: true,
        sortAttributes: true,
        sortClassName: false,
      });
    }
    const file = routeToFile(page.route);
    const size = await write(file, html);
    results.push({ route: page.route, file, size });
  }
  return results;
}

/* ---------------------------------------------------------------- Sitemap */
async function buildSitemap(pages) {
  const today = new Date().toISOString().slice(0, 10);
  const priority = (r) => {
    if (r === '/') return '1.0';
    if (/^\/(residential|commercial|pricing|contact|portfolio)\/$/.test(r)) return '0.9';
    if (/^\/interior-designers-in-/.test(r)) return '0.9';
    if (/^\/(services|residential)\//.test(r)) return '0.8';
    if (/^\/(about|process|cost-calculator|reviews|blog|faq|warranty)\/$/.test(r)) return '0.7';
    if (/^\/blog\//.test(r)) return '0.6';
    return '0.4';
  };
  const freq = (r) => {
    if (r === '/' || r === '/portfolio/' || r === '/blog/') return 'weekly';
    if (/^\/(privacy|terms|refund)\//.test(r)) return 'yearly';
    return 'monthly';
  };

  const urls = pages
    .filter((p) => !p.noindex && p.route !== '/404')
    .sort((a, b) => Number(priority(b.route)) - Number(priority(a.route)))
    .map((p) => `  <url>
    <loc>${absoluteUrl(p.route)}</loc>
    <lastmod>${p.dateModified || today}</lastmod>
    <changefreq>${freq(p.route)}</changefreq>
    <priority>${priority(p.route)}</priority>
  </url>`).join('\n');

  await write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`);
}

/* ----------------------------------------------------------------- Robots */
async function buildRobots() {
  await write('robots.txt', `# ${site.legalName}
User-agent: *
Allow: /

# Block noisy scrapers that add no SEO value
User-agent: AhrefsBot
Crawl-delay: 10
User-agent: SemrushBot
Crawl-delay: 10

Sitemap: ${absoluteUrl('/sitemap.xml')}
`);
}

/* --------------------------------------------------------------- Manifest */
async function buildManifest() {
  await write('site.webmanifest', JSON.stringify({
    name: site.legalName,
    short_name: site.name,
    description: 'Residential interior fit-out for homes in Delhi, Gurugram and Noida.',
    start_url: '.',
    scope: '.',
    display: 'standalone',
    background_color: '#fdfcfa',
    theme_color: '#0b0d0f',
    lang: 'en-IN',
    categories: ['business', 'lifestyle', 'shopping'],
    icons: [
      { src: 'assets/img/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'assets/img/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }, null, 2));

  /* Inline SVG favicon — crisp at every size, ~450 bytes */
  await write('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#9B7028"/><stop offset="48%" stop-color="#CFA54F"/><stop offset="100%" stop-color="#EAD7A8"/>
</linearGradient></defs>
<rect width="512" height="512" rx="112" fill="#0b0d0f"/>
<path d="M160 366V148c0-4.2 5.1-6.3 8-3.3L344 330" stroke="url(#g)" stroke-width="30" stroke-linecap="round" fill="none"/>
<path d="M352 146v218c0 4.2-5.1 6.3-8 3.3L168 182" stroke="url(#g)" stroke-width="30" stroke-linecap="round" fill="none" opacity=".5"/>
</svg>`);
}

/* -------------------------------------------------------------- Housekeeping */
async function cleanLegacy() {
  /* Old flat pages from the previous site that are now directories */
  const legacy = [
    'about.html', 'blog.html', 'careers.html', 'commercial.html', 'contact.html',
    'portfolio.html', 'privacy.html', 'residential.html', 'terms.html',
    'testimonials.html', 'tools.html', 'style.css', 'script.js',
  ];
  for (const f of legacy) {
    await fs.rm(path.join(ROOT, f), { force: true });
  }
}

/* =============================================================== RUN */
const t0 = Date.now();
console.log(`\n  Nexora Spaces — building ${DEV ? '(dev)' : '(production)'}\n`);

await cleanLegacy();
const css = await buildCss();
const js = await buildJs();
const pages = await loadPages();
const built = await buildPages(pages);
await buildSitemap(pages);
await buildRobots();
await buildManifest();

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
const totalHtml = built.reduce((a, b) => a + b.size, 0);

console.log(`  CSS   ${kb(css.size).padStart(9)}  (from ${kb(css.raw)})`);
console.log(`  JS    ${kb(js.size).padStart(9)}  (from ${kb(js.raw)})`);
console.log(`  HTML  ${kb(totalHtml).padStart(9)}  across ${built.length} pages\n`);

const sorted = [...built].sort((a, b) => a.route.localeCompare(b.route));
for (const b of sorted) console.log(`   ${b.route.padEnd(42)} ${kb(b.size).padStart(9)}`);

console.log(`\n  ✓ done in ${Date.now() - t0}ms\n`);
