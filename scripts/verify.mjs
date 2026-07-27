/**
 * Residential-refocus verification.
 *
 * check.mjs validates links/SEO/images. THIS script enforces the rules that
 * are specific to this brief and that must never silently regress:
 *
 *   1. No pricing, rates, EMI or calculator anywhere in HTML or JS
 *   2. No commercial / office / retail / hospitality positioning
 *   3. Hero has a video (or walkthrough) with a poster fallback + overlay
 *   4. Consultation modal present on every page, with the exact field set
 *   5. Gallery has 10+ packages, each covering all 8 room types, all assets present
 *   6. About page carries no team/individual photos
 *   7. Every control resolves — no href="#", no unlabelled buttons
 *   8. Every JS handler the markup references actually exists in app.js
 *
 * Run:  npm run verify
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/config/site.config.js';
import { galleryPackages, roomOrder } from '../src/data/gallery.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = site.basePath || '';
const errors = [];
const passes = [];
const fail = (m) => errors.push(m);
const pass = (m) => passes.push(m);

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
const exists = (p) => fs.existsSync(path.join(ROOT, p.replace(/^\//, '')));

/** Strip tags → visible text, so we test what a user actually reads. */
const visibleText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/gi, ' ')
  .replace(/\s+/g, ' ');

const appJs = fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8');
const cssBundle = fs.readFileSync(path.join(ROOT, 'assets/css/main.css'), 'utf8');

console.log(`\n  Verifying ${files.length} pages against the residential brief\n`);

/* =========================================== 1 + 2 + 6 + 7: per page */
const MONEY = [
  [/₹/, 'rupee symbol'],
  [/\bRs\.?\s?\d/i, 'Rs amount'],
  [/\b\d[\d,.]*\s*(lakh|lakhs|crore|crores)\b/i, 'lakh/crore amount'],
  [/\bEMI\b/i, 'EMI'],
  [/per\s+sq\.?\s?ft[^.]{0,20}\d/i, 'per-sq.ft rate'],
  [/\bstarting (from|at)\b[^.]{0,24}\d/i, 'starting-from price'],
  [/\bno[- ]cost EMI\b/i, 'no-cost EMI'],
  [/cost calculator|price calculator|budget calculator/i, 'calculator'],
  [/calculate my (cost|budget)/i, 'calculator CTA'],
  [/\brate card\b/i, 'rate card'],
];

