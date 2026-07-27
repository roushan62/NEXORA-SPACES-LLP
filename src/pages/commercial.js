import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import { pageHead, sectionHead, faqBlock, ctaBand, folioCard } from '../layouts/sections.js';
import { projects } from '../data/content.js';

const sectors = [
  {
    slug: 'office-interiors', icon: 'briefcase', name: 'Corporate offices',
    desc: 'Workplace strategy, space norms, acoustics and MEP coordination for 10 to 400-seat floors.',
    rate: '₹1,400 – ₹2,600 / sq.ft', img: 'projects/p5',
    alt: 'Modern corporate office fit-out with acoustic ceiling and open workstations',
    points: ['Density and space-norm planning', 'Acoustic and lighting compliance', 'Server, UPS and MEP coordination', 'Phased fit-out for occupied floors'],
  },
  {
    slug: 'retail', icon: 'store', name: 'Retail & showrooms',
    desc: 'Brand-consistent store design and multi-city rollouts with a repeatable kit of parts.',
    rate: '₹1,600 – ₹3,200 / sq.ft', img: 'projects/p8',
    alt: 'Retail showroom interior with feature lighting and display joinery',
    points: ['Customer-flow and zoning design', 'Display, VM and lighting design', 'Signage and brand-standard compliance', 'Multi-store rollout documentation'],
  },
  {
    slug: 'hospitality', icon: 'utensils', name: 'Cafés & restaurants',
    desc: 'F&B builds where the kitchen, the covers and the licence conditions all have to work together.',
    rate: '₹1,800 – ₹3,800 / sq.ft', img: 'projects/p8',
    alt: 'Warm industrial cafe interior with brew bar and pendant lighting',
    points: ['Cover count vs kitchen capacity planning', 'Exhaust, grease trap and fire compliance', 'Bar, counter and service-line design', 'Fast-track builds for lease deadlines'],
  },
  {
    slug: 'clinics', icon: 'stethoscope', name: 'Clinics & studios',
    desc: 'Healthcare, dental, diagnostic and wellness spaces built to hygiene and access norms.',
    rate: '₹1,500 – ₹2,900 / sq.ft', img: 'projects/p2',
    alt: 'Clean modern clinic reception interior with warm lighting',
    points: ['Infection-control-friendly finishes', 'Equipment clearances and services', 'Accessibility and signage compliance', 'Patient-flow and privacy zoning'],
  },
];

const engagements = [
  {
    name: 'Design consultancy', icon: 'ruler', fee: 'From ₹65 / sq.ft',
    best: 'You have a trusted contractor and need the design, drawings and specifications done properly.',
    includes: ['Site study and space programming', 'Concept boards and 3D visualisation', 'GFC drawings and detailing', 'Itemised BOQ with specifications', 'Two site visits during execution'],
    excludes: ['Execution and procurement', 'Warranty on built work'],
  },
  {
    name: 'Project management (PMC)', icon: 'hardHat', fee: '7 – 11% of project value', popular: true,
    best: 'You want to appoint your own vendors but need a professional running the site and the money.',
    includes: ['Everything in Design consultancy', 'Vendor tendering and rate negotiation', 'Weekly site supervision and QC', 'Bill certification and variation control', 'Programme and snag management'],
    excludes: ['Direct execution liability', 'Material warranty (rests with vendors)'],
  },
  {
    name: 'Turnkey fit-out', icon: 'layers', fee: 'Fixed BOQ contract',
    best: 'You want one accountable party, one price and one warranty for the whole build.',
    includes: ['Everything in PMC', 'Full execution with our own teams', 'Single-window procurement', 'Fixed-price contract with penalties', '1-year defect liability, 10-yr modular warranty'],
    excludes: ['Client-supplied loose furniture', 'Landlord-scope base building work'],
  },
];

