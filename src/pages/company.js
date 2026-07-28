import { site, waLink, yearsInBusiness, currentYear } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import {
  pageHead, sectionHead, faqBlock, ctaBand, testimonialSection,
  processRail, credentialStrip,
} from '../layouts/sections.js';
import { processSteps, testimonials, faqsGeneral } from '../data/content.js';
import { statsWide, credentials } from '../data/stats.js';

/* ============================================================== ABOUT */
const about = {
  route: '/about/',
  title: 'About Nexora Spaces LLP | Residential Interior Fit-Out, Delhi NCR',
  metaTitle: 'About Us | Residential Interior Fit-Out | Nexora',
  description:
    `Residential interior fit-out and design-build studio serving Delhi, Gurugram and Noida since ${site.foundedYear}. In-house design, own production, 850+ homes delivered.`,
  keywords: 'about nexora spaces, residential interior company delhi ncr, home interior firm gurgaon, house interior designers noida',
  ogImage: '/assets/img/pages/about-1600.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }],
  extraSchema: [{
    '@type': 'AboutPage',
    '@id': `${site.baseUrl}${site.basePath}/about/#aboutpage`,
    mainEntity: { '@id': `${site.baseUrl}${site.basePath}/#organization` },
  }],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }],
      title: 'We build homes,<br>and only homes',
      sub: `Nexora Spaces LLP is a residential interior fit-out and design-build studio. Built in ${site.foundedYear} around a simple operating belief: good design only matters when execution protects it. ${yearsInBusiness} years and 850 homes later, that is still the whole thesis.`,
      image: '/assets/img/pages/about-1600.jpg',
      stats: [
        { value: '850+', label: 'Homes delivered' },
        { value: '62', label: 'In-house team' },
        { value: `${yearsInBusiness}+ yrs`, label: 'Building homes' },
        { value: '96%', label: 'On-time handover' },
      ],
    }),

    /* Story */
    `<section class="section">
      <div class="container">
        <div class="split split-start">
          <div class="reveal">
            ${sectionHead({ eyebrow: 'Our story', title: 'Design was never the problem' })}
            <div class="prose">
              <p>Every interior firm in Delhi NCR can produce a good-looking render. What almost nobody could do consistently — in ${site.foundedYear}, and honestly still today — was <strong>deliver that render on time, with materials that match the specification.</strong></p>
              <p>Our founding team had spent years on the other side of that gap: good schemes value-engineered into something unrecognisable, and families being told why the handover date had moved for the third time.</p>
              <p>So Nexora was built backwards from the failure points. We brought design in-house so nobody was working on commission. We set up our own production unit so modular quality was controlled before it reached site. We wrote the warranty and the handover date into the contract, because a promise that is not documented is just marketing.</p>
              <p>And we stayed residential. No offices, no retail, no restaurants — because a studio that does everything is optimised for nothing. Every process we run is tuned for families living in, or moving into, a home.</p>
              <p>It is not a romantic origin story. It is an operations one — and it is why our on-time handover rate is 96% rather than the industry's rather more forgiving average.</p>
            </div>
            <div class="btn-group mt-8">
              <a href="${url('/process/')}" class="btn btn-primary">See how we work</a>
              <a href="${url('/gallery/')}" class="btn btn-ghost">View our work</a>
            </div>
          </div>
          <div class="split-media reveal delay-1" data-parallax="0.05">
            <div class="img-offset">
              ${picture({ name: 'pages/about', alt: 'Interior design studio workspace with material samples and floor plans', widths: [960, 1600], sizes: '(max-width:1024px) 100vw, 50vw', width: 960, height: 640, className: 'img-round img-shadow' })}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    /* Numbers */
    `<section class="section-sm bg-subtle section-divided">
      <div class="container">
        <div class="stat-strip reveal-stagger">
          ${statsWide.map((s) => `
          <div class="stat-item">
            <span class="stat-value"><span data-count="${s.value}"${s.decimals ? ` data-decimals="${s.decimals}"` : ''}>0</span>${esc(s.suffix || '')}</span>
            <span class="stat-label">${esc(s.label)}</span>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* Principles */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'How we operate',
          title: 'Five commitments we will not negotiate',
          sub: 'These are not values on a wall. Each one is a documented operating rule with a consequence attached.',
          center: true,
        })}
        <div class="grid grid-auto gap-6 reveal-stagger">
          ${[
            { icon: 'receipt', t: 'Quote the truth, not the win', d: 'We would rather lose a project than under-quote it and manage the shortfall through variations later. If your budget does not match your brief, we say so in the first meeting.' },
            { icon: 'fileText', t: 'Everything in writing', d: 'Scope, brand names, quantities, dates and payment triggers are documented. No verbal approvals, no "we discussed this on site".' },
            { icon: 'clock', t: 'The date is a commitment', d: 'The handover date goes in the contract. If we miss it for reasons within our control, there is a defined consequence — not an apology.' },
            { icon: 'eye', t: 'Visible progress', d: 'Weekly photo reports whether you ask or not. Clients managing projects from another city should never have to chase for information.' },
            { icon: 'heart', t: 'Answer after handover', d: 'The warranty desk is staffed, and the number still works in year eight. A lot of firms disappear after final payment; that is precisely when trust is actually tested.' },
          ].map((v) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(v.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(v.t)}</h3>
            <p class="card-text">${esc(v.d)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* What we do — company level, deliberately no individual photos or names */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'What we do',
          title: 'Six teams, one accountable studio',
          sub: 'We describe Nexora at company level rather than parading headshots. What matters to your home is which team owns which stage — and that every one of them works to the same documented scope.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${[
            { icon: 'ruler', t: 'Design studio', d: 'Space planning, layout options, finish palettes, detailed views and execution drawings — settled before anything reaches site.' },
            { icon: 'userCheck', t: 'Project management', d: 'One named project manager per home holding the schedule, the budget of coordination and the weekly photo report.' },
            { icon: 'hardHat', t: 'Production unit', d: 'Modular carcasses and shutters cut, edge-banded and finished in a controlled unit, then quality-checked before dispatch.' },
            { icon: 'wrench', t: 'Site execution', d: 'Civil, electrical, ceiling, painting and installation by insured engineers and verified trade partners, dust-sealed daily.' },
            { icon: 'badgeCheck', t: 'Quality & procurement', d: 'Materials bought against the written BOQ and verified on site — brand, model and finish — before they are used.' },
            { icon: 'shieldCheck', t: 'Warranty & care', d: 'Snag closure, hardware realignment and post-handover support — the desk that still answers in year eight.' },
          ].map((v) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(v.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(v.t)}</h3>
            <p class="card-text">${esc(v.d)}</p>
          </div>`).join('')}
        </div>
        <p class="text-center mt-10" style="font-size:var(--fs-sm);color:var(--text-muted)">
          Designers, project managers, production staff and site execution partners — all working to the same documented scope and handover process.
          <a href="${url('/team/')}" class="link-underline" style="color:var(--accent-text);font-weight:600">Explore the six teams</a> that build every home, or
          <a href="${url('/careers/')}" class="link-underline" style="color:var(--accent-text);font-weight:600">join the studio</a> — we are hiring.
        </p>
      </div>
    </section>`,

    /* Mission & vision */
    `<section class="section">
      <div class="container container-narrow">
        ${sectionHead({ eyebrow: 'Mission & vision', title: 'What we are trying to build', center: true })}
        <div class="grid grid-2 gap-6 reveal-stagger">
          <div class="card card-pad-lg">
            <span class="card-icon">${icon('compass', { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">Our mission</h3>
            <p class="card-text">To make a beautifully finished home an achievable, predictable purchase for ordinary families — delivered faster than the industry manages, at a value-driven investment, without ever compromising the finish.</p>
          </div>
          <div class="card card-pad-lg">
            <span class="card-icon">${icon('sparkles', { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">Our vision</h3>
            <p class="card-text">To be the residential studio Delhi NCR recommends by default — known not for the loudest marketing, but for homes that still look and work exactly as promised a decade after handover.</p>
          </div>
        </div>
      </div>
    </section>`,

    /* Credentials */
    `<section class="section">
      <div class="container">
        ${sectionHead({ eyebrow: 'Credentials', title: 'Registrations and standards', center: true })}
        ${credentialStrip(credentials)}
        <div class="mt-10 reveal">
          <div class="spec-list card card-pad-lg">
            <div class="spec-row"><span class="spec-key">Legal entity</span><span class="spec-val">${esc(site.legalName)} — Limited Liability Partnership</span></div>
            <div class="spec-row"><span class="spec-key">LLPIN</span><span class="spec-val">${esc(site.legal.llpin)}</span></div>
            <div class="spec-row"><span class="spec-key">GSTIN</span><span class="spec-val">${esc(site.legal.gstin)}</span></div>
            <div class="spec-row"><span class="spec-key">MSME / Udyam</span><span class="spec-val">${esc(site.legal.msme)}</span></div>
            <div class="spec-row"><span class="spec-key">Registered office</span><span class="spec-val">${esc(site.legal.registeredAddress)}</span></div>
            <div class="spec-row"><span class="spec-key">Incorporated</span><span class="spec-val">${site.foundedYear}</span></div>
            <div class="spec-row"><span class="spec-key">Operating studios</span><span class="spec-val">Gurugram (HQ) · Noida · South Delhi</span></div>
          </div>
        </div>
      </div>
    </section>`,

    testimonialSection(testimonials, { title: 'Families who trusted us early', eyebrow: 'Client stories' }),
    ctaBand({ source: 'about' }),
  ].join('\n'),
};

/* ============================================================ PROCESS */
const processPage = {
  route: '/process/',
  title: 'Our Interior Design Process — 7 Stages from Brief to Handover | Nexora Spaces',
  metaTitle: 'Our Process | Interiors Delivered in 45 Days | Nexora',
  description:
    'The seven-stage system behind every home — consultation, design, written scope, production, execution and snag-free handover on a committed date.',
  keywords: 'interior design process, how interior design works, interior project timeline, turnkey interior process india',
  ogImage: '/assets/img/pages/process-1600.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Process', href: '/process/' }],
  faqs: faqsGeneral.slice(1, 6),
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Process', href: '/process/' }],
      title: 'How a Nexora home<br>gets built',
      sub: 'The same seven stages run on every home, whether it is a compact 1 BHK or a multi-level villa. Documented, tracked, and reported to you weekly.',
      image: '/assets/img/pages/process-1600.jpg',
      stats: [
        { value: '7', label: 'Documented stages' },
        { value: 'Fastest', label: 'Handover in the industry' },
        { value: '96%', label: 'On-time rate' },
        { value: 'Weekly', label: 'Photo reporting' },
      ],
    }),

    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Overview',
          title: 'The seven stages',
          sub: 'Timelines shown are for a typical 2–3 BHK. Villas and gut renovations run longer, and we give you a project-specific programme before you sign.',
          center: true,
        })}
        ${processRail(processSteps)}
      </div>
    </section>`,

    `<section class="section bg-subtle cv-auto">
      <div class="container container-narrow">
        ${sectionHead({
          eyebrow: 'In detail',
          title: 'What actually happens in each stage',
          center: true,
        })}
        <div class="timeline reveal">
          ${[
            { t: 'Consultation & site survey', time: 'Day 1–3', d: 'A senior designer — not a salesperson — visits your home. We measure every wall, photograph existing services, check structural constraints, and talk through how your family actually uses space. You get an honest budget conversation at this meeting, before anyone is invested.' },
            { t: 'Concept & 3D design', time: 'Day 4–10', d: 'Mood boards establish direction, then we develop layouts and produce photoreal 3D views of every room. Revision rounds are agreed upfront and written into your scope. Material samples come to your home so you decide on physical finishes, not screen colours.' },
            { t: 'Itemised BOQ & contract', time: 'Day 11–14', d: 'Every line item priced with brand and specification named. You can take this document to any other vendor and compare like for like — we encourage it. Contract locks scope, price, payment milestones and the handover date.' },
            { t: 'Production in our facility', time: 'Day 15–32', d: 'Modular units are CNC-cut from 710-grade ply, edge-banded at 2mm, and finished in a controlled environment. Hardware is fitted and quality-checked before dispatch. Nothing is assembled with dust blowing across your living room floor.' },
            { t: 'Site execution', time: 'Day 20–40', d: 'Civil, plumbing, electrical, false ceiling and painting run to a sequenced programme with daily supervision. Overlapping with production is how we compress the timeline. You get weekly photo reports and a named PM on WhatsApp.' },
            { t: 'Installation & styling', time: 'Day 41–45', d: 'Factory-finished modular units are installed, lighting is commissioned and scene-set, and our stylist dresses the home — cushions, art placement, plants — for your first walkthrough. Deep cleaning included.' },
            { t: 'Snag, handover & warranty', time: 'Day 45+', d: 'You walk through and list everything you are not happy with. We close every item before the final 10% is released. Then you get warranty documents, material care guides, as-built drawings and a direct line to the post-handover desk.' },
          ].map((s) => `
          <div class="tl-item">
            <span class="tl-year">${esc(s.time)}</span>
            <h3>${esc(s.t)}</h3>
            <p>${esc(s.d)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Payments',
          title: 'When money changes hands',
          sub: 'Tied to milestones, never to the calendar. We never ask for the full amount before work begins.',
          center: true,
        })}
        <div class="grid grid-4 gap-5 reveal-stagger">
          ${[
            { pct: '10%', t: 'Design sign-off', d: 'After you approve the 3D design and BOQ. This covers design development and locks your production slot.' },
            { pct: '40%', t: 'Material dispatch', d: 'When modular units enter production and site materials are procured. Invoiced against a dispatch list.' },
            { pct: '40%', t: 'Installation start', d: 'When units arrive at site and installation begins. You can see exactly what you are paying for.' },
            { pct: '10%', t: 'Snag closure', d: 'Released only after every item on your snag list is closed and you sign the handover document.' },
          ].map((p) => `
          <div class="card card-hover text-center">
            <span class="big-num" style="font-size:var(--fs-4xl);color:var(--brand-400);display:block;margin-bottom:var(--s-4)">${esc(p.pct)}</span>
            <h3 class="card-title" style="font-size:var(--fs-base)">${esc(p.t)}</h3>
            <p class="card-text" style="font-size:var(--fs-sm)">${esc(p.d)}</p>
          </div>`).join('')}
        </div>
        <div class="alert alert-brand mt-8 reveal">
          ${icon('shieldCheck', { size: 20 })}
          <p><span class="alert-title">Every payment is invoiced with GST.</span>
          We do not accept cash, and we do not ask for advances outside this schedule.
          If any interior firm asks for the full amount upfront, treat it as a serious warning sign.</p>
        </div>
      </div>
    </section>`,

    `<section class="section bg-subtle">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Honest comparison',
          title: 'Turnkey vs managing it yourself',
          sub: 'There are situations where hiring vendors directly is genuinely the better call. Here is how to tell.',
          center: true,
        })}
        <div class="vs-grid reveal">
          <div class="vs-card bad">
            <h3>${icon('users', { size: 22 })} Managing vendors yourself</h3>
            <ul class="check-list">
              <li>${icon('x', { size: 18 })} You coordinate carpenter, electrician, painter, plumber and tiler</li>
              <li>${icon('x', { size: 18 })} Gaps between scopes become your problem and your cost</li>
              <li>${icon('x', { size: 18 })} No single warranty — each vendor covers only their bit</li>
              <li>${icon('x', { size: 18 })} Expect 15–25 hours a week of your own time on site</li>
              <li>${icon('check', { size: 18 })} Can be 8–12% cheaper if you have trusted vendors</li>
              <li>${icon('check', { size: 18 })} Full control over every purchase decision</li>
            </ul>
          </div>
          <div class="vs-card good">
            <h3>${icon('shieldCheck', { size: 22 })} Turnkey with Nexora</h3>
            <ul class="check-list">
              <li>${icon('check', { size: 18 })} One contract, one PM, one accountable price</li>
              <li>${icon('check', { size: 18 })} Scope gaps are our problem, not a variation bill</li>
              <li>${icon('check', { size: 18 })} 10-year modular warranty from a single entity</li>
              <li>${icon('check', { size: 18 })} Weekly reporting — manage it from another city</li>
              <li>${icon('check', { size: 18 })} Insured teams and documented site liability</li>
              <li>${icon('check', { size: 18 })} Snag closure before the final payment releases</li>
            </ul>
          </div>
        </div>
        <p class="text-center mt-8 measure mx-auto" style="color:var(--text-muted)">
          If you have a contractor you already trust and the bandwidth to run site yourself, ask us about a
          <a href="${url('/contact/')}" class="link-underline" style="color:var(--accent-text);font-weight:600">design-only engagement</a>
          instead. We would rather give you the right advice than the bigger invoice.
        </p>
      </div>
    </section>`,

    faqBlock(faqsGeneral.slice(1, 6), { eyebrow: 'Process FAQs', title: 'Questions about how we work' }),
    ctaBand({ source: 'process' }),
  ].join('\n'),
};

/* ============================================================ WARRANTY */
const warranty = {
  route: '/warranty/',
  title: '10-Year Warranty Policy | Nexora Spaces LLP',
  metaTitle: '10-Year Interior Warranty — What It Covers | Nexora',
  description:
    'Full details of the Nexora Spaces 10-year warranty on modular woodwork and hardware, 1-year cover on site services, what is excluded, and how to raise a claim.',
  keywords: 'interior warranty, modular kitchen warranty, 10 year warranty interior, interior design warranty india',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Warranty', href: '/warranty/' }],
  faqs: [
    { q: 'Is the warranty transferable if I sell my home?', a: '<p>Yes. The warranty attaches to the installation, not the person. Email us the new owner\'s details and we will re-register it. There is no fee.</p>' },
    { q: 'How do I raise a warranty claim?', a: `<p>Email <a href="mailto:${site.email.general}">${site.email.general}</a> or WhatsApp us with photos, your project code and a short description. We acknowledge within one working day and inspect within five for NCR addresses.</p>` },
    { q: 'What voids the warranty?', a: '<p>Water ingress from building leakage, structural movement, modifications by third-party carpenters, transportation or reinstallation by others, and normal wear such as laminate colour fade from direct sunlight. All exclusions are listed in your contract — nothing here is a surprise clause.</p>' },
  ],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Warranty', href: '/warranty/' }],
      title: 'What our 10-year<br>warranty actually covers',
      sub: 'Most firms advertise a long warranty and bury the exclusions. Here is the complete position, in plain language, before you sign anything.',
      light: true,
    }),
    `<section class="section">
      <div class="container container-narrow">
        <div class="grid grid-2 gap-6 mb-12 reveal-stagger">
          <div class="card card-pad-lg" style="border-color:var(--line-brand);background:var(--brand-50)">
            <span class="card-icon">${icon('shieldCheck', { size: 24 })}</span>
            <h3 class="card-title">10 years — modular woodwork</h3>
            <ul class="check-list">
              <li>${icon('check', { size: 18 })} Plywood carcass integrity and delamination</li>
              <li>${icon('check', { size: 18 })} Edge banding adhesion</li>
              <li>${icon('check', { size: 18 })} Hinges, channels and sliding systems</li>
              <li>${icon('check', { size: 18 })} Soft-close and lift-up mechanisms</li>
              <li>${icon('check', { size: 18 })} Handles, locks and fittings supplied by us</li>
              <li>${icon('check', { size: 18 })} Borer and termite treatment failure</li>
            </ul>
          </div>
          <div class="card card-pad-lg">
            <span class="card-icon">${icon('clock', { size: 24 })}</span>
            <h3 class="card-title">1 year — site-executed work</h3>
            <ul class="check-list">
              <li>${icon('check', { size: 18 })} Painting — peeling, blistering, patchiness</li>
              <li>${icon('check', { size: 18 })} False ceiling cracks and joint failure</li>
              <li>${icon('check', { size: 18 })} Electrical points and switch functionality</li>
              <li>${icon('check', { size: 18 })} Plumbing executed within our scope</li>
              <li>${icon('check', { size: 18 })} Tile and stone laying, grout failure</li>
              <li>${icon('check', { size: 18 })} Polish and lacquer finish on site joinery</li>
            </ul>
          </div>
        </div>

        <div class="prose">
          <h2>How it works</h2>
          <p>Your warranty certificate is issued at handover with a unique project code, itemising every element covered and its start date. You do not need to keep the paperwork — we hold a permanent record against your project code.</p>

          <h2>Response commitment</h2>
          <p>We acknowledge every claim within <strong>one working day</strong> and inspect within <strong>five working days</strong> for any address in Delhi NCR. If the defect is covered, repair or replacement is at our cost including labour and transport. If it is not covered, we tell you why in writing and quote the repair separately — you are free to decline.</p>

          <h2>What is excluded</h2>
          <ul>
            <li>Water damage from building leakage, seepage or plumbing outside our scope</li>
            <li>Structural movement, settlement or building-related cracking</li>
            <li>Modification, repair or reinstallation carried out by anyone other than us</li>
            <li>Damage from misuse, overloading beyond rated capacity, or accident</li>
            <li>Natural variation and colour fade in wood, veneer and stone from direct sunlight</li>
            <li>Consumables such as bulbs, filters, sealant and gaskets</li>
            <li>Client-supplied materials and appliances (these carry the manufacturer's warranty)</li>
          </ul>

          <h2>Annual maintenance</h2>
          <p>We offer an optional AMC covering hardware realignment, hinge servicing, touch-up polishing and a full inspection. It is not required to keep the warranty valid — we mention it only because clients ask, and we will quote it for your home on request.</p>

          <h2>Raising a claim</h2>
          <p>WhatsApp <a href="${waLink('Hi Nexora, I would like to raise a warranty claim.')}">${esc(site.phone.display)}</a> or email <a href="mailto:${site.email.general}">${esc(site.email.general)}</a> with your project code, photographs and a short description. That is the entire process — no forms, no portal, no ticket number you have to chase.</p>
        </div>
      </div>
    </section>`,
    ctaBand({ form: false, source: 'warranty', title: 'Questions about your warranty?<br><span class="serif-italic gradient-text">Just ask us.</span>', text: 'Existing client or considering us — the warranty desk answers either way.', points: ['1 working day acknowledgement', '5 working day inspection in NCR', 'Transferable if you sell'] }),
  ].join('\n'),
};

export default [about, processPage, warranty];
