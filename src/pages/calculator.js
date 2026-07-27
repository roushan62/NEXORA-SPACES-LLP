import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { pageHead, sectionHead, faqBlock, ctaBand } from '../layouts/sections.js';
import { faqsCost } from '../data/content.js';

const calcFaqs = [
  {
    q: 'How accurate is this calculator?',
    a: '<p>It is built from our own 2026 rate card and the last 200 projects we delivered in NCR, so it lands within roughly <strong>±12%</strong> of a final BOQ for a standard apartment. It cannot account for structural surprises, unusual layouts, imported material selections or heavy civil work — those need a site visit.</p><p>Treat it as a planning number that tells you which package tier is realistic, not as a quotation.</p>',
  },
  {
    q: 'Does the estimate include GST?',
    a: '<p>No. All figures are pre-tax. Interior work attracts <strong>18% GST</strong>, so add that to whatever the calculator shows. We keep tax separate deliberately — bundling it in makes rate comparison between vendors misleading.</p>',
  },
  {
    q: 'What is not covered in this estimate?',
    a: '<p>Loose furniture and appliances, curtains and soft furnishing beyond the package inclusion, society work-permission charges, temporary accommodation, and any structural or facade work requiring approvals. Budget roughly <strong>10–15% extra</strong> for loose items.</p>',
  },
  {
    q: 'Why does the same home cost more in Gurugram than Noida?',
    a: '<p>Labour rates, material logistics and society access restrictions. Gurugram and South Delhi typically run <strong>6–8% higher</strong> than Noida and Greater Noida for identical scope and material. The calculator applies these city factors automatically.</p>',
  },
  ...faqsCost,
];

