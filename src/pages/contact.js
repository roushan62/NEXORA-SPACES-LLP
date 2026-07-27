import { site, waLink, hq } from '../config/site.config.js';
import { icon, iconSolid } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { pageHead, sectionHead, faqBlock, leadForm } from '../layouts/sections.js';

const contactFaqs = [
  { q: 'What happens after I submit this form?', a: '<p>A senior designer — not a call-centre agent — calls you within <strong>2 working hours</strong>. That call is a scoping conversation: what you want done, your rough budget and your possession date. If we are not the right fit, we will say so on that call rather than book a visit anyway.</p>' },
  { q: 'Is the consultation and 3D design really free?', a: '<p>Yes, and there is no catch. The site visit, the concept discussion, the 3D views and the itemised BOQ cost you nothing and carry no obligation. You keep the BOQ whether you hire us or not — several clients have used it to negotiate with other vendors, and that is fine.</p>' },
  { q: 'Can I visit a studio instead?', a: `<p>Please do. Our Gurugram head office has a full material library — hardware cutaways, shutter finish panels, counter samples — which is far more useful than a screen. Walk-ins are welcome ${esc(site.hours.display)}, though calling ahead means a designer is free when you arrive.</p>` },
  { q: 'Do you charge for a site visit outside NCR?', a: '<p>Within Delhi NCR — Gurugram, Noida, Greater Noida, Delhi, Ghaziabad, Faridabad — site visits are free. Outside NCR we charge a travel-cost visit fee, which is fully adjusted against your project value if you proceed.</p>' },
  { q: 'How quickly can you start?', a: '<p>Design typically starts within 3–5 days of the site survey. Site work begins after design sign-off, BOQ approval and society permission — usually 2–3 weeks from first contact. If you have a hard possession or move-in date, tell us on the first call and we will tell you honestly whether it is achievable.</p>' },
];

const mapUrl = (o) =>
  `https://www.google.com/maps?q=${encodeURIComponent(o.mapQuery)}&output=embed`;

