import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc, serviceSchema } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import {
  sectionHead, statStrip, trustMarquee, processRail, faqBlock,
  ctaBand, testimonialSection, credentialStrip, stars, heroVideo,
} from '../layouts/sections.js';
import { stats, trustBadges, credentials } from '../data/stats.js';
import { testimonials, faqsGeneral, processSteps, designStyles, posts } from '../data/content.js';
import { galleryPackages } from '../data/gallery.js';

/* ------------------------------------------------------------------ Hero
   Full-bleed interior walkthrough behind the headline.

   The <video> only mounts when real footage is configured in
   site.heroVideo.sources (see site.config.js). Until then the same markup
   runs a CSS-driven walkthrough across the gallery stills, so the hero is
   never a flat image and never 404s on a missing video file. Either way the
   poster paints first and the text stays readable over the gradient scrim. */
const hero = () => `
<section class="hero hero-cinematic">
  ${heroVideo()}
  <div class="hero-scrim"></div>

  <div class="container hero-inner">
    <div class="hero-copy">
      <span class="hero-badge anim-fade-up">
        ${site.reviews.schema
          ? `${stars(5)}<span>${site.reviews.rating} on Google · ${site.reviews.count} verified reviews</span>`
          : `${icon('home', { size: 16 })}<span>Residential interior fit-out · Delhi NCR</span>`}
      </span>

      <h1 class="hero-title anim-fade-up anim-d1">
        Crafting homes<br>
        <span class="accent">that feel like you</span>
      </h1>

      <p class="hero-sub anim-fade-up anim-d2">
        Nexora Spaces designs and builds complete home interiors — flats, apartments and villas.
        <strong>Best-in-class execution, the fastest handover in the industry</strong>, and a
        designer-grade finish that stays value-driven from the first drawing to the last handle.
      </p>

      <div class="hero-actions anim-fade-up anim-d3">
        <a href="${url('/gallery/')}" class="btn btn-accent btn-lg">
          ${icon('image', { size: 18 })} View our work
        </a>
        <button type="button" class="btn btn-glass btn-lg" aria-label="Open the free consultation form" data-consult-open>
          ${icon('sparkles', { size: 18 })} Get free consultation
        </button>
      </div>

      <div class="hero-proof anim-fade-up anim-d4">
        <div class="hero-proof-item">
          ${icon('gem', { size: 20 })}
          <span><span class="hero-proof-val">Designer-grade</span>
          <span class="hero-proof-lbl">Finish on every home</span></span>
        </div>
        <div class="hero-proof-item">
          ${icon('clock', { size: 20 })}
          <span><span class="hero-proof-val">Fastest</span>
          <span class="hero-proof-lbl">Turnaround in the industry</span></span>
        </div>
        <div class="hero-proof-item">
          ${icon('home', { size: 20 })}
          <span><span class="hero-proof-val">Homes only</span>
          <span class="hero-proof-lbl">Residential is all we do</span></span>
        </div>
      </div>
    </div>
  </div>

  <div class="hero-card anim-fade-up anim-d5">
    <h4>${icon('shieldCheck', { size: 16 })} Value-driven from day one</h4>
    <p>Budget-smart luxury: premium materials and detailing, specified honestly, with the scope agreed in writing before a single panel is cut.</p>
    <a href="${url('/about/')}" class="link-arrow" style="color:var(--brand-300)">How we work ${icon('arrowRight', { size: 15 })}</a>
  </div>

  <a href="#promise" class="hero-scroll" aria-label="Scroll to content">
    <span>Scroll</span>
    <span class="hero-scroll-line" aria-hidden="true"></span>
  </a>
</section>`;

