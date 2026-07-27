import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, articleSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import { pageHead, sectionHead, ctaBand, faqBlock } from '../layouts/sections.js';
import { posts, faqsCost, faqsGeneral } from '../data/content.js';

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const imgName = (p) => p.image.replace('/assets/img/', '').replace('.jpg', '');

const postCard = (p) => `
<a href="${url('/blog/' + p.slug + '/')}" class="post-card">
  <div class="post-media zoom-parent">
    ${picture({ name: imgName(p), alt: p.alt, widths: [420, 800], sizes: '(max-width:900px) 100vw, 33vw', width: 800, height: 500, imgClass: 'zoom-img' })}
  </div>
  <div class="post-body">
    <div class="post-meta">
      <span class="badge badge-accent">${esc(p.category)}</span>
      <span>${icon('calendar', { size: 13 })} ${fmtDate(p.date)}</span>
      <span>${icon('clock', { size: 13 })} ${esc(p.readTime)}</span>
    </div>
    <h3 class="post-title">${esc(p.title)}</h3>
    <p class="post-excerpt">${esc(p.excerpt)}</p>
    <span class="link-arrow">Read article ${icon('arrowRight', { size: 16 })}</span>
  </div>
</a>`;

/* ============================================================ INDEX */
const index = {
  route: '/blog/',
  title: 'Design Journal — Interior Cost Guides & Advice for Delhi NCR | Nexora Spaces',
  metaTitle: 'Design Journal | Interior Guides for Delhi NCR | Nexora',
  description:
    'Practical, NCR-specific writing on interior costs, materials, planning and process. Written by the designers and project managers who actually deliver the work.',
  keywords: 'interior design blog india, interior design cost guide, modular kitchen guide, home interior tips delhi ncr',
  ogImage: '/assets/img/blog/b1-800.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Design journal', href: '/blog/' }],
  extraSchema: [{
    '@type': 'Blog',
    '@id': `${site.baseUrl}${site.basePath}/blog/#blog`,
    name: 'Nexora Spaces Design Journal',
    description: 'Interior design guides, cost breakdowns and material advice for Delhi NCR homeowners.',
    publisher: { '@id': `${site.baseUrl}${site.basePath}/#organization` },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      datePublished: p.date,
      url: `${site.baseUrl}${site.basePath}/blog/${p.slug}/`,
      image: `${site.baseUrl}${site.basePath}/assets/img/blog/${p.slug.slice(0, 2)}-800.jpg`,
    })),
  }],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Design journal', href: '/blog/' }],
      title: 'Things worth knowing<br>before you sign',
      sub: 'Written by our designers and project managers, about the Delhi NCR market specifically. No listicles, no stock advice, no "10 trends you must follow".',
      light: true,
    }),

    `<section class="section">
      <div class="container">
        ${posts.filter((p) => p.featured).map((p) => `
        <a href="${url('/blog/' + p.slug + '/')}" class="post-featured reveal">
          <div class="post-media zoom-parent">
            ${picture({ name: imgName(p), alt: p.alt, widths: [420, 800], sizes: '(max-width:860px) 100vw, 55vw', width: 800, height: 500, imgClass: 'zoom-img' })}
          </div>
          <div class="post-body">
            <div class="post-meta">
              <span class="badge badge-dark">Featured</span>
              <span class="badge badge-accent">${esc(p.category)}</span>
              <span>${icon('clock', { size: 13 })} ${esc(p.readTime)}</span>
            </div>
            <h2 class="post-title">${esc(p.title)}</h2>
            <p class="post-excerpt">${esc(p.excerpt)}</p>
            <span class="link-arrow">Read the full guide ${icon('arrowRight', { size: 16 })}</span>
          </div>
        </a>`).join('')}

        <div class="blog-grid reveal-stagger">
          ${posts.filter((p) => !p.featured).map(postCard).join('')}
        </div>
      </div>
    </section>`,

    `<section class="section bg-subtle">
      <div class="container container-narrow">
        <div class="magnet reveal">
          <div>
            <h3>${icon('download', { size: 18 })} Planning a project right now?</h3>
            <p>Skip the reading. Send your floor plan on WhatsApp and get an itemised estimate back within one working day — no obligation, and no sales calls unless you ask for one.</p>
          </div>
          <a href="${waLink('Hi Nexora, I would like an interior estimate. Sharing my floor plan.')}" class="btn btn-accent" target="_blank" rel="noopener">
            ${icon('send', { size: 18 })} Send floor plan
          </a>
        </div>
      </div>
    </section>`,

    ctaBand({ source: 'blog-index' }),
  ].join('\n'),
};

