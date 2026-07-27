import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { pageHead, sectionHead, faqBlock, ctaBand } from '../layouts/sections.js';
import { packages, faqsCost, faqsGeneral } from '../data/content.js';

const compareRows = [
  ['Design & 3D visualisation', '2D layouts + 1 revision', 'Photoreal 3D + 3 revisions', 'Unlimited revisions'],
  ['Plywood grade', '710 BWR (BWP in kitchen)', '710 BWP throughout', '710 BWP + marine in wet zones'],
  ['Shutter finish', 'Laminate 1mm', 'Acrylic / PU', 'Imported veneer, lacquered glass'],
  ['Hardware', 'Branded soft-close (Ebco)', 'Hettich / Ebco premium', 'Blum / Häfele with motion'],
  ['Countertop', 'Granite', 'Quartz', 'Imported quartz / solid surface'],
  ['False ceiling', 'Peripheral, living & dining', 'Designer with cove & profile', 'Architectural, scene-controlled'],
  ['Paint', 'Tractor Emulsion or equal', 'Royale / Velvet Touch or equal', 'Specialty & textured finishes'],
  ['Wardrobe internals', 'Shelves + hanging rod', 'Drawers, pull-outs, mirror', 'Full dressing system, LED sensors'],
  ['Lighting design', 'Standard fixtures', 'Layered scheme with profiles', 'Designer scheme + automation ready'],
  ['Project manager', 'Shared PM', 'Dedicated PM', 'Senior PM + site engineer'],
  ['Site reporting', 'Fortnightly', 'Weekly photo report', 'Weekly + fortnightly walkthrough'],
  ['Styling at handover', '—', 'Basic styling', 'Full styling + loose furniture design'],
  ['Modular warranty', '10 years', '10 years', '10 years'],
];

const drivers = [
  { icon: 'maximize', t: 'Carpet area', impact: 'Highest', d: 'Everything is priced per square foot of usable area. A 20% larger home is roughly a 20% larger bill — there is no economy of scale to negotiate here.' },
  { icon: 'gem', t: 'Material grade', impact: 'Very high', d: '710 BWP vs MR-grade ply is a 30% swing on the carcass alone. Acrylic vs laminate shutters is another 40%. This is where most of the difference between quotes lives.' },
  { icon: 'wrench', t: 'Hardware brand', impact: 'High', d: 'A Hettich soft-close hinge costs roughly 4× a local one and lasts around 10× longer. On a full home this is a ₹60,000–₹1.5 lakh decision.' },
  { icon: 'layers', t: 'Scope depth', impact: 'High', d: 'Modular-only is about 62% of full-home cost. Adding civil, flooring and plumbing takes it to roughly 124%. Decide scope before comparing quotes.' },
  { icon: 'mapPin', t: 'City & society', impact: 'Moderate', d: 'Gurugram and South Delhi run 6–8% above Noida. Towers with restricted lift access and short work windows add labour hours to the same scope.' },
  { icon: 'clock', t: 'Timeline pressure', impact: 'Moderate', d: 'Fast-track builds need parallel trades and short-lead materials. Compressing a 45-day project to 30 typically adds 8–14%.' },
];

