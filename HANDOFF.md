# HANDOFF — Nexora Spaces LLP

_Last updated: 2026-07-27_

## Current branch

Use only:

```bash
git checkout arena/019fa4bc-nexora-spaces-llp
```

## What this session was asked to do

The previous chat summary said there should be two local commits to push and merge:

```text
d931710  Add HANDOFF.md for session continuity
c8dbc24  Add founder photo (Sourabh Pandey) + 11 review fixes
```

In this checkout those SHAs were **not present locally** and were also **not found on GitHub**. The repo only had `main` at `3367e9a`. The work was therefore recreated from the handoff summary.

## Changes recreated in this branch

1. Added an optimized founder image for Sourabh Pandey:
   - Source: `Photos/Founder_Sourabh_Pandey.png`
   - Web asset: `assets/img/team/sourabh-pandey.jpg`

2. Replaced fake/persona leadership names with honest founder-led content:
   - `src/data/content.js`
   - `src/pages/company.js`
   - `src/styles/08-pages.css`

3. Disabled unverified review structured data:
   - `src/config/site.config.js` → `site.reviews.schema = false`
   - Review aggregate schema and Review JSON-LD are gated behind this flag.
   - Visible rating/count claims are replaced with safer copy while schema is off.

4. Rebuilt static site output:
   - root `*.html` / page `index.html` files
   - `assets/css/main.css`
   - `assets/js/app.js` if build changes it
   - `sitemap.xml`, `robots.txt`, `site.webmanifest`

## Commands to verify

```bash
npm run build
npm run check
```

Expected health from previous checks: 40 pages, all checks passing.

## Important pending user data

These still need real business details from the owner before final SEO/live launch:

1. Co-founder details:
   - real name
   - real role/title
   - real bio
   - photo uploaded in `Photos/`

2. Sourabh Pandey bio:
   - current bio is generic and execution-focused
   - replace with real background/experience/specialisation when available

3. Contact/NAP details:
   - phone numbers in `src/config/site.config.js` are placeholders
   - emails/offices/legal IDs/social profiles also need verification

4. Reviews / Google Business Profile:
   - `site.reviews.schema` must stay `false` until rating/count/reviews are real and match Google Business Profile or another verifiable source
   - enabling fake `aggregateRating` or `Review` JSON-LD can trigger Google structured-data/manual-action issues

## Push / PR / merge flow

After changes are committed:

```bash
git push origin arena/019fa4bc-nexora-spaces-llp
gh pr create --base main --head arena/019fa4bc-nexora-spaces-llp --title "Update founder profile and disable unverified review schema" --body "Adds Sourabh Pandey founder profile/photo and gates unverified review structured data."
gh pr merge <PR_NUMBER> --merge
```

Do **not** create/switch to any branch other than `arena/019fa4bc-nexora-spaces-llp` in Arena.
