import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import {
  pageHead, sectionHead, processRail, faqBlock, ctaBand,
  testimonialSection, folioCard,
} from '../layouts/sections.js';
import { projects, testimonials, faqsGeneral, processSteps, packages, designStyles } from '../data/content.js';

/* ============================================================ MAIN PAGE */
const roomScopes = [
  { icon: 'kitchen', name: 'Modular kitchen', text: 'Base and wall units, tall stacks, quartz or granite counters, chimney and hob integration, dado tiling.' },
  { icon: 'package', name: 'Wardrobes & storage', text: 'Sliding or hinged shutters, internal drawers, pull-outs, mirror units, loft storage and shoe racks.' },
  { icon: 'sofa', name: 'Living & dining', text: 'TV panelling, crockery units, feature walls, console and shoe cabinet, seating layout planning.' },
  { icon: 'bed', name: 'Bedrooms', text: 'Beds with hydraulic storage, headboard panelling, side tables, study desks and dressing units.' },
  { icon: 'lamp', name: 'False ceiling & lighting', text: 'Peripheral or designer ceiling, cove and profile lighting, spotlights, and full lighting-scene planning.' },
  { icon: 'palette', name: 'Painting & finishes', text: 'Putty, primer and two coats of emulsion, textured or stencil feature walls, and enamel on joinery.' },
  { icon: 'zap', name: 'Electrical & plumbing', text: 'New points, concealed conduiting, modular switches, DB upgrades, and bathroom plumbing shifts.' },
  { icon: 'layers', name: 'Civil & flooring', text: 'Demolition, brickwork, waterproofing, tile or wooden flooring, and skirting.' },
];

const bhkLinks = [
  { label: '1 BHK', href: '/residential/1-bhk/', area: '400–550 sq.ft', price: '₹5.5 L – ₹10.1 L', desc: 'Studio and compact homes where every inch has to earn its place.' },
  { label: '2 BHK', href: '/residential/2-bhk/', area: '650–900 sq.ft', price: '₹9.0 L – ₹16.4 L', desc: 'Our most-booked configuration across Noida and New Gurgaon.', popular: true },
  { label: '3 BHK', href: '/residential/3-bhk/', area: '1,000–1,300 sq.ft', price: '₹13.2 L – ₹24.2 L', desc: 'Family homes with a study or guest room in the mix.' },
  { label: '4 BHK & Villas', href: '/residential/4-bhk-villa/', area: '1,600 sq.ft+', price: '₹19.0 L – ₹1.8 Cr', desc: 'Large-format builds, duplexes, penthouses and independent floors.' },
];