const commercialFaqs = [
  {
    q: 'Do you execute commercial projects, or only advise?',
    a: '<p>Both. You can engage us three ways: <strong>design consultancy</strong> (we draw, you build), <strong>PMC</strong> (we manage your vendors), or <strong>turnkey</strong> (we design and execute under one fixed-price contract). Roughly 60% of our commercial work is turnkey.</p><p>Pick based on whether you already have reliable contractors and internal bandwidth to supervise.</p>',
  },
  {
    q: 'How fast can you deliver an office fit-out?',
    a: '<p>A 4,000–5,000 sq.ft office typically runs 55–70 days from design freeze. We have delivered fast-track builds in 40 days where the client accepted a restricted material palette with short lead times — that is the honest trade-off, and we will map it out for you before you commit to a date.</p>',
  },
  {
    q: 'Can you work in occupied offices and after business hours?',
    a: '<p>Yes. Phased fit-outs in live offices are routine — we work floor by floor or zone by zone, run noisy trades outside business hours where the building permits it, and coordinate directly with facility management on permits, lift bookings and material movement windows.</p>',
  },
  {
    q: 'Do you handle building management approvals and compliance?',
    a: '<p>We prepare and submit the fit-out drawing sets that building management requires, coordinate the NOC process, and ensure fire, electrical and accessibility norms are met in the design. Statutory licences that must be held by the occupier — trade licence, FSSAI, pollution NOC — remain your responsibility, but we supply whatever documentation is needed.</p>',
  },
  {
    q: 'What is the payment structure on commercial work?',
    a: '<p>Milestone-based against a signed BOQ: 15% on mobilisation, 35% on material dispatch, 35% on installation, 10% on practical completion, and 5% retained for 90 days as defect liability. All invoiced with GST, all against certified progress.</p>',
  },
  {
    q: 'Do you take projects outside Delhi NCR?',
    a: '<p>For commercial rollouts, yes — we have executed retail and office projects in Jaipur, Chandigarh and Lucknow for NCR-headquartered clients. For single small projects far outside NCR the mobilisation cost rarely makes sense, and we will tell you that upfront rather than quote it anyway.</p>',
  },
];

