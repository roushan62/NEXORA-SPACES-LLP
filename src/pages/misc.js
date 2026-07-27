import { site, waLink, currentYear, yearsInBusiness, hq } from '../config/site.config.js';
import { icon, iconSolid } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url, richText } from '../layouts/base.js';
import {
  pageHead, sectionHead, faqBlock, ctaBand, quoteCard, stars, leadForm,
} from '../layouts/sections.js';
import { testimonials, faqsGeneral, faqsCost, projects } from '../data/content.js';

/* ============================================================= REVIEWS */
const extraReviews = [
  { name: 'Nikhil & Aparna Joshi', project: '3 BHK Turnkey', location: 'Sector 137, Noida', text: 'Third quote we took, and the only one that itemised hardware by brand. That single detail told us who was serious. They flagged a two-day slip a week before it happened rather than on the day, which is the only time I have ever seen that in a fit-out.' },
  { name: 'Ritu Malhotra', project: 'Kitchen + Wardrobes', location: 'Vasant Kunj, Delhi', text: 'I only wanted the kitchen and two wardrobes. Never once did they try to upsell me a full home package. The kitchen is two years old now and the soft-close still closes soft.' },
  { name: 'Arjun Sethi', project: '2 BHK Renovation', location: 'Indirapuram, Ghaziabad', text: 'Old flat, hidden problems. When they found corroded plumbing behind the bathroom wall they photographed it, quoted the fix in writing, and waited for my approval before touching it. That is the whole difference.' },
  { name: 'Col. (Retd.) H. S. Bedi', project: '4 BHK Independent Floor', location: 'Punjabi Bagh, Delhi', text: 'I am difficult about punctuality and paperwork. They matched it. Every invoice arrived with GST, every variation was approved in writing before work, and the site was swept clean every evening.' },
  { name: 'Sneha Iyer', project: '2 BHK Turnkey', location: 'Gaur City, Greater Noida West', text: 'We were relocating from Chennai and could not visit. Everything ran on WhatsApp video calls and weekly photo reports. We walked into a finished home. I did not expect that to work as well as it did.' },
  { name: 'Mohit Grover', project: 'Café Fit-Out', location: 'Sector 29, Gurugram', text: 'Hard lease deadline, 46 days. They told me upfront which finishes had lead times that would not make it, and we chose alternatives on day two rather than discovering the problem in week five. Opened on schedule.' },
];

const allReviews = [...testimonials, ...extraReviews];

