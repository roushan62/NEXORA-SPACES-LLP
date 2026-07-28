# Nexora Spaces LLP — Website

**Residential** interior fit-out and design-build company website targeting **Delhi, Gurugram and Noida**.

34 pages · fully static · zero third-party requests · SEO and Core-Web-Vitals optimised.

> ### Two hard rules for this site
> 1. **No pricing, anywhere.** No rates, ranges, per-sq-ft figures, EMI, package prices
>    or cost calculators — in copy, in JSON-LD, or in JS. Value is expressed in words
>    only ("value-driven", "budget-smart luxury"). `npm run verify` fails the build if
>    a price leaks back in.
> 2. **Residential only.** Flats, apartments, villas and individual rooms. No office,
>    retail, hospitality or commercial fit-out content. `npm run verify` also guards this.

**Live:** https://roushan62.github.io/NEXORA-SPACES-LLP/

---

## Quick start

```bash
npm install        # one time
npm run build      # generate the site
npm run serve      # preview at http://localhost:4321/NEXORA-SPACES-LLP/
```

| Command | What it does |
|---|---|
| `npm run build` | Renders all pages, bundles + minifies CSS/JS, writes sitemap & robots |
| `npm run check` | Validates every internal link, image, canonical, schema and heading |
| `npm run verify` | Enforces the residential brief: no pricing/calculator, no commercial language, hero + modal + gallery integrity, no team photos |
| `npm run audit` | Reports payload budget, CSS coverage, a11y and SEO completeness |
| `npm run images` | Regenerates responsive AVIF/WebP/JPEG derivatives + OG card + favicons |
| `npm run serve` | Local preview server that mirrors GitHub Pages paths |

---

## ⚙️ Edit your business details in ONE place

Everything — phone numbers, email, addresses, GST, prices, social links — comes from
a single file:

```
src/config/site.config.js
```

Change a value there, run `npm run build`, and it updates across all 40 pages.
Anything marked `// ⚠️ REPLACE` is a realistic placeholder awaiting your real data.

### Before going live — the checklist

1. **Contact details** — `site.phone`, `site.email`, `site.offices[]` (3 studios)
2. **Legal** — `site.legal` (LLPIN, GSTIN, MSME, registered address)
3. **Social links** — `site.social`
4. **Reviews** — `site.reviews`. ⚠️ Only keep `schema: true` once the rating and count
   reflect **real, verifiable** reviews. Fake rating markup risks a Google penalty.
4b. **Hero video** — `site.heroVideo.sources`. Empty by default, which makes the hero
   run an animated walkthrough built from the gallery stills. Drop real footage into
   `assets/video/` and list it there to switch to a true `<video>` background.
5. **Lead form** — `site.forms.endpoint`. Create a free
   [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) endpoint
   and paste it in. Until then forms gracefully fall back to opening WhatsApp with
   the enquiry pre-filled, so **no lead is ever lost**.
6. **Analytics** — `site.analytics.ga4` / `.gtm` (left empty = script never loads)
7. **Photography** — replace `src/assets-src/*.jpg` with real project photos and run
   `npm run images`
8. **Content** — real projects, reviews and team in `src/data/content.js`

### Moving to a custom domain later

```js
// src/config/site.config.js
baseUrl: 'https://www.nexoraspaces.in',
basePath: '',
```

Then add a `CNAME` file containing your domain and rebuild. Canonicals, sitemap,
schema and every internal link update automatically.

---

## Architecture

A small Node build system renders templates to static HTML. Nav, footer, SEO tags and
schema live in **one** place instead of being copy-pasted across 40 files.

```
src/
├── config/site.config.js   ← ALL business data (single source of truth)
├── data/
│   ├── content.js          ← projects, reviews, FAQs, packages, blog, team
│   └── stats.js            ← headline numbers, trust badges, credentials
├── lib/
│   ├── icons.js            ← 90 inline SVG icons → one sprite per page
│   ├── seo.js              ← meta tags + JSON-LD schema builders
│   ├── nav.js              ← site information architecture
│   └── picture.js          ← responsive <picture> helper
├── layouts/
│   ├── base.js             ← the HTML shell every page renders through
│   └── sections.js         ← reusable sections (hero, FAQ, CTA, forms…)
├── styles/                 ← 9 layered CSS files, bundled to one
├── scripts/app.js          ← vanilla JS runtime (15 KB minified)
└── pages/                  ← one file per page group

scripts/
├── build.mjs   ├── check.mjs   ├── audit.mjs   ├── images.mjs   └── serve.mjs
```