/* ====================================================== ARTICLE BODIES */
const bodies = {
  'interior-design-cost-delhi-ncr': {
    toc: [
      ['rates', 'The 2026 rate card'],
      ['city', 'Why city matters'],
      ['drivers', 'What drives cost'],
      ['hidden', 'Five hidden line items'],
      ['save', 'Where to save safely'],
      ['compare', 'How to compare quotes'],
    ],
    html: `
<p class="lead" style="font-size:var(--fs-lg);color:var(--text)">Ask five interior firms in Delhi NCR what a 2 BHK costs and you will get five answers between ₹6 lakh and ₹22 lakh. None of them are lying. They are quoting different scopes, different materials and — most misleadingly — different area bases.</p>
<p>This guide gives you our actual 2026 rate card, explains what moves the number, and shows you how to compare two quotes properly. We publish it because an informed client is a faster, less painful project for everyone.</p>

<h2 id="rates">The 2026 rate card</h2>
<p>All figures below are <strong>per square foot of carpet area</strong> — the usable floor area inside your walls — and exclude 18% GST.</p>
<table>
  <thead><tr><th>Package</th><th>Rate / sq.ft</th><th>Typical 2 BHK (780 sq.ft)</th></tr></thead>
  <tbody>
    <tr><td><strong>Essential</strong></td><td>₹1,150 – ₹1,450</td><td>₹9.0 L – ₹11.3 L</td></tr>
    <tr><td><strong>Signature</strong></td><td>₹1,650 – ₹2,100</td><td>₹12.9 L – ₹16.4 L</td></tr>
    <tr><td><strong>Luxe</strong></td><td>₹2,400 – ₹3,400</td><td>₹18.7 L – ₹26.5 L</td></tr>
  </tbody>
</table>
<p>If a quote you have received sits well below the Essential band for a comparable scope, something is being left out — usually electrical, painting, or loft storage. That is not a cheaper quote; it is an incomplete one.</p>

<h2 id="city">Why the same home costs more in Gurugram than Noida</h2>
<p>Roughly 6–8% for identical scope and material. Three reasons:</p>
<ul>
  <li><strong>Labour rates.</strong> Skilled carpentry and finishing labour costs more in Gurugram and South Delhi.</li>
  <li><strong>Society access.</strong> Towers with single service-lift slots and 9am–6pm work windows stretch the same job across more days.</li>
  <li><strong>Logistics.</strong> Material movement into Golf Course Road and inner South Delhi is slower and more restricted than into a Sector 150 tower during bulk possession.</li>
</ul>
<p>Outer Delhi — Dwarka, Rohini, Uttam Nagar — sits closer to Noida rates than to South Delhi.</p>

<h2 id="drivers">What actually drives your cost</h2>
<p>In order of impact:</p>
<ol>
  <li><strong>Carpet area.</strong> Everything is per square foot. There is no volume discount to negotiate.</li>
  <li><strong>Material grade.</strong> 710 BWP plywood versus MR-grade is a 30% swing on the carcass alone. Acrylic versus laminate shutters is another 40%.</li>
  <li><strong>Hardware.</strong> A Hettich soft-close hinge costs about 4× a local equivalent and lasts roughly 10× longer. Across a full home this is a ₹60,000 to ₹1.5 lakh decision.</li>
  <li><strong>Scope depth.</strong> Modular-only is about 62% of a full-home cost. Add civil, flooring and plumbing and you are at roughly 124%.</li>
  <li><strong>Timeline.</strong> Compressing 45 days to 30 needs parallel trades and short-lead materials — typically 8–14% more.</li>
</ol>

<h2 id="hidden">Five line items that vanish from cheap quotes</h2>
<p>When a quote looks suspiciously good, check whether these are present:</p>
<ul>
  <li><strong>Electrical work.</strong> New points, conduiting, modular switches and DB upgrade. Easily ₹70,000–₹1.7 lakh on a 2 BHK.</li>
  <li><strong>Loft storage.</strong> Often quoted separately or omitted entirely, then added later at a premium.</li>
  <li><strong>Painting.</strong> Some quotes cover only the rooms with joinery, leaving you to paint the rest.</li>
  <li><strong>Hardware brand.</strong> "Soft-close hinges" with no brand named means the cheapest available on installation day.</li>
  <li><strong>Edge banding thickness.</strong> 0.8mm looks identical to 2mm on day one and peels within two monsoons. It is rarely specified in a weak BOQ.</li>
</ul>

<h2 id="save">Where you can safely save</h2>
<p>Not everything needs premium specification. Genuine savings that will not hurt you in year three:</p>
<ul>
  <li><strong>Guest bedroom and utility areas.</strong> Laminate instead of acrylic here is invisible in daily life.</li>
  <li><strong>Loose furniture.</strong> Buy over time rather than financing it all into the project.</li>
  <li><strong>Feature walls.</strong> One well-executed feature wall beats four mediocre ones, and costs a quarter as much.</li>
  <li><strong>Phasing.</strong> Do the kitchen, wardrobes and painting now; living room and ceiling in twelve months. Design the whole home upfront so phase two matches.</li>
</ul>
<p>Where you should not save: kitchen carcass grade, hardware, and anything concealed behind finished surfaces. Redoing those later means demolishing the work in front of them.</p>

<h2 id="compare">How to compare two quotes properly</h2>
<p>Put them side by side and check five things:</p>
<ol>
  <li><strong>Area basis.</strong> Carpet, built-up or super built-up? A rate quoted on super built-up can look 25–30% lower for identical work.</li>
  <li><strong>Brand names.</strong> Every hardware and material line should name a brand. "Premium quality hardware" is not a specification.</li>
  <li><strong>Quantities.</strong> Running feet of wardrobe, square feet of ceiling, number of electrical points. Vague quantities become variations later.</li>
  <li><strong>Exclusions list.</strong> A quote without a stated exclusions list is hiding them.</li>
  <li><strong>Payment schedule.</strong> Anything demanding more than 50% before material dispatch deserves hard questions.</li>
</ol>
<p>If you would like a second opinion on a quote you have received — even one from a competitor — send it to us. We will tell you honestly whether it is fair. We have talked several people out of switching to us because their existing quote was genuinely good.</p>`,
  },

  'modular-kitchen-materials-guide': {
    toc: [['ply', 'Plywood grades'], ['shutters', 'Shutter finishes'], ['hardware', 'Hardware'], ['counter', 'Countertops'], ['read', 'Reading a BOQ']],
    html: `
<p class="lead" style="font-size:var(--fs-lg);color:var(--text)">Almost every kitchen that fails in an Indian home fails for the same three reasons: wrong plywood grade near water, cheap edge banding, and hardware chosen on price. None of these are visible on the day of handover — which is exactly why they get cut.</p>

<h2 id="ply">Plywood grades: BWP, BWR and MR</h2>
<table>
  <thead><tr><th>Grade</th><th>Full name</th><th>Water resistance</th><th>Use in kitchen</th></tr></thead>
  <tbody>
    <tr><td><strong>BWP (IS:710)</strong></td><td>Boiling Water Proof</td><td>Highest — survives boiling water immersion</td><td>Base units, sink area, all wet zones</td></tr>
    <tr><td><strong>BWR (IS:303)</strong></td><td>Boiling Water Resistant</td><td>Good — handles humidity and splashes</td><td>Wall units and dry zones only</td></tr>
    <tr><td><strong>MR (IS:303)</strong></td><td>Moisture Resistant</td><td>Low — humidity only, not water</td><td>Not suitable for kitchens</td></tr>
  </tbody>
</table>
<p>Anyone quoting MR-grade for a kitchen carcass is under-specifying. Ask to see the IS:710 stamp on the board, and make sure the BOQ names a brand — Century, Greenply, Austin or equivalent.</p>
<blockquote>The carcass is the part you never see and can never replace without demolishing the kitchen. It is the single worst place to save money.</blockquote>

<h2 id="shutters">Shutter finishes compared</h2>
<table>
  <thead><tr><th>Finish</th><th>Life</th><th>Maintenance</th><th>Rate / sq.ft</th></tr></thead>
  <tbody>
    <tr><td>Laminate 1mm</td><td>8–10 years</td><td>Very easy</td><td>₹1,450 – ₹1,900</td></tr>
    <tr><td>Acrylic gloss</td><td>10+ years</td><td>Shows fingerprints</td><td>₹2,100 – ₹2,800</td></tr>
    <tr><td>PU matte</td><td>10+ years</td><td>Can be re-coated</td><td>₹2,400 – ₹3,200</td></tr>
    <tr><td>Membrane / PVC</td><td>5–7 years</td><td>Delaminates in heat</td><td>₹1,300 – ₹1,700</td></tr>
    <tr><td>Lacquered glass</td><td>12+ years</td><td>Shows smudges</td><td>₹3,000 – ₹4,200</td></tr>
  </tbody>
</table>
<p>Membrane finishes are popular because they are cheap and look good initially. In a Delhi kitchen with regular high heat, they are the finish most likely to fail early — we generally advise against them near the hob.</p>

<h2 id="hardware">Hardware: where the money is well spent</h2>
<p>Hinges and channels are operated thousands of times a year. A branded soft-close hinge from Hettich, Blum or Ebco is rated for 50,000+ cycles; an unbranded one may not survive 8,000.</p>
<ul>
  <li><strong>Hinges.</strong> Soft-close, clip-on, with three-way adjustment. Insist the brand is named on the BOQ.</li>
  <li><strong>Drawer channels.</strong> Tandem box or full-extension telescopic. Avoid roller channels — they sag under load.</li>
  <li><strong>Lift-ups.</strong> Gas-strut or mechanical lift systems for wall units, particularly above the hob where head clearance matters.</li>
  <li><strong>Edge banding.</strong> Always 2mm PVC, hot-glue pressed. The 0.8mm banding most low quotes use peels within two monsoons.</li>
</ul>

<h2 id="counter">Countertops</h2>
<p><strong>Granite</strong> is the value choice — heat-proof, durable, and around ₹280–₹550/sq.ft. <strong>Quartz</strong> costs ₹550–₹1,200/sq.ft, is non-porous and stain-resistant, but can discolour under prolonged direct heat. <strong>Solid surface</strong> allows seamless joins and integrated sinks at ₹900–₹2,200/sq.ft but scratches more easily.</p>
<p>For most Indian cooking patterns, quartz is the best balance — as long as you use a trivet under hot vessels.</p>

<h2 id="read">Reading a kitchen BOQ in two minutes</h2>
<p>Scan for these five lines. If any is missing or vague, ask before you sign:</p>
<ol>
  <li>Plywood grade <em>and</em> brand, stated separately for base and wall units</li>
  <li>Edge banding thickness in mm</li>
  <li>Hinge and channel brand with model or series</li>
  <li>Countertop material, thickness and edge profile</li>
  <li>Whether appliance cut-outs, chimney duct and electrical points are included</li>
</ol>
<p>A vendor who cannot answer these instantly is not the vendor you want building the room your family eats from.</p>`,
  },
};