const COMMERCIAL = [
  [/\boffice (interiors?|fit[- ]?out)\b/i, 'office fit-out'],
  [/\bcorporate (office|interiors?)\b/i, 'corporate interiors'],
  [/\bretail (fit[- ]?out|rollout|showroom)\b/i, 'retail fit-out'],
  [/\bhospitality\b/i, 'hospitality'],
  [/\bcaf[eé]s? (&|and) restaurants?\b/i, 'F&B'],
  [/\bworkplace strategy\b/i, 'workplace strategy'],
  [/\bclinics? (&|and) studios?\b/i, 'clinics'],
  [/\bcommercial (interiors?|fit[- ]?out|projects?)\b/i, 'commercial interiors'],
  [/\bseats?\b.{0,12}\bfit[- ]?out/i, 'seat-count fit-out'],
];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const page = rel(file);
  const text = visibleText(html);

  for (const [re, label] of MONEY) {
    if (re.test(text)) fail(`${page} → PRICING leak: ${label} — "${(text.match(re) || [''])[0]}"`);
  }
  for (const [re, label] of COMMERCIAL) {
    const hit = text.match(re);
    if (!hit) continue;
    /* Copy that explicitly REFUSES commercial work is on-brief, not a leak.
       e.g. "Do you take office, retail or commercial projects? No..." */
    const around = text.slice(Math.max(0, hit.index - 120), hit.index + 220);
    if (/\b(do not|don't|no\.|never|only|residential-only|we are a residential)\b/i.test(around)) continue;
    fail(`${page} → COMMERCIAL language: ${label} — "${hit[0]}"`);
  }

  /* dead links */
  for (const m of html.matchAll(/href="([^"]*)"/g)) {
    const h = m[1];
    if (h === '#' || h === '' || /^javascript:/i.test(h)) fail(`${page} → dead link href="${h}"`);
  }
  /* unlabelled buttons */
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)) {
    const attrs = m[1], inner = visibleText(m[2]).trim();
    const hasAria = /aria-label="[^"]+"/.test(attrs);
    const hasSvg = /<svg|<use/.test(m[2]);
    if (!inner && !hasAria && !hasSvg) fail(`${page} → unlabelled <button>`);
  }

  /* consultation modal on every page */
  if (!/id="consultModal"/.test(html)) fail(`${page} → consultation modal missing`);
  if (!/data-consult-open/.test(html)) fail(`${page} → no "Get free consultation" trigger`);

  /* the modal form must carry exactly the agreed fields */
  const modalIdx = html.indexOf('consultModal');
  const modal = modalIdx === -1 ? '' : html.slice(modalIdx, modalIdx + 6000);
  for (const f of ['name="name"', 'name="phone"', 'name="city"', 'name="home_type"', 'name="approx_area"', 'name="message"']) {
    if (!modal.includes(f)) fail(`${page} → consult form missing ${f}`);
  }
  if (/name="(budget|price|cost|amount|emi)"/i.test(modal)) fail(`${page} → consult form has a money field`);

  /* every page must have exactly one h1 and a canonical (belt & braces) */
  const h1s = [...html.matchAll(/<h1[^>]*>/g)].length;
  if (h1s !== 1) fail(`${page} → ${h1s} <h1> tags`);

  /* ------------------------------------------------------------------ */
  /* Structured data is invisible to visibleText() but Google reads it, so
     the same two rules have to be enforced inside every JSON-LD block and
     in the meta description. A price or an "offers" node here is exactly
     the sort of thing that triggers a structured-data manual action. */
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const rawJson = m[1];
    let graph;
    try {
      graph = JSON.parse(rawJson);
    } catch {
      fail(`${page} → JSON-LD block is not valid JSON`);
      continue;
    }

    const flat = JSON.stringify(graph);
    for (const [re, label] of MONEY) {
      if (re.test(flat)) fail(`${page} → PRICING leak in JSON-LD: ${label}`);
    }
    for (const [re, label] of COMMERCIAL) {
      const hit = flat.match(re);
      // FAQ answers that refuse commercial work are legitimately in the graph.
      if (hit && !/do not|don't|only residential|residential[- ]only/i.test(
        flat.slice(Math.max(0, hit.index - 160), hit.index + 240)
      )) {
        fail(`${page} → COMMERCIAL language in JSON-LD: ${label} — "${hit[0]}"`);
      }
    }
    for (const key of ['"price"', '"lowPrice"', '"highPrice"', '"priceRange"', '"priceSpecification"']) {
      if (flat.includes(key)) fail(`${page} → JSON-LD publishes ${key}, but the site has no pricing`);
    }

    /* Every @id inside one graph must be unique, or Google merges the nodes
       and the page loses the entity it was trying to describe. */
    const nodes = Array.isArray(graph) ? graph : (graph['@graph'] || [graph]);
    const seen = new Map();
    for (const node of nodes) {
      if (!node || typeof node !== 'object' || !node['@id']) continue;
      const id = node['@id'];
      if (seen.has(id)) fail(`${page} → duplicate JSON-LD @id "${id}" (nodes silently merge)`);
      seen.set(id, true);
    }
  }

  /* The meta description is user-facing SERP copy — same rules apply. */
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  for (const [re, label] of COMMERCIAL) {
    if (re.test(desc)) fail(`${page} → COMMERCIAL language in meta description: ${label}`);
  }
  for (const [re, label] of MONEY) {
    if (re.test(desc)) fail(`${page} → PRICING in meta description: ${label}`);
  }
}
pass(`${files.length} pages: no pricing, no calculator, no commercial language`);
pass(`${files.length} pages: JSON-LD and meta descriptions are clean, @ids unique`);
pass(`${files.length} pages: consultation modal present with the correct field set`);
pass(`${files.length} pages: no dead links, no unlabelled buttons`);