/* ------------------------------------------------------- The four promises */
const promise = () => {
  const items = [
    {
      icon: 'gem', title: 'Best-in-class execution',
      text: 'Modular work is built and finished in our own production unit, then installed by our own team. Nothing is subcontracted to whoever is free that week.',
    },
    {
      icon: 'clock', title: 'The fastest handover in the industry',
      text: 'Because the joinery arrives finished, site time collapses. Your handover date is agreed at sign-off and written into the contract — not revised halfway through.',
    },
    {
      icon: 'receipt', title: 'Value-driven, always',
      text: 'Budget-smart luxury. We specify where it shows and save where it does not, and every material is named in writing so you know exactly what you are getting.',
    },
    {
      icon: 'sparkles', title: 'A premium, designer-grade finish',
      text: 'Level lines, flush shadow gaps, clean edge banding and lighting that flatters the room. The details you only notice when someone gets them wrong.',
    },
  ];
  return `
<section class="section" id="promise">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Our promise',
      title: 'Four things we will not<br><span class="serif-italic gradient-text">compromise on</span>',
      sub: 'Homes are personal, and a home fit-out is disruptive by nature. These are the commitments that decide whether that disruption was worth it.',
      center: true,
    })}
    <div class="grid grid-4 gap-6 reveal-stagger">
      ${items.map((d) => `
      <div class="feat-card feat-card-lift">
        <span class="ico-lead">${icon(d.icon, { size: 26 })}</span>
        <h3>${esc(d.title)}</h3>
        <p>${esc(d.text)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;
};

/* ------------------------------------------------------------- Difference */
const differentiators = () => {
  const items = [
    { icon: 'ruler', title: 'An in-house design studio', text: 'Full-time designers, not freelancers on commission. The person who draws your home is the person accountable for it.' },
    { icon: 'hardHat', title: 'Our own production', text: 'Modular units are cut and finished in a controlled environment, so quality is settled before anything reaches your flat.' },
    { icon: 'fileText', title: 'Scope agreed in writing', text: 'Every material, brand and finish is named and signed off before work starts. Nothing is decided by a verbal promise on site.' },
    { icon: 'userCheck', title: 'One project manager', text: 'A single named PM from survey to snag closure, plus weekly photo updates — even if you are living in another city.' },
    { icon: 'shieldCheck', title: 'A documented warranty', text: 'A written, transferable warranty on modular carcass and hardware, included in your contract rather than implied in a brochure.' },
    { icon: 'home', title: 'Homes are all we do', text: 'No offices, no retail, no restaurants. Every process we have is tuned for families living in, or moving into, a real home.' },
  ];
  return `
<section class="section bg-subtle cv-auto">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Why Nexora',
      title: 'Home interiors have a trust problem.<br><span class="serif-italic gradient-text">We built the studio around fixing it.</span>',
      sub: 'Delays, vanishing project managers and finishes that do not match the render are what homeowners actually fear. Here is how we designed those out.',
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
      img: 'projects/p1', title: 'Full home interiors',
      tag: 'Most booked', tagCls: 'badge-accent',
      desc: 'Design, civil, electrical, false ceiling, painting, modular joinery and styling — your whole home delivered under a single contract.',
      href: '/services/turnkey-interiors/',
      alt: 'Turnkey living room interior with oak panelling delivered by Nexora Spaces',
    },
    {
      img: 'projects/p4', title: 'Modular kitchens & wardrobes',
      tag: 'Factory-finished', tagCls: 'badge-green',
      desc: 'Kitchens, wardrobes and walk-in storage built off site in a controlled unit, then installed in days rather than weeks of on-site carpentry.',
      href: '/services/modular-kitchen/',
      alt: 'Handleless modular kitchen with quartz countertop by Nexora Spaces',
    },
    {
      img: 'projects/p9', title: 'Renovation & room makeovers',
      tag: 'Live-in friendly', tagCls: 'badge-teal',
      desc: 'One room or the whole flat. We phase the work, dust-seal the active zone daily and work around your family staying in the home.',
      href: '/services/renovation/',
      alt: 'Renovated bedroom with light oak wardrobe and layered lighting by Nexora Spaces',
    },
  ];

  return `
<section class="section" id="services">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({
        eyebrow: 'What we do',
        title: 'Three ways to work with us',
        sub: 'All residential, all delivered by the same team to the same standard — whether it is a single room or an entire villa.',
      })}
      <a href="${url('/services/turnkey-interiors/')}" class="btn btn-outline hide-sm">All services ${icon('arrowRight', { size: 16 })}</a>
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
          <a href="${url(c.href)}" class="link-arrow" style="margin-top:auto">Explore ${icon('arrowRight', { size: 16 })}</a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;
};