const reviews = {
  route: '/reviews/',
  title: site.reviews.schema
    ? `Client Reviews — ${site.reviews.count} Verified Ratings | Nexora Spaces LLP`
    : 'Client Stories & Testimonials | Nexora Spaces LLP',
  metaTitle: 'Client Reviews & Testimonials | Nexora Spaces',
  description: site.reviews.schema
    ? `${site.reviews.count} verified client reviews of Nexora Spaces. Real feedback from Gurugram, Noida and Delhi homeowners on cost, timelines and support.`
    : 'Selected client feedback and project stories from Gurugram, Noida and Delhi homeowners on cost, timelines and support.',
  keywords: 'nexora spaces reviews, interior designer reviews delhi ncr, best interior designers gurgaon reviews, interior design testimonials noida',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews/' }],
  extraSchema: site.reviews.schema ? [{
    '@type': 'ItemList',
    '@id': `${site.baseUrl}${site.basePath}/reviews/#reviewlist`,
    name: 'Client reviews of Nexora Spaces LLP',
    itemListElement: allReviews.slice(0, 10).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Review',
        reviewBody: r.text,
        author: { '@type': 'Person', name: r.name },
        itemReviewed: { '@id': `${site.baseUrl}${site.basePath}/#organization` },
        reviewRating: { '@type': 'Rating', ratingValue: 5, bestRating: 5, worstRating: 1 },
      },
    })),
  }] : [],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews/' }],
      title: 'What clients say<br>after handover',
      sub: site.reviews.schema
        ? 'Every review below is from a client whose project we completed. We publish the critical feedback too — you will find mentions of a two-day delay and a scope disagreement, because a page of pure praise tells you nothing.'
        : 'Selected client stories from completed projects. Public rating counts and structured review markup are intentionally disabled until the Google Business Profile numbers are verified.',
      stats: site.reviews.schema ? [
        { value: `${site.reviews.rating}★`, label: 'Average rating' },
        { value: `${site.reviews.count}`, label: 'Verified reviews' },
        { value: '96%', label: 'On-time delivery' },
        { value: '38%', label: 'From referrals' },
      ] : [
        { value: `${allReviews.length}`, label: 'Published stories' },
        { value: '96%', label: 'On-time delivery' },
        { value: '38%', label: 'From referrals' },
        { value: '10 yrs', label: 'Warranty' },
      ],
    }),

    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: site.reviews.schema ? 'Verified clients' : 'Client stories',
          title: 'Reviews from real handovers',
          sub: site.reviews.schema
            ? 'Names, locations and project types are published with client permission.'
            : 'These testimonials are displayed as editorial content only; review schema remains off until verification is complete.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${allReviews.map(quoteCard).join('')}
        </div>
      </div>
    </section>`,

    site.reviews.schema ? `<section class="section bg-subtle">
      <div class="container container-narrow text-center">
        ${sectionHead({
          eyebrow: 'Rating breakdown',
          title: 'How the score is made up',
          center: true,
        })}
        <div class="card card-pad-lg reveal">
          <div class="flex items-center justify-center gap-4 mb-8 flex-wrap">
            <span style="font-family:var(--font-display);font-size:var(--fs-5xl);font-weight:600;line-height:1">${site.reviews.rating}</span>
            <div style="text-align:left">
              ${stars(5, 'stars-lg')}
              <p style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:var(--s-2)">Based on ${site.reviews.count} verified reviews</p>
            </div>
          </div>
          <div class="spec-list">
            ${[
              ['Quality of work', '4.9'], ['Timeline adherence', '4.8'],
              ['Cost transparency', '4.9'], ['Communication', '4.9'],
              ['After-handover support', '4.7'],
            ].map(([k, v]) => `
            <div class="spec-row" style="grid-template-columns:1fr auto auto;align-items:center;gap:var(--s-4)">
              <span class="spec-key">${esc(k)}</span>
              <div class="calc-bar" style="width:min(220px,40vw);background:var(--bg-muted)">
                <span style="width:${(parseFloat(v) / 5) * 100}%;background:var(--gradient-brand);display:block;height:100%;border-radius:inherit"></span>
              </div>
              <strong style="font-variant-numeric:tabular-nums;min-width:2.4em;text-align:right">${esc(v)}</strong>
            </div>`).join('')}
          </div>
        </div>
        <p class="mt-6" style="font-size:var(--fs-xs);color:var(--text-subtle)">
          ${icon('info', { size: 13 })} Aggregated from Google Business Profile and post-handover client surveys.
          <a href="${site.reviews.googleUrl}" target="_blank" rel="noopener" class="link-underline" style="color:var(--accent-text)">View on Google</a>
        </p>
      </div>
    </section>` : `<section class="section bg-subtle">
      <div class="container container-narrow text-center">
        ${sectionHead({
          eyebrow: 'Review schema status',
          title: 'Ratings are hidden until verified',
          sub: 'To avoid inaccurate structured data, Google review rating/count markup is disabled in the build. Add real Google Business Profile numbers in site.config.js before turning it back on.',
          center: true,
        })}
        <div class="alert alert-brand reveal" style="text-align:left">
          ${icon('info', { size: 20 })}
          <p><span class="alert-title">Safe for SEO.</span>
          The page can still show client stories, but it will not publish aggregateRating or Review JSON-LD until the source data is real and verifiable.</p>
        </div>
      </div>
    </section>`,

    ctaBand({ source: 'reviews' }),
  ].join('\n'),
};

/* ================================================================= FAQ */
const faqExtra = [
  { q: 'Do you provide 3D designs before I commit?', a: '<p>Yes, free of charge and with no obligation. After the site survey you get photoreal 3D views of every room, plus an itemised BOQ. You keep both whether or not you hire us.</p>' },
  { q: 'What brands of material and hardware do you use?', a: '<p>Plywood from Century, Greenply or Austin (710 grade). Hardware from Hettich, Blum or Ebco depending on package. Paint from Asian Paints or Berger. Laminates from Merino, Greenlam or Century. Every brand is named on your BOQ — never "premium quality" as a description.</p>' },
  { q: 'Can I supply my own materials?', a: '<p>You can, for finishes and loose items. We will deduct the corresponding line from the BOQ. We do not, however, warranty client-supplied material, and we cannot take responsibility for delays if it arrives late — that gets stated in the contract so expectations are clear.</p>' },
  { q: 'Do you handle Vastu requirements?', a: '<p>Regularly. Tell us your requirements at the briefing stage and we will work them into the layout. Where a Vastu requirement conflicts with a structural or practical constraint, we will show you the options and their cost implications rather than quietly ignoring it.</p>' },
  { q: 'What if I am not happy with the design?', a: '<p>Revision rounds are included, and the number is agreed with you upfront and written into your scope. If we genuinely cannot land on a direction you are happy with before contract signature, you walk away having paid nothing.</p>' },
  { q: 'Do you work with tenants and rented properties?', a: '<p>Yes, with a different approach — we focus on removable, non-permanent interventions and modular units you can take with you. Tell us upfront that the property is rented so we design accordingly.</p>' },
  { q: 'How do I check on progress if I live abroad?', a: '<p>Weekly photo and video reports on WhatsApp, plus scheduled video walkthroughs at each milestone. About one in six of our clients is an NRI or based in another city, so this workflow is well tested.</p>' },
  { q: 'What happens if my project is delayed?', a: '<p>If the delay is within our control, the contract defines the consequence. If it is caused by scope changes, society permission issues or client-side decisions, we document the revised date in writing when it happens — not at the end. Our current on-time rate is 96%, and we publish that number rather than claiming 100%.</p>' },
];

const faq = {
  route: '/faq/',
  title: 'Interior Design FAQs — Cost, Timeline, Warranty | Nexora Spaces',
  metaTitle: 'Interior Design FAQs | Delhi, Gurgaon & Noida | Nexora',
  description:
    'Straight answers on interior design cost, timelines, materials, warranty and payment schedules for Delhi NCR homeowners.',
  keywords: 'interior design faq, interior design questions india, how much does interior design cost, interior design process questions',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'FAQs', href: '/faq/' }],
  faqs: [...faqsGeneral, ...faqsCost, ...faqExtra],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'FAQs', href: '/faq/' }],
      title: 'Questions we get<br>every single week',
      sub: 'Answered properly, including the ones where the honest answer is not in our commercial interest.',
      light: true,
    }),

    `<section class="section">
      <div class="container container-narrow">
        ${[
          { title: 'Cost & budgeting', items: faqsCost, icon: 'rupee' },
          { title: 'Scope, process & timelines', items: faqsGeneral, icon: 'compass' },
          { title: 'Materials, warranty & aftercare', items: faqExtra, icon: 'shieldCheck' },
        ].map((group) => `
        <div class="mb-12">
          <h2 class="mb-6 flex items-center gap-3" style="font-size:var(--fs-2xl)">
            <span class="card-icon" style="margin:0;width:42px;height:42px">${icon(group.icon, { size: 20 })}</span>
            ${esc(group.title)}
          </h2>
          <div class="accordion reveal" data-single="false">
            ${group.items.map((f) => `
            <div class="acc-item">
              <button class="acc-btn" aria-expanded="false">
                <span>${esc(f.q)}</span>
                <span class="acc-icon">${icon('chevronDown', { size: 16 })}</span>
              </button>
              <div class="acc-panel"><div><div class="acc-body">${richText(f.a)}</div></div></div>
            </div>`).join('')}
          </div>
        </div>`).join('')}

        <div class="magnet reveal">
          <div>
            <h3>${icon('headphones', { size: 18 })} Question not answered here?</h3>
            <p>WhatsApp a senior designer directly. We answer scope, cost and feasibility questions honestly — including when the answer is that we are not the right fit for your project.</p>
          </div>
          <a href="${waLink()}" class="btn btn-accent" target="_blank" rel="noopener">${iconSolid('whatsapp', { size: 18 })} Ask on WhatsApp</a>
        </div>
      </div>
    </section>`,

    ctaBand({ source: 'faq' }),
  ].join('\n'),
};

/* ============================================================= CAREERS */
const jobs = [
  { title: 'Senior Interior Designer', team: 'Design Studio', location: 'Gurugram (HQ)', type: 'Full-time', exp: '5–9 years', desc: 'Own residential projects end to end — brief to handover. Strong space planning, detailing and client-facing communication required.' },
  { title: 'Project Manager — Site Delivery', team: 'Projects', location: 'Noida', type: 'Full-time', exp: '4–8 years', desc: 'Run 6–9 concurrent residential fit-outs. Civil or interiors background, and the discipline to keep weekly reporting genuinely weekly.' },
  { title: '3D Visualiser', team: 'Design Studio', location: 'Gurugram (HQ)', type: 'Full-time', exp: '2–5 years', desc: '3ds Max + Corona or V-Ray. Photoreal interior visualisation with fast turnaround on revisions.' },
  { title: 'Design Consultant (Client Facing)', team: 'Sales', location: 'Gurugram / Noida', type: 'Full-time', exp: '2–5 years', desc: 'First point of contact for enquiries. We want consultative, not pushy — our whole positioning depends on it.' },
  { title: 'Production Supervisor', team: 'Manufacturing', location: 'Manesar facility', type: 'Full-time', exp: '5–10 years', desc: 'CNC operations, edge banding, QC and dispatch scheduling for modular units.' },
  { title: 'Junior Interior Designer', team: 'Design Studio', location: 'Gurugram (HQ)', type: 'Full-time', exp: '0–2 years', desc: 'For recent graduates from a recognised design programme. AutoCAD and SketchUp essential, portfolio matters more than marks.' },
];

const careers = {
  route: '/careers/',
  title: 'Careers at Nexora Spaces LLP — Interior Design Jobs in Delhi NCR',
  metaTitle: 'Careers | Interior Design Jobs in Delhi NCR | Nexora',
  description:
    'Open roles for interior designers, 3D visualisers and project managers in Gurugram and Noida. In-house studio, no commission-driven selling.',
  keywords: 'interior design jobs delhi ncr, interior designer jobs gurgaon, 3d visualiser jobs noida, project manager interior jobs',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Careers', href: '/careers/' }],
  extraSchema: jobs.map((j) => ({
    '@type': 'JobPosting',
    title: j.title,
    description: j.desc,
    hiringOrganization: { '@id': `${site.baseUrl}${site.basePath}/#organization` },
    employmentType: 'FULL_TIME',
    datePosted: '2026-06-01',
    validThrough: '2026-12-31',
    experienceRequirements: {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: parseInt(j.exp, 10) * 12 || 0,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: j.location.split(' ')[0],
        addressRegion: j.location.includes('Noida') ? 'Uttar Pradesh' : 'Haryana',
        addressCountry: 'IN',
      },
    },
  })),
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Careers', href: '/careers/' }],
      title: 'Build things that<br>outlast the trend cycle',
      sub: 'We are 62 people across design, projects and production. No commission-driven selling, no designer working on six projects at once, and no culture of blaming the site team when a drawing was wrong.',
      stats: [
        { value: '62', label: 'Team members' },
        { value: '6', label: 'Open roles' },
        { value: '4.6★', label: 'Employee rating' },
        { value: '82%', label: 'Retention, 3 yrs' },
      ],
    }),

    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Why here',
          title: 'What we actually offer',
          sub: 'Written plainly, because everyone claims a great culture.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${[
            { icon: 'palette', t: 'Design that gets built', d: 'Because execution is in-house, the thing you draw is the thing that gets made. No watching your scheme get value-engineered by a contractor you never met.' },
            { icon: 'users', t: 'Sane project loads', d: 'Designers carry four to six live projects, not fifteen. We would rather do fewer projects properly than burn people out on volume.' },
            { icon: 'trendingUp', t: 'Structured growth', d: 'Defined levels with published criteria, twice-yearly reviews, and a training budget that is actually spent.' },
            { icon: 'heart', t: 'No commission selling', d: 'Consultants are not paid per closure. It removes the incentive to oversell, which is the entire reason clients trust us.' },
            { icon: 'clock', t: 'Realistic hours', d: 'Site work has crunch periods and we will not pretend otherwise — but weekends are protected outside of handover weeks.' },
            { icon: 'shield', t: 'Standard benefits, done right', d: 'Health cover for you and dependants, on-time salary every month without exception, and paid leave that is genuinely usable.' },
          ].map((b) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(b.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(b.t)}</h3>
            <p class="card-text">${esc(b.d)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    `<section class="section bg-subtle">
      <div class="container container-narrow">
        ${sectionHead({ eyebrow: 'Open roles', title: 'Six positions open right now', center: true })}
        <div class="grid gap-4 reveal-stagger">
          ${jobs.map((j) => `
          <div class="job-card">
            <div style="flex:1;min-width:240px">
              <h3 class="job-title">${esc(j.title)}</h3>
              <div class="job-meta mb-3">
                <span>${icon('briefcase', { size: 13 })} ${esc(j.team)}</span>
                <span>${icon('mapPin', { size: 13 })} ${esc(j.location)}</span>
                <span>${icon('clock', { size: 13 })} ${esc(j.type)}</span>
                <span>${icon('trendingUp', { size: 13 })} ${esc(j.exp)}</span>
              </div>
              <p style="font-size:var(--fs-sm);color:var(--text-muted);line-height:1.6">${esc(j.desc)}</p>
            </div>
            <a href="mailto:${site.email.careers}?subject=${encodeURIComponent('Application: ' + j.title)}" class="btn btn-outline">Apply ${icon('arrowRight', { size: 16 })}</a>
          </div>`).join('')}
        </div>

        <div class="magnet mt-10 reveal">
          <div>
            <h3>Do not see your role?</h3>
            <p>We keep good portfolios on file and reach out when something opens. Send your CV and work to <strong>${esc(site.email.careers)}</strong> with a line about what you want to be doing in two years.</p>
          </div>
          <a href="mailto:${site.email.careers}" class="btn btn-accent">${icon('send', { size: 18 })} Send your portfolio</a>
        </div>
      </div>
    </section>`,
  ].join('\n'),
};