/* Generic body for posts without bespoke content yet */
const genericBody = (p) => ({
  toc: [['overview', 'Overview'], ['detail', 'The detail'], ['next', 'What to do next']],
  html: `
<p class="lead" style="font-size:var(--fs-lg);color:var(--text)">${esc(p.excerpt)}</p>

<h2 id="overview">Overview</h2>
<p>This guide is written from our own project data across Delhi, Gurugram and Noida — not from generic industry advice. Everything below reflects what we actually see on site in NCR homes.</p>
<p>If you want this applied to your specific home rather than read in the abstract, send us your floor plan. We will come back with an itemised view within one working day.</p>

<h2 id="detail">The detail</h2>
<p>We are expanding this article with the full breakdown, worked examples and photographs from recent projects. In the meantime, these related guides cover adjacent ground in depth:</p>
<ul>
  <li><a href="${url('/blog/interior-design-cost-delhi-ncr/')}">Interior design cost in Delhi NCR — the honest 2026 breakdown</a></li>
  <li><a href="${url('/blog/modular-kitchen-materials-guide/')}">BWP vs BWR vs MR plywood: what your kitchen actually needs</a></li>
  <li><a href="${url('/pricing/')}">Our full pricing and package comparison</a></li>
  <li><a href="${url('/process/')}">How we deliver a home in 45 days</a></li>
</ul>

<h2 id="next">What to do next</h2>
<p>If you are within eight weeks of possession or planning a renovation, the most useful next step is a free site visit. A senior designer measures the home, discusses scope honestly against your budget, and you get a 3D concept and itemised BOQ to keep — whether you hire us or not.</p>`,
});