Generated HTML is written to the repo root so GitHub Pages serves it directly.

---

## Pages (40)

**Core** — Home · Home Interiors · **Gallery (10 full home packages)** · Portfolio ·
About · Process · Contact · Reviews · FAQ · Careers · Warranty · Design Journal

**Local SEO** — Interior Designers in Gurgaon / Noida / Delhi

**By home size** — 1 BHK · 2 BHK · 3 BHK · 4 BHK & Villas

**Services** — Modular Kitchen · Wardrobes · Full Home Turnkey · Renovation

**Blog** — 6 articles · **Legal** — Privacy · Terms · Refund · 404 · Thank-you

---

## The gallery

`/gallery/` shows **10 complete home packages**. Each package walks through the same
eight spaces — full-home overview, living/hall, kitchen, bedroom, puja room, washroom,
walk-in wardrobe and passage — in a keyboard- and swipe-navigable lightbox.

Packages are defined in **`src/data/gallery.js`** (copy, alt text, filter tags). Image
derivatives are generated by `npm run images` into `assets/img/gallery/`.

### ⚠️ Swapping in real project photography

The current renders are **placeholders**. To replace them:

```bash
# Name files <packageId>-<room>.jpg, e.g. aurelia-kitchen.jpg
cp your-photo.jpg src/assets-src/gallery/aurelia-kitchen.jpg
npm run images && npm run build
```

The pipeline prefers a real file whenever one exists and only falls back to a graded
placeholder when it does not — so you can swap photos in one room at a time.

---

## Performance

| Metric | Value |
|---|---|
| Initial payload (home, desktop) | **422 KB** — HTML + CSS + fonts + LCP image |
| Initial payload (home, mobile) | **~322 KB** — the LCP preload is responsive, so phones fetch the 640w AVIF (30 KB) rather than the 1400w (129 KB) |
| CSS | 80 KB minified, single file |
| JS | 15 KB minified, deferred, no dependencies |
| Third-party render-blocking requests | **0** — fonts, icons and images all self-hosted |
| Images | AVIF → WebP → JPEG, responsive `srcset`, every one has `width`/`height` |
| Layout shift | None — all media has intrinsic dimensions reserved |

Fonts (Inter + Fraunces variable, 83 KB) are self-hosted and preloaded. Icons are one
inline SVG sprite per page. Google Maps loads only on click via a lightweight facade.

---

## SEO

- Unique title + meta description per page, all within SERP length limits
- Canonical URLs, `hreflang="en-IN"`, Open Graph and Twitter cards
- **JSON-LD `@graph`**: `HomeAndConstructionBusiness`, `WebSite`, `WebPage`,
  `BreadcrumbList`, `FAQPage`, `Service`, `Offer`, `AggregateRating`, `JobPosting`,
  `BlogPosting`, plus a per-city `LocalBusiness` node
- Auto-generated `sitemap.xml` with computed priorities, plus `robots.txt`
- Geo meta tags, three city landing pages, and locality internal-linking in the footer
- `npm run check` fails the build on a broken link, missing canonical or duplicate `<h1>`

---

## Accessibility

WCAG-minded: semantic landmarks, one `<h1>` per page, visible `:focus-visible` rings,
44px+ touch targets, `aria-expanded` on all disclosures, focus-trapped mobile drawer,
labelled form fields with inline error messaging, and full
`prefers-reduced-motion` support.

---

## Deploying

The built HTML is committed at the repo root, so **no build step is needed to go live**.

### Option 1 — GitHub Pages (deploy from branch) · simplest

**Settings → Pages → Source → Deploy from a branch → `main` / `(root)` → Save.**
Live in 2–3 minutes. Every future `npm run build` + push republishes automatically.

### Option 2 — GitHub Actions (build + validate on every push)

A ready workflow is included at `.github/deploy.workflow.yml.example`. To enable it:

```bash
mkdir -p .github/workflows
mv .github/deploy.workflow.yml.example .github/workflows/deploy.yml
git add -A && git commit -m "Enable Pages workflow" && git push
```

Then set **Settings → Pages → Source → GitHub Actions**. This runs `npm run check`
on every push, so a broken link or missing canonical fails the deploy before it ships.

> It ships as `.example` because the automation that created this branch does not hold
> GitHub's `workflows` permission — moving the file yourself takes one command.

### Option 3 — Any static host

Upload the repository contents (excluding `node_modules/`, `src/`, `scripts/`) to
Netlify, Vercel, Hostinger, cPanel or S3. It is plain HTML, CSS, JS and images.

---

© Nexora Spaces LLP. All rights reserved.