/* =========================================================== THANK YOU */
const thankYou = {
  route: '/thank-you/',
  title: 'Thank You — We Will Call You Shortly | Nexora Spaces',
  description: 'Your enquiry has been received. A senior designer from Nexora Spaces will call you within 2 working hours.',
  noindex: true,
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Thank you', href: '/thank-you/' }],
  body: `
<section class="section-lg">
  <div class="container container-narrow text-center">
    <div class="success-icon">${icon('checkCircle', { size: 42 })}</div>
    <h1 class="mb-5">Thank you — we have your enquiry</h1>
    <p class="section-sub mx-auto mb-10">
      A senior designer will call you within <strong>2 working hours</strong>. If you would like to talk sooner,
      call or WhatsApp us directly — we pick up fast.
    </p>
    <div class="btn-group center mb-12">
      <a href="tel:${site.phone.tel}" class="btn btn-primary btn-lg">${icon('phone', { size: 18 })} ${esc(site.phone.display)}</a>
      <a href="${waLink()}" class="btn btn-whatsapp btn-lg" target="_blank" rel="noopener">${iconSolid('whatsapp', { size: 18 })} WhatsApp now</a>
    </div>

    <div class="card card-pad-lg text-left">
      <h2 class="mb-6" style="font-size:var(--fs-xl)">What happens next</h2>
      <div class="timeline">
        ${[
          ['Within 2 hours', 'A senior designer calls to understand your scope, budget and possession date.'],
          ['Within 48 hours', 'Free site visit at a time that suits you — evenings and Saturdays included.'],
          ['Within 72 hours', 'Photoreal 3D concept and an itemised BOQ, yours to keep with no obligation.'],
        ].map(([t, d]) => `
        <div class="tl-item">
          <span class="tl-year">${esc(t)}</span>
          <p>${esc(d)}</p>
        </div>`).join('')}
      </div>
    </div>

    <div class="mt-12">
      <p class="rule-label mb-6">While you wait</p>
      <div class="grid grid-3 gap-5">
        <a href="${url('/portfolio/')}" class="card card-hover"><span class="card-icon">${icon('image', { size: 20 })}</span><h3 class="card-title" style="font-size:var(--fs-base)">Browse our portfolio</h3></a>
        <a href="${url('/gallery/')}" class="card card-hover"><span class="card-icon">${icon('image', { size: 20 })}</span><h3 class="card-title" style="font-size:var(--fs-base)">Browse home packages</h3></a>
        <a href="${url('/process/')}" class="card card-hover"><span class="card-icon">${icon('compass', { size: 20 })}</span><h3 class="card-title" style="font-size:var(--fs-base)">See how we work</h3></a>
      </div>
    </div>
  </div>
</section>`,
};

