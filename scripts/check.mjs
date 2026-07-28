/**
 * Post-build validation — broken links, missing assets, SEO and a11y checks.
 * Run: npm run check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/config/site.config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = site.basePath || '';

const errors = [];
const warnings = [];
const ok = [];

/* Collect built HTML files */
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
const rel = (f) => '/' + path.relative(ROOT, f).replace(/\\/g, '/');

/* Build the set of valid internal routes */
const routes = new Set();
for (const f of files) {
  let r = rel(f).replace(/index\.html$/, '');
  routes.add(r);
  routes.add(r.replace(/\/$/, ''));
  routes.add(rel(f));
}
/* Static assets that exist on disk */
const assetExists = (p) => fs.existsSync(path.join(ROOT, p.replace(/^\//, '')));

/** Resolve a URL found on `page` to a root-relative filesystem path (basePath
 *  stripped). Handles basePath-absolute ("/REPO/…"), root-absolute ("/…") and
 *  page-relative ("./…", "../…") links, so validation works for the portable
 *  relative output as well as the legacy basePath-absolute output. */
const toRoot = (target, page) => {
  let t = target;
  if (BASE && t.startsWith(BASE)) t = t.slice(BASE.length) || '/';
  if (t.startsWith('/')) return path.posix.normalize(t);
  return path.posix.normalize(path.posix.dirname(page) + '/' + t);
};

console.log(`\n  Checking ${files.length} pages…\n`);

let totalLinks = 0, totalImgs = 0;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const page = rel(file);

  /* ---------------------------------------------------------- internal links */
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    totalLinks++;
    let target = href.split('#')[0].split('?')[0];
    if (!target) continue;
    /* strip basePath OR resolve a page-relative path, then compare on-disk routes */
    const stripped = toRoot(target, page);

    if (stripped.startsWith('/assets/') || /\.(css|js|xml|txt|webmanifest|svg|png|jpg|webp|avif|woff2|ico)$/.test(stripped)) {
      if (!assetExists(stripped)) errors.push(`${page} → missing asset: ${href}`);
      continue;
    }
    const norm = stripped.endsWith('/') ? stripped : stripped + '/';
    if (!routes.has(norm) && !routes.has(stripped) && !routes.has(stripped + 'index.html')) {
      errors.push(`${page} → broken link: ${href}`);
    }
  }

  /* --------------------------------------------------------------- images */
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  for (const tag of imgs) {
    totalImgs++;
    const src = (tag.match(/src="([^"]+)"/) || [])[1];
    if (src && !/^(https?:|data:)/.test(src)) {
      const s = toRoot(src, page);
      if (!assetExists(s)) errors.push(`${page} → missing image: ${src}`);
    }
    if (!/\balt=/.test(tag)) errors.push(`${page} → <img> without alt: ${tag.slice(0, 90)}`);
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      warnings.push(`${page} → <img> without width/height (CLS risk): ${(src || '').slice(-40)}`);
    }
  }
  /* srcset / imagesrcset assets */
  for (const m of html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/g)) {
    for (const cand of m[1].split(',')) {
      const u = cand.trim().split(/\s+/)[0];
      if (!u || /^(https?:|data:)/.test(u)) continue;
      const s = toRoot(u, page);
      if (!assetExists(s)) errors.push(`${page} → missing srcset asset: ${u}`);
    }
  }

  /* ------------------------------------------------------------------ SEO */
  /* Attribute order is not guaranteed (the HTML minifier sorts attributes),
     so find the tag first, then read the attribute out of it. */
  const findTag = (tag, attr, val) => {
    const re = new RegExp('<' + tag + '\\b[^>]*\\b' + attr + '="' + val + '"[^>]*>', 'i');
    return (html.match(re) || [])[0] || '';
  };
  const attrOf = (tagStr, attr) =>
    (tagStr.match(new RegExp('\\b' + attr + '="([^"]*)"', 'i')) || [])[1] || '';

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = attrOf(findTag('meta', 'name', 'description'), 'content');
  const canonical = attrOf(findTag('link', 'rel', 'canonical'), 'href');
  const h1s = [...html.matchAll(/<h1[^>]*>/g)].length;

  if (!title) errors.push(`${page} → missing <title>`);
  else if (title.length > 65) warnings.push(`${page} → title ${title.length} chars (>65 may truncate in SERP)`);
  else if (title.length < 25) warnings.push(`${page} → title only ${title.length} chars`);

  if (!desc) errors.push(`${page} → missing meta description`);
  else if (desc.length > 165) warnings.push(`${page} → description ${desc.length} chars (>165 truncates)`);
  else if (desc.length < 70) warnings.push(`${page} → description only ${desc.length} chars`);

  if (!canonical) errors.push(`${page} → missing canonical`);
  if (h1s === 0) errors.push(`${page} → no <h1>`);
  if (h1s > 1) errors.push(`${page} → ${h1s} <h1> tags (should be exactly 1)`);

  /* ---------------------------------------------------------------- schema */
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!lds.length) warnings.push(`${page} → no JSON-LD structured data`);
  for (const ld of lds) {
    try { JSON.parse(ld[1]); } catch (e) { errors.push(`${page} → invalid JSON-LD: ${e.message}`); }
  }

  /* ------------------------------------------------------------- integrity */
  if (/undefined|\[object Object\]|NaN/.test(html.replace(/undefined-/g, ''))) {
    errors.push(`${page} → contains 'undefined' / '[object Object]' / 'NaN' in output`);
  }
  if (/\[PLACEHOLDER/i.test(html)) warnings.push(`${page} → contains a [PLACEHOLDER] token`);

  /* --------------------------------------------------------------- a11y */
  if (!/<html[^>]*lang=/.test(html)) errors.push(`${page} → <html> missing lang attribute`);
  if (!/skip-link/.test(html)) warnings.push(`${page} → no skip-to-content link`);
  for (const btn of html.matchAll(/<button\b[^>]*>(\s*)<\/button>/g)) {
    errors.push(`${page} → empty <button> without label`);
  }
}