const main = {
  route: '/residential/',
  title: 'Residential Interior Design & Turnkey Fit-Out in Delhi NCR | Nexora Spaces',
  metaTitle: 'Residential Interior Design in Delhi NCR | Nexora',
  description:
    'Turnkey home interiors across Delhi NCR, 1 BHK to villas. One contract for design, modular, civil and painting. 10-year warranty, 45-day handover.',
  keywords: 'residential interior design delhi ncr, home interior gurgaon, flat interior design noida, turnkey home interiors, 2 bhk interior design cost',
  ogImage: '/assets/img/projects/p1-1200.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Residential', href: '/residential/' }],
  faqs: faqsGeneral.slice(0, 7),
  extraSchema: [serviceSchema({
    name: 'Residential Interior Design and Fit-Out',
    description: 'Full-home turnkey interior design and execution for apartments, builder floors and villas in Delhi, Gurugram and Noida.',
    serviceType: 'Residential Interior Design',
    offers: { price: '1150', min: 1150, max: 3400 },
  })],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Residential', href: '/residential/' }],
      title: 'Residential interiors,<br>delivered end to end',
      sub: 'From a compact Dwarka 1 BHK to a Golf Course Road villa — one team handles design, civil, modular, electrical, painting and styling. You get one contract, one price and one warranty.',
      image: '/assets/img/pages/residential-1600.jpg',
      actions: [
        `<a href="${url('/contact/')}" class="btn btn-accent btn-lg">${icon('sparkles', { size: 18 })} Get free 3D design</a>`,
        `<a href="${url('/cost-calculator/')}" class="btn btn-glass btn-lg">Estimate my cost</a>`,
      ],
      stats: [
        { value: '850+', label: 'Homes delivered' },
        { value: '45 days', label: 'Standard handover' },
        { value: '10 yrs', label: 'Modular warranty' },
        site.reviews.schema
          ? { value: `${site.reviews.rating}★`, label: 'Client rating' }
          : { value: '1 PM', label: 'Single point of contact' },
      ],
    }),

    /* ---- Configurations ---- */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'By home size',
          title: 'Pick your configuration',
          sub: 'Indicative full-home ranges on carpet area, excluding GST. Click through for room-by-room scope, real project costs and what changes at each budget level.',
          center: true,
        })}
        <div class="grid grid-4 gap-5 reveal-stagger">
          ${bhkLinks.map((b) => `
          <a href="${url(b.href)}" class="card card-hover" style="display:flex;flex-direction:column;${b.popular ? 'border-color:var(--brand-400)' : ''}">
            ${b.popular ? '<span class="badge badge-accent badge-caps mb-4" style="align-self:flex-start">Most booked</span>' : '<span class="badge badge-outline badge-caps mb-4" style="align-self:flex-start">' + esc(b.area) + '</span>'}
            <h3 class="card-title">${esc(b.label)} interiors</h3>
            <p class="card-text mb-5" style="flex:1">${esc(b.desc)}</p>
            <div style="padding-top:var(--s-4);border-top:1px solid var(--line)">
              <span style="font-size:var(--fs-xs);color:var(--text-subtle);display:block">Typical range</span>
              <strong style="font-family:var(--font-display);font-size:var(--fs-lg)">${esc(b.price)}</strong>
            </div>
            <span class="link-arrow mt-4">View ${esc(b.label)} details ${icon('arrowRight', { size: 15 })}</span>
          </a>`).join('')}
        </div>
      </div>
    </section>`,

    /* ---- Scope of work ---- */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Scope of work',
          title: 'Everything included under one contract',
          sub: 'No "that\'s not in our scope" conversations halfway through. This is the standard scope on a turnkey project — anything you drop is credited back on the BOQ.',
        })}
        <div class="grid grid-4 gap-5 reveal-stagger">
          ${roomScopes.map((s) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(s.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-base)">${esc(s.name)}</h3>
            <p class="card-text" style="font-size:var(--fs-sm)">${esc(s.text)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* ---- Packages ---- */
    `<section class="section" id="packages">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Packages',
          title: 'What each finish level actually gets you',
          sub: 'The difference between tiers is material grade and detailing, not effort. Design quality, project management and warranty are identical across all three.',
          center: true,
        })}
        <div class="price-grid reveal-stagger">
          ${packages.map((p) => `
          <div class="price-card${p.popular ? ' is-popular' : ''}">
            ${p.popular ? '<span class="price-flag">Most chosen</span>' : ''}
            <h3 class="price-name">${esc(p.name)}</h3>
            <p class="price-for">${esc(p.for)}</p>
            <div class="price-amount"><span class="price-cur">₹</span><span class="price-num">${esc(p.rate)}</span></div>
            <span class="price-unit">${esc(p.unit)}</span>
            <p class="price-note mt-3">${esc(p.example)}</p>
            <div class="price-divider"></div>
            <ul class="check-list">
              ${p.includes.map((f) => `<li>${icon('check', { size: 18 })} ${esc(f)}</li>`).join('')}
            </ul>
            <div class="mb-6" style="padding-top:var(--s-4);border-top:1px dashed var(--line)">
              <span style="font-size:var(--fs-xs);font-weight:700;text-transform:uppercase;letter-spacing:var(--tracking-caps);color:var(--text-subtle);display:block;margin-bottom:var(--s-3)">Not included</span>
              <ul class="check-list tight cross">
                ${p.excludes.map((f) => `<li>${icon('x', { size: 16 })} <span style="font-size:var(--fs-sm)">${esc(f)}</span></li>`).join('')}
              </ul>
            </div>
            <a href="${url('/contact/')}" class="btn ${p.popular ? 'btn-accent' : 'btn-outline'} btn-block">Get ${esc(p.name)} quote</a>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* ---- Process ---- */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Delivery system',
          title: 'How your home gets built',
          sub: 'Same seven stages on every project, documented and tracked.',
          center: true,
        })}
        ${processRail(processSteps)}
      </div>
    </section>`,

    /* ---- Styles ---- */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Design languages',
          title: 'Six directions we develop well',
          sub: 'Bring a Pinterest board and we will tell you honestly what it costs to execute properly — and which parts will not survive Delhi dust and humidity.',
        })}
        <div class="grid grid-3 gap-5 reveal-stagger">
          ${designStyles.map((s) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(s.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(s.name)}</h3>
            <p class="card-text">${esc(s.desc)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* ---- Recent residential work ---- */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({ eyebrow: 'Recent work', title: 'Residential projects we have handed over' })}
          <a href="${url('/portfolio/')}" class="btn btn-outline hide-sm">Full portfolio ${icon('arrowRight', { size: 16 })}</a>
        </div>
        <div class="folio-grid reveal-stagger">
          ${projects.filter((p) => p.tags.includes('residential')).slice(0, 6).map((p) => folioCard({
            ...p, image: `/assets/img/projects/${p.image.split('/').pop().replace('.jpg', '')}-800.jpg`,
          })).join('')}
        </div>
      </div>
    </section>`,

    testimonialSection(testimonials.slice(0, 5), { title: 'Homeowners who let us in' }),
    faqBlock(faqsGeneral.slice(0, 7), { eyebrow: 'Residential FAQs', title: 'Before you commit, ask us this' }),
    ctaBand({ source: 'residential' }),
  ].join('\n'),
};

/* ==================================================== BHK SUB-PAGES ==== */
const bhkData = [
  {
    slug: '1-bhk', label: '1 BHK', area: '400–550 sq.ft',
    priceRange: '₹5.5 lakh – ₹10.1 lakh', timeline: '30–38 days',
    image: 'projects/p6', imgAlt: 'Compact 1 BHK interior with space-saving wardrobe and study',
    intro: 'A 1 BHK is the hardest brief in interiors — you have one shot at every wall. Our approach is storage-first: we plan the volume you need before we plan how it looks, so the home never feels crowded by its own furniture.',
    highlights: [
      { icon: 'package', title: 'Storage that disappears', text: 'Full-height wardrobes to the ceiling, bed with hydraulic storage, and a loft plan that adds 40+ cubic feet without visual weight.' },
      { icon: 'ruler', title: 'Multi-use planning', text: 'Fold-down study, extendable dining, and a sofa-cum-bed layout so a single room genuinely serves three functions.' },
      { icon: 'lamp', title: 'Light and mirror strategy', text: 'Mirror placement and layered lighting to make 480 sq.ft read considerably larger without gimmicks.' },
    ],
    costTable: [
      ['Modular kitchen (L or parallel, 6–8 ft)', '₹1.6 L – ₹3.2 L'],
      ['Bedroom wardrobe + loft', '₹1.1 L – ₹2.4 L'],
      ['Bed with storage + side units', '₹55 K – ₹1.3 L'],
      ['TV unit & living storage', '₹45 K – ₹1.1 L'],
      ['False ceiling & lighting', '₹60 K – ₹1.4 L'],
      ['Painting (full home)', '₹40 K – ₹85 K'],
      ['Electrical & plumbing updates', '₹35 K – ₹90 K'],
    ],
    faqs: [
      { q: 'Is it worth doing full interiors in a 1 BHK?', a: '<p>If you are staying three years or more, yes — the storage gain alone changes how the home functions daily. If you are flipping or renting it out within a year, we would honestly suggest modular kitchen and wardrobes only, which is roughly 45% of the full-home cost and carries most of the resale value.</p>' },
      { q: 'How long does a 1 BHK take?', a: '<p>30 to 38 days from design sign-off, assuming society permissions are in hand. Modular-only scope finishes in 12–16 days.</p>' },
      { q: 'What is the realistic minimum budget?', a: '<p>Around <strong>₹5.5 lakh</strong> for a complete Essential-grade fit-out of a 480 sq.ft carpet-area home in Noida or Ghaziabad. Below that we would be cutting into material grade, and we will tell you so rather than take the project.</p>' },
    ],
  },
  {
    slug: '2-bhk', label: '2 BHK', area: '650–900 sq.ft',
    priceRange: '₹9.0 lakh – ₹16.4 lakh', timeline: '38–45 days',
    image: 'projects/p2', imgAlt: 'Contemporary 2 BHK living and dining interior in Noida',
    intro: 'Roughly six in ten homes we deliver are 2 BHKs — in Sector 150 Noida, New Gurgaon, Dwarka and Indirapuram. It is the configuration we have refined most, which is why our 2 BHK timelines are the most reliable in our book.',
    highlights: [
      { icon: 'kitchen', title: 'Kitchen that takes the load', text: 'Tall-unit stack for pantry, integrated appliance planning, and a work triangle that survives actual Indian cooking.' },
      { icon: 'users', title: 'A second room that flexes', text: 'Guest room, nursery or WFH study — designed so it can convert later without rebuilding the joinery.' },
      { icon: 'sofa', title: 'Living that seats eight', text: 'Layouts planned around real Indian hosting, not showroom photography.' },
    ],
    costTable: [
      ['Modular kitchen (8–10 ft, with tall unit)', '₹2.4 L – ₹4.6 L'],
      ['Two bedroom wardrobes + lofts', '₹2.2 L – ₹4.4 L'],
      ['Beds with storage + side tables', '₹1.1 L – ₹2.4 L'],
      ['TV unit, crockery & console', '₹85 K – ₹2.1 L'],
      ['False ceiling & profile lighting', '₹1.1 L – ₹2.3 L'],
      ['Painting (full home)', '₹65 K – ₹1.4 L'],
      ['Electrical, plumbing & civil', '₹70 K – ₹1.7 L'],
    ],
    faqs: [
      { q: 'What does a 2 BHK interior cost in Noida vs Gurugram?', a: '<p>Same scope, Noida typically lands 6–8% lower. A Signature-grade 780 sq.ft 2 BHK is about <strong>₹12.9–15.1 lakh in Noida</strong> and <strong>₹13.8–16.4 lakh in Gurugram</strong>. The gap is labour rates and material logistics, not quality.</p>' },
      { q: 'Can I do it in phases?', a: '<p>Yes, and many clients do. The usual split is Phase 1 — kitchen, wardrobes and painting; Phase 2 — living room, ceiling and decor six to twelve months later. We design the whole home upfront so Phase 2 matches perfectly, and we hold your material specifications on file.</p>' },
      { q: 'Do you work in under-construction or newly possessed flats?', a: '<p>Yes — new-possession flats are ideal because there is no demolition and no living-around-the-work. Send us the builder floor plan and we can start design before you even get keys.</p>' },
    ],
  },
  {
    slug: '3-bhk', label: '3 BHK', area: '1,000–1,300 sq.ft',
    priceRange: '₹13.2 lakh – ₹24.2 lakh', timeline: '42–52 days',
    image: 'projects/p9', imgAlt: 'Japandi style 3 BHK bedroom interior in Gurugram',
    intro: 'Three-bedroom homes are where design decisions start compounding. Get the master suite and the shared spaces right and the rest follows; get them wrong and you will feel it every single day.',
    highlights: [
      { icon: 'bed', title: 'Master suite as a priority', text: 'Walk-in or full-wall wardrobe, dresser, reading corner and separated lighting circuits for a genuine retreat.' },
      { icon: 'briefcase', title: 'A real work-from-home room', text: 'Acoustic treatment, correct desk-to-window orientation, and cable management that survives daily video calls.' },
      { icon: 'utensils', title: 'Kitchen and dining connected', text: 'Breakfast counters, service windows and crockery planning for households that actually entertain.' },
    ],
    costTable: [
      ['Modular kitchen (10–12 ft, premium finish)', '₹3.2 L – ₹6.4 L'],
      ['Three wardrobes + lofts', '₹3.4 L – ₹6.8 L'],
      ['Beds, side tables & dresser units', '₹1.8 L – ₹3.6 L'],
      ['Living, dining & foyer joinery', '₹1.6 L – ₹3.4 L'],
      ['Designer false ceiling & lighting', '₹1.7 L – ₹3.4 L'],
      ['Painting & feature walls', '₹95 K – ₹2.1 L'],
      ['Electrical, plumbing & civil', '₹1.1 L – ₹2.6 L'],
    ],
    faqs: [
      { q: 'Is a 3 BHK worth the Signature package over Essential?', a: '<p>In our experience, yes. On a 1,150 sq.ft home the step up is roughly ₹5.8 lakh, and it buys acrylic kitchen shutters, premium hardware throughout, designer ceiling and better paint. Those are exactly the surfaces you touch daily and the ones that look tired first in an Essential build.</p>' },
      { q: 'How disruptive is it if we are already living there?', a: '<p>Manageable with phasing. We seal the working zone daily, run modular installation room by room, and schedule dusty work (civil, ceiling) in a concentrated block. Most families stay through it; some move out for the 8–10 day civil phase only.</p>' },
      { q: 'Can you match interiors to an existing marble or flooring?', a: '<p>Yes. We photograph and colour-match on site, then bring physical samples to your home rather than deciding on a screen. Matching existing stone is routine work for us.</p>' },
    ],
  },
  {
    slug: '4-bhk-villa', label: '4 BHK & Villas', area: '1,600 sq.ft and above',
    priceRange: '₹19 lakh – ₹1.8 crore', timeline: '70–112 days',
    image: 'projects/p7', imgAlt: 'Luxury villa double-height living room interior in Gurugram',
    intro: 'Large-format homes are a different discipline: more trades, longer lead times on imported material, and far less tolerance for coordination failures. These projects get a senior PM, a dedicated site engineer and fortnightly client walkthroughs.',
    highlights: [
      { icon: 'gem', title: 'Material provenance', text: 'Book-matched stone, imported veneers and solid-surface fabrication — specified with samples and mock-ups before order.' },
      { icon: 'zap', title: 'Automation ready', text: 'Lighting scenes, motorised curtains, HVAC zoning and AV routed correctly at the conduit stage, not retrofitted later.' },
      { icon: 'hardHat', title: 'Multi-trade sequencing', text: 'Stone, joinery, glass, metal and MEP planned on a shared programme so trades are never waiting on each other.' },
    ],
    costTable: [
      ['Modular kitchen + utility + pantry', '₹6.5 L – ₹22 L'],
      ['Four to six wardrobes / walk-ins', '₹6.8 L – ₹24 L'],
      ['Living, dining, family lounge joinery', '₹4.5 L – ₹28 L'],
      ['Stone, cladding & feature walls', '₹3.8 L – ₹32 L'],
      ['Designer ceiling & lighting scheme', '₹3.2 L – ₹18 L'],
      ['Painting, polish & specialty finishes', '₹1.8 L – ₹9 L'],
      ['MEP, automation & civil works', '₹2.6 L – ₹22 L'],
    ],
    faqs: [
      { q: 'Do you take independent floors and builder floors?', a: '<p>Yes — South Delhi builder floors and Gurugram independent floors are a large part of our book. These often need full gut-renovation including services replacement, which we handle as a single contract.</p>' },
      { q: 'What about imported material lead times?', a: '<p>Imported veneers and stone typically run 4–8 weeks. We lock those selections in the first two weeks of design specifically so they do not become the critical path later. If a lead time threatens your date, we will say so before you sign.</p>' },
      { q: 'Can we phase a villa by floor?', a: '<p>Absolutely, and for occupied villas it is usually the right call. We complete one level fully — including snagging — before opening the next.</p>' },
    ],
  },
];

const bhkPages = bhkData.map((b) => ({
  route: `/residential/${b.slug}/`,
  title: `${b.label} Interior Design Cost in Delhi NCR (2026) | Nexora Spaces`,
  metaTitle: `${b.label} Interior Design Cost in Delhi NCR (2026)`,
  description: `${b.label} interior design in Delhi NCR. Typical cost ${b.priceRange}, handover in ${b.timeline}. Room-by-room pricing and free 3D design.`,
  keywords: `${b.label.toLowerCase()} interior design cost, ${b.label.toLowerCase()} interior delhi, ${b.label.toLowerCase()} interior gurgaon, ${b.label.toLowerCase()} interior noida`,
  ogImage: `/assets/img/${b.image}-1200.jpg`,
  crumbs: [
    { label: 'Home', href: '/' },
    { label: 'Residential', href: '/residential/' },
    { label: b.label, href: `/residential/${b.slug}/` },
  ],
  faqs: b.faqs,
  extraSchema: [serviceSchema({
    name: `${b.label} Interior Design & Fit-Out`,
    description: `Turnkey ${b.label} interior design and execution in Delhi, Gurugram and Noida.`,
    serviceType: 'Residential Interior Design',
    offers: { price: '1150', min: 1150, max: 3400 },
  })],
  body: [
    pageHead({
      crumbs: [
        { label: 'Home', href: '/' },
        { label: 'Residential', href: '/residential/' },
        { label: b.label, href: `/residential/${b.slug}/` },
      ],
      title: `${b.label} interior design<br>in Delhi NCR`,
      sub: b.intro,
      image: `/assets/img/${b.image}-1200.jpg`,
      actions: [
        `<a href="${url('/contact/')}" class="btn btn-accent btn-lg">Get a ${b.label} quote</a>`,
        `<a href="${url('/cost-calculator/')}" class="btn btn-glass btn-lg">Calculate my cost</a>`,
      ],
      stats: [
        { value: b.priceRange.split(' – ')[0].replace('₹', '₹'), label: 'Starting from' },
        { value: b.timeline.split('–')[1] || b.timeline, label: 'Typical handover' },
        { value: b.area.split('–')[0], label: 'Carpet area from' },
        { value: '10 yrs', label: 'Warranty' },
      ],
    }),

    `<section class="section">
      <div class="container">
        <div class="split split-start">
          <div class="reveal">
            ${sectionHead({ eyebrow: 'What we focus on', title: `Designing a ${b.label} properly` })}
            <div class="grid gap-6">
              ${b.highlights.map((h) => `
              <div class="feat-card">
                <span class="ico-lead">${icon(h.icon, { size: 24 })}</span>
                <h3>${esc(h.title)}</h3>
                <p>${esc(h.text)}</p>
              </div>`).join('')}
            </div>
          </div>
          <div class="split-media reveal delay-1">
            <div class="img-offset">
              ${picture({ name: b.image, alt: b.imgAlt, widths: [420, 800, 1200], sizes: '(max-width:1024px) 100vw, 50vw', width: 800, height: 600, className: 'img-round img-shadow' })}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    `<section class="section bg-subtle">
      <div class="container container-narrow">
        ${sectionHead({
          eyebrow: 'Cost breakdown',
          title: `${b.label} interior cost, head by head`,
          sub: 'Indicative Delhi NCR ranges from Essential to Luxe finish, excluding GST. Your BOQ will be exact.',
          center: true,
        })}
        <div class="table-wrap reveal">
          <table class="table">
            <thead><tr><th>Scope item</th><th class="num">Typical range</th></tr></thead>
            <tbody>
              ${b.costTable.map((r) => `<tr><td>${esc(r[0])}</td><td class="num"><strong>${esc(r[1])}</strong></td></tr>`).join('')}
              <tr class="table-highlight">
                <td><strong>Full-home turnkey total</strong></td>
                <td class="num"><strong>${esc(b.priceRange)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="alert alert-warn mt-6 reveal">
          ${icon('alertCircle', { size: 20 })}
          <p><span class="alert-title">Add these to your total budget</span>
          18% GST on the interior contract, ₹5,000–₹25,000 society work permission and lift charges,
          plus loose furniture and appliances at roughly 10–15% of the interior spend.</p>
        </div>
        <div class="btn-group center mt-8 reveal">
          <a href="${url('/cost-calculator/')}" class="btn btn-primary btn-lg">${icon('calculator', { size: 18 })} Get my exact estimate</a>
          <a href="${waLink(`Hi Nexora, I need a quote for ${b.label} interiors.`)}" class="btn btn-outline btn-lg" target="_blank" rel="noopener">WhatsApp a designer</a>
        </div>
      </div>
    </section>`,

    `<section class="section">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({ eyebrow: 'Delivered work', title: `Recent ${b.label} and similar projects` })}
          <a href="${url('/portfolio/')}" class="btn btn-outline hide-sm">All projects ${icon('arrowRight', { size: 16 })}</a>
        </div>
        <div class="folio-grid reveal-stagger">
          ${projects.slice(0, 3).map((p) => folioCard({
            ...p, image: `/assets/img/projects/${p.image.split('/').pop().replace('.jpg', '')}-800.jpg`,
          })).join('')}
        </div>
      </div>
    </section>`,

    faqBlock(b.faqs, { eyebrow: `${b.label} FAQs`, title: `${b.label} questions we get every week` }),
    ctaBand({ source: `residential-${b.slug}` }),
  ].join('\n'),
}));

export default [main, ...bhkPages];