const main = {
  route: '/commercial/',
  title: 'Commercial & Office Interior Design in Delhi NCR | Nexora Spaces LLP',
  metaTitle: 'Office & Commercial Interior Designers in Delhi NCR',
  description:
    'Office, retail, F&B and clinic interior fit-out across Delhi NCR. Design consultancy, project management or turnkey execution on fixed-price BOQ.',
  keywords: 'commercial interior designers delhi, office interior design gurgaon, office fit out noida, retail interior design delhi ncr, restaurant interior designers',
  ogImage: '/assets/img/projects/p5-1200.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Commercial', href: '/commercial/' }],
  faqs: commercialFaqs,
  extraSchema: [serviceSchema({
    name: 'Commercial Interior Design and Fit-Out',
    description: 'Office, retail, hospitality and healthcare interior design, project management and turnkey fit-out across Delhi NCR.',
    serviceType: 'Commercial Interior Design',
    audience: 'Businesses and commercial occupiers in Delhi NCR',
    offers: { price: '1400', min: 1400, max: 3800 },
  })],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Commercial', href: '/commercial/' }],
      title: 'Workplaces built<br>to a deadline',
      sub: 'Offices, retail, F&B and clinics across Delhi NCR. Engage us for design only, for project management, or for a single-window turnkey contract — the standards are the same either way.',
      image: '/assets/img/pages/commercial-1600.jpg',
      actions: [
        `<a href="${url('/contact/')}" class="btn btn-accent btn-lg">Discuss your project</a>`,
        `<a href="tel:${site.phone.tel}" class="btn btn-glass btn-lg">${icon('phone', { size: 18 })} ${esc(site.phone.display)}</a>`,
      ],
      stats: [
        { value: '120+', label: 'Commercial projects' },
        { value: '4.2 L', label: 'Sq.ft delivered' },
        { value: '55–70', label: 'Days, typical office' },
        { value: '3', label: 'Engagement models' },
      ],
    }),

    /* Sectors */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Sectors',
          title: 'Where we do our best commercial work',
          sub: 'Each sector has its own compliance and operational logic. We staff projects with people who have built in that sector before.',
          center: true,
        })}
        <div class="grid grid-2 gap-6 reveal-stagger">
          ${sectors.map((s) => `
          <article class="svc-card" id="${esc(s.slug)}">
            <div class="svc-media zoom-parent">
              ${picture({ name: s.img, alt: s.alt, widths: [420, 800, 1200], sizes: '(max-width:900px) 100vw, 50vw', width: 800, height: 500, imgClass: 'zoom-img' })}
              <span class="svc-tag"><span class="badge badge-dark">${icon(s.icon, { size: 13 })} ${esc(s.name)}</span></span>
            </div>
            <div class="svc-body">
              <h3 class="svc-title">${esc(s.name)}</h3>
              <p class="svc-desc">${esc(s.desc)}</p>
              <ul class="check-list tight mb-6">
                ${s.points.map((p) => `<li>${icon('check', { size: 16 })} <span style="font-size:var(--fs-sm)">${esc(p)}</span></li>`).join('')}
              </ul>
              <div class="svc-meta">
                <span class="svc-price">Typical range<b style="font-size:var(--fs-base)">${esc(s.rate)}</b></span>
                <a href="${url('/contact/')}" class="link-arrow">Get a quote ${icon('arrowRight', { size: 16 })}</a>
              </div>
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>`,

    /* Engagement models */
    `<section class="section bg-subtle cv-auto" id="engagement">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Engagement models',
          title: 'Three ways to appoint us',
          sub: 'Choose based on how much of the risk and coordination you want to keep in-house. We will tell you honestly which one fits your situation.',
          center: true,
        })}
        <div class="price-grid reveal-stagger">
          ${engagements.map((e) => `
          <div class="price-card${e.popular ? ' is-popular' : ''}">
            ${e.popular ? '<span class="price-flag">Most common</span>' : ''}
            <span class="card-icon">${icon(e.icon, { size: 22 })}</span>
            <h3 class="price-name">${esc(e.name)}</h3>
            <p class="price-for">${esc(e.best)}</p>
            <div class="price-amount"><span class="price-num" style="font-size:var(--fs-xl)">${esc(e.fee)}</span></div>
            <div class="price-divider mt-6"></div>
            <ul class="check-list">
              ${e.includes.map((f) => `<li>${icon('check', { size: 18 })} ${esc(f)}</li>`).join('')}
            </ul>
            <div class="mb-6" style="padding-top:var(--s-4);border-top:1px dashed var(--line)">
              <span style="font-size:var(--fs-xs);font-weight:700;text-transform:uppercase;letter-spacing:var(--tracking-caps);color:var(--text-subtle);display:block;margin-bottom:var(--s-3)">Not included</span>
              <ul class="check-list tight cross">
                ${e.excludes.map((f) => `<li>${icon('x', { size: 16 })} <span style="font-size:var(--fs-sm)">${esc(f)}</span></li>`).join('')}
              </ul>
            </div>
            <a href="${url('/contact/')}" class="btn ${e.popular ? 'btn-accent' : 'btn-outline'} btn-block">Enquire about ${esc(e.name.split(' ')[0])}</a>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* Process for commercial */
    `<section class="section">
      <div class="container">
        <div class="split split-start">
          <div class="reveal">
            ${sectionHead({
              eyebrow: 'How commercial differs',
              title: 'Business projects have a different clock',
              sub: 'Rent starts, leases expire and teams need desks. Our commercial process is built around your date, not ours.',
            })}
            <div class="timeline">
              ${[
                { t: 'Brief & feasibility', d: 'Headcount, growth plan, budget envelope and hard dates. We test whether the space can actually deliver what you need before design starts.' },
                { t: 'Test-fit & space plan', d: 'Two or three layout options with seat counts, so leadership can decide on data rather than opinion.' },
                { t: 'Design & documentation', d: 'Concept, 3D, GFC drawings, MEP coordination and a BOQ your finance team can interrogate line by line.' },
                { t: 'Approvals & mobilisation', d: 'Building-management drawing submission, NOCs, site handover checklist and access permits.' },
                { t: 'Execution & QC', d: 'Weekly progress reports, snag-as-you-go quality checks, and variation control that requires written sign-off.' },
                { t: 'Handover & DLP', d: 'As-built drawings, warranty documents, O&M manuals and a 90-day defect liability window.' },
              ].map((s) => `
              <div class="tl-item">
                <h3>${esc(s.t)}</h3>
                <p>${esc(s.d)}</p>
              </div>`).join('')}
            </div>
          </div>
          <div class="split-media reveal delay-1">
            <div class="sticky-side">
              ${picture({ name: 'projects/p5', alt: 'Corporate office fit-out in progress with modular workstations', widths: [420, 800, 1200], sizes: '(max-width:1024px) 100vw, 45vw', width: 800, height: 600, className: 'img-round img-shadow' })}
              <div class="card mt-6" style="border-color:var(--line-brand)">
                <h3 class="card-title" style="font-size:var(--fs-lg)">${icon('clock', { size: 18 })} Working to a lease deadline?</h3>
                <p class="card-text mb-5">Tell us the date you must occupy. We will tell you within 48 hours whether it is achievable and what the material palette needs to look like to hit it.</p>
                <a href="${waLink('Hi Nexora, I have a commercial fit-out with a fixed deadline. Can we discuss feasibility?')}" class="btn btn-primary btn-block" target="_blank" rel="noopener">Check feasibility on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    /* Work */
    `<section class="section bg-subtle">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({ eyebrow: 'Delivered', title: 'Commercial projects' })}
          <a href="${url('/portfolio/')}" class="btn btn-outline hide-sm">Full portfolio ${icon('arrowRight', { size: 16 })}</a>
        </div>
        <div class="folio-grid reveal-stagger">
          ${projects.filter((p) => p.tags.includes('commercial')).map((p) => folioCard({
            ...p, image: `/assets/img/projects/${p.image.split('/').pop().replace('.jpg', '')}-800.jpg`,
          })).join('')}
          ${projects.filter((p) => !p.tags.includes('commercial')).slice(0, 1).map((p) => folioCard({
            ...p, image: `/assets/img/projects/${p.image.split('/').pop().replace('.jpg', '')}-800.jpg`,
          })).join('')}
        </div>
      </div>
    </section>`,

    faqBlock(commercialFaqs, { eyebrow: 'Commercial FAQs', title: 'What businesses ask before appointing us' }),
    ctaBand({
      eyebrow: 'Commercial enquiry',
      title: 'Tell us your date.<br><span class="serif-italic gradient-text">We will tell you if it is real.</span>',
      text: 'Send a floor plate and a headcount. You get a test-fit, an indicative budget and a programme — before any commitment.',
      points: ['Test-fit and seat-count options', 'Indicative BOQ within 5 working days', 'Fixed-price contract with delay penalties'],
      source: 'commercial',
    }),
  ].join('\n'),
};

/* ------------------------------------------------------- Sector sub-pages */
const sectorPages = sectors.map((s) => ({
  route: `/commercial/${s.slug}/`,
  title: `${s.name} Interior Design & Fit-Out in Delhi NCR | Nexora Spaces`,
  metaTitle: `${s.name} Interior Design in Delhi NCR | Nexora`,
  description: `${s.name} interior design and fit-out across Delhi NCR from ${s.rate.split(' – ')[0]}/sq.ft. Design consultancy, PMC or turnkey execution.`,
  keywords: `${s.name.toLowerCase()} interior design, ${s.name.toLowerCase()} fit out delhi ncr, commercial interior designers gurgaon noida`,
  ogImage: `/assets/img/${s.img}-1200.jpg`,
  crumbs: [
    { label: 'Home', href: '/' },
    { label: 'Commercial', href: '/commercial/' },
    { label: s.name, href: `/commercial/${s.slug}/` },
  ],
  faqs: commercialFaqs.slice(0, 4),
  extraSchema: [serviceSchema({
    name: `${s.name} Interior Design & Fit-Out`,
    description: s.desc,
    serviceType: 'Commercial Interior Design',
    audience: 'Businesses in Delhi NCR',
  })],
  body: [
    pageHead({
      crumbs: [
        { label: 'Home', href: '/' },
        { label: 'Commercial', href: '/commercial/' },
        { label: s.name, href: `/commercial/${s.slug}/` },
      ],
      title: `${s.name} interiors<br>in Delhi NCR`,
      sub: s.desc,
      image: `/assets/img/${s.img}-1200.jpg`,
      actions: [
        `<a href="${url('/contact/')}" class="btn btn-accent btn-lg">Request a proposal</a>`,
        `<a href="${url('/commercial/#engagement')}" class="btn btn-glass btn-lg">Engagement models</a>`,
      ],
      stats: [
        { value: s.rate.split(' – ')[0], label: 'Rate from (per sq.ft)' },
        { value: '3', label: 'Ways to engage us' },
        { value: '90 days', label: 'Defect liability' },
        { value: 'Fixed', label: 'Price contract' },
      ],
    }),

    `<section class="section">
      <div class="container">
        <div class="split split-start">
          <div class="reveal">
            ${sectionHead({ eyebrow: 'Our approach', title: `What we get right in ${s.name.toLowerCase()}` })}
            <div class="grid gap-5">
              ${s.points.map((p) => `
              <div class="feat-card">
                <h3 style="font-size:var(--fs-base);display:flex;align-items:center;gap:var(--s-3)">
                  <span style="color:var(--brand-500)">${icon('checkCircle', { size: 20 })}</span> ${esc(p)}
                </h3>
              </div>`).join('')}
            </div>
            <div class="alert alert-info mt-8">
              ${icon('info', { size: 20 })}
              <p><span class="alert-title">Not sure which engagement model fits?</span>
              If you already have reliable contractors, take design consultancy. If you have vendors but no bandwidth, take PMC.
              If you want one throat to choke, take turnkey. <a href="${url('/commercial/#engagement')}">Compare all three</a>.</p>
            </div>
          </div>
          <div class="split-media reveal delay-1">
            ${picture({ name: s.img, alt: s.alt, widths: [420, 800, 1200], sizes: '(max-width:1024px) 100vw, 50vw', width: 800, height: 600, className: 'img-round img-shadow' })}
          </div>
        </div>
      </div>
    </section>`,

    faqBlock(commercialFaqs.slice(0, 4), { eyebrow: 'FAQs', title: `${s.name} questions` }),
    ctaBand({ source: `commercial-${s.slug}` }),
  ].join('\n'),
}));

export default [main, ...sectorPages];
