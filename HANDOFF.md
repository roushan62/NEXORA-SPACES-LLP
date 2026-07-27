# HANDOFF — Nexora Spaces LLP

_Last updated: 2026-07-28 — residential refocus_

## What this site is now

**Nexora Spaces LLP is a residential-only interior fit-out and design-build studio.**
Flats, apartments, villas, independent floors and individual rooms. No office, retail,
hospitality or commercial fit-out content anywhere.

## Two rules that must not regress

1. **No pricing, anywhere.** No rates, ranges, per-sq-ft figures, EMI, package prices,
   budget sliders or cost calculators — not in copy, not in JSON-LD, not in JS.
   Value is expressed in words only: "value-driven", "budget-smart luxury",
   "cost-effective".
2. **Residential only.** Every page speaks to homeowners.

Both are enforced automatically:

```bash
npm run build
npm run check     # links, images, canonicals, schema, headings
npm run verify    # the residential brief — fails on a pricing or commercial leak
```

## ⚠️ Placeholder media that still needs real assets

| What | Where | How to replace |
|---|---|---|
| **Hero video** | `site.heroVideo.sources` in `src/config/site.config.js` (currently empty) | Drop an interior-walkthrough file into `assets/video/` and list it in `sources`. Until then the hero runs an animated cross-fade walkthrough built from gallery stills — it autoplays everywhere and costs no extra download. |
| **Gallery photography** (80 images) | `src/assets-src/gallery/` | Add `<packageId>-<room>.jpg` (e.g. `aurelia-kitchen.jpg`), then `npm run images && npm run build`. Real files always win over placeholders, one room at a time. |
| **Project photos** (portfolio) | `src/assets-src/p1–p9.jpg` | Replace and run `npm run images`. |

Package ids: `aurelia, meridian, sereno, aravalli, kalina, vasant, oakwood, lumen,
palash, nirvaan`. Rooms: `overview, hall, kitchen, bedroom, puja, bath, closet, passage`.

## Still pending real business data

1. **Contact/NAP** — phone numbers, emails, office addresses and legal IDs in
   `src/config/site.config.js` are still placeholders (marked `⚠️ REPLACE`).
2. **Lead form endpoint** — `site.forms.endpoint` is empty, so the consultation form
   falls back to opening WhatsApp with the enquiry pre-filled. No lead is lost, but a
   Formspree/Web3Forms endpoint should be set before launch.
3. **Reviews** — `site.reviews.schema` must stay `false` until the rating and count are
   real and verifiable against a Google Business Profile. Unverified `aggregateRating`
   markup risks a structured-data manual action.
4. **Credentials** — the ISO and insurance lines in `src/data/stats.js` are marked
   `⚠️ REPLACE`.

## Deliberate decisions worth knowing

- **About Us is company-level only.** No team photos, no founder headshots, no
  "meet the team". The previous founder image and `assets/img/team/` were removed.
  `npm run verify` fails if portrait imagery returns.
- **Pricing pages are gone**, not hidden: `/pricing/`, `/cost-calculator/` and the whole
  `/commercial/` tree were deleted, and every inbound link was rewritten.
- **`richText()`** in `src/layouts/base.js` rewrites root-relative links inside authored
  FAQ/blog HTML through the deploy `basePath`. Without it, a hand-written
  `<a href="/warranty/">` in content data 404s on GitHub Project Pages.

## Branch

Work happens on `arena/019fa4eb-nexora-spaces-llp`.