/* --------------------------------------------------------- Gallery teaser */
const galleryTeaser = () => {
  const featured = galleryPackages.slice(0, 6);
  return `
<section class="section bg-subtle cv-auto" id="gallery">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({
        eyebrow: 'Home gallery',
        title: 'Complete homes, room by room',
        sub: 'Not a scatter of pretty corners — each package walks you through one whole home, from the hall to the puja room to the passage.',
      })}
      <a href="${url('/gallery/')}" class="btn btn-outline hide-sm">All ${galleryPackages.length} packages ${icon('arrowRight', { size: 16 })}</a>
    </div>

    <div class="pkg-grid reveal-stagger">
      ${featured.map((p) => `
      <a href="${url('/gallery/#' + p.id)}" class="pkg-card">
        <div class="pkg-media zoom-parent">
          <!-- TODO: replace with real project photo -->
          ${picture({
            name: `gallery/${p.id}-hall`, alt: p.rooms.hall.alt,
            widths: [640, 1400], sizes: '(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw',
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

    <div class="text-center mt-10 only-sm">
      <a href="${url('/gallery/')}" class="btn btn-outline btn-block">View all packages ${icon('arrowRight', { size: 16 })}</a>
    </div>
  </div>
</section>`;
};

/* ---------------------------------------------------------------- Process */
const process = () => `
<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'How it works',
      title: 'Seven stages, from first call to keys',
      sub: 'You always know which stage you are in, who owns it, and what happens next.',
      center: true,
    })}
    ${processRail(processSteps)}
    <div class="text-center mt-10 reveal">
      <a href="${url('/process/')}" class="btn btn-outline">See the full process ${icon('arrowRight', { size: 16 })}</a>
    </div>
  </div>
</section>`;

/* ----------------------------------------------------------------- Styles */
const styles = () => `
<section class="section bg-subtle cv-auto">
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
      alt: 'Home interior project in a Gurugram apartment',
    },
    {
      name: 'Noida & Greater Noida', href: '/interior-designers-in-noida/', img: 'pages/noida',
      areas: 'Sectors 44–168 · Noida Expressway · Sector 150 · Greater Noida West · Indirapuram',
      alt: 'Home interior project in a Noida apartment',
    },
    {
      name: 'Delhi', href: '/interior-designers-in-delhi/', img: 'pages/delhi',
      areas: 'South Delhi · GK I & II · Saket · Vasant Kunj · Dwarka · Rohini · Punjabi Bagh',
      alt: 'Home interior project in a South Delhi residence',
    },
  ];
  return `
<section class="section">
  <div class="container">
    ${sectionHead({
      eyebrow: 'Where we work',
      title: 'Three studios across Delhi NCR',
      sub: 'Local teams who already know your society\'s work-permission rules, lift dimensions and material access timings — which is exactly why homes here finish on schedule.',
      center: true,
    })}
    <div class="grid grid-3 gap-6 reveal-stagger">
      ${cityCards.map((c) => `
      <a href="${url(c.href)}" class="svc-card">
        <div class="svc-media zoom-parent">
          ${picture({ name: c.img, alt: c.alt, widths: [960, 1600], sizes: '(max-width:1024px) 100vw, 33vw', width: 960, height: 600, imgClass: 'zoom-img' })}
        </div>
        <div class="svc-body">
          <h3 class="svc-title">${icon('mapPin', { size: 18 })} ${esc(c.name)}</h3>
          <p class="svc-desc">${esc(c.areas)}</p>
          <span class="link-arrow" style="margin-top:auto">View ${esc(c.name)} homes ${icon('arrowRight', { size: 16 })}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>`;
};

/* ------------------------------------------------------------------ Blog */
const journal = () => `
<section class="section bg-subtle cv-auto">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({
        eyebrow: 'Design journal',
        title: 'Worth reading before you start',
        sub: 'Practical writing for homeowners on materials, planning and process — no listicles.',
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
<section class="section-sm section-divided">
  <div class="container">
    <p class="rule-label mb-8">Credentials &amp; compliance</p>
    ${credentialStrip(credentials)}
  </div>
</section>`;

/* ============================================================ EXPORT PAGE */
export default {
  route: '/',
  title: 'Residential Interior Fit-Out in Delhi, Gurgaon & Noida | Nexora Spaces LLP',
  metaTitle: 'Residential Interior Fit-Out | Nexora Spaces LLP',
  description:
    'Nexora Spaces LLP designs and builds complete home interiors across Delhi NCR — flats, apartments and villas. Fastest handover, designer-grade finish.',
  keywords:
    'residential interior fit out delhi, home interior designers gurgaon, flat interior design noida, apartment interior delhi ncr, villa interior designers, modular kitchen home interiors',
  ogImage: '/assets/img/og-default.jpg',
  preloadImage: '/assets/img/hero-1536.avif',
  crumbs: [{ label: 'Home', href: '/' }],
  faqs: faqsGeneral,
  extraSchema: [
    serviceSchema({
      name: 'Residential Interior Fit-Out & Design-Build',
      description: 'End-to-end home interior design and execution for flats, apartments and villas across Delhi, Gurugram and Noida — design, civil, modular, electrical, painting and handover under one contract.',
      serviceType: 'Residential Interior Design',
    }),
  ],
  body: [
    hero(),
    trustMarquee([
      ...trustBadges,
      { icon: 'users', label: 'In-house designers & project managers' },
      { icon: 'fileText', label: 'Scope agreed in writing before work starts' },
      { icon: 'home', label: 'Residential interiors only' },
      { icon: 'gem', label: 'Premium hardware on every home' },
    ]),
    promise(),
    statStrip(stats),
    differentiators(),
    services(),
    galleryTeaser(),
    process(),
    testimonialSection(testimonials),
    styles(),
    cities(),
    credentialsSection(),
    journal(),
    faqBlock(faqsGeneral, {
      eyebrow: 'Straight answers',
      title: 'The questions homeowners ask us',
      sub: 'Scope, timeline, warranty and process — answered honestly, including where we are not the right fit.',
    }),
    ctaBand({ source: 'home-cta' }),
  ].join('\n'),
};