/* ================================================================= 404 */
const notFound = {
  route: '/404',
  title: 'Page Not Found | Nexora Spaces LLP',
  description: 'The page you are looking for does not exist. Browse our residential interior services for Delhi, Gurugram and Noida.',
  noindex: true,
  body: `
<section class="error-page">
  <div class="container container-narrow">
    <span class="error-code">404</span>
    <h1 class="mb-5">This page has been redesigned out of existence</h1>
    <p class="section-sub mx-auto mb-10">
      The link is broken or the page has moved. Here is where most people were heading.
    </p>
    <h2 class="sr-only">Popular pages</h2>
    <div class="grid grid-3 gap-5 mb-10" style="text-align:left">
      ${[
        ['Home interiors', '/residential/', 'home'],
        ['Home gallery', '/gallery/', 'image'],
        ['Our services', '/services/turnkey-interiors/', 'key'],
        ['Our portfolio', '/portfolio/', 'layers'],
        ['Interior designers in Gurgaon', '/interior-designers-in-gurgaon/', 'mapPin'],
        ['Contact us', '/contact/', 'phone'],
      ].map(([label, href, ic]) => `
      <a href="${url(href)}" class="card card-hover">
        <span class="card-icon" style="width:42px;height:42px;margin-bottom:var(--s-4)">${icon(ic, { size: 19 })}</span>
        <h3 class="card-title" style="font-size:var(--fs-base)">${esc(label)}</h3>
      </a>`).join('')}
    </div>
    <a href="${url('/')}" class="btn btn-primary btn-lg">${icon('home', { size: 18 })} Back to home</a>
  </div>
</section>`,
};