/* ------------------------------------------------------------ site files */
for (const f of ['sitemap.xml', 'robots.txt', 'site.webmanifest', 'favicon.svg', '404.html', '.nojekyll']) {
  if (!fs.existsSync(path.join(ROOT, f))) warnings.push(`missing root file: ${f}`);
  else ok.push(f);
}

/* sitemap ↔ pages parity */
if (fs.existsSync(path.join(ROOT, 'sitemap.xml'))) {
  const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const indexable = files.filter((f) => {
    const h = fs.readFileSync(f, 'utf8');
    return !/<meta\b[^>]*content="noindex/i.test(h);
  });
  if (locs.length !== indexable.length) {
    warnings.push(`sitemap has ${locs.length} URLs but ${indexable.length} indexable pages exist`);
  }
  for (const loc of locs) {
    if (!loc.startsWith(site.baseUrl)) errors.push(`sitemap URL does not match baseUrl: ${loc}`);
  }
}

/* ----------------------------------------------------------------- output */
const dedupe = (a) => [...new Set(a)];
const errs = dedupe(errors);
const warns = dedupe(warnings);

if (errs.length) {
  console.log(`  ✗ ${errs.length} ERROR(S)\n`);
  errs.slice(0, 40).forEach((e) => console.log(`    • ${e}`));
  if (errs.length > 40) console.log(`    … and ${errs.length - 40} more`);
  console.log('');
}
if (warns.length) {
  console.log(`  ⚠ ${warns.length} warning(s)\n`);
  warns.slice(0, 25).forEach((w) => console.log(`    • ${w}`));
  if (warns.length > 25) console.log(`    … and ${warns.length - 25} more`);
  console.log('');
}

console.log(`  Checked: ${files.length} pages · ${totalLinks} internal links · ${totalImgs} images`);
console.log(errs.length ? `\n  ✗ FAILED\n` : `\n  ✓ ALL CHECKS PASSED\n`);
process.exit(errs.length ? 1 : 0);
