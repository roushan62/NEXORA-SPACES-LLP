import { site, waLink, yearsInBusiness } from '../config/site.config.js';
import { icon, iconSolid } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import {
  sectionHead, statStrip, trustMarquee, processRail, faqBlock,
  ctaBand, testimonialSection, folioCard, credentialStrip, stars,
} from '../layouts/sections.js';
import { stats, trustBadges, credentials } from '../data/stats.js';
import { projects, testimonials, faqsGeneral, processSteps, packages, designStyles, posts } from '../data/content.js';

/* ------------------------------------------------------------------ Hero */
const hero = () => `
<section class="hero">
  <div class="hero-media">
    <picture>
      <source type="image/avif" media="(max-width:640px)" srcset="${url('/assets/img/hero-640.avif')}">
      <source type="image/avif" media="(max-width:1024px)" srcset="${url('/assets/img/hero-1024.avif')}">
      <source type="image/avif" srcset="${url('/assets/img/hero-1920.avif')}">
      <source type="image/webp" media="(max-width:640px)" srcset="${url('/assets/img/hero-640.webp')}">
      <source type="image/webp" srcset="${url('/assets/img/hero-1536.webp')}">
      <img src="${url('/assets/img/hero-1536.jpg')}" alt="Warm minimal living room interior designed and executed by Nexora Spaces in Gurugram"
           width="1536" height="1024" fetchpriority="high" decoding="async">
    </picture>
  </div>
  <div class="hero-scrim"></div>

  <div class="container hero-inner">
    <div class="hero-copy">
      <span class="hero-badge anim-fade-up">
        ${stars(5)}
        <span>${site.reviews.rating} on Google · ${site.reviews.count} verified reviews</span>
      </span>

      <h1 class="hero-title anim-fade-up anim-d1">
        Turnkey interiors for<br>
        <span class="accent">Delhi, Gurugram &amp; Noida</span>
      </h1>

      <p class="hero-sub anim-fade-up anim-d2">
        We design it, we build it, we hand you the keys. <strong>One contract, one team,
        one accountable price</strong> — with a ${site.guarantees.warrantyYears}-year warranty and a
        ${site.guarantees.deliveryDays}-day handover written into it.
      </p>

      <div class="hero-actions anim-fade-up anim-d3">
        <a href="${url('/contact/')}" class="btn btn-accent btn-lg">
          ${icon('sparkles', { size: 18 })} Get free 3D design
        </a>
        <a href="${url('/cost-calculator/')}" class="btn btn-glass btn-lg">
          ${icon('calculator', { size: 18 })} Calculate my cost
        </a>
      </div>

      <div class="hero-proof anim-fade-up anim-d4">
        <div class="hero-proof-item">
          ${icon('shieldCheck', { size: 20 })}
          <span><span class="hero-proof-val">${site.guarantees.warrantyYears} years</span>
          <span class="hero-proof-lbl">Warranty on modular</span></span>
        </div>
        <div class="hero-proof-item">
          ${icon('clock', { size: 20 })}
          <span><span class="hero-proof-val">${site.guarantees.deliveryDays} days</span>
          <span class="hero-proof-lbl">Contractual handover</span></span>
        </div>
        <div class="hero-proof-item">
          ${icon('home', { size: 20 })}
          <span><span class="hero-proof-val">850+</span>
          <span class="hero-proof-lbl">Homes delivered in NCR</span></span>
        </div>
      </div>
    </div>
  </div>

  <div class="hero-card anim-fade-up anim-d5">
    <h4>${icon('receipt', { size: 16 })} Fixed-price promise</h4>
    <p>Your BOQ price is the price you pay. Any scope change is re-quoted and signed before we proceed — never billed as a surprise at handover.</p>
    <a href="${url('/pricing/')}" class="link-arrow" style="color:var(--brand-300)">See how we price ${icon('arrowRight', { size: 15 })}</a>
  </div>

  <div class="hero-scroll" aria-hidden="true">
    <span>Scroll</span>${icon('chevronDown', { size: 18 })}
  </div>
</section>`;