export default {
  route: '/contact/',
  title: 'Contact Nexora Spaces — Interior Designers in Gurugram, Noida & Delhi',
  metaTitle: 'Contact Us | Interior Designers in Delhi NCR | Nexora',
  description:
    `Book a free interior design consultation in Delhi, Gurugram or Noida. Call ${site.phone.display} or visit one of our three NCR studios.`,
  keywords: 'contact interior designer delhi ncr, interior design consultation gurgaon, interior designer near me noida, book interior design consultation',
  ogImage: '/assets/img/pages/contact-1600.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }],
  faqs: contactFaqs,
  extraSchema: [{
    '@type': 'ContactPage',
    '@id': `${site.baseUrl}${site.basePath}/contact/#contactpage`,
    mainEntity: { '@id': `${site.baseUrl}${site.basePath}/#organization` },
  }],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }],
      title: 'Talk to a designer,<br>not a call centre',
      sub: 'Every enquiry goes to a senior designer who can actually answer scope, cost and timeline questions on the first call. Response within 2 working hours, Monday to Saturday.',
      image: '/assets/img/pages/contact-1600.jpg',
    }),

    /* --------------------------------------------------- Form + methods */
    `<section class="section">
      <div class="container">
        <div class="contact-grid">
          <div class="reveal">
            ${sectionHead({
              eyebrow: 'Get in touch',
              title: 'Three ways to reach us',
              sub: 'Pick whichever suits you. All three land with the same team.',
            })}

            <div class="grid gap-4 mb-10">
              <a href="tel:${site.phone.tel}" class="contact-method">
                <span class="ico-wrap">${icon('phone', { size: 20 })}</span>
                <div>
                  <h3>Call us</h3>
                  <p><strong style="color:var(--accent-text);font-size:var(--fs-base)">${esc(site.phone.display)}</strong><br>${esc(site.hours.display)} · ${esc(site.hours.sundayNote)}</p>
                </div>
              </a>
              <a href="${waLink()}" class="contact-method" target="_blank" rel="noopener">
                <span class="ico-wrap" style="background:#e8f8ee;color:#1faa54">${iconSolid('whatsapp', { size: 20 })}</span>
                <div>
                  <h3>WhatsApp a designer</h3>
                  <p>Fastest option. Send your floor plan and get an indicative estimate back the same day.</p>
                </div>
              </a>
              <a href="mailto:${site.email.general}" class="contact-method">
                <span class="ico-wrap">${icon('mail', { size: 20 })}</span>
                <div>
                  <h3>Email us</h3>
                  <p><strong style="color:var(--accent-text)">${esc(site.email.general)}</strong><br>For commercial enquiries: ${esc(site.email.sales)}</p>
                </div>
              </a>
            </div>

            <div class="card" style="border-color:var(--line-brand);background:var(--brand-50)">
              <h3 class="card-title" style="font-size:var(--fs-lg)">${icon('sparkles', { size: 18 })} What the free consultation includes</h3>
              <ul class="check-list">
                <li>${icon('check', { size: 18 })} Site visit and full measurement by a senior designer</li>
                <li>${icon('check', { size: 18 })} Honest budget conversation before any design work</li>
                <li>${icon('check', { size: 18 })} Photoreal 3D concept of your actual layout</li>
                <li>${icon('check', { size: 18 })} Line-by-line BOQ with brand names — yours to keep</li>
                <li>${icon('check', { size: 18 })} Realistic timeline against your possession date</li>
              </ul>
            </div>
          </div>

          <div class="reveal delay-1">
            <div class="card card-pad-lg sticky-side" style="box-shadow:var(--sh-xl)">
              ${leadForm({
                id: 'mainContactForm',
                heading: 'Book your free consultation',
                sub: 'A senior designer calls you within 2 working hours. No obligation.',
                source: 'contact-page',
              })}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    /* ------------------------------------------------------------ Studios */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Visit us',
          title: 'Three studios across NCR',
          sub: 'Material libraries, hardware cutaways and finish samples — worth an hour of your time before you commit to anything.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${site.offices.map((o) => `
          <div class="studio-card">
            <span class="studio-badge">${o.isHq ? 'Head office & experience centre' : o.label.split('—')[1] || 'Studio'}</span>
            <h3>${esc(o.city)}</h3>
            <p class="studio-addr">
              ${esc(o.street)}<br>
              ${esc(o.area)}<br>
              ${esc(o.city)}, ${esc(o.region)} ${esc(o.postalCode)}
            </p>
            <div class="studio-links">
              <a href="tel:${o.phone.replace(/\s/g, '')}">${icon('phone', { size: 15 })} ${esc(o.phone)}</a>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery)}" target="_blank" rel="noopener">
                ${icon('mapPin', { size: 15 })} Get directions
              </a>
              <span style="display:flex;align-items:center;gap:var(--s-2);color:var(--text-muted)">
                ${icon('clock', { size: 15 })} ${esc(site.hours.display)}
              </span>
            </div>
          </div>`).join('')}
        </div>

        <div class="map-facade mt-10 reveal" data-embed="${mapUrl(hq)}" data-embed-title="Map showing Nexora Spaces head office in ${esc(hq.city)}"
             role="button" tabindex="0" aria-label="Load interactive map of our ${esc(hq.city)} office">
          <div class="map-cta">
            <span class="pin">${icon('mapPin', { size: 26 })}</span>
            <strong style="font-size:var(--fs-lg)">${esc(hq.city)} head office</strong>
            <span style="font-size:var(--fs-sm);color:var(--text-muted)">${esc(hq.street)}, ${esc(hq.area)}</span>
            <span class="btn btn-primary btn-sm mt-3">${icon('play', { size: 14 })} Load interactive map</span>
            <span style="font-size:var(--fs-xs);color:var(--text-subtle);margin-top:var(--s-2)">
              Map loads on click to keep this page fast
            </span>
          </div>
        </div>
      </div>
    </section>`,

    /* ------------------------------------------------------- Service area */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Coverage',
          title: 'Where we take projects',
          sub: 'Free site visits anywhere in Delhi NCR. Outside NCR, a travel-cost visit fee applies and is adjusted against your project.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${[
            { city: 'Gurugram', href: '/interior-designers-in-gurgaon/', areas: 'DLF Phase 1–5 · Golf Course Road & Extension · Sohna Road · Sectors 47–115 · New Gurgaon · MG Road · Sushant Lok' },
            { city: 'Noida & Greater Noida', href: '/interior-designers-in-noida/', areas: 'Sector 150 · Noida Expressway · Sectors 74–137 · Greater Noida West · Pari Chowk · Indirapuram · Vaishali' },
            { city: 'Delhi', href: '/interior-designers-in-delhi/', areas: 'Greater Kailash · Saket · Vasant Kunj · Dwarka · Rohini · Punjabi Bagh · Defence Colony · Mayur Vihar' },
          ].map((c) => `
          <a href="${url(c.href)}" class="card card-hover">
            <span class="card-icon">${icon('mapPin', { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(c.city)}</h3>
            <p class="card-text mb-5">${esc(c.areas)}</p>
            <span class="link-arrow">View ${esc(c.city)} page ${icon('arrowRight', { size: 15 })}</span>
          </a>`).join('')}
        </div>
        <p class="text-center mt-8" style="color:var(--text-muted);font-size:var(--fs-sm)">
          Also serving Faridabad, Ghaziabad and Sonipat. Commercial rollouts undertaken pan-North India.
        </p>
      </div>
    </section>`,

    faqBlock(contactFaqs, { eyebrow: 'Before you call', title: 'What to expect when you reach out' }),
  ].join('\n'),
};
