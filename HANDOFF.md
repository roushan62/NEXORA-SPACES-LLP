# HANDOFF — Nexora Spaces LLP

_Last updated: 2026-07-28 — full functional audit + contact backend_

## What this site is

**Nexora Spaces LLP is a residential-only interior fit-out and design-build studio.**
Flats, apartments, villas, independent floors and individual rooms. No office, retail,
hospitality or commercial fit-out content anywhere.

34 static pages, plus one PHP function on Vercel that emails the lead form.

## Two rules that must not regress

1. **No pricing, anywhere.** No rates, ranges, per-sq-ft figures, EMI, package prices,
   budget sliders or cost calculators — not in copy, not in JSON-LD, not in JS.
2. **Residential only.** Every page speaks to homeowners.

Both are enforced automatically:

```bash
npm test        # build + check + verify + e2e + test:api  (~15s)
```

| Script | Guards |
|---|---|
| `npm run check` | links, images, canonicals, schema, headings |
| `npm run verify` | the residential brief — pricing/commercial leaks in copy **and JSON-LD**, unique schema `@id`s |
| `npm run e2e` | boots all 34 pages in a DOM and drives every control |
| `npm run audit:browser` | renders all 34 pages in Chromium at 5 widths and hit-tests every control |
| `npm run test:api` | runs `api/contact.php` on real PHP 8.2 (WebAssembly) |

---

## 🔴 Before launch — three things

1. **Deploy the contact backend.** Follow **[`api/README.md`](api/README.md)** (~10 min,
   free). Then paste your Vercel URL into `site.forms.endpoint` and rebuild.
   Until then the form falls back to WhatsApp, so no lead is lost.
2. **Change the recipient.** `MAIL_TO` on Vercel is currently the testing placeholder
   `kingboy620478@gmail.com`. Point it at the real studio inbox.
3. **Replace the placeholder business data** in `src/config/site.config.js` — every
   item marked `⚠️ REPLACE` (phone, email, addresses, LLPIN/GSTIN, social links).

---

## What was fixed in this pass

Found by driving every built page in a headless DOM and rendering them in real
Chromium at 1440 / 768 / 390px.

**Dead or broken controls**
- Carousel arrows did nothing on 12 pages — the buttons and the `.rail` they scroll
  sat in two sibling `[data-rail]` wrappers. The empty `data-rail=""` also reached
  `querySelector('')`, which throws and aborted the rest of the JS boot.
- "Back to top" was revealed on scroll but had no click handler at all.
- Unticked consent silently blocked submit: the error was written to a `.field-error`
  node that does not exist inside `<label class="consent">`, and the focus selector
  never matched it. No message, no focus move, no explanation.
- The portfolio "Commercial" filter matched zero projects and emptied the grid.

**Layout** (found by rendering all 34 pages at 320/390/768/1280/1440 — 170 combinations)
- The desktop navbar overlapped itself at **every width from 1100–1440px**: the
  nowrap links were squeezed to 443px while needing 998px, so they rendered on top
  of the phone number and CTA.
- The closed consultation modal stayed in the layout (`hidden` is only a UA-level
  `display:none`, and `.modal{display:grid}` overrode it), covering every page with
  an invisible panel that swallowed all three mobile dock buttons.
- The toast, hidden only by `transform`, ate taps on the middle dock action.
- The CTA band overflowed the right edge on 13 of 19 pages at 390px (grid
  `min-width:auto`); the contact page declared a hard 480px column.
- Blog articles hung off every phone: `.article-shell` and `.page-head-grid`
  hit the same `min-width:auto` trap, and `.post-media` combined
  `aspect-ratio:auto` with `min-height`, which makes the browser derive a
  *width* from the image's ratio.
- Data tables in authored blog HTML had no scroll wrapper. `richText()` now
  wraps them automatically, so future posts are covered.
- The fixed mobile dock only reserved space under the footer, so mid-page
  content sat beneath it unreachable.
- The consent checkbox was an 18px tap target (WCAG 2.2 asks for 24px).

**SEO / accessibility**
- Every `Service` node across 13 pages shared one `@id`, so Google merged them.
- The organization schema advertised "Office interior design", and city pages carried
  a `price`/`priceRange` offer — both contradicting the brief while invisible to the
  visible-text checks.
- The logo renders 3× per page and each copy redefined `id="nxGold"`.
- 15 pages skipped a heading level; the nav mega-menu used an `<h4>` that sat above
  the page `<h1>` entirely.

Each fix has a matching regression test, and each test was confirmed to fail when the
fix is reverted.

---

## ⚠️ Placeholder media that still needs real assets

| What | Where | How to replace |
|---|---|---|
| **Hero video** | `site.heroVideo.sources` (currently empty) | Drop a walkthrough into `assets/video/` and list it. Until then the hero cross-fades gallery stills — autoplays everywhere, no extra download. |
| **Gallery photography** (80 images) | `src/assets-src/gallery/` | Add `<packageId>-<room>.jpg`, then `npm run images && npm run build`. Real files always win over placeholders, one room at a time. |
| **Project photos** | `src/assets-src/p1–p9.jpg` | Replace and run `npm run images`. |

Package ids: `aurelia, meridian, sereno, aravalli, kalina, vasant, oakwood, lumen,
palash, nirvaan`. Rooms: `overview, hall, kitchen, bedroom, puja, bath, closet, passage`.

## Still pending real business data

1. **Contact/NAP** — phone, email, addresses and legal IDs in `src/config/site.config.js`.
2. **Reviews** — `site.reviews.schema` must stay `false` until the rating and count are
   real and verifiable against a Google Business Profile. Unverified `aggregateRating`
   markup risks a structured-data manual action.
3. **Credentials** — the ISO and insurance lines in `src/data/stats.js`.

## Deliberate decisions worth knowing

- **About Us is company-level only.** No team photos or founder headshots;
  `npm run verify` fails if portrait imagery returns.
- **Pricing pages are gone**, not hidden: `/pricing/`, `/cost-calculator/` and the whole
  `/commercial/` tree were deleted and every inbound link rewritten.
- **`richText()`** in `src/layouts/base.js` rewrites root-relative links inside authored
  FAQ/blog HTML through the deploy `basePath`. Without it a hand-written
  `<a href="/warranty/">` in content data 404s on GitHub Project Pages.
- **Nav labels**: `navLabel` in `src/lib/nav.js` gives the desktop bar shorter text; the
  drawer and `aria-label` keep the full descriptive label. Removing it re-breaks the
  navbar at common desktop widths.
- **`[hidden] { display: none !important }`** in `02-base.css` is load-bearing. Without
  it any component `display` rule silently re-enables a closed overlay.
