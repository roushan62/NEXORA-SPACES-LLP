import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import { pageHead, sectionHead, faqBlock, ctaBand, testimonialSection } from '../layouts/sections.js';
import { testimonials } from '../data/content.js';

const services = [
  {
    slug: 'modular-kitchen', name: 'Modular kitchen', img: 'projects/p4',
    alt: 'Handleless modular kitchen with graphite cabinets and quartz countertop',
    tagline: 'Factory-finished kitchens built for Indian cooking',
    intro: 'A kitchen is the hardest-working room in an Indian home — heat, steam, oil and daily abuse. We build ours in a factory from 710-grade BWP plywood with branded hardware, so the parts that fail in cheap kitchens simply do not.',
    priceNote: 'Built off site in a controlled unit, then installed in days rather than weeks of on-site carpentry.',
    stats: [
      { value: 'Days', label: 'Not weeks, to install' },
      { value: 'BWP', label: '710-grade ply' },
      { value: 'Warranty', label: 'Documented in writing' },
      { value: 'Premium', label: 'Branded hardware' },
    ],
    features: [
      { icon: 'layers', title: '710-grade BWP plywood carcass', text: 'Boiling-water-proof ply throughout the carcass, not just the shutters. This is where cheap kitchens cut corners and where failures start.' },
      { icon: 'wrench', title: 'Hettich, Blum or Ebco hardware', text: 'Soft-close hinges and channels rated for 50,000+ cycles, with the brand and model named on your BOQ so you can verify it.' },
      { icon: 'gem', title: 'Your choice of shutter finish', text: 'Laminate, acrylic, PU, membrane or lacquered glass — with real samples in your hand before you decide, not screenshots.' },
      { icon: 'ruler', title: 'Work-triangle planning', text: 'Sink, hob and fridge positioned for how you actually cook, with tall-unit pantry stacks and appliance integration planned in.' },
      { icon: 'shieldCheck', title: 'Edge banding that survives steam', text: '2mm PVC edge banding on all exposed edges, hot-glue pressed. The 0.8mm banding most vendors use peels within two monsoons.' },
      { icon: 'zap', title: 'Services planned before install', text: 'Water points, drain slope, chimney duct route and electrical load mapped at design stage, so nothing is chiselled open later.' },
    ],
    table: {
      head: ['Finish type', 'Durability', 'Maintenance', 'Best suited to'],
      rows: [
        ['Laminate (1mm)', 'Good — 8–10 yrs', 'Very easy, wipe clean', 'Value-driven builds and rental homes'],
        ['Acrylic (high gloss)', 'Very good — 10+ yrs', 'Shows fingerprints', 'Bright, reflective modern kitchens'],
        ['PU (matte or gloss)', 'Very good — 10+ yrs', 'Easy, can be re-coated', 'Premium matte finishes, any colour'],
        ['Membrane / PVC foil', 'Fair — 5–7 yrs', 'Easy, can delaminate in heat', 'Shaker and profiled shutter styles'],
        ['Lacquered glass', 'Excellent — 12+ yrs', 'Easy, but shows smudges', 'Luxe kitchens with a seamless look'],
      ],
    },
    faqs: [
      { q: 'What drives the cost of a modular kitchen?', a: '<p>Four things, in order of impact: the <strong>shutter finish</strong> you choose, the <strong>hardware brand</strong>, the <strong>ply grade</strong> behind it all, and the <strong>counter material</strong>. Layout complexity and appliance integration follow.</p><p>We build your kitchen specification around where the money actually shows — then put every line in writing before anything is ordered.</p>' },
      { q: 'BWP or BWR plywood — which does a kitchen need?', a: '<p><strong>BWP (boiling water proof)</strong> for the base units and anywhere near the sink; BWR is acceptable for wall units and dry zones. Anyone quoting MR-grade (moisture resistant) ply for a kitchen carcass is under-specifying — it will swell within a few years. Ask for the IS:710 marking, and check the BOQ names the brand.</p>' },
      { q: 'How long does installation take?', a: '<p>Twelve to eighteen days from measurement to a working kitchen, because the units arrive finished. On-site carpentry for the same kitchen takes four to six weeks and leaves your home a dust site for all of it.</p>' },
      { q: 'Can you replace only the shutters and keep my carcass?', a: '<p>If the carcass is BWP or BWR ply and structurally sound, yes — a shutter and hardware refresh is far less work than a full rebuild. If the carcass is particle board or already swollen, replacing shutters is throwing money at a problem that will resurface. We will tell you which situation you are in after a site check.</p>' },
    ],
  },
  {
    slug: 'wardrobes', name: 'Wardrobes & storage', img: 'projects/p9',
    alt: 'Light oak sliding wardrobe with slatted detail in a Japandi bedroom',
    tagline: 'Storage planned around what you actually own',
    intro: 'Most wardrobes fail not because of build quality but because nobody counted the saris, the suitcases or the winter quilts. We start with an inventory conversation, then design the internals — hanging heights, drawer depths and loft volume — around it.',
    priceNote: 'Internals are designed around an inventory conversation, so the storage matches what you actually own.',
    stats: [
      { value: 'Days', label: 'Not weeks, to install' },
      { value: 'Warranty', label: 'Documented in writing' },
      { value: '3', label: 'Shutter systems' },
      { value: 'Custom', label: 'Internals every time' },
    ],
    features: [
      { icon: 'package', title: 'Sliding, hinged or walk-in', text: 'Sliding for tight rooms where a swing door would block circulation, hinged for full access, walk-in where the floor plan allows a dedicated dressing zone.' },
      { icon: 'ruler', title: 'Internals designed to your inventory', text: 'Sari drawers, trouser pull-outs, tie racks, valet rods and shoe pull-outs — specified after we count what you own, not from a catalogue default.' },
      { icon: 'maximize', title: 'Full-height, loft included', text: 'Wardrobes run floor to ceiling with an integrated loft. That dead 18 inches above a standard wardrobe is where your luggage should live.' },
      { icon: 'eye', title: 'Mirror and lighting integration', text: 'Full-length mirror on a shutter or a pull-out mirror panel, with sensor-activated internal LED so you can see the back of a dark wardrobe.' },
      { icon: 'lock', title: 'Locker and safe provision', text: 'Concealed locker compartments and safe housing built into the carcass, not bolted on afterwards.' },
      { icon: 'leaf', title: 'Anti-borer and moisture treatment', text: 'Borer-treated ply as standard, with a moisture barrier on any wall-abutting panel — critical in ground-floor and north-facing NCR bedrooms.' },
    ],
    table: {
      head: ['Wardrobe type', 'Best for', 'Space needed', 'Relative investment'],
      rows: [
        ['Hinged (openable)', 'Full visibility, best value', '900mm clearance in front', 'Most value-driven option'],
        ['Sliding (2 or 3 shutter)', 'Narrow rooms, no swing space', 'Zero clearance needed', 'Step up from hinged'],
        ['Walk-in dressing', 'Master suites, 3 BHK+', 'Min. 5×7 ft dedicated area', 'Premium, most bespoke'],
        ['Loft-only addition', 'Extra storage, minimal work', 'Above existing wardrobe', 'Smallest scope of the four'],
      ],
    },
    faqs: [
      { q: 'Sliding or hinged — which should I choose?', a: '<p>Sliding if the room is under 11 feet wide or the wardrobe faces the bed with less than 900mm clearance. Hinged if you want to see the full wardrobe at once and want to save 20–30% on cost. Sliding loses you about 8% of internal depth to the track mechanism — worth knowing before you decide.</p>' },
      { q: 'What should we prioritise inside a wardrobe?', a: '<p>Internals over finish, every time. Drawers, pull-outs, correct hanging heights and a proper loft change how the wardrobe works daily; the shutter finish only changes how it looks. If something has to give, take a simpler finish and keep the internals.</p>' },
      { q: 'Can wardrobes be moved if I shift homes?', a: '<p>Modular units can be dismantled and re-installed, though you should expect some material loss and a re-fitting charge. For rented homes we usually recommend a freestanding modular system instead — we will flag this at design stage if you tell us the home is rented.</p>' },
    ],
  },
  {
    slug: 'turnkey-interiors', name: 'Turnkey interiors', img: 'projects/p1',
    alt: 'Complete turnkey living room interior with oak panelling and layered lighting',
    tagline: 'One contract from empty flat to move-in ready',
    intro: 'Turnkey means you sign once and we handle everything after — design, demolition, plumbing, electrical, ceiling, painting, modular, furniture and final styling. One price, one project manager, one warranty, and no gaps between vendors for problems to hide in.',
    priceNote: 'One signed scope covering design, civil, services, modular, painting and styling — start to handover.',
    stats: [
      { value: 'Fastest', label: 'Handover in the industry' },
      { value: '1', label: 'Contract & PM' },
      { value: 'Warranty', label: 'Documented in writing' },
      { value: '0', label: 'Unapproved variations' },
    ],
    features: [
      { icon: 'fileText', title: 'A single itemised contract', text: 'Every scope item, brand and quantity on one BOQ. No separate carpenter, painter and electrician bills arriving in sequence.' },
      { icon: 'userCheck', title: 'One named project manager', text: 'The same person from site survey to snag closure. You have their number, and escalation goes to a partner, not a call centre.' },
      { icon: 'truck', title: 'Procurement handled by us', text: 'We buy, we store, we stage delivery to site. No weekend trips to Kirti Nagar to choose laminates under a tube light.' },
      { icon: 'camera', title: 'Weekly photo reporting', text: 'Site photos and progress against programme sent on WhatsApp every week — critical if you are managing this from another city.' },
      { icon: 'clipboard', title: 'Snag list closed before final payment', text: 'You walk the home, list everything, we fix it. The final milestone releases only after you sign the snag closure.' },
      { icon: 'shieldCheck', title: 'One warranty covers it all', text: 'A documented warranty on modular work and site services, from a single entity. No arguments about whose scope a defect falls in.' },
    ],
    table: {
      head: ['Home size', 'Rooms typically covered', 'Puja & washrooms', 'Relative programme'],
      rows: [
        ['1 BHK', 'Living, bedroom, kitchen', 'Mandir unit + 1 washroom', 'Shortest programme'],
        ['2 BHK', 'Living, dining, 2 bedrooms, kitchen', 'Mandir + 2 washrooms', 'Our most refined timeline'],
        ['3 BHK', 'Living, dining, 3 bedrooms, kitchen, study', 'Puja space + up to 3 washrooms', 'Slightly longer than a 2 BHK'],
        ['4 BHK', 'Adds family lounge and guest zone', 'Walk-in puja + 4 washrooms', 'Staged room by room'],
        ['Villa / floor', 'All levels, lounges and utility', 'Puja room + all washrooms', 'Staged level by level'],
      ],
    },
    faqs: [
      { q: 'Is turnkey more expensive than hiring vendors separately?', a: '<p>On paper, individual vendors can look a little cheaper. In practice, the gap closes once you account for the items that fall between scopes, the rework when trades clash, and your own time spent coordinating. Where turnkey genuinely costs more is when you have a trusted contractor and the bandwidth to run the site yourself — in that case, ask us about a design-only engagement instead. We would rather tell you that than oversell.</p>' },
      { q: 'What if I want to keep my existing furniture or appliances?', a: '<p>Completely fine and quite common. We design around what you are keeping, measure it, and adjust joinery dimensions to suit. It also reduces your BOQ, which we pass on rather than pocket.</p>' },
      { q: 'Who is liable if something goes wrong on site?', a: '<p>We are. Our teams are insured, and we carry site liability cover. That is a real advantage of a single contract — with multiple vendors, liability is usually a finger-pointing exercise that ends with you paying.</p>' },
    ],
  },
  {
    slug: 'renovation', name: 'Renovation & retrofit', img: 'projects/p3',
    alt: 'Renovated modern classic living room with panelled walls in South Delhi',
    tagline: 'Upgrading homes people are already living in',
    intro: 'Renovation is not new construction with old walls — it is surgery. Hidden services, unknown structural conditions, society restrictions and a family who still needs a working bathroom every evening. We plan for all four before we lift a hammer.',
    priceNote: 'Scope is set after a pre-demolition survey, so the plan reflects what is actually behind your walls.',
    stats: [
      { value: 'Phased', label: 'Room-by-room delivery' },
      { value: 'Survey', label: 'Before any demolition' },
      { value: 'Daily', label: 'Dust sealing' },
      { value: 'Phased', label: 'Room-by-room option' },
    ],
    features: [
      { icon: 'search', title: 'Pre-demolition survey', text: 'We scan for concealed conduits and plumbing, check slab and beam conditions, and photograph everything before demolition — so surprises are documented, not disputed.' },
      { icon: 'shield', title: 'Daily dust containment', text: 'Zip-wall sealing of the active zone, floor protection on circulation routes, and end-of-day clearing. Non-negotiable on occupied homes.' },
      { icon: 'refresh', title: 'Phased, room-by-room delivery', text: 'One zone completed and handed back before the next opens, so your family always has functioning bedrooms and at least one bathroom.' },
      { icon: 'zap', title: 'Services brought up to code', text: 'Old aluminium wiring, undersized DBs and corroded GI plumbing get replaced during renovation — the one time it is economical to do it.' },
      { icon: 'clipboard', title: 'Society compliance handled', text: 'Work permissions, timing restrictions, lift protection, debris disposal slots and neighbour notice — we deal with the RWA so you do not have to.' },
      { icon: 'trendingUp', title: 'Spend where it returns', text: 'We will tell you which upgrades add real resale value in your micro-market and which are pure lifestyle spend, so you can choose deliberately.' },
    ],
    table: {
      head: ['Renovation type', 'Scope', 'Can you live in?', 'Relative programme'],
      rows: [
        ['Cosmetic refresh', 'Paint, lighting, soft furnishing', 'Yes, easily', 'Shortest'],
        ['Partial renovation', 'Kitchen or bathrooms + joinery', 'Yes, with phasing', 'Short'],
        ['Full renovation', 'All rooms, services retained', 'Usually, room by room', 'Medium'],
        ['Gut renovation', 'Strip to shell, all services new', 'Move out for services phase', 'Longest'],
      ],
    },
    faqs: [
      { q: 'Can we live in the house during renovation?', a: '<p>For partial and phased work, yes — most of our renovation clients do. For a gut renovation where plumbing and electrical are being replaced, you will need to move out for at least the services phase, typically 3–5 weeks. We will tell you honestly which category your project falls into after the site survey.</p>' },
      { q: 'How do you handle unknown problems found after demolition?', a: '<p>We photograph and document, then issue a written variation for your approval before proceeding — no work happens on an unapproved variation. We also recommend holding a stated contingency on any renovation, so the possibility is planned for from day one rather than sprung on you.</p>' },
      { q: 'Is renovating better value than buying a new flat?', a: '<p>In established NCR locations — South Delhi, DLF Phases, older Noida sectors — usually yes. Renovating a well-located older property tends to beat the premium on an equivalent new-build in the same micro-market. In newer peripheral sectors the maths can flip. We are happy to talk it through even if the answer means you do not renovate.</p>' },
    ],
  },
];