/* ====================================================== ARTICLE PAGES */
const articles = posts.map((p) => {
  const content = bodies[p.slug] || genericBody(p);
  return {
    route: `/blog/${p.slug}/`,
    title: `${p.title} | Nexora Spaces`,
    metaTitle: (p.metaTitle || (p.title.length > 50 ? p.title : `${p.title} | Nexora`)).slice(0, 64),
    description: p.excerpt,
    keywords: `${p.category.toLowerCase()}, interior design delhi ncr, ${p.slug.replace(/-/g, ' ')}`,
    ogImage: `/assets/img/blog/${imgName(p).split('/').pop()}-800.jpg`,
    ogType: 'article',
    pageType: 'Article',
    datePublished: p.date,
    dateModified: p.updated || p.date,
    crumbs: [
      { label: 'Home', href: '/' },
      { label: 'Design journal', href: '/blog/' },
      { label: p.category, href: '/blog/' },
    ],
    extraSchema: [articleSchema(p, `/blog/${p.slug}/`)],
    body: [
      pageHead({
        crumbs: [
          { label: 'Home', href: '/' },
          { label: 'Design journal', href: '/blog/' },
          { label: p.category, href: '/blog/' },
        ],
        title: esc(p.title),
        sub: esc(p.excerpt),
        light: true,
      }),

      `<section class="section-sm bg-subtle section-divided">
        <div class="container">
          <div class="flex items-center gap-5 flex-wrap" style="font-size:var(--fs-sm);color:var(--text-muted)">
            <span class="badge badge-accent">${esc(p.category)}</span>
            <span>${icon('calendar', { size: 14 })} Published ${fmtDate(p.date)}</span>
            <span>${icon('clock', { size: 14 })} ${esc(p.readTime)} read</span>
            <span>${icon('users', { size: 14 })} Nexora Design Studio</span>
          </div>
        </div>
      </section>`,

      `<section class="section">
        <div class="container">
          <div class="article-shell">
            <aside class="toc" id="toc">
              <h4>On this page</h4>
              <ul>
                ${content.toc.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('')}
              </ul>
              <div class="mt-6" style="padding-top:var(--s-5);border-top:1px solid var(--line)">
                <a href="${url('/cost-calculator/')}" class="btn btn-primary btn-sm btn-block">${icon('calculator', { size: 15 })} Cost calculator</a>
              </div>
            </aside>

            <article>
              <div class="img-round img-shadow mb-10">
                ${picture({ name: imgName(p), alt: p.alt, widths: [420, 800], sizes: '(max-width:1024px) 100vw, 70vw', width: 800, height: 500 })}
              </div>
              <div class="prose">${content.html}</div>

              <div class="magnet mt-12">
                <div>
                  <h3>Want this applied to your home?</h3>
                  <p>Free site visit, free 3D concept and an itemised BOQ within 72 hours. Yours to keep either way.</p>
                </div>
                <a href="${url('/contact/')}" class="btn btn-accent">Book free consultation</a>
              </div>

              <div class="mt-12" style="padding-top:var(--s-8);border-top:1px solid var(--line)">
                <h3 class="mb-6" style="font-size:var(--fs-xl)">Continue reading</h3>
                <div class="grid grid-2 gap-5">
                  ${posts.filter((x) => x.slug !== p.slug).slice(0, 2).map(postCard).join('')}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>`,

      ctaBand({ source: `blog-${p.slug}` }),
    ].join('\n'),
  };
});

export default [index, ...articles];