/* ============================================================== LEGAL */
const legalPage = ({ route, title, metaTitle, description, heading, sub, sections }) => ({
  route, title, metaTitle, description,
  crumbs: [{ label: 'Home', href: '/' }, { label: heading, href: route }],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: heading, href: route }],
      title: heading,
      sub,
      light: true,
    }),
    `<section class="section">
      <div class="container container-narrow">
        <p class="badge badge-outline mb-8">${icon('calendar', { size: 13 })} Last updated: 1 July ${currentYear}</p>
        <div class="prose">
          ${sections.map((s) => `<h2>${esc(s.h)}</h2>${s.body}`).join('\n')}
          <h2>Contact us about this policy</h2>
          <p>
            ${esc(site.legalName)}<br>
            ${esc(site.legal.registeredAddress)}<br>
            Email: <a href="mailto:${site.email.general}">${esc(site.email.general)}</a><br>
            Phone: <a href="tel:${site.phone.tel}">${esc(site.phone.display)}</a>
          </p>
        </div>
      </div>
    </section>`,
  ].join('\n'),
});

const privacy = legalPage({
  route: '/privacy/',
  title: 'Privacy Policy | Nexora Spaces LLP',
  metaTitle: 'Privacy Policy | Nexora Spaces LLP',
  description: 'How Nexora Spaces LLP collects, uses, stores and protects your personal information, and the rights you have over your data.',
  heading: 'Privacy policy',
  sub: 'What we collect, why we collect it, and what you can ask us to do with it.',
  sections: [
    { h: 'Information we collect', body: `<p>We collect information you give us directly when you fill a form, call, WhatsApp or email us — typically your name, phone number, email address, city, property type and project requirements.</p><p>We also collect limited technical information automatically: pages visited, approximate location derived from IP, device type and referral source. This is used to understand which pages are useful and to improve the site.</p>` },
    { h: 'How we use your information', body: `<ul><li>To respond to your enquiry and provide a quotation</li><li>To schedule site visits and manage your project</li><li>To send project updates, invoices and warranty documents</li><li>To improve our services and website</li><li>To comply with statutory, tax and accounting obligations</li></ul><p>We do <strong>not</strong> sell, rent or trade your personal information to third parties for their marketing purposes.</p>` },
    { h: 'Who we share it with', body: `<p>Only where necessary to deliver your project: our own project and production teams, logistics providers, and professional advisers bound by confidentiality. We may disclose information where required by law.</p>` },
    { h: 'How long we keep it', body: `<p>Enquiry data that does not convert is retained for 24 months, after which it is deleted. Project and financial records are retained for 8 years to meet statutory accounting and tax requirements. Warranty records are retained for the warranty period plus 2 years.</p>` },
    { h: 'Your rights', body: `<p>You can ask us to provide a copy of the data we hold about you, correct anything inaccurate, delete your data where we have no legal obligation to retain it, or stop marketing communications. Email <a href="mailto:${site.email.general}">${site.email.general}</a> and we will respond within 30 days.</p>` },
    { h: 'Cookies', body: `<p>This website uses only essential cookies required for it to function. If analytics are enabled, they run in anonymised mode with IP anonymisation active. We do not use advertising or cross-site tracking cookies.</p>` },
    { h: 'Data security', body: `<p>We apply reasonable technical and organisational safeguards including access controls, encrypted transmission and restricted internal access. No system is completely secure, and we cannot guarantee absolute security of information transmitted over the internet.</p>` },
    { h: 'Children', body: `<p>Our services are directed at adults. We do not knowingly collect personal information from anyone under 18.</p>` },
    { h: 'Changes to this policy', body: `<p>We may update this policy from time to time. Material changes will be reflected in the "last updated" date above, and where appropriate we will notify existing clients directly.</p>` },
  ],
});