export default services.map((s) => ({
  route: `/services/${s.slug}/`,
  title: `${s.name} for Homes in Delhi NCR | Nexora Spaces LLP`,
  metaTitle: `${s.name} for Homes in Delhi NCR | Nexora`,
  description: `${s.tagline}. Residential ${s.name.toLowerCase()} across Delhi, Gurugram and Noida — designer-grade finish and a free consultation.`,
  keywords: `${s.name.toLowerCase()} delhi, ${s.name.toLowerCase()} gurgaon, ${s.name.toLowerCase()} noida, home ${s.name.toLowerCase()} india`,
  ogImage: `/assets/img/${s.img}-1200.jpg`,
  crumbs: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/turnkey-interiors/' },
    { label: s.name, href: `/services/${s.slug}/` },
  ],
  faqs: s.faqs,
  extraSchema: [serviceSchema({
    name: s.name,
    description: s.intro,
    serviceType: s.name,
  }, `/services/${s.slug}/`)],
  body: [
    pageHead({
      crumbs: [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services/turnkey-interiors/' },
        { label: s.name, href: `/services/${s.slug}/` },
      ],
      title: s.tagline,
      sub: s.intro,
      image: `/assets/img/${s.img}-1200.jpg`,
      actions: [
        `<button type="button" class="btn btn-accent btn-lg" data-consult-open>Get free consultation</button>`,
        `<a href="${url('/gallery/')}" class="btn btn-glass btn-lg">View our work</a>`,
      ],
      stats: s.stats,
    }),

    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'What you get',
          title: `How we build ${s.name.toLowerCase()}`,
          sub: 'The specifics that separate work that lasts a decade from work that looks fine for two years.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${s.features.map((f) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(f.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(f.title)}</h3>
            <p class="card-text">${esc(f.text)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    `<section class="section bg-subtle">
      <div class="container container-narrow">
        ${sectionHead({
          eyebrow: 'Comparison',
          title: 'Your options, compared honestly',
          sub: 'What each choice actually gives you, so you can decide on merit rather than on a sales pitch.',
          center: true,
        })}
        <div class="table-wrap reveal">
          <table class="table">
            <thead><tr>${s.table.head.map((h, i) => `<th${i === s.table.head.length - 1 ? ' class="num"' : ''}>${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>
              ${s.table.rows.map((r) => `<tr>${r.map((c, i) => `<td${i === r.length - 1 ? ' class="num"' : ''}>${i === 0 ? `<strong>${esc(c)}</strong>` : esc(c)}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="magnet mt-8 reveal">
          <div>
            <h3>Want this planned for your exact home?</h3>
            <p>Send us your floor plan on WhatsApp and a senior designer will come back with a written scope — no obligation, no sales calls unless you ask.</p>
          </div>
          <a href="${waLink(`Hi Nexora, I'd like to discuss ${s.name.toLowerCase()} for my home. I'll share my floor plan.`)}" class="btn btn-accent" target="_blank" rel="noopener">
            ${icon('send', { size: 18 })} Send floor plan
          </a>
        </div>
      </div>
    </section>`,

    `<section class="section">
      <div class="container">
        <div class="split">
          <div class="split-media reveal" data-parallax="0.05">
            ${picture({ name: s.img, alt: s.alt, widths: [420, 800, 1200], sizes: '(max-width:1024px) 100vw, 50vw', width: 800, height: 600, className: 'img-round img-shadow' })}
          </div>
          <div class="reveal delay-1">
            ${sectionHead({ eyebrow: 'How we scope it', title: `${s.name}, agreed in writing` })}
            <p class="section-sub mb-8">${esc(s.priceNote)}</p>
            <ul class="check-list mb-8">
              <li>${icon('checkCircle', { size: 18 })} Itemised scope with brand names — verify every line</li>
              <li>${icon('checkCircle', { size: 18 })} Fixed for the agreed scope, no variation surprises</li>
              <li>${icon('checkCircle', { size: 18 })} Milestone-linked payments, never everything upfront</li>
              <li>${icon('checkCircle', { size: 18 })} Value-driven specification — premium where it shows</li>
            </ul>
            <div class="btn-group">
              <button type="button" class="btn btn-primary" data-consult-open>Get free consultation</button>
              <a href="${url('/gallery/')}" class="btn btn-ghost">View our work</a>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    testimonialSection(testimonials.slice(0, 4), { title: 'What clients say', eyebrow: 'Reviews' }),
    faqBlock(s.faqs, { eyebrow: 'FAQs', title: `${s.name} — your questions answered` }),
    ctaBand({ source: `service-${s.slug}` }),
  ].join('\n'),
}));
