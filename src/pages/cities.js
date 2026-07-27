/**
 * City landing pages — the primary local-SEO assets.
 * Each targets "interior designers in <city>" with genuinely city-specific
 * content: micro-markets, local price bands, society realities, landmarks.
 */
import { site, waLink, hq } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { absoluteUrl } from '../config/site.config.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import {
  pageHead, sectionHead, faqBlock, ctaBand, testimonialSection, folioCard, processRail,
} from '../layouts/sections.js';
import { projects, testimonials, processSteps } from '../data/content.js';

const cities = [
  {
    slug: 'interior-designers-in-gurgaon',
    city: 'Gurugram', alt2: 'Gurgaon',
    office: site.offices.find((o) => o.id === 'gurugram'),
    img: 'pages/gurgaon',
    imgAlt: 'Interior design project delivered by Nexora Spaces in a Gurugram apartment',
    projectCount: '410+',
    intro:
      'Gurugram is where our head office sits and where we have delivered the most homes. High-rise condominiums with strict material-movement windows, builder floors in the older sectors, and villas along Golf Course Road each demand a different execution plan — and we run all three every week.',
    priceNote: 'Gurugram sites are shaped by tower access rules and society work windows. Here is what we typically deliver, and what each home size involves locally.',
    prices: [
      ['1 BHK', 'Condominium studios and compact units', 'Storage-first planning, shortest programme'],
      ['2 BHK', 'Sohna Road and New Gurgaon high-rises', 'Our most refined and most reliable timeline'],
      ['3 BHK', 'Golf Course Extension and Sector 65–70 towers', 'Master suite and shared spaces prioritised'],
      ['4 BHK / Villa', 'Golf Course Road villas and DLF builder floors', 'Senior PM, site engineer, staged by level'],
    ],
    areas: [
      { name: 'DLF Phase 1–5', note: 'Builder floors and condominiums; older services often need replacement' },
      { name: 'Golf Course Road', note: 'The Camellias, Magnolias, Aralias — high-spec villa and penthouse work' },
      { name: 'Golf Course Extension', note: 'Ireo, M3M, Emaar towers; new-possession fit-outs' },
      { name: 'Sohna Road', note: 'Mid-rise condominiums, strong 2 and 3 BHK demand' },
      { name: 'Sectors 47–57', note: 'Established societies, mix of renovation and fresh interiors' },
      { name: 'New Gurgaon (79–95)', note: 'Large new-possession volumes; fast-track packages' },
      { name: 'Sector 65–70', note: 'Premium high-rises along the Extension corridor' },
      { name: 'MG Road & Sushant Lok', note: 'Older stock, mostly gut renovations' },
    ],
    localFactors: [
      { icon: 'clock', t: 'Society work windows', d: 'Most Gurugram condominiums permit work only 9am–6pm on weekdays with no Sunday activity. We build this into the programme rather than discovering it in week two.' },
      { icon: 'truck', t: 'Service lift booking', d: 'Towers on Golf Course Extension often allow one service lift slot per day. Our material staging plan is built around that constraint.' },
      { icon: 'fileText', t: 'RWA permissions & deposits', d: 'Refundable work deposits are standard in most societies. We handle the paperwork and the debris-disposal compliance.' },
      { icon: 'leaf', t: 'Dust and AQI protocols', d: 'During GRAP restrictions, certain site activities pause. We front-load dust-generating work outside those windows wherever the calendar allows.' },
    ],
    faqs: [
      { q: 'How do you scope a home interior project in Gurgaon?', a: '<p>After a site survey we issue a written, itemised scope naming every material, brand and finish. Gurugram adds two local variables: society access rules and, in older DLF stock, the condition of existing services.</p><p>We survey both before committing to anything, so the plan reflects your actual home rather than a generic template.</p>' },
      { q: 'Do you work in DLF Phase 1–5 builder floors?', a: '<p>Regularly. Older DLF builder floors usually need more than cosmetic work — aluminium wiring, undersized distribution boards and corroded GI plumbing are common. We survey services before quoting, so the renovation budget reflects what the property actually needs instead of springing it on you after demolition.</p>' },
      { q: 'How do you handle high-rise society restrictions?', a: '<p>We obtain the work permission, pay and track the refundable deposit, book service-lift slots in advance, protect common areas, and schedule noisy trades inside permitted hours. Our Gurugram PMs deal with these RWAs every week, so we know each tower\'s rules before we start.</p>' },
      { q: 'Where is your Gurugram office?', a: `<p>Our head office and experience centre is at <strong>${esc(site.offices[0].street)}, ${esc(site.offices[0].area)}, Gurugram ${esc(site.offices[0].postalCode)}</strong>. You can see material samples, hardware cutaways and finish panels in person — walk-ins welcome ${esc(site.hours.display)}, though booking ahead means a designer is free for you.</p>` },
      { q: 'Can you start before I get possession?', a: '<p>Yes, and it saves weeks. Send the builder floor plan and we will complete design, 3D and BOQ while you wait for handover. Site work begins the day you have keys and society permission, so you are not starting the design clock from zero at possession.</p>' },
    ],
  },
  {
    slug: 'interior-designers-in-noida',
    city: 'Noida', alt2: 'Greater Noida',
    office: site.offices.find((o) => o.id === 'noida'),
    img: 'pages/noida',
    imgAlt: 'Interior design project delivered by Nexora Spaces in a Noida apartment',
    projectCount: '260+',
    intro:
      'Noida and Greater Noida are our highest-volume new-possession markets. Sector 150, the Expressway corridor and Greater Noida West hand over hundreds of flats at a time — which means predictable layouts, and packages we have refined to the point where our 2 BHK timelines here are the most reliable in our book.',
    priceNote: 'Noida is typically the most cost-efficient NCR market for identical scope — roughly 6–8% below Gurugram.',
    prices: [
      ['1 BHK', 'Compact units across the Expressway corridor', 'Storage-first planning, shortest programme'],
      ['2 BHK', 'Sector 150 and Greater Noida West volumes', 'Predictable layouts, our fastest turnaround'],
      ['3 BHK', 'Sector 137–168 and Expressway towers', 'Master suite and WFH room prioritised'],
      ['4 BHK / Villa', 'Larger Expressway and Greater Noida homes', 'Senior PM and staged room-by-room delivery'],
    ],
    areas: [
      { name: 'Sector 150', note: 'Sports City belt — ATS, Ace, Godrej; heavy new-possession volume' },
      { name: 'Noida Expressway (Sec 128–137)', note: 'Jaypee, Prateek, Paras; premium 3 and 4 BHK stock' },
      { name: 'Sector 74–79', note: 'Supertech, Amrapali, Gulshan; dense mid-segment demand' },
      { name: 'Sector 93–100', note: 'Established high-rises, mostly renovation work' },
      { name: 'Greater Noida West', note: 'Gaur City, Panchsheel; value-focused family homes' },
      { name: 'Sector 44–52', note: 'Older Noida sectors, independent houses and builder floors' },
      { name: 'Indirapuram', note: 'Ghaziabad border; strong 2 and 3 BHK renovation market' },
      { name: 'Sector 168 & Pari Chowk', note: 'Greater Noida premium corridor' },
    ],
    localFactors: [
      { icon: 'package', t: 'New-possession advantage', d: 'No demolition, no living-around-the-work and predictable builder layouts — which is why Noida 2 BHKs are consistently our quickest handovers.' },
      { icon: 'ruler', t: 'Layouts we already know', d: 'We have designed the same Sector 150 and Gaur City floor plans dozens of times. That means faster design cycles and no measurement surprises.' },
      { icon: 'rupee', t: 'Better cost efficiency', d: 'Lower labour rates and easier material access make Noida the best value in NCR for the same specification.' },
      { icon: 'truck', t: 'Bulk-possession logistics', d: 'When 400 flats hand over in one tower, lifts and access get contested. We book slots early and stage material off-site.' },
    ],
    faqs: [
      { q: 'Why are your Noida timelines so reliable?', a: '<p>Volume and repetition. Sector 150, the Expressway corridor and Greater Noida West hand over hundreds of flats with near-identical layouts, so we have refined the sequence for those plans more than anywhere else in NCR.</p><p>That is also why Noida tends to be our most value-efficient market for the same specification.</p>' },
      { q: 'Do you work in Greater Noida West and Gaur City?', a: '<p>Yes — Greater Noida West is one of our highest-volume corridors. We know the standard Gaur City, Panchsheel and Ajnara layouts well, which shortens the design phase considerably. Our Noida studio in Sector 63 covers the entire Greater Noida belt.</p>' },
      { q: 'My flat is new possession. When should I start?', a: '<p>Start design 6–8 weeks before you expect keys. Send the builder floor plan, we complete design, 3D and BOQ during the wait, and site work begins the day possession and society permission are in hand. Clients who do this typically move in a month earlier than those who start at possession.</p>' },
      { q: 'Where is your Noida studio?', a: `<p><strong>${esc(site.offices[1].street)}, ${esc(site.offices[1].area)}, Noida ${esc(site.offices[1].postalCode)}</strong>. It doubles as our east-NCR project office, so your Noida or Greater Noida project manager is based here rather than commuting from Gurugram.</p>` },
      { q: 'Do you take projects in Ghaziabad and Indirapuram?', a: '<p>Yes, both are served from the Noida studio at the same rates. Indirapuram in particular has a strong renovation market — a lot of 12 to 18-year-old stock now needing services replacement along with new interiors.</p>' },
    ],
  },
  {
    slug: 'interior-designers-in-delhi',
    city: 'Delhi', alt2: 'New Delhi',
    office: site.offices.find((o) => o.id === 'delhi'),
    img: 'pages/delhi',
    imgAlt: 'Modern classic interior design project delivered by Nexora Spaces in South Delhi',
    projectCount: '180+',
    intro:
      'Delhi is our most technically demanding market. South Delhi builder floors with 1990s services, DDA flats in Dwarka and Rohini with tight structural constraints, and heritage-adjacent properties with approval sensitivities — the common thread is that almost nothing here is a straightforward new-possession fit-out.',
    priceNote: 'South Delhi runs comparable to Gurugram; outer Delhi (Dwarka, Rohini, Uttam Nagar) is closer to Noida rates.',
    prices: [
      ['1 BHK', 'Dwarka, Rohini and outer Delhi flats', 'Storage-first planning, shortest programme'],
      ['2 BHK', 'Dwarka sectors and West Delhi apartments', 'Our most refined and most reliable timeline'],
      ['3 BHK', 'South Delhi flats and Vasant Kunj homes', 'Master suite and shared spaces prioritised'],
      ['4 BHK / Builder floor', 'GK, Saket and South Delhi builder floors', 'Often gut renovation with new services'],
    ],
    areas: [
      { name: 'Greater Kailash I & II', note: 'Builder floors; typically full gut-renovation scope' },
      { name: 'Saket & Malviya Nagar', note: 'Mixed stock, strong renovation demand' },
      { name: 'Vasant Kunj & Vasant Vihar', note: 'DDA and private apartments, premium finishes' },
      { name: 'Dwarka (Sec 1–23)', note: 'Cooperative group housing; high 2 and 3 BHK volume' },
      { name: 'Rohini & Pitampura', note: 'DDA flats and independent floors, value-conscious' },
      { name: 'Punjabi Bagh & Rajouri', note: 'Independent houses, large-format projects' },
      { name: 'Defence Colony & Lajpat Nagar', note: 'Our South Delhi client lounge catchment' },
      { name: 'Mayur Vihar & Patparganj', note: 'East Delhi group housing societies' },
    ],
    localFactors: [
      { icon: 'search', t: 'Older services need auditing', d: 'Aluminium wiring, 1990s GI plumbing and undersized DBs are the norm in South Delhi builder floors. We survey and quote for replacement rather than working around them.' },
      { icon: 'hardHat', t: 'Structural sensitivity', d: 'Many Delhi properties have load-bearing walls where clients assume partitions. We verify before any demolition is planned or priced.' },
      { icon: 'fileText', t: 'Approval awareness', d: 'Facade changes, floor additions and certain structural work need municipal clearance. We flag anything in your brief that crosses that line.' },
      { icon: 'truck', t: 'Access constraints', d: 'Narrow lanes in GK, Lajpat Nagar and Rajouri restrict vehicle size and delivery timing. Material staging is planned around it.' },
    ],
    faqs: [
      { q: 'What is different about interiors in Delhi?', a: '<p>Age of stock. South Delhi builder floors and older colonies frequently need services replaced — wiring, distribution boards and plumbing — which a new-possession flat does not.</p><p>We survey services before finalising any scope, so a renovation plan reflects what the property actually needs rather than what a template assumes.</p>' },
      { q: 'Do you handle South Delhi builder floor renovations?', a: '<p>It is a significant part of our Delhi book. These usually involve full services replacement — new wiring, new plumbing, upgraded DB — alongside interiors. We audit and photograph everything before quoting so there is no "we found something" conversation after demolition.</p>' },
      { q: 'Can you work in DDA flats in Dwarka or Rohini?', a: '<p>Yes, frequently. DDA layouts have known structural constraints — load-bearing walls that cannot be touched and fixed service shafts. We work within them and design storage that compensates. We will tell you at survey stage which walls are genuinely movable.</p>' },
      { q: 'Where is your Delhi office?', a: `<p>Our client lounge is at <strong>${esc(site.offices[2].street)}, ${esc(site.offices[2].area)}, New Delhi ${esc(site.offices[2].postalCode)}</strong>. It is a consultation and sample space rather than a full studio — design work runs from Gurugram, but your South Delhi project manager is Delhi-based.</p>` },
      { q: 'Do you take independent house and full-property projects?', a: '<p>Yes — Punjabi Bagh, Rajouri Garden and Defence Colony independent houses are regular work for us. These are phased floor by floor with a senior PM assigned, and typically run 85–112 days depending on whether services are being replaced.</p>' },
    ],
  },
];