const terms = legalPage({
  route: '/terms/',
  title: 'Terms of Service | Nexora Spaces LLP',
  metaTitle: 'Terms of Service | Nexora Spaces LLP',
  description: 'The terms governing use of the Nexora Spaces LLP website and the basis on which we provide interior design and fit-out services.',
  heading: 'Terms of service',
  sub: 'The rules for using this website, and how our service agreements work.',
  sections: [
    { h: 'Acceptance of terms', body: `<p>By accessing this website you agree to these terms. If you do not agree, please do not use the site. These terms govern website use only — project work is governed by the separate signed agreement between you and ${esc(site.legalName)}.</p>` },
    { h: 'Estimates and quotations', body: `<p>This website does not publish prices, rates or estimates of any kind. Nothing shown here constitutes an offer. A binding scope and quotation is provided solely as a written, itemised document issued after a site survey, and remains valid for the period stated on it.</p>` },
    { h: 'Scope of services', body: `<p>We provide interior design, project management and turnkey fit-out services. The precise scope for your project is defined exclusively in your signed agreement and accompanying BOQ. Anything not listed there is outside scope.</p>` },
    { h: 'Payment terms', body: `<p>Standard residential milestones are 10% on design sign-off, 40% on material dispatch, 40% on installation start and 10% on snag closure. All amounts attract GST at prevailing rates. Delayed payments may attract interest as specified in your agreement and may shift the delivery programme.</p>` },
    { h: 'Timelines', body: `<p>Committed delivery dates run from design sign-off and receipt of the applicable milestone payment, and assume society permissions are in place. Delays caused by client-side decisions, scope changes, permission issues or force majeure extend the programme accordingly, and we will confirm any revised date in writing when it arises.</p>` },
    { h: 'Intellectual property', body: `<p>All designs, drawings, 3D visualisations and documents we produce remain our intellectual property until the project is paid in full, at which point you receive a licence to use them for the specific property. Website content, photographs and branding remain our property and may not be reproduced without written consent.</p>` },
    { h: 'Warranties and liability', body: `<p>Our warranty terms are published on the <a href="${url('/warranty/')}">warranty page</a> and form part of your agreement. To the maximum extent permitted by law, our aggregate liability is limited to the value of the contract. We are not liable for indirect or consequential loss.</p>` },
    { h: 'Third-party content', body: `<p>This site may link to third-party websites. We are not responsible for their content, accuracy or privacy practices.</p>` },
    { h: 'Governing law', body: `<p>These terms are governed by the laws of India. Courts at ${esc(site.legal.jurisdiction)} have exclusive jurisdiction over any dispute.</p>` },
  ],
});