export default {
  route: '/cost-calculator/',
  title: 'Interior Design Cost Calculator — Delhi, Gurgaon & Noida | Nexora Spaces',
  metaTitle: 'Interior Cost Calculator for Delhi NCR 2026 | Nexora',
  description:
    'Free interior cost calculator for Delhi, Gurgaon and Noida. Instant estimate by carpet area, city and package, with a head-wise breakdown.',
  keywords: 'interior design cost calculator, home interior cost calculator india, interior cost estimate delhi ncr, modular kitchen cost calculator, 2 bhk interior cost calculator',
  ogImage: '/assets/img/pages/pricing-1600.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Cost calculator', href: '/cost-calculator/' }],
  faqs: calcFaqs,
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Cost calculator', href: '/cost-calculator/' }],
      title: 'Interior cost calculator<br>for Delhi NCR',
      sub: 'Built from our real 2026 rate card and the last 200 projects we delivered. No email gate, no "submit to see your price" — the number appears as you type.',
      image: '/assets/img/pages/pricing-1600.jpg',
      light: false,
    }),

    /* ------------------------------------------------------- Calculator */
    `<section class="section">
      <div class="container">
        <form class="calc-shell" id="calcForm" novalidate>
          <!-- ---------------- Inputs ---------------- -->
          <div class="calc-panel reveal">

            <div class="calc-group">
              <p class="calc-group-title"><span class="step">1</span> Where is your home?</p>
              <div class="field" style="margin-bottom:0">
                <label class="field-label sr-only" for="calcCity">City</label>
                <select class="field-select" id="calcCity" name="city">
                  <option value="gurugram">Gurugram</option>
                  <option value="south-delhi">South Delhi</option>
                  <option value="delhi">Delhi (other)</option>
                  <option value="noida" selected>Noida</option>
                  <option value="greater-noida">Greater Noida</option>
                  <option value="ghaziabad">Ghaziabad / Indirapuram</option>
                  <option value="faridabad">Faridabad</option>
                  <option value="other">Other NCR</option>
                </select>
              </div>
            </div>

            <div class="calc-group">
              <p class="calc-group-title"><span class="step">2</span> What are we designing?</p>
              <div class="field-row" style="margin-bottom:var(--s-5)">
                <div class="field" style="margin-bottom:0">
                  <label class="field-label" for="calcConfig">Home configuration</label>
                  <select class="field-select" id="calcConfig" name="config">
                    <option value="1bhk">1 BHK</option>
                    <option value="2bhk" selected>2 BHK</option>
                    <option value="3bhk">3 BHK</option>
                    <option value="4bhk">4 BHK</option>
                    <option value="villa">Villa / Penthouse</option>
                  </select>
                </div>
                <div class="field" style="margin-bottom:0">
                  <label class="field-label" for="calcScopeSel">Scope of work</label>
                  <div class="chip-group" id="calcScopeSel" style="gap:var(--s-2)">
                    <label class="chip"><input type="radio" name="calcScope" value="modular"> Modular only</label>
                    <label class="chip"><input type="radio" name="calcScope" value="full" checked> Full home</label>
                    <label class="chip"><input type="radio" name="calcScope" value="turnkey"> Turnkey + civil</label>
                  </div>
                </div>
              </div>

              <div class="field" style="margin-bottom:0">
                <div class="range-head">
                  <label class="field-label" for="calcArea">Carpet area</label>
                  <span class="range-val" id="calcAreaOut">780 sq.ft</span>
                </div>
                <input type="range" class="range" id="calcArea" name="area" min="250" max="4000" step="10" value="780">
                <div class="range-scale"><span>250 sq.ft</span><span>2,000</span><span>4,000 sq.ft</span></div>
                <p class="field-hint mt-3">${icon('info', { size: 12 })} Carpet area is the usable floor area inside your walls — typically 70–80% of the super built-up area on your builder agreement.</p>
              </div>
            </div>

            <div class="calc-group">
              <p class="calc-group-title"><span class="step">3</span> What finish level?</p>
              <div class="pkg-picker">
                <label class="pkg-opt">
                  <input type="radio" name="calcPkg" value="essential">
                  <span class="pkg-radio"></span>
                  <span style="flex:1">
                    <span class="pkg-opt-name">Essential</span>
                    <span class="pkg-opt-desc">Laminate finishes, quality basics, everything functional and durable.</span>
                  </span>
                  <span class="pkg-opt-rate">₹1,150–1,450</span>
                </label>
                <label class="pkg-opt">
                  <input type="radio" name="calcPkg" value="signature" checked>
                  <span class="pkg-radio"></span>
                  <span style="flex:1">
                    <span class="pkg-opt-name">Signature <span class="badge badge-accent badge-caps">Most chosen</span></span>
                    <span class="pkg-opt-desc">Acrylic or PU shutters, premium hardware, designer ceiling and lighting.</span>
                  </span>
                  <span class="pkg-opt-rate">₹1,650–2,100</span>
                </label>
                <label class="pkg-opt">
                  <input type="radio" name="calcPkg" value="luxe">
                  <span class="pkg-radio"></span>
                  <span style="flex:1">
                    <span class="pkg-opt-name">Luxe</span>
                    <span class="pkg-opt-desc">Imported veneers, natural stone, Blum hardware, bespoke detailing.</span>
                  </span>
                  <span class="pkg-opt-rate">₹2,400–3,400</span>
                </label>
              </div>
            </div>
          </div>

          <!-- ---------------- Result ---------------- -->
          <aside class="calc-result reveal delay-1">
            <span class="calc-result-label">${icon('sparkles', { size: 13 })} Your estimated budget</span>
            <p class="calc-amount"><span id="calcMin">₹12.90 L</span><span class="dash">–</span><span id="calcMax">₹16.40 L</span></p>
            <p class="calc-rate" id="calcRate">₹1,650 – ₹2,100 / sq.ft</p>

            <div class="calc-divider"></div>

            <span class="calc-result-label">Where the money goes</span>
            <div id="calcRows"></div>

            <div class="calc-emi">
              <span>Indicative EMI · 18 months</span>
              <b id="calcEmi">₹81,000</b>
            </div>

            <a href="${waLink()}" data-wa="https://wa.me/${site.phone.whatsapp}?text=" id="calcWa"
               class="btn btn-accent btn-block btn-lg" target="_blank" rel="noopener">
              ${icon('send', { size: 18 })} Send this to a designer
            </a>
            <a href="${url('/contact/')}" class="btn btn-glass btn-block mt-3">Book a free consultation</a>

            <p class="calc-disclaimer">
              ${icon('info', { size: 12 })} Indicative estimate excluding 18% GST, society charges, loose furniture and appliances.
              Accurate to roughly ±12% for standard apartments. Your final BOQ is prepared after a site survey.
            </p>
          </aside>
        </form>
      </div>
    </section>`,

    /* --------------------------------------------------- How we price */
    `<section class="section bg-subtle">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Behind the number',
          title: 'What actually moves your budget',
          sub: 'Five variables account for almost all the difference between a ₹9 lakh and a ₹19 lakh 2 BHK.',
          center: true,
        })}
        <div class="grid grid-auto gap-6 reveal-stagger">
          ${[
            { icon: 'maximize', t: 'Carpet area', d: 'The single biggest driver. Everything is priced per square foot of usable area, so a 20% larger home is roughly a 20% larger bill.' },
            { icon: 'gem', t: 'Material grade', d: '710 BWP ply vs MR-grade, acrylic vs laminate, quartz vs granite. Material choice alone can swing a project by 40%.' },
            { icon: 'wrench', t: 'Hardware brand', d: 'Hettich and Blum cost 3–4× local hardware and last far longer. This is the line item where cutting costs hurts soonest.' },
            { icon: 'layers', t: 'Scope depth', d: 'Modular-only is roughly 62% of a full-home cost. Adding civil, flooring and plumbing pushes it to about 124%.' },
            { icon: 'mapPin', t: 'City & society', d: 'Gurugram and South Delhi run 6–8% above Noida. High-rise societies with restricted material-movement windows add labour hours.' },
          ].map((x) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(x.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-base)">${esc(x.t)}</h3>
            <p class="card-text" style="font-size:var(--fs-sm)">${esc(x.d)}</p>
          </div>`).join('')}
        </div>

        <div class="alert alert-warn mt-10 reveal">
          ${icon('alertCircle', { size: 20 })}
          <p><span class="alert-title">Always add these four to your total</span>
          <strong>18% GST</strong> on the interior contract · <strong>₹5,000–₹25,000</strong> society work permission and lift charges ·
          <strong>10–15%</strong> for loose furniture and appliances · temporary accommodation if you cannot live on site during civil work.</p>
        </div>
      </div>
    </section>`,

    faqBlock(calcFaqs, { eyebrow: 'Calculator FAQs', title: 'Understanding your estimate' }),
    ctaBand({
      eyebrow: 'Next step',
      title: 'Turn the estimate into<br><span class="serif-italic gradient-text">a real quotation</span>',
      text: 'Share your floor plan and possession date. You get a photoreal 3D concept and a line-by-line BOQ within 72 hours — free, and yours to keep whether you hire us or not.',
      points: ['Free 3D design of your actual layout', 'Line-by-line BOQ with brand names', 'No obligation, no follow-up pressure'],
      source: 'calculator',
    }),
  ].join('\n'),
};