export default {
  route: '/pricing/',
  title: 'Interior Design Pricing & Packages in Delhi NCR (2026) | Nexora Spaces',
  metaTitle: 'Interior Design Cost & Packages in Delhi NCR 2026',
  description:
    'Transparent interior pricing for Delhi NCR: Essential ₹1,150, Signature ₹1,650, Luxe ₹2,400 per sq.ft. Full inclusions, exclusions and EMI options.',
  keywords: 'interior design cost delhi ncr, interior design packages gurgaon, home interior price noida, interior design rate per square feet india, 2 bhk interior cost',
  ogImage: '/assets/img/pages/pricing-1600.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Pricing', href: '/pricing/' }],
  faqs: [...faqsCost, faqsGeneral[4], faqsGeneral[5]],
  extraSchema: [
    serviceSchema({
      name: 'Interior Design Packages',
      description: 'Three transparent interior design and fit-out packages for Delhi NCR homes — Essential, Signature and Luxe.',
      serviceType: 'Interior Design',
      offers: { price: '1150', min: 1150, max: 3400 },
    }),
    {
      '@type': 'OfferCatalog',
      '@id': `${site.baseUrl}${site.basePath}/pricing/#catalog`,
      name: 'Nexora Spaces interior packages',
      itemListElement: packages.map((p, i) => ({
        '@type': 'Offer',
        position: i + 1,
        name: `${p.name} interior package`,
        description: p.for,
        priceCurrency: 'INR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: p.rate.split(' – ')[0].replace(/,/g, ''),
          priceCurrency: 'INR',
          unitText: 'per square foot of carpet area',
        },
        availability: 'https://schema.org/InStock',
      })),
    },
  ],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Pricing', href: '/pricing/' }],
      title: 'Pricing published,<br>not negotiated in a room',
      sub: 'Our rate card is on this page because you should be able to check whether we are in your range before you spend an evening in a showroom. Every figure is per square foot of carpet area, excluding GST.',
      image: '/assets/img/pages/pricing-1600.jpg',
      actions: [
        `<a href="${url('/cost-calculator/')}" class="btn btn-accent btn-lg">${icon('calculator', { size: 18 })} Calculate my cost</a>`,
        `<a href="${url('/contact/')}" class="btn btn-glass btn-lg">Get an itemised BOQ</a>`,
      ],
      stats: [
        { value: '₹1,150', label: 'Essential, per sq.ft' },
        { value: '₹1,650', label: 'Signature, per sq.ft' },
        { value: '₹2,400', label: 'Luxe, per sq.ft' },
        { value: '0', label: 'Hidden charges' },
      ],
    }),

    /* --------------------------------------------------------- Packages */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Packages',
          title: 'Three finish levels',
          sub: 'Design quality, project management and warranty are identical across all three. What changes is material grade and depth of detailing.',
          center: true,
        })}
        <div class="price-grid reveal-stagger">
          ${packages.map((p) => `
          <div class="price-card${p.popular ? ' is-popular' : ''}">
            ${p.popular ? '<span class="price-flag">7 in 10 choose this</span>' : ''}
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
            <a href="${url('/contact/')}" class="btn ${p.popular ? 'btn-accent' : 'btn-outline'} btn-block">Request ${esc(p.name)} BOQ</a>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* ------------------------------------------------------- Comparison */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Side by side',
          title: 'Exactly what changes between tiers',
          sub: 'The specification table we hand to every client. Take it to any other vendor and compare line by line — we would genuinely encourage it.',
          center: true,
        })}
        <div class="table-wrap reveal">
          <table class="table">
            <thead>
              <tr>
                <th style="min-width:200px">Specification</th>
                <th>Essential</th>
                <th style="background:var(--brand-50)">Signature</th>
                <th>Luxe</th>
              </tr>
            </thead>
            <tbody>
              ${compareRows.map((r) => `
              <tr>
                <td><strong>${esc(r[0])}</strong></td>
                <td>${esc(r[1])}</td>
                <td style="background:var(--brand-50)">${esc(r[2])}</td>
                <td>${esc(r[3])}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>`,

    /* ---------------------------------------------------------- Drivers */
    `<section class="section" id="drivers">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Cost drivers',
          title: 'What actually moves your number',
          sub: 'Six variables account for almost all the variance between a ₹9 lakh and a ₹19 lakh 2 BHK.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${drivers.map((d) => `
          <div class="card card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="card-icon" style="margin:0">${icon(d.icon, { size: 22 })}</span>
              <span class="badge ${d.impact === 'Highest' || d.impact === 'Very high' ? 'badge-red' : d.impact === 'High' ? 'badge-amber' : 'badge-teal'}">${esc(d.impact)} impact</span>
            </div>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(d.t)}</h3>
            <p class="card-text">${esc(d.d)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* --------------------------------------------------------- Payments */
    `<section class="section bg-subtle">
      <div class="container container-narrow">
        ${sectionHead({
          eyebrow: 'Payment schedule',
          title: 'When you pay, and for what',
          sub: 'Milestone-linked, never calendar-linked. We do not accept cash and we never ask for the full amount upfront.',
          center: true,
        })}
        <div class="grid grid-4 gap-4 reveal-stagger">
          ${[
            ['10%', 'Design sign-off'], ['40%', 'Material dispatch'],
            ['40%', 'Installation start'], ['10%', 'Snag closure'],
          ].map(([pct, label]) => `
          <div class="card card-pad-sm text-center card-hover">
            <span style="font-family:var(--font-display);font-size:var(--fs-3xl);font-weight:600;color:var(--brand-500);display:block;line-height:1;margin-bottom:var(--s-2)">${pct}</span>
            <span style="font-size:var(--fs-sm);font-weight:600">${esc(label)}</span>
          </div>`).join('')}
        </div>

        <div id="emi" class="mt-12">
          ${sectionHead({
            eyebrow: 'Finance',
            title: 'EMI and interior loans',
            sub: 'Through NBFC partners — we do not lend, and we do not earn a commission that would bias our advice.',
            center: true,
          })}
          <div class="grid grid-3 gap-5 reveal-stagger">
            ${[
              { icon: 'rupee', t: '₹1 L – ₹50 L', d: 'Loan amounts available against salary slips or ITR, subject to lender approval.' },
              { icon: 'calendar', t: '12 – 60 months', d: 'Tenure options, with no-cost EMI available on selected packages and periods.' },
              { icon: 'zap', t: '48 – 72 hours', d: 'Typical approval turnaround. We help with documentation but the lender decides.' },
            ].map((f) => `
            <div class="card card-hover">
              <span class="card-icon">${icon(f.icon, { size: 22 })}</span>
              <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(f.t)}</h3>
              <p class="card-text">${esc(f.d)}</p>
            </div>`).join('')}
          </div>
          <div class="alert alert-info mt-8 reveal">
            ${icon('info', { size: 20 })}
            <p><span class="alert-title">We will show you the total interest outgo in writing.</span>
            A "no-cost EMI" is usually a discount absorbed into the price. We will tell you what the same project costs
            paid outright versus financed, so you can make the decision with the real numbers.</p>
          </div>
        </div>
      </div>
    </section>`,

    /* -------------------------------------------------------- Extra costs */
    `<section class="section">
      <div class="container container-narrow">
        ${sectionHead({
          eyebrow: 'Full transparency',
          title: 'Costs that are not in our quote',
          sub: 'Four things every NCR homeowner should budget for, that most vendors conveniently forget to mention.',
          center: true,
        })}
        <div class="spec-list card card-pad-lg reveal">
          <div class="spec-row"><span class="spec-key">GST @ 18%</span><span class="spec-val">Applied on the full interior contract value. Shown separately on every invoice — never bundled into the rate to make it look lower.</span></div>
          <div class="spec-row"><span class="spec-key">Society charges</span><span class="spec-val">₹5,000 – ₹25,000 for work permission, refundable deposit, lift usage and debris disposal. Paid to your RWA, varies by society.</span></div>
          <div class="spec-row"><span class="spec-key">Loose furniture & appliances</span><span class="spec-val">Typically 10–15% of the interior budget. Sofas, dining sets, mattresses, appliances and curtains beyond the package inclusion.</span></div>
          <div class="spec-row"><span class="spec-key">Temporary accommodation</span><span class="spec-val">Only if you cannot live on site during civil work. Applies mainly to gut renovations, typically 3–5 weeks.</span></div>
        </div>
        <div class="btn-group center mt-10 reveal">
          <a href="${url('/cost-calculator/')}" class="btn btn-primary btn-lg">${icon('calculator', { size: 18 })} Estimate my total</a>
          <a href="${waLink('Hi Nexora, I would like an itemised BOQ for my home.')}" class="btn btn-outline btn-lg" target="_blank" rel="noopener">Request a BOQ</a>
        </div>
      </div>
    </section>`,

    faqBlock([...faqsCost, faqsGeneral[4], faqsGeneral[5]], { eyebrow: 'Pricing FAQs', title: 'Money questions, answered directly' }),
    ctaBand({ source: 'pricing' }),
  ].join('\n'),
};