export default cities.map((c) => {
  const cityProjects = projects.filter((p) =>
    p.tags.includes(c.slug.includes('gurgaon') ? 'gurugram' : c.slug.includes('noida') ? 'noida' : 'delhi')
  );
  const shown = cityProjects.length >= 3 ? cityProjects : [...cityProjects, ...projects.filter((p) => !cityProjects.includes(p))].slice(0, 6);

  return {
    route: `/${c.slug}/`,
    title: `Interior Designers in ${c.city} — Turnkey Home Interiors | Nexora Spaces`,
    metaTitle: `Interior Designers in ${c.city} | Nexora Spaces`,
    description:
      `Home interior designers in ${c.city} — ${c.projectCount} homes delivered. Residential design and fit-out with a documented warranty and a free consultation.`,
    keywords:
      `interior designers in ${c.city.toLowerCase()}, interior design ${c.city.toLowerCase()}, home interior ${c.city.toLowerCase()}, best interior designers ${c.city.toLowerCase()}, modular kitchen ${c.city.toLowerCase()}, interior design cost ${c.city.toLowerCase()}`,
    ogImage: `/assets/img/${c.img}-1600.jpg`,
    crumbs: [{ label: 'Home', href: '/' }, { label: `Interior designers in ${c.city}`, href: `/${c.slug}/` }],
    faqs: c.faqs,
    extraSchema: [
      serviceSchema({
        name: `Interior Design & Fit-Out in ${c.city}`,
        description: `Turnkey residential interior design and execution for homes in ${c.city}, Delhi NCR.`,
        serviceType: 'Interior Design',
        audience: `Homeowners in ${c.city}`,
      }, `/${c.slug}/`),
      /* A dedicated LocalBusiness node per city studio boosts local relevance */
      {
        '@type': 'HomeAndConstructionBusiness',
        '@id': absoluteUrl(`/${c.slug}/#localbusiness`),
        name: `${site.legalName} — ${c.city}`,
        parentOrganization: { '@id': absoluteUrl('/#organization') },
        url: absoluteUrl(`/${c.slug}/`),
        image: absoluteUrl(`/assets/img/${c.img}-1600.jpg`),
        telephone: c.office.phone.replace(/\s/g, ''),
        email: site.email.general,
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${c.office.street}, ${c.office.area}`,
          addressLocality: c.office.city,
          addressRegion: c.office.region,
          postalCode: c.office.postalCode,
          addressCountry: 'IN',
        },
        geo: { '@type': 'GeoCoordinates', latitude: c.office.geo.lat, longitude: c.office.geo.lng },
        areaServed: c.areas.map((a) => ({ '@type': 'Place', name: `${a.name}, ${c.city}` })),
        openingHoursSpecification: [{
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00', closes: '19:30',
        }],
        ...(site.reviews.schema ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: site.reviews.rating,
            reviewCount: site.reviews.count,
            bestRating: 5, worstRating: 1,
          },
        } : {}),
      },
    ],
    body: [
      pageHead({
        crumbs: [{ label: 'Home', href: '/' }, { label: `Interior designers in ${c.city}`, href: `/${c.slug}/` }],
        title: `Interior designers<br>in ${c.city}`,
        sub: c.intro,
        image: `/assets/img/${c.img}-1600.jpg`,
        actions: [
          `<a href="${url('/contact/')}" class="btn btn-accent btn-lg">${icon('sparkles', { size: 18 })} Free ${c.city} consultation</a>`,
          `<a href="tel:${c.office.phone.replace(/\s/g, '')}" class="btn btn-glass btn-lg">${icon('phone', { size: 18 })} ${esc(c.office.phone)}</a>`,
        ],
        stats: [
          { value: c.projectCount, label: `Homes done in ${c.city}` },
          { value: 'Fastest', label: 'Handover in the industry' },
          { value: '10 yrs', label: 'Warranty' },
          site.reviews.schema
            ? { value: `${site.reviews.rating}★`, label: 'Client rating' }
            : { value: 'Local PM', label: 'Dedicated project lead' },
        ],
      }),

      /* ---- Local studio card ---- */
      `<section class="section-sm bg-subtle section-divided">
        <div class="container">
          <div class="grid grid-3 gap-6 reveal-stagger">
            <div class="contact-method">
              <span class="ico-wrap">${icon('mapPin', { size: 20 })}</span>
              <div>
                <h3>${esc(c.office.label.split('—')[1] || c.city)}</h3>
                <p>${esc(c.office.street)}, ${esc(c.office.area)}, ${esc(c.office.city)} ${esc(c.office.postalCode)}</p>
              </div>
            </div>
            <div class="contact-method">
              <span class="ico-wrap">${icon('phone', { size: 20 })}</span>
              <div>
                <h3>Speak to a ${esc(c.city)} designer</h3>
                <p><a href="tel:${c.office.phone.replace(/\s/g, '')}">${esc(c.office.phone)}</a><br>${esc(site.hours.display)}</p>
              </div>
            </div>
            <div class="contact-method">
              <span class="ico-wrap">${icon('calendar', { size: 20 })}</span>
              <div>
                <h3>Free home visit</h3>
                <p>A senior designer measures your home and discusses scope — anywhere in ${esc(c.city)}, at no cost.</p>
              </div>
            </div>
          </div>
        </div>
      </section>`,

      /* ---- Areas served ---- */
      `<section class="section">
        <div class="container">
          ${sectionHead({
            eyebrow: `${c.city} coverage`,
            title: `Where we work across ${c.city}`,
            sub: `Local project managers who already know these societies, their work-permission rules and their access constraints.`,
            center: true,
          })}
          <div class="grid grid-4 gap-4 reveal-stagger">
            ${c.areas.map((a) => `
            <div class="card card-pad-sm card-hover">
              <h3 style="font-size:var(--fs-base);font-family:var(--font-sans);font-weight:700;display:flex;align-items:center;gap:var(--s-2);margin-bottom:var(--s-2)">
                <span style="color:var(--brand-500)">${icon('mapPin', { size: 16 })}</span> ${esc(a.name)}
              </h3>
              <p style="font-size:var(--fs-sm);color:var(--text-muted);line-height:1.5">${esc(a.note)}</p>
            </div>`).join('')}
          </div>
        </div>
      </section>`,

      /* ---- What we deliver locally ---- */
      `<section class="section bg-subtle cv-auto">
        <div class="container container-narrow">
          ${sectionHead({
            eyebrow: `${c.city} homes`,
            title: `What we deliver in ${c.city}`,
            sub: c.priceNote,
            center: true,
          })}
          <div class="table-wrap reveal">
            <table class="table">
              <thead><tr><th>Home size</th><th>Typical ${esc(c.city)} property</th><th>How we approach it</th></tr></thead>
              <tbody>
                ${c.prices.map((r, i) => `<tr${i === 1 ? ' class="table-highlight"' : ''}><td><strong>${esc(r[0])}</strong></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <p class="mt-5 text-center" style="font-size:var(--fs-xs);color:var(--text-subtle)">
            ${icon('info', { size: 13 })} Every home is scoped individually after a site survey, with materials named in writing.
          </p>
          <div class="btn-group center mt-8 reveal">
            <button type="button" class="btn btn-primary btn-lg" aria-label="Open the free consultation form" data-consult-open>${icon('sparkles', { size: 18 })} Get free consultation</button>
            <a href="${waLink(`Hi Nexora, I'd like to discuss home interiors in ${c.city}.`)}" class="btn btn-outline btn-lg" target="_blank" rel="noopener">WhatsApp a designer</a>
          </div>
        </div>
      </section>`,

      /* ---- Local factors ---- */
      `<section class="section">
        <div class="container">
          <div class="split split-start">
            <div class="reveal">
              ${sectionHead({
                eyebrow: 'Local realities',
                title: `What working in ${c.city} actually involves`,
                sub: 'The operational details that decide whether a project finishes on schedule here.',
              })}
              <div class="grid gap-5">
                ${c.localFactors.map((f) => `
                <div class="feat-card">
                  <span class="ico-lead">${icon(f.icon, { size: 22 })}</span>
                  <h3>${esc(f.t)}</h3>
                  <p>${esc(f.d)}</p>
                </div>`).join('')}
              </div>
            </div>
            <div class="split-media reveal delay-1">
              <div class="sticky-side">
                ${picture({ name: c.img, alt: c.imgAlt, widths: [960, 1600], sizes: '(max-width:1024px) 100vw, 50vw', width: 960, height: 640, className: 'img-round img-shadow' })}
                <div class="card mt-6" style="border-color:var(--line-brand)">
                  <h3 class="card-title" style="font-size:var(--fs-lg)">Book a free ${esc(c.city)} site visit</h3>
                  <p class="card-text mb-5">A senior designer visits your home, measures everything, and gives you a realistic scope and budget conversation. No cost, no obligation.</p>
                  <a href="${url('/contact/')}" class="btn btn-accent btn-block">Schedule my visit</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`,

      /* ---- Process ---- */
      `<section class="section bg-subtle cv-auto">
        <div class="container">
          ${sectionHead({
            eyebrow: 'How it works',
            title: `Your ${c.city} project, step by step`,
            center: true,
          })}
          ${processRail(processSteps)}
        </div>
      </section>`,

      /* ---- Projects ---- */
      `<section class="section">
        <div class="container">
          <div class="section-head-row">
            ${sectionHead({ eyebrow: 'Delivered', title: `Recent projects in and around ${c.city}` })}
            <a href="${url('/portfolio/')}" class="btn btn-outline hide-sm">Full portfolio ${icon('arrowRight', { size: 16 })}</a>
          </div>
          <div class="folio-grid reveal-stagger">
            ${shown.slice(0, 6).map((p) => folioCard({
              ...p, image: `/assets/img/projects/${p.image.split('/').pop().replace('.jpg', '')}-800.jpg`,
            })).join('')}
          </div>
        </div>
      </section>`,

      testimonialSection(testimonials, { title: `${c.city} clients on working with us`, eyebrow: 'Reviews' }),
      faqBlock(c.faqs, { eyebrow: `${c.city} FAQs`, title: `Interior design in ${c.city} — your questions` }),
      ctaBand({
        eyebrow: `${c.city} enquiry`,
        title: `Ready to start your<br><span class="serif-italic gradient-text">${c.city} home?</span>`,
        text: `Free consultation, free 3D concept and a fixed-price BOQ in 72 hours. Our ${c.city} team handles everything from society permissions to final styling.`,
        points: [`Local ${c.city} project manager`, 'Free consultation, scope in writing', 'Documented warranty, committed handover date'],
        source: `city-${c.slug}`,
      }),
    ].join('\n'),
  };
});
