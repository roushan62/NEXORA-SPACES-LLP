import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import {
  pageHead, sectionHead, faqBlock, ctaBand,
  testimonialSection, folioCard,
} from '../layouts/sections.js';
import { projects, testimonials, faqsGeneral, faqsPlanning, designStyles } from '../data/content.js';
import { galleryPackages } from '../data/gallery.js';

/* ============================================================ MAIN PAGE */
const roomScopes = [
  { icon: 'kitchen', name: 'Modular kitchen', text: 'Base and wall units, tall stacks, quartz or granite counters, chimney and hob integration, dado tiling.' },
  { icon: 'package', name: 'Wardrobes & storage', text: 'Sliding or hinged shutters, internal drawers, pull-outs, mirror units, loft storage and shoe racks.' },
  { icon: 'sofa', name: 'Living & dining', text: 'TV panelling, crockery units, feature walls, console and shoe cabinet, seating layout planning.' },
  { icon: 'bed', name: 'Bedrooms', text: 'Beds with hydraulic storage, headboard panelling, side tables, study desks and dressing units.' },
  { icon: 'sparkles', name: 'Puja room', text: 'Freestanding mandir, wall niche or a dedicated room — carved, jaali or contemporary, detailed properly.' },
  { icon: 'droplet', name: 'Washrooms', text: 'Vanities, mirrors, fittings, niches and anti-skid, easy-clean surfaces for family bathrooms.' },
  { icon: 'lamp', name: 'False ceiling & lighting', text: 'Peripheral or designer ceiling, cove and profile lighting, spotlights, and full lighting-scene planning.' },
  { icon: 'palette', name: 'Painting & finishes', text: 'Putty, primer and emulsion, textured or stencil feature walls, veneer panelling and enamel on joinery.' },
  { icon: 'zap', name: 'Electrical & plumbing', text: 'New points, concealed conduiting, modular switches, DB upgrades, and bathroom plumbing shifts.' },
  { icon: 'layers', name: 'Civil & flooring', text: 'Demolition, brickwork, waterproofing, tile or wooden flooring, and skirting.' },
];

const bhkLinks = [
  { label: '1 BHK', href: '/residential/1-bhk/', area: '400–550 sq.ft', desc: 'Studio and compact homes where every inch has to earn its place.' },
  { label: '2 BHK', href: '/residential/2-bhk/', area: '650–900 sq.ft', desc: 'Our most-delivered home size across Noida and New Gurgaon.', popular: true },
  { label: '3 BHK', href: '/residential/3-bhk/', area: '1,000–1,300 sq.ft', desc: 'Family homes with a study or guest room in the mix.' },
  { label: '4 BHK & Villas', href: '/residential/4-bhk-villa/', area: '1,600 sq.ft+', desc: 'Large-format homes, duplexes, penthouses and independent floors.' },
];