const refund = legalPage({
  route: '/refund/',
  title: 'Cancellation & Refund Policy | Nexora Spaces LLP',
  metaTitle: 'Cancellation & Refund Policy | Nexora Spaces LLP',
  description: 'How cancellations and refunds work at Nexora Spaces LLP at each stage of a project, with clear timelines and deductions.',
  heading: 'Cancellation & refund policy',
  sub: 'What happens to your money if you cancel — set out by stage, with no ambiguity.',
  sections: [
    { h: 'Before design sign-off', body: `<p>Consultation, site survey, 3D concept and BOQ are provided <strong>free of charge with no obligation</strong>. If you decide not to proceed at this stage, nothing is owed and nothing is refundable because nothing has been paid.</p>` },
    { h: 'After design sign-off, before production', body: `<p>The 10% design milestone covers design development, drawings and documentation already delivered. If you cancel at this point, we retain the design fee and refund any excess within <strong>14 working days</strong>. You keep the drawings and BOQ for the property.</p>` },
    { h: 'After material dispatch payment', body: `<p>Once the 40% dispatch milestone is paid, materials have been procured and modular units have entered production. Cancellation at this stage means we deduct actual costs incurred — material procured, production time consumed and any custom fabrication — and refund the balance within <strong>21 working days</strong>, with a documented statement of deductions.</p>` },
    { h: 'After installation begins', body: `<p>Once installation has started, cancellation is treated as termination for convenience. You are liable for all work completed and materials supplied to date, plus a 10% termination charge on the remaining contract value. Any credit balance is refunded within 21 working days.</p>` },
    { h: 'Cancellation by us', body: `<p>We may terminate if a site is unsafe, if statutory permissions are refused, if payment milestones remain unmet after written notice, or where continuing would require us to breach a legal or safety obligation. In such cases you are charged only for work genuinely completed, and any balance is refunded in full within 14 working days.</p>` },
    { h: 'How to cancel', body: `<p>Send written notice to <a href="mailto:${site.email.general}">${esc(site.email.general)}</a> quoting your project code. We acknowledge within 2 working days and issue a settlement statement within 7 working days showing exactly what has been deducted and why.</p>` },
    { h: 'Refund method', body: `<p>Refunds are made to the original payment source. Bank transfers typically settle within 3–5 working days of processing. We do not issue cash refunds.</p>` },
    { h: 'Disputes', body: `<p>If you disagree with a settlement statement, raise it in writing within 15 days. Unresolved disputes are subject to the jurisdiction of courts at ${esc(site.legal.jurisdiction)}.</p>` },
  ],
});

export default [reviews, faq, careers, thankYou, notFound, privacy, terms, refund];