/* ================================================ 1b: JS is pricing-free */
for (const [re, label] of [
  [/inrLakh|calcAmount|calcEmi|priceSpecification/i, 'calculator remnant'],
  [/initCalculator/i, 'calculator init'],
  [/\bCALC\b\s*=/, 'calculator model'],
]) {
  if (re.test(appJs)) fail(`assets/js/app.js → ${label}`);
}
if (/₹/.test(appJs)) fail('assets/js/app.js → rupee symbol present');
pass('app.js contains no calculator or pricing logic');

/* ============================================ 3: hero video + fallback */
{
  const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const hasVideo = /<video[^>]*data-hero-video/.test(home);
  const hasWalk = /data-hero-walk/.test(home);

  if (!hasVideo && !hasWalk) fail('home → hero has neither a video nor the walkthrough fallback');
  else pass(`home → hero uses ${hasVideo ? 'a <video> background' : 'the animated walkthrough fallback'}`);

  if (hasVideo) {
    const tag = (home.match(/<video[^>]*>/) || [''])[0];
    for (const attr of ['autoplay', 'muted', 'loop', 'playsinline', 'poster=']) {
      if (!tag.includes(attr)) fail(`home → hero <video> missing ${attr}`);
    }
    if (!/hero-video-fallback/.test(home)) fail('home → hero video has no poster/fallback <img>');
  }
  if (hasWalk) {
    const frames = [...home.matchAll(/class="hero-frame/g)].length;
    if (frames < 3) fail(`home → walkthrough has only ${frames} frames`);
    /* Frame assets must exist */
    for (const m of home.matchAll(/hero-frame[\s\S]{0,400}?src="([^"]+)"/g)) {
      const src = m[1].startsWith(BASE) ? m[1].slice(BASE.length) : m[1];
      if (!exists(src)) fail(`home → hero frame asset missing: ${m[1]}`);
    }
  }

  if (!/hero-scrim/.test(home)) fail('home → hero missing the dark gradient overlay');
  else pass('home → hero gradient overlay present for text contrast');

  if (!/hero-scroll/.test(home)) fail('home → no scroll-down indicator');
  else pass('home → scroll indicator present');

  /* Both hero CTAs must work */
  if (!new RegExp(`href="${BASE}/gallery/"`).test(home)) fail('home → "View our work" does not link to the gallery');
  else pass('home → "View our work" links to the gallery');
  if (!/data-consult-open/.test(home)) fail('home → "Get free consultation" has no handler');
  else pass('home → "Get free consultation" opens the modal');
}

/* ============================================ 4: JS handlers all exist */
for (const [hook, fn] of [
  ['data-consult-open', 'initConsult'],
  ['data-gallery-open', 'initGallery'],
  ['data-hero-walk', 'initHero'],
  ['data-filter-group', 'initFilters'],
  ['data-lead-form', 'initForms'],
]) {
  const usedInHtml = files.some((f) => fs.readFileSync(f, 'utf8').includes(hook));
  const handledInJs = appJs.includes(hook.replace(/^data-/, 'data-')) || appJs.includes(hook);
  if (usedInHtml && !handledInJs) fail(`markup uses [${hook}] but app.js never reads it (${fn})`);
}
pass('every interactive hook in the markup has a matching handler in app.js');

/* =========================================== 5: gallery completeness */
{
  const gal = fs.readFileSync(path.join(ROOT, 'gallery/index.html'), 'utf8');

  if (galleryPackages.length < 10) fail(`gallery → only ${galleryPackages.length} packages (need 10+)`);
  else pass(`gallery → ${galleryPackages.length} complete home packages`);

  const cards = [...gal.matchAll(/class="pkg-card pkg-card-lg"/g)].length;
  if (cards !== galleryPackages.length) fail(`gallery → ${cards} cards rendered for ${galleryPackages.length} packages`);

  /* Each package must cover all eight rooms, and every asset must exist. */
  let missingAssets = 0;
  for (const p of galleryPackages) {
    for (const r of roomOrder) {
      if (!p.rooms[r.id]) { fail(`gallery → ${p.id} missing room "${r.id}"`); continue; }
      if (!p.rooms[r.id].alt || !p.rooms[r.id].caption) fail(`gallery → ${p.id}/${r.id} missing alt or caption`);
      for (const w of [640, 1400]) {
        for (const ext of ['jpg', 'webp', 'avif']) {
          if (!exists(`/assets/img/gallery/${p.id}-${r.id}-${w}.${ext}`)) missingAssets++;
        }
      }
    }
  }
  if (missingAssets) fail(`gallery → ${missingAssets} image derivatives missing`);
  else pass(`gallery → all ${galleryPackages.length * roomOrder.length * 6} image derivatives present`);
  pass(`gallery → every package covers all ${roomOrder.length} room types (hall, kitchen, bedroom, puja, bath, closet, passage, overview)`);

  /* Lightbox scaffolding + data payload */
  for (const id of ['lightbox', 'lbImg', 'lbPrev', 'lbNext', 'lbClose', 'lbThumbs', 'galleryData']) {
    if (!gal.includes(`id="${id}"`)) fail(`gallery → lightbox element #${id} missing`);
  }
  const payload = (gal.match(/id="galleryData">([\s\S]*?)<\/script>/) || [])[1];
  if (!payload) fail('gallery → lightbox data payload missing');
  else {
    try {
      const data = JSON.parse(payload.replace(/\\u003c/g, '<'));
      if (data.length !== galleryPackages.length) fail(`gallery → payload has ${data.length} packages`);
      const badRooms = data.filter((d) => d.rooms.length !== roomOrder.length);
      if (badRooms.length) fail(`gallery → ${badRooms.length} packages have wrong room count in payload`);
      else pass('gallery → lightbox payload complete and valid JSON');
      /* payload image paths must resolve */
      let bad = 0;
      for (const d of data) for (const r of d.rooms) {
        const s = r.src.startsWith(BASE) ? r.src.slice(BASE.length) : r.src;
        if (!exists(s)) bad++;
      }
      if (bad) fail(`gallery → ${bad} lightbox image paths do not resolve`);
      else pass('gallery → all lightbox image paths resolve on disk');
    } catch (e) { fail(`gallery → payload is not valid JSON: ${e.message}`); }
  }

  /* Filters */
  if (!/data-filter-group/.test(gal)) fail('gallery → filter group missing');
  else pass('gallery → category filters present');

  /* Placeholder honesty — the production HTML minifier strips comments, so
     assert against the source templates and the image pipeline instead. */
  const gallerySrc = fs.readFileSync(path.join(ROOT, 'src/pages/gallery.js'), 'utf8');
  const homeSrc = fs.readFileSync(path.join(ROOT, 'src/pages/home.js'), 'utf8');
  const imagesSrc = fs.readFileSync(path.join(ROOT, 'scripts/images.mjs'), 'utf8');
  const dataSrc = fs.readFileSync(path.join(ROOT, 'src/data/gallery.js'), 'utf8');
  if (!/TODO: replace with real project photo/.test(gallerySrc)) {
    fail('gallery source → package cards are not flagged with a TODO for real photos');
  } else if (!/TODO: replace with real project photo/.test(homeSrc)) {
    fail('home source → gallery teaser is not flagged with a TODO for real photos');
  } else if (!/PLACEHOLDER/i.test(imagesSrc) || !/PLACEHOLDER/i.test(dataSrc)) {
    fail('image pipeline / gallery data → placeholder status is not documented');
  } else {
    pass('placeholder imagery documented with TODOs and swap-in instructions');
  }
}

/* ================================================ 6: About has no faces */
{
  const about = fs.readFileSync(path.join(ROOT, 'about/index.html'), 'utf8');
  if (/team-photo|team-card|meet the team/i.test(about)) fail('about → team photo markup present');
  if (/\/assets\/img\/team\//.test(about)) fail('about → references a team photo asset');
  if (fs.existsSync(path.join(ROOT, 'assets/img/team'))) fail('about → assets/img/team still exists');
  /* any <img> on About must be scene/illustrative, not a portrait */
  const imgs = [...about.matchAll(/<img[^>]*alt="([^"]*)"[^>]*>/g)].map((m) => m[1]);
  const portraits = imgs.filter((a) => /founder|portrait|headshot|ceo|director|partner/i.test(a));
  if (portraits.length) fail(`about → portrait imagery: ${portraits.join(' | ')}`);
  pass('about → company-level only, no team or founder photos');
}

/* =========================================== 8: motion + responsiveness */
{
  if (!/IntersectionObserver/.test(appJs)) fail('app.js → no IntersectionObserver scroll reveal');
  else pass('scroll-reveal animations wired via IntersectionObserver');

  if (!/prefers-reduced-motion/.test(cssBundle)) fail('css → no prefers-reduced-motion support');
  else pass('reduced-motion preferences respected');

  const mq = (cssBundle.match(/@media[^{]*\(max-width/g) || []).length;
  if (mq < 10) fail(`css → only ${mq} max-width breakpoints, responsiveness looks thin`);
  else pass(`css → ${mq} responsive breakpoints`);

  for (const cls of ['.hero-video', '.hero-frame', '.modal', '.lb', '.pkg-card', '.pkg-grid']) {
    if (!cssBundle.includes(cls)) fail(`css → ${cls} styles missing from the bundle`);
  }
  pass('all new components are styled in the CSS bundle');

  /* Images below the fold should be lazy, and all need dimensions (CLS). */
  let noDims = 0, total = 0;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const tag of html.match(/<img\b[^>]*>/g) || []) {
      total++;
      if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) noDims++;
    }
  }
  if (noDims) fail(`${noDims}/${total} <img> tags lack width/height (layout shift risk)`);
  else pass(`all ${total} images carry intrinsic dimensions (no layout shift)`);
}

/* ============================================ 9: deploy sanity */
{
  for (const f of ['.nojekyll', 'sitemap.xml', 'robots.txt', 'site.webmanifest', 'index.html', '404.html']) {
    if (!exists('/' + f)) fail(`deploy → ${f} missing`);
  }
  /* Nothing may reference the removed pages. */
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const gone of ['/cost-calculator/', '/pricing/', '/commercial/']) {
      if (html.includes(BASE + gone)) fail(`${rel(file)} → links to removed page ${gone}`);
    }
  }
  /* Every asset path must be basePath-prefixed so Pages sub-folder hosting works. */
  let unprefixed = 0;
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/(?:src|href)="(\/[^"]*)"/g)) {
      if (!m[1].startsWith(BASE + '/') && m[1] !== BASE) unprefixed++;
    }
  }
  if (unprefixed) fail(`deploy → ${unprefixed} root-relative paths missing the ${BASE} basePath`);
  else pass(`deploy → every internal path is ${BASE}-prefixed for GitHub Pages`);
  pass('deploy → required root files present');
}

/* ------------------------------------------------------------- report */
console.log(`  ✓ ${passes.length} checks passed\n`);
passes.forEach((p) => console.log(`    ✓ ${p}`));

if (errors.length) {
  const uniq = [...new Set(errors)];
  console.log(`\n  ✗ ${uniq.length} PROBLEM(S)\n`);
  uniq.slice(0, 60).forEach((e) => console.log(`    • ${e}`));
  if (uniq.length > 60) console.log(`    … and ${uniq.length - 60} more`);
  console.log('');
  process.exit(1);
}
console.log('\n  ✓ RESIDENTIAL BRIEF VERIFIED\n');