/* ------------------------------------------------------------- Difference */
const differentiators = () => {
  const items = [
    { icon: 'ruler', title: 'In-house design studio', text: 'Twelve full-time designers, not freelancers on commission. The person who draws your home is the person accountable for it.' },
    { icon: 'hardHat', title: 'Own production facility', text: 'Modular units are CNC-cut and finished in our own unit, so quality is controlled before anything reaches your site.' },
    { icon: 'receipt', title: 'Line-by-line BOQ', text: 'Every plank, hinge and light fitting is priced with the brand named. You compare like for like, and nothing hides in a lump sum.' },
    { icon: 'userCheck', title: 'One project manager', text: 'A single named PM from survey to snag closure, plus weekly photo reports on WhatsApp — even if you live in another city.' },
    { icon: 'shieldCheck', title: 'Warranty that is documented', text: `${site.guarantees.warrantyYears} years on modular carcass and hardware, in your contract — transferable if you sell the property.` },
    { icon: 'rupee', title: 'Milestone payments only', text: '10% design, 40% dispatch, 40% installation, 10% handover. We never ask for the full amount upfront.' },
  ];
  return `
<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Why Nexora',
      title: 'The interiors industry has a trust problem.<br><span class="serif-italic gradient-text">We built the company around fixing it.</span>',
      sub: 'Delays, budget creep and vanishing project managers are the three complaints every NCR homeowner has heard. Here is exactly how we designed those out.',
    })}
    <div class="grid grid-3 gap-6 reveal-stagger">
      ${items.map((d) => `
      <div class="feat-card">
        <span class="ico-lead">${icon(d.icon, { size: 26 })}</span>
        <h3>${esc(d.title)}</h3>
        <p>${esc(d.text)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;
};

/* --------------------------------------------------------------- Services */
const services = () => {
  const cards = [
    {
      img: 'projects/p1', title: 'Full home turnkey interiors',
      tag: 'Most booked', tagCls: 'badge-accent',
      desc: 'Design, civil, electrical, ceiling, painting, modular and styling — delivered under a single contract with one warranty.',
      price: '₹1,150', unit: '/sq.ft onwards', href: '/residential/',
      alt: 'Turnkey living room interior with oak panelling delivered by Nexora Spaces',
    },
    {
      img: 'projects/p4', title: 'Modular kitchens & wardrobes',
      tag: '10-yr warranty', tagCls: 'badge-green',
      desc: 'Factory-finished carcasses in 710-grade ply with Hettich or Blum hardware. Installed in days, not weeks of on-site carpentry.',
      price: '₹1.8 L', unit: 'onwards', href: '/services/modular-kitchen/',
      alt: 'Handleless modular kitchen with quartz countertop by Nexora Spaces',
    },
    {
      img: 'projects/p5', title: 'Commercial & office fit-out',
      tag: 'Advisory + build', tagCls: 'badge-teal',
      desc: 'Workplace strategy, retail rollouts and F&B builds. Engage us for design only, PMC, or complete single-window execution.',
      price: '₹1,400', unit: '/sq.ft onwards', href: '/commercial/',
      alt: 'Modern open-plan office fit-out with acoustic ceiling by Nexora Spaces',
    },
  ];

  return `
<section class="section bg-subtle cv-auto" id="services">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({
        eyebrow: 'What we do',
        title: 'Three ways to work with us',
        sub: 'Residential turnkey is our core. Modular-only and commercial engagements follow the same standards and the same paperwork discipline.',
      })}
      <a href="${url('/pricing/')}" class="btn btn-outline hide-sm">See all packages ${icon('arrowRight', { size: 16 })}</a>
    </div>

    <div class="grid grid-3 gap-6 reveal-stagger">
      ${cards.map((c) => `
      <article class="svc-card">
        <div class="svc-media zoom-parent">
          <span class="svc-tag"><span class="badge ${c.tagCls}">${esc(c.tag)}</span></span>
          ${picture({ name: c.img, alt: c.alt, widths: [420, 800, 1200], sizes: '(max-width:1024px) 100vw, 33vw', width: 800, height: 500, imgClass: 'zoom-img' })}
        </div>
        <div class="svc-body">
          <h3 class="svc-title">${esc(c.title)}</h3>
          <p class="svc-desc">${esc(c.desc)}</p>
          <div class="svc-meta">
            <span class="svc-price">Starting at<b>${esc(c.price)}<span style="font-size:var(--fs-xs);font-weight:400;color:var(--text-muted)"> ${esc(c.unit)}</span></b></span>
            <a href="${url(c.href)}" class="link-arrow">Explore ${icon('arrowRight', { size: 16 })}</a>
          </div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
};

/* ----------------------------------------------------------- Calculator */
const calculatorTeaser = () => `
<section class="section" id="calculator">
  <div class="container">
    <div class="split split-60">
      <div class="reveal">
        <span class="eyebrow">Budget planning</span>
        <h2 class="section-title">Know your number<br><span class="serif-italic gradient-text">before you talk to anyone</span></h2>
        <p class="section-sub mb-8">
          Our calculator uses live NCR rates — the same per-square-foot bands we quote from,
          adjusted for your city, carpet area and finish level. No email gate, no "we'll call you to reveal the price".
        </p>
        <ul class="check-list mb-8">
          <li>${icon('checkCircle', { size: 18 })} City-specific rates for Gurugram, Noida and Delhi</li>
          <li>${icon('checkCircle', { size: 18 })} Head-wise split: modular, civil, ceiling, painting, decor</li>
          <li>${icon('checkCircle', { size: 18 })} Indicative EMI so you can plan cash flow</li>
          <li>${icon('checkCircle', { size: 18 })} Send the result straight to us on WhatsApp for a firm BOQ</li>
        </ul>
        <div class="btn-group">
          <a href="${url('/cost-calculator/')}" class="btn btn-primary btn-lg">${icon('calculator', { size: 18 })} Open the calculator</a>
          <a href="${url('/pricing/')}" class="btn btn-ghost btn-lg">View packages</a>
        </div>
      </div>

      <div class="split-media reveal delay-1">
        <div class="card card-pad-lg" style="box-shadow:var(--sh-xl);border-color:var(--line-brand)">
          <div class="flex items-center gap-3 mb-6">
            <span class="card-icon" style="margin:0;width:44px;height:44px">${icon('trendingUp', { size: 20 })}</span>
            <div>
              <strong style="display:block;font-size:var(--fs-base)">Typical NCR budgets, 2026</strong>
              <span style="font-size:var(--fs-xs);color:var(--text-muted)">Full-home turnkey, carpet-area basis</span>
            </div>
          </div>
          <div class="table-wrap" style="border:0">
            <table class="table" style="min-width:0">
              <thead><tr><th>Home</th><th class="num">Essential</th><th class="num">Signature</th></tr></thead>
              <tbody>
                <tr><td><strong>1 BHK</strong><br><span style="font-size:var(--fs-xs);color:var(--text-muted)">~480 sq.ft</span></td><td class="num">₹5.5 – 7.0 L</td><td class="num">₹7.9 – 10.1 L</td></tr>
                <tr><td><strong>2 BHK</strong><br><span style="font-size:var(--fs-xs);color:var(--text-muted)">~780 sq.ft</span></td><td class="num">₹9.0 – 11.3 L</td><td class="num">₹12.9 – 16.4 L</td></tr>
                <tr class="table-highlight"><td><strong>3 BHK</strong><br><span style="font-size:var(--fs-xs);color:var(--text-muted)">~1,150 sq.ft</span></td><td class="num">₹13.2 – 16.7 L</td><td class="num">₹19.0 – 24.2 L</td></tr>
                <tr><td><strong>4 BHK / Villa</strong><br><span style="font-size:var(--fs-xs);color:var(--text-muted)">~1,650 sq.ft</span></td><td class="num">₹19.0 – 23.9 L</td><td class="num">₹27.2 – 34.7 L</td></tr>
              </tbody>
            </table>
          </div>
          <p class="mt-5" style="font-size:var(--fs-xs);color:var(--text-subtle);line-height:1.5">
            ${icon('info', { size: 13 })} Indicative ranges excluding GST, society charges and loose furniture.
            Gurugram and South Delhi typically run 6–8% above Noida.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>`;

/* ---------------------------------------------------------------- Process */
const process = () => `
<section class="section bg-subtle cv-auto" id="process">
  <div class="container">
    ${sectionHead({
      eyebrow: 'How it works',
      title: 'Seven stages. No surprises in any of them.',
      sub: 'Every project runs on the same documented system, whether it is a ₹6 lakh 1 BHK or a ₹2 crore villa.',
      center: true,
    })}
    ${processRail(processSteps)}
    <div class="text-center mt-12 reveal">
      <a href="${url('/process/')}" class="btn btn-outline">See the full process in detail ${icon('arrowRight', { size: 16 })}</a>
    </div>
  </div>
</section>`;

/* -------------------------------------------------------------- Portfolio */
const portfolio = () => `
<section class="section cv-auto" id="work">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({
        eyebrow: 'Recent work',
        title: 'Homes and workplaces we have delivered',
        sub: 'A selection from across DLF, Golf Course Road, Noida Expressway, Dwarka and South Delhi.',
      })}
      <a href="${url('/portfolio/')}" class="btn btn-outline hide-sm">View full portfolio ${icon('arrowRight', { size: 16 })}</a>
    </div>

    <div class="folio-grid reveal-stagger">
      ${projects.slice(0, 6).map((p, i) => folioCard({
        ...p, image: `/assets/img/projects/${p.image.split('/').pop().replace('.jpg', '')}-800.jpg`,
      }, i === 0)).join('')}
    </div>

    <div class="text-center mt-10 only-sm">
      <a href="${url('/portfolio/')}" class="btn btn-outline btn-block">View full portfolio ${icon('arrowRight', { size: 16 })}</a>
    </div>
  </div>
</section>`;

/* --------------------------------------------------------------- Packages */
const pricingTeaser = () => `
<section class="section bg-subtle cv-auto" id="packages">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Packages',
      title: 'Three tiers. Published rates.',
      sub: 'Pick the finish level that matches your brief and budget. Every tier includes design, project management and warranty — the difference is in materials and detailing.',
      center: true,
    })}

    <div class="price-grid reveal-stagger">
      ${packages.map((p) => `
      <div class="price-card${p.popular ? ' is-popular' : ''}">
        ${p.popular ? '<span class="price-flag">Most chosen in NCR</span>' : ''}
        <h3 class="price-name">${esc(p.name)}</h3>
        <p class="price-for">${esc(p.for)}</p>
        <div class="price-amount">
          <span class="price-cur">₹</span>
          <span class="price-num">${esc(p.rate)}</span>
        </div>
        <span class="price-unit">${esc(p.unit)}</span>
        <p class="price-note mt-3">${esc(p.example)}</p>
        <div class="price-divider"></div>
        <ul class="check-list">
          ${p.includes.slice(0, 6).map((f) => `<li>${icon('check', { size: 18 })} ${esc(f)}</li>`).join('')}
        </ul>
        <a href="${url('/pricing/')}" class="btn ${p.popular ? 'btn-accent' : 'btn-outline'} btn-block">
          Full inclusions ${icon('arrowRight', { size: 16 })}
        </a>
      </div>`).join('')}
    </div>

    <div class="alert alert-brand mt-10 reveal">
      ${icon('info', { size: 20 })}
      <p><span class="alert-title">Rates are per square foot of carpet area, not built-up.</span>
      Some firms quote on built-up area to make the number look 25% smaller. Ask every vendor which basis they use
      before you compare — then compare the BOQ, not the bottom line.</p>
    </div>
  </div>
</section>`;

/* ----------------------------------------------------------------- Styles */
const styles = () => `
<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Design languages',
      title: 'Find the look that fits how you live',
      sub: 'We do not force a house style. Tell us what you respond to and we will develop it properly — with the material palette to back it up.',
      center: true,
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
</section>`;

/* --------------------------------------------------------------- Cities */
const cities = () => {
  const cityCards = [
    {
      name: 'Gurugram', href: '/interior-designers-in-gurgaon/', img: 'pages/gurgaon',
      areas: 'DLF Phase 1–5 · Golf Course Road & Extension · Sohna Road · Sectors 47–115 · New Gurgaon',
      count: '410+ homes', alt: 'Interior design project in a Gurugram apartment',
    },
    {
      name: 'Noida & Greater Noida', href: '/interior-designers-in-noida/', img: 'pages/noida',
      areas: 'Sectors 44–168 · Noida Expressway · Sector 150 · Greater Noida West · Indirapuram',
      count: '260+ homes', alt: 'Interior design project in a Noida apartment',
    },
    {
      name: 'Delhi', href: '/interior-designers-in-delhi/', img: 'pages/delhi',
      areas: 'South Delhi · GK I & II · Saket · Vasant Kunj · Dwarka · Rohini · Punjabi Bagh',
      count: '180+ homes', alt: 'Interior design project in a South Delhi residence',
    },
  ];
  return `
<section class="section bg-subtle cv-auto">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Where we work',
      title: 'Three studios across Delhi NCR',
      sub: 'Local teams who know your society\'s work-permission rules, lift dimensions and material access timings — which is exactly why projects here finish on schedule.',
      center: true,
    })}
    <div class="grid grid-3 gap-6 reveal-stagger">
      ${cityCards.map((c) => `
      <a href="${url(c.href)}" class="svc-card">
        <div class="svc-media zoom-parent">
          ${picture({ name: c.img, alt: c.alt, widths: [960, 1600], sizes: '(max-width:1024px) 100vw, 33vw', width: 960, height: 600, imgClass: 'zoom-img' })}
          <span class="svc-tag"><span class="badge badge-dark">${esc(c.count)}</span></span>
        </div>
        <div class="svc-body">
          <h3 class="svc-title">${icon('mapPin', { size: 18 })} ${esc(c.name)}</h3>
          <p class="svc-desc">${esc(c.areas)}</p>
          <span class="link-arrow" style="margin-top:auto">View ${esc(c.name)} projects ${icon('arrowRight', { size: 16 })}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>`;
};

/* ------------------------------------------------------------------ Blog */
const journal = () => `
<section class="section">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({
        eyebrow: 'Design journal',
        title: 'Guides worth reading before you sign anything',
        sub: 'Practical, NCR-specific writing on cost, materials and process — no listicles.',
      })}
      <a href="${url('/blog/')}" class="btn btn-outline hide-sm">All articles ${icon('arrowRight', { size: 16 })}</a>
    </div>
    <div class="grid grid-3 gap-6 reveal-stagger">
      ${posts.slice(0, 3).map((p) => `
      <a href="${url('/blog/' + p.slug + '/')}" class="svc-card">
        <div class="svc-media zoom-parent">
          ${picture({ name: p.image.replace('/assets/img/', '').replace('.jpg', ''), alt: p.alt, widths: [420, 800], sizes: '(max-width:1024px) 100vw, 33vw', width: 800, height: 500, imgClass: 'zoom-img' })}
        </div>
        <div class="svc-body">
          <div class="flex items-center gap-3 mb-3" style="font-size:var(--fs-xs);color:var(--text-muted)">
            <span class="badge badge-accent">${esc(p.category)}</span>
            <span>${icon('clock', { size: 13 })} ${esc(p.readTime)}</span>
          </div>
          <h3 class="svc-title" style="font-size:var(--fs-lg)">${esc(p.title)}</h3>
          <p class="svc-desc">${esc(p.excerpt)}</p>
          <span class="link-arrow" style="margin-top:auto">Read article ${icon('arrowRight', { size: 16 })}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ Credentials */
const credentialsSection = () => `
<section class="section-sm bg-subtle section-divided">
  <div class="container">
    <p class="rule-label mb-8">Credentials &amp; compliance</p>
    ${credentialStrip(credentials)}
  </div>
</section>`;

/* ============================================================ EXPORT PAGE */
export default {
  route: '/',
  title: 'Interior Designers in Delhi, Gurgaon & Noida | Nexora Spaces LLP',
  metaTitle: 'Interior Designers in Delhi, Gurgaon & Noida | Nexora',
  description:
    'Turnkey interior design & fit-out in Delhi NCR. 10-year warranty, 45-day handover, free 3D design and an itemised BOQ. 850+ homes delivered.',
  keywords:
    'interior designers in delhi, interior designers in gurgaon, interior designers in noida, turnkey interiors delhi ncr, modular kitchen gurgaon, home interior design noida, interior design cost delhi',
  ogImage: '/assets/img/og-default.jpg',
  preloadImage: '/assets/img/hero-1536.avif',
  crumbs: [{ label: 'Home', href: '/' }],
  faqs: faqsGeneral,
  extraSchema: [
    serviceSchema({
      name: 'Turnkey Interior Design & Fit-Out',
      description: 'Complete residential interior design and execution across Delhi, Gurugram and Noida — design, civil, modular, electrical, painting and handover under one contract.',
      serviceType: 'Interior Design',
      offers: { price: '1150', min: 1150, max: 3400 },
    }),
  ],
  body: [
    hero(),
    trustMarquee([
      ...trustBadges,
      { icon: 'users', label: '62 in-house designers & PMs' },
      { icon: 'star', label: `${site.reviews.rating}★ average client rating` },
      { icon: 'building', label: '18+ NCR micro-markets served' },
      { icon: 'gem', label: 'Hettich · Blum · Ebco hardware' },
    ]),
    statStrip(stats),
    differentiators(),
    services(),
    calculatorTeaser(),
    process(),
    portfolio(),
    pricingTeaser(),
    testimonialSection(testimonials),
    styles(),
    cities(),
    credentialsSection(),
    journal(),
    faqBlock(faqsGeneral, {
      eyebrow: 'Straight answers',
      title: 'The questions everyone asks us',
      sub: 'Cost, timeline, warranty and payment — answered honestly, including where we are not the right fit.',
    }),
    ctaBand({ source: 'home-cta' }),
  ].join('\n'),
};