const main = {
  route: '/residential/',
  title: 'Home Interior Design & Fit-Out in Delhi NCR | Nexora Spaces LLP',
  metaTitle: 'Home Interior Design in Delhi NCR | Nexora Spaces',
  description:
    'Complete home interiors across Delhi NCR, from 1 BHK flats to villas. One contract for design, modular, civil and painting, with a designer-grade finish throughout.',
  keywords: 'home interior design delhi ncr, residential interior gurgaon, flat interior design noida, apartment interiors delhi, villa interior designers ncr',
  ogImage: '/assets/img/projects/p1-1200.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Home Interiors', href: '/residential/' }],
  faqs: faqsGeneral.slice(0, 7),
  extraSchema: [serviceSchema({
    name: 'Residential Interior Design and Fit-Out',
    description: 'Full-home turnkey interior design and execution for apartments, builder floors and villas in Delhi, Gurugram and Noida.',
    serviceType: 'Residential Interior Design',
  })],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Home Interiors', href: '/residential/' }],
      title: 'Home interiors,<br>delivered end to end',
      sub: 'From a compact Dwarka 1 BHK to a Golf Course Road villa — one team handles design, civil, modular, electrical, painting and styling. You get one contract, one team and one warranty.',
      image: '/assets/img/pages/residential-1600.jpg',
      actions: [
        `<button type="button" class="btn btn-accent btn-lg" aria-label="Open the free consultation form" data-consult-open>${icon('sparkles', { size: 18 })} Get free consultation</button>`,
        `<a href="${url('/gallery/')}" class="btn btn-glass btn-lg">View our work</a>`,
      ],
      stats: [
        { value: '850+', label: 'Homes delivered' },
        { value: 'Fastest', label: 'Handover in the industry' },
        { value: 'Designer', label: 'Grade finish, always' },
        { value: '1 PM', label: 'Single point of contact' },
      ],
    }),

    /* ---- Configurations ---- */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'By home size',
          title: 'Pick your configuration',
          sub: 'Every home size gets the same team and the same standard. Click through for the room-by-room scope and what we focus on at each size.',
          center: true,
        })}
        <div class="grid grid-4 gap-5 reveal-stagger">
          ${bhkLinks.map((b) => `
          <a href="${url(b.href)}" class="card card-hover" style="display:flex;flex-direction:column;${b.popular ? 'border-color:var(--brand-400)' : ''}">
            ${b.popular ? '<span class="badge badge-accent badge-caps mb-4" style="align-self:flex-start">Most delivered</span>' : '<span class="badge badge-outline badge-caps mb-4" style="align-self:flex-start">' + esc(b.area) + '</span>'}
            <h3 class="card-title">${esc(b.label)} interiors</h3>
            <p class="card-text mb-5" style="flex:1">${esc(b.desc)}</p>
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
          sub: 'No "not in our scope" conversations halfway through. This is the standard scope on a full-home project — anything you drop is credited back in writing.',
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

    /* ---- Gallery packages ---- */
    `<section class="section">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({
            eyebrow: 'Home gallery',
            title: 'See complete homes, room by room',
            sub: 'Each package walks through every space we deliver — hall, kitchen, bedrooms, puja room, washrooms, wardrobe and passage.',
          })}
          <a href="${url('/gallery/')}" class="btn btn-outline hide-sm">All packages ${icon('arrowRight', { size: 16 })}</a>
        </div>
        <div class="pkg-grid reveal-stagger">
          ${galleryPackages.slice(0, 3).map((p) => `
          <a href="${url('/gallery/#' + p.id)}" class="pkg-card">
            <div class="pkg-media zoom-parent">
              <!-- TODO: replace with real project photo -->
              ${picture({
                name: `gallery/${p.id}-hall`, alt: p.rooms.hall.alt,
                widths: [640, 1400], sizes: '(max-width:1024px) 100vw, 33vw',
                width: 640, height: 427, imgClass: 'zoom-img',
              })}
              <span class="pkg-count">${icon('image', { size: 13 })} 8 rooms</span>
            </div>
            <div class="pkg-body">
              <span class="pkg-style">${esc(p.style)}</span>
              <h3 class="pkg-name">${esc(p.name)}</h3>
              <span class="link-arrow">View the full home ${icon('arrowRight', { size: 15 })}</span>
            </div>
          </a>`).join('')}
        </div>
      </div>
    </section>`,

    /* ---- Design styles ---- */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Design languages',
          title: 'Six directions we develop well',
          sub: 'Bring a Pinterest board and we will tell you honestly what it takes to execute properly — and which parts will not survive Delhi dust and humidity.',
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
    `<section class="section">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({ eyebrow: 'Recent work', title: 'Homes we have handed over' })}
          <a href="${url('/portfolio/')}" class="btn btn-outline hide-sm">Full portfolio ${icon('arrowRight', { size: 16 })}</a>
        </div>
        <div class="folio-grid reveal-stagger">
          ${projects.filter((p) => p.tags.includes('residential')).slice(0, 6).map((p) => folioCard(p)).join('')}
        </div>
      </div>
    </section>`,

    testimonialSection(testimonials.slice(0, 5), { title: 'Homeowners who let us in' }),
    faqBlock(faqsGeneral.slice(0, 7), { eyebrow: 'Home interior FAQs', title: 'Before you commit, ask us this' }),
    ctaBand({ source: 'residential' }),
  ].join('\n'),
};

/* ==================================================== BHK SUB-PAGES ==== */
const bhkData = [
  {
    slug: '1-bhk', label: '1 BHK', area: '400–550 sq.ft', timeline: 'the fastest turnaround of any home size',
    image: 'projects/p6', imgAlt: 'Compact 1 BHK interior with space-saving wardrobe and study',
    intro: 'A 1 BHK is the hardest brief in interiors — you have one shot at every wall. Our approach is storage-first: we plan the volume you need before we plan how it looks, so the home never feels crowded by its own furniture.',
    highlights: [
      { icon: 'package', title: 'Storage that disappears', text: 'Full-height wardrobes to the ceiling, bed with hydraulic storage, and a loft plan that adds serious volume without visual weight.' },
      { icon: 'ruler', title: 'Multi-use planning', text: 'Fold-down study, extendable dining, and a sofa-cum-bed layout so a single room genuinely serves three functions.' },
      { icon: 'lamp', title: 'Light and mirror strategy', text: 'Mirror placement and layered lighting to make a compact home read considerably larger without gimmicks.' },
    ],
    scopeTable: [
      ['Modular kitchen (L or parallel, 6–8 ft)', 'Tall unit, chimney and hob integration, dado tiling'],
      ['Bedroom wardrobe + loft', 'Full-height shutters, internal drawers, loft storage above'],
      ['Bed with storage + side units', 'Hydraulic storage bed, headboard panelling, side tables'],
      ['TV unit & living storage', 'Wall-mounted console with concealed cable management'],
      ['Puja unit', 'Wall-mounted or niche mandir with dedicated lighting'],
      ['False ceiling & lighting', 'Peripheral ceiling, cove lighting and spot planning'],
      ['Painting (full home)', 'Putty, primer and emulsion across all rooms'],
      ['Electrical & plumbing updates', 'New points, modular switches, bathroom fitting changes'],
    ],
    faqs: [
      { q: 'Is it worth doing full interiors in a 1 BHK?', a: '<p>If you are staying three years or more, yes — the storage gain alone changes how the home functions daily. If you are renting it out within a year, we would honestly suggest modular kitchen and wardrobes only, which carries most of the practical benefit and the resale value.</p>' },
      { q: 'How long does a 1 BHK take?', a: '<p>It is the quickest home size we deliver, and the exact handover date is agreed at design sign-off and written into your contract. Modular-only scope finishes considerably faster still.</p>' },
      { q: 'What should we prioritise if we cannot do everything at once?', a: '<p>Kitchen and wardrobes first — they carry the most daily function and are the most disruptive to add later. Living room joinery, feature walls and decor can all be phased in afterwards, and we design the whole home upfront so the later phase matches exactly.</p>' },
    ],
  },
  {
    slug: '2-bhk', label: '2 BHK', area: '650–900 sq.ft', timeline: 'a reliably short, contracted handover',
    image: 'projects/p2', imgAlt: 'Contemporary 2 BHK living and dining interior in Noida',
    intro: 'Roughly six in ten homes we deliver are 2 BHKs — in Sector 150 Noida, New Gurgaon, Dwarka and Indirapuram. It is the configuration we have refined most, which is why our 2 BHK timelines are the most reliable in our book.',
    highlights: [
      { icon: 'kitchen', title: 'Kitchen that takes the load', text: 'Tall-unit stack for pantry, integrated appliance planning, and a work triangle that survives actual Indian cooking.' },
      { icon: 'users', title: 'A second room that flexes', text: 'Guest room, nursery or WFH study — designed so it can convert later without rebuilding the joinery.' },
      { icon: 'sofa', title: 'Living that seats eight', text: 'Layouts planned around real Indian hosting, not showroom photography.' },
    ],
    scopeTable: [
      ['Modular kitchen (8–10 ft, with tall unit)', 'Premium soft-close hardware, quartz or granite counter'],
      ['Two bedroom wardrobes + lofts', 'Sliding or hinged, with drawers, pull-outs and mirror unit'],
      ['Beds with storage + side tables', 'Hydraulic storage, panelled bedbacks, reading light points'],
      ['TV unit, crockery & console', 'Living and dining joinery with concealed storage'],
      ['Puja room or mandir unit', 'Niche or freestanding, with jaali detail and lighting'],
      ['Washroom upgrades', 'Vanity, mirror, fittings and anti-skid flooring'],
      ['False ceiling & profile lighting', 'Designer ceiling with cove and profile lighting'],
      ['Electrical, plumbing & civil', 'New points, concealed runs and minor civil changes'],
    ],
    faqs: [
      { q: 'Does a 2 BHK in Noida differ from one in Gurugram?', a: '<p>The design approach is identical. What changes is site logistics — society work-permission rules, lift access windows and material movement timings differ between towers, and those affect sequencing rather than quality. Our local teams already know the rules in most NCR societies.</p>' },
      { q: 'Can I do it in phases?', a: '<p>Yes, and many families do. The usual split is Phase 1 — kitchen, wardrobes and painting; Phase 2 — living room, ceiling and decor six to twelve months later. We design the whole home upfront so Phase 2 matches perfectly, and we hold your material specifications on file.</p>' },
      { q: 'Do you work in under-construction or newly possessed flats?', a: '<p>Yes — new-possession flats are ideal because there is no demolition and no living-around-the-work. Send us the builder floor plan and we can start design before you even get keys.</p>' },
    ],
  },
  {
    slug: '3-bhk', label: '3 BHK', area: '1,000–1,300 sq.ft', timeline: 'a committed handover date, written in',
    image: 'projects/p9', imgAlt: 'Japandi style 3 BHK bedroom interior in Gurugram',
    intro: 'Three-bedroom homes are where design decisions start compounding. Get the master suite and the shared spaces right and the rest follows; get them wrong and you will feel it every single day.',
    highlights: [
      { icon: 'bed', title: 'Master suite as a priority', text: 'Walk-in or full-wall wardrobe, dresser, reading corner and separated lighting circuits for a genuine retreat.' },
      { icon: 'briefcase', title: 'A real work-from-home room', text: 'Acoustic treatment, correct desk-to-window orientation, and cable management that survives daily video calls.' },
      { icon: 'utensils', title: 'Kitchen and dining connected', text: 'Breakfast counters, service windows and crockery planning for households that actually entertain.' },
    ],
    scopeTable: [
      ['Modular kitchen (10–12 ft, premium finish)', 'Acrylic or PU shutters, quartz counter, tall unit stack'],
      ['Three wardrobes + lofts', 'Full internals: drawers, pull-outs, mirror and loft storage'],
      ['Beds, side tables & dresser units', 'Panelled bedbacks with integrated lighting and niches'],
      ['Living, dining & foyer joinery', 'Feature walls, crockery unit, shoe cabinet and console'],
      ['Dedicated puja space', 'Full mandir unit with carved or jaali detail and storage'],
      ['Washrooms (up to three)', 'Vanities, backlit mirrors, fittings and niche detailing'],
      ['Designer false ceiling & lighting', 'Cove, profile and scene-planned lighting throughout'],
      ['Electrical, plumbing & civil', 'DB upgrades, concealed conduiting and plumbing shifts'],
    ],
    faqs: [
      { q: 'Where is it worth spending more in a 3 BHK?', a: '<p>Kitchen hardware, wardrobe internals and the ply behind everything — those are the surfaces you touch daily and the ones that look tired first if the grade is wrong. Feature walls, decor and statement lighting are far easier to upgrade later, so they are the right place to be restrained.</p>' },
      { q: 'How disruptive is it if we are already living there?', a: '<p>Manageable with phasing. We seal the working zone daily, run modular installation room by room, and schedule dusty work (civil, ceiling) in a concentrated block. Most families stay through it; some move out for the civil phase only.</p>' },
      { q: 'Can you match interiors to an existing marble or flooring?', a: '<p>Yes. We photograph and colour-match on site, then bring physical samples to your home rather than deciding on a screen. Matching existing stone is routine work for us.</p>' },
    ],
  },
  {
    slug: '4-bhk-villa', label: '4 BHK & Villas', area: '1,600 sq.ft and above', timeline: 'a staged programme with dates per level',
    image: 'projects/p7', imgAlt: 'Luxury villa double-height living room interior in Gurugram',
    intro: 'Large-format homes are a different discipline: more trades, longer lead times on imported material, and far less tolerance for coordination failures. These homes get a senior PM, a dedicated site engineer and fortnightly client walkthroughs.',
    highlights: [
      { icon: 'gem', title: 'Material provenance', text: 'Book-matched stone, imported veneers and solid-surface fabrication — specified with samples and mock-ups before order.' },
      { icon: 'zap', title: 'Automation ready', text: 'Lighting scenes, motorised curtains, HVAC zoning and AV routed correctly at the conduit stage, not retrofitted later.' },
      { icon: 'hardHat', title: 'Multi-trade sequencing', text: 'Stone, joinery, glass, metal and MEP planned on a shared programme so trades are never waiting on each other.' },
    ],
    scopeTable: [
      ['Modular kitchen + utility + pantry', 'Working and show kitchen, integrated appliances'],
      ['Four to six wardrobes / walk-ins', 'Dressing rooms with island drawers and sensor lighting'],
      ['Living, dining, family lounge joinery', 'Bespoke fabrication in stone, veneer, glass and metal'],
      ['Stone, cladding & feature walls', 'Book-matched slabs with mock-ups approved before order'],
      ['Dedicated puja room', 'Marble or carved timber mandir room with jaali detail'],
      ['Washrooms (four or more)', 'Wet rooms, twin vanities and specialist waterproofing'],
      ['Designer ceiling & lighting scheme', 'Architectural lighting with scene control'],
      ['MEP, automation & civil works', 'Full services coordination and automation readiness'],
    ],
    faqs: [
      { q: 'Do you take independent floors and builder floors?', a: '<p>Yes — South Delhi builder floors and Gurugram independent floors are a large part of our book. These often need full gut-renovation including services replacement, which we handle as a single contract.</p>' },
      { q: 'What about imported material lead times?', a: '<p>Imported veneers and stone typically run several weeks. We lock those selections in the first two weeks of design specifically so they do not become the critical path later. If a lead time threatens your date, we will say so before you sign.</p>' },
      { q: 'Can we phase a villa by floor?', a: '<p>Absolutely, and for occupied villas it is usually the right call. We complete one level fully — including snagging — before opening the next.</p>' },
    ],
  },
];

const bhkPages = bhkData.map((b) => ({
  route: `/residential/${b.slug}/`,
  title: `${b.label} Interior Design in Delhi NCR | Nexora Spaces LLP`,
  metaTitle: `${b.label} Interior Design in Delhi NCR | Nexora`,
  description: `${b.label} home interior design and fit-out across Delhi, Gurugram and Noida. Full room-by-room scope, designer-grade finish and a committed handover date.`,
  keywords: `${b.label.toLowerCase()} interior design, ${b.label.toLowerCase()} interior delhi, ${b.label.toLowerCase()} interior gurgaon, ${b.label.toLowerCase()} interior noida, ${b.label.toLowerCase()} home interiors`,
  ogImage: `/assets/img/${b.image}-1200.jpg`,
  crumbs: [
    { label: 'Home', href: '/' },
    { label: 'Home Interiors', href: '/residential/' },
    { label: b.label, href: `/residential/${b.slug}/` },
  ],
  faqs: b.faqs,
  extraSchema: [serviceSchema({
    name: `${b.label} Interior Design & Fit-Out`,
    description: `Turnkey ${b.label} home interior design and execution in Delhi, Gurugram and Noida.`,
    serviceType: 'Residential Interior Design',
  })],
  body: [
    pageHead({
      crumbs: [
        { label: 'Home', href: '/' },
        { label: 'Home Interiors', href: '/residential/' },
        { label: b.label, href: `/residential/${b.slug}/` },
      ],
      title: `${b.label} interior design<br>in Delhi NCR`,
      sub: b.intro,
      image: `/assets/img/${b.image}-1200.jpg`,
      actions: [
        `<button type="button" class="btn btn-accent btn-lg" data-consult-open>Get a free ${esc(b.label)} consultation</button>`,
        `<a href="${url('/gallery/')}" class="btn btn-glass btn-lg">View our work</a>`,
      ],
      stats: [
        { value: b.area.split('–')[0].trim(), label: 'Carpet area from' },
        { value: 'Fastest', label: 'Handover in the industry' },
        { value: 'Designer', label: 'Grade finish' },
        { value: 'Warranty', label: 'Documented in writing' },
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
          <div class="split-media reveal delay-1" data-parallax="0.05">
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
          eyebrow: 'Scope',
          title: `What a ${b.label} project includes`,
          sub: 'The standard scope, head by head. Every line is confirmed in writing with named materials before any work begins.',
          center: true,
        })}
        <div class="table-wrap reveal">
          <table class="table">
            <thead><tr><th>Scope item</th><th>What it covers</th></tr></thead>
            <tbody>
              ${b.scopeTable.map((r) => `<tr><td><strong>${esc(r[0])}</strong></td><td>${esc(r[1])}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="alert alert-brand mt-6 reveal">
          ${icon('info', { size: 20 })}
          <p><span class="alert-title">Plan for these alongside the interior scope</span>
          Society work-permission and lift charges, applicable taxes, loose furniture and appliances,
          and temporary accommodation if you cannot live on site during civil work. We flag all four upfront.</p>
        </div>
        <div class="btn-group center mt-8 reveal">
          <button type="button" class="btn btn-primary btn-lg" aria-label="Open the free consultation form" data-consult-open>${icon('sparkles', { size: 18 })} Get free consultation</button>
          <a href="${waLink(`Hi Nexora, I'd like to discuss ${b.label} interiors for my home.`)}" class="btn btn-outline btn-lg" target="_blank" rel="noopener">WhatsApp a designer</a>
        </div>
      </div>
    </section>`,

    `<section class="section">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({ eyebrow: 'Delivered work', title: `Recent ${b.label} and similar homes` })}
          <a href="${url('/portfolio/')}" class="btn btn-outline hide-sm">All projects ${icon('arrowRight', { size: 16 })}</a>
        </div>
        <div class="folio-grid reveal-stagger">
          ${projects.filter((p) => p.tags.includes('residential')).slice(0, 3).map((p) => folioCard(p)).join('')}
        </div>
      </div>
    </section>`,

    faqBlock([...b.faqs, faqsPlanning[2]], { eyebrow: `${b.label} FAQs`, title: `${b.label} questions we get every week` }),
    ctaBand({ source: `residential-${b.slug}` }),
  ].join('\n'),
}));

export default [main, ...bhkPages];
