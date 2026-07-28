/**
 * Reusable page sections — composed by every page template.
 */
import { site, waLink } from '../config/site.config.js';
import { icon, iconSolid } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url, richText } from './base.js';

/* --------------------------------------------------------------- Helpers */
export const stars = (n = 5, cls = '') =>
  `<span class="stars ${cls}" aria-label="${n} out of 5 stars">${Array.from({ length: n }, () => iconSolid('star', { size: 15 })).join('')}</span>`;

export const sectionHead = ({ eyebrow, title, sub, center = false, wide = false, cls = '' }) => `
<div class="section-head${center ? ' center' : ''}${wide ? ' wide' : ''} ${cls} reveal">
  ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
  ${title ? `<h2 class="section-title">${title}</h2>` : ''}
  ${sub ? `<p class="section-sub">${sub}</p>` : ''}
</div>`;

/* ------------------------------------------------------------- Hero video
   Full-bleed interior walkthrough behind the homepage hero.

   Two modes, chosen by site.heroVideo.sources in site.config.js:

   1. REAL FOOTAGE (sources listed) — renders a muted, looping, playsinline
      <video> with a poster image. `preload="none"` plus data-src means the
      file is only fetched once the poster has painted and the viewport is
      wide enough, so it never blocks first paint and never burns mobile data.

   2. NO FOOTAGE YET (sources empty — the current state) — renders the same
      framing as a CSS cross-fading walkthrough across the gallery stills.
      It autoplays everywhere, costs nothing extra to download, and cannot
      404 on a missing video file.

   ⚠️ TODO for Roushan: drop a real interior walkthrough into assets/video/
   and list it in site.heroVideo.sources. Mode 1 then takes over on its own. */
export const heroVideo = () => {
  const { sources = [], poster, mobileBreakpoint = 768 } = site.heroVideo || {};
  const posterUrl = url(poster || '/assets/img/hero-1536.jpg');

  if (sources.length) {
    return `
<div class="hero-media hero-media-video">
  <video class="hero-video" autoplay muted loop playsinline preload="none"
         poster="${posterUrl}" aria-hidden="true" tabindex="-1"
         data-hero-video data-min-width="${mobileBreakpoint}">
    ${sources.map((s) => `<source data-src="${url(s.src)}" type="${esc(s.type)}">`).join('\n    ')}
  </video>
  <img class="hero-video-fallback" src="${posterUrl}" alt="" width="1536" height="1024"
       fetchpriority="high" decoding="async">
</div>`;
  }

  /* Fallback walkthrough — living room → kitchen → bedroom → whole home.

     Frame 1 is the LCP element, so it is served as <picture> (AVIF → WebP →
     JPEG) and is the image the page preloads. Frames 2-4 only appear after
     ~4s of cross-fade, so they stay lazy and are never on the critical path. */
  const frames = [
    { name: 'gallery/nirvaan-hall', alt: 'Living room of a completed Nexora Spaces home' },
    { name: 'gallery/nirvaan-kitchen', alt: 'Modular kitchen of a completed Nexora Spaces home' },
    { name: 'gallery/nirvaan-bedroom', alt: 'Bedroom of a completed Nexora Spaces home' },
    { name: 'gallery/nirvaan-overview', alt: 'Full home overview of a completed Nexora Spaces interior' },
  ];
  const srcset = (name, ext) =>
    `${url(`/assets/img/${name}-640.${ext}`)} 640w, ${url(`/assets/img/${name}-1400.${ext}`)} 1400w`;

  return `
<div class="hero-media hero-media-walk" data-hero-walk aria-hidden="true">
  ${frames.map((f, i) => `
  <div class="hero-frame${i === 0 ? ' is-active' : ''}" style="--i:${i}">
    <picture>
      <source type="image/avif" srcset="${srcset(f.name, 'avif')}" sizes="100vw">
      <source type="image/webp" srcset="${srcset(f.name, 'webp')}" sizes="100vw">
      <img src="${url(`/assets/img/${f.name}-1400.jpg`)}"
           srcset="${srcset(f.name, 'jpg')}"
           sizes="100vw" alt="${esc(f.alt)}" width="1400" height="933"
           ${i === 0 ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'}>
    </picture>
  </div>`).join('')}
</div>`;
};

/** The exact asset the hero paints first — kept next to the markup above so
 *  the homepage <link rel=preload> can never drift out of sync with it again.
 *  Returns the srcset too, so the preload matches the <picture> candidates
 *  rather than forcing the desktop file onto every device. */
export const heroLcp = () => {
  const usingVideo = !!(site.heroVideo && site.heroVideo.sources && site.heroVideo.sources.length);
  if (usingVideo) {
    return { href: site.heroVideo.poster || '/assets/img/hero-1536.jpg', srcset: null };
  }
  const name = 'gallery/nirvaan-hall';
  return {
    href: `/assets/img/${name}-1400.avif`,
    srcset: `${url(`/assets/img/${name}-640.avif`)} 640w, ${url(`/assets/img/${name}-1400.avif`)} 1400w`,
  };
};

/* ------------------------------------------------------------ Breadcrumbs */
export const breadcrumbs = (crumbs, onImage = true) => {
  if (!crumbs || crumbs.length < 2) return '';
  return `<nav class="crumbs${onImage ? ' on-image' : ''}" aria-label="Breadcrumb">
    ${crumbs.map((c, i) => {
      const last = i === crumbs.length - 1;
      const item = last
        ? `<span aria-current="page">${esc(c.label)}</span>`
        : `<a href="${url(c.href)}">${esc(c.label)}</a>`;
      return (i > 0 ? icon('chevronRight', { size: 12 }) : '') + item;
    }).join('')}
  </nav>`;
};

/* ------------------------------------------------------------- Page header */
/* The banner behind a page title is the LCP element on most inner pages, so
   it is served AVIF → WebP → JPEG instead of one large JPEG at every viewport.

   Callers pass a concrete derivative (…-1600.jpg or …-1200.jpg) and the two
   image families on disk have different widths — assets/img/pages/* is
   960/1600, assets/img/projects/* is 420/800/1200. So the narrower companion
   width is derived from the filename rather than assumed, otherwise the
   srcset points at derivatives that were never generated. */
const HEAD_WIDTHS = { 1600: [960, 1600], 1200: [420, 800, 1200] };

const pageHeadMedia = (image) => {
  const path = String(image).replace(/^.*\/assets\/img\//, '');
  const match = path.match(/^(.*)-(\d+)\.(jpg|jpeg|png|webp|avif)$/i);
  const base = match ? match[1] : path.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
  const largest = match ? Number(match[2]) : 1600;
  const widths = HEAD_WIDTHS[largest] || [largest];

  const set = (ext) => widths.map((w) => `${url(`/assets/img/${base}-${w}.${ext}`)} ${w}w`).join(', ');
  return `<div class="page-head-media">
    <picture>
      <source type="image/avif" srcset="${set('avif')}" sizes="100vw">
      <source type="image/webp" srcset="${set('webp')}" sizes="100vw">
      <img src="${url(`/assets/img/${base}-${largest}.jpg`)}" srcset="${set('jpg')}" sizes="100vw"
           alt="" width="1600" height="700" fetchpriority="high" decoding="async">
    </picture>
  </div>`;
};

export const pageHead = ({ crumbs, title, sub, actions = [], stats = [], image, light = false }) => `
<section class="page-head${light ? ' page-head-light' : ''}">
  ${image && !light ? pageHeadMedia(image) : ''}
  <div class="container">
    <div class="${stats.length ? 'page-head-grid' : ''}">
      <div>
        ${breadcrumbs(crumbs, !light)}
        <h1>${title}</h1>
        ${sub ? `<p class="page-head-sub">${sub}</p>` : ''}
        ${actions.length ? `<div class="page-head-actions">${actions.join('')}</div>` : ''}
      </div>
      ${stats.length ? `
      <div class="page-head-stats">
        ${stats.map((s) => `
        <div>
          <span class="stat-value">${esc(s.value)}</span>
          <span class="stat-label">${esc(s.label)}</span>
        </div>`).join('')}
      </div>` : ''}
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------- Stat strip */
export const statStrip = (items, dark = false) => `
<section class="section-sm ${dark ? 'on-dark' : 'bg-subtle'} section-divided">
  <div class="container">
    <div class="stat-strip reveal-stagger">
      ${items.map((s) => `
      <div class="stat-item">
        <span class="stat-value"><span data-count="${s.value}"${s.decimals ? ` data-decimals="${s.decimals}"` : ''}>0</span>${esc(s.suffix || '')}</span>
        <span class="stat-label">${esc(s.label)}</span>
        ${s.sub ? `<span class="stat-sub">${esc(s.sub)}</span>` : ''}
      </div>`).join('')}
    </div>
  </div>
</section>`;

/* ---------------------------------------------------------------- Marquee */
export const trustMarquee = (items) => {
  const row = items.map((t) => `<span class="marquee-item">${icon(t.icon, { size: 18 })} ${esc(t.label)}</span>`).join('');
  return `
<section class="section-sm bg-subtle">
  <div class="marquee">
    <div class="marquee-track">${row}${row}</div>
  </div>
</section>`;
};

/* ------------------------------------------------------------- Process rail */
export const processRail = (steps) => `
<div class="process-rail reveal-stagger">
  ${steps.map((s, i) => `
  <div class="process-step">
    <span class="process-dot"></span>
    <span class="process-num">Step ${String(i + 1).padStart(2, '0')}</span>
    <h3>${esc(s.title)}</h3>
    <p>${esc(s.text)}</p>
    ${s.time ? `<span class="process-time">${icon('clock', { size: 13 })} ${esc(s.time)}</span>` : ''}
  </div>`).join('')}
</div>`;

/* ------------------------------------------------------------------- FAQ */
export const faqBlock = (faqs, { title = 'Frequently asked questions', eyebrow = 'Answers', sub = '', center = false } = {}) => `
<section class="section" id="faq">
  <div class="container">
    <div class="split split-start">
      <div>
        ${sectionHead({ eyebrow, title, sub, center })}
        <div class="card bg-subtle card-flat reveal" style="border-color:var(--line-brand)">
          <div class="card-icon">${icon('headphones', { size: 24 })}</div>
          <h3 class="card-title" style="font-size:var(--fs-lg)">Still have a question?</h3>
          <p class="card-text mb-6">Talk to a senior designer — not a call-centre agent. We answer scope, cost and timeline questions honestly, even if the answer is "not yet".</p>
          <div class="btn-group">
            <a href="tel:${site.phone.tel}" class="btn btn-primary btn-sm">${icon('phone', { size: 16 })} ${esc(site.phone.display)}</a>
            <a href="${waLink()}" class="btn btn-outline btn-sm" target="_blank" rel="noopener">WhatsApp us</a>
          </div>
        </div>
      </div>
      <div class="accordion reveal" data-single="true">
        ${faqs.map((f, i) => `
        <div class="acc-item${i === 0 ? ' is-open' : ''}">
          <button class="acc-btn" aria-expanded="${i === 0}">
            <span>${esc(f.q)}</span>
            <span class="acc-icon">${icon('chevronDown', { size: 16 })}</span>
          </button>
          <div class="acc-panel"><div><div class="acc-body">${richText(f.a)}</div></div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

/* -------------------------------------------------------------- Lead form */
export const leadForm = ({
  id = 'leadForm',
  compact = false,
  heading = 'Get a free consultation',
  sub = 'Share a few details and a senior designer calls you back — no cost, no obligation.',
  source = 'website',
} = {}) => {
  const action = site.forms.endpoint || '#';
  const success = site.forms.endpoint ? url(site.forms.successRoute) : '';
  return `
<form id="${id}" class="lead-form" data-lead-form action="${action}" method="POST"
      data-success="${success}" data-wa-fallback="https://wa.me/${site.phone.whatsapp}?text=" novalidate>
  ${heading ? `<h3>${esc(heading)}</h3>` : ''}
  ${sub ? `<p class="mb-6" style="font-size:var(--fs-sm);color:inherit;opacity:.72">${esc(sub)}</p>` : ''}
  ${site.forms.accessKey ? `<input type="hidden" name="access_key" value="${site.forms.accessKey}">` : ''}
  <input type="hidden" name="_subject" value="New consultation request — ${esc(site.name)}">
  <input type="hidden" name="source" value="${esc(source)}">
  <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true"
         style="position:absolute;left:-9999px;opacity:0;height:0;width:0">

  <div class="field-row">
    <div class="field">
      <label class="field-label" for="${id}-name">Full name <span class="req">*</span></label>
      <input class="field-input" id="${id}-name" name="name" type="text" required autocomplete="name" placeholder="Your name">
      <span class="field-error"></span>
    </div>
    <div class="field">
      <label class="field-label" for="${id}-phone">Phone <span class="req">*</span></label>
      <input class="field-input" id="${id}-phone" name="phone" type="tel" required autocomplete="tel" inputmode="numeric" placeholder="10-digit number">
      <span class="field-error"></span>
    </div>
  </div>

  <div class="field-row">
    <div class="field">
      <label class="field-label" for="${id}-city">City <span class="req">*</span></label>
      <select class="field-select" id="${id}-city" name="city" required>
        <option value="">Select city</option>
        <option>Gurugram</option>
        <option>Noida / Greater Noida</option>
        <option>Delhi</option>
        <option>Ghaziabad</option>
        <option>Faridabad</option>
        <option>Other</option>
      </select>
      <span class="field-error"></span>
    </div>
    <div class="field">
      <label class="field-label" for="${id}-type">Home type <span class="req">*</span></label>
      <select class="field-select" id="${id}-type" name="home_type" required>
        <option value="">Select type</option>
        <option>Flat / Apartment</option>
        <option>Villa</option>
        <option>Independent House</option>
      </select>
      <span class="field-error"></span>
    </div>
  </div>

  <div class="field">
    <label class="field-label" for="${id}-area">Approx. area <span class="field-optional">(optional)</span></label>
    <input class="field-input" id="${id}-area" name="approx_area" type="text" inputmode="numeric"
           placeholder="e.g. 1,200 sq.ft — skip if you are not sure">
    <span class="field-error"></span>
  </div>

  ${compact ? '' : `
  <div class="field">
    <label class="field-label" for="${id}-msg">Message</label>
    <textarea class="field-textarea" id="${id}-msg" name="message" rows="3"
      placeholder="Possession date, rooms to be done, the look you have in mind…"></textarea>
  </div>`}

  <div class="field field-consent mb-6">
    <label class="consent">
      <input type="checkbox" name="consent" required>
      <span>I agree to be contacted by ${esc(site.name)} on call, SMS and WhatsApp, and accept the <a href="${url('/privacy/')}">privacy policy</a>.</span>
    </label>
    <span class="field-error"></span>
  </div>

  <button type="submit" class="btn btn-accent btn-block btn-lg">
    <span class="btn-text">Request my free consultation</span>
    ${icon('arrowRight', { size: 18 })}
  </button>
  <p class="mt-4 text-center" style="font-size:var(--fs-xs);opacity:.6">
    ${icon('lock', { size: 12 })} No spam, and never any pressure. Your details stay with our design team only.
  </p>
</form>`;
};

/* ------------------------------------------------- Consultation modal
   Rendered once per page in the base layout. Any element with
   data-consult-open toggles it — that is how every "Get Free Consultation"
   button on the site works. */
export const consultModal = () => `
<div class="modal-scrim" id="consultScrim" hidden></div>
<div class="modal" id="consultModal" role="dialog" aria-modal="true"
     aria-labelledby="consultModalTitle" hidden>
  <div class="modal-panel">
    <button class="modal-close" id="consultClose" aria-label="Close consultation form">
      ${icon('close', { size: 20 })}
    </button>
    <span class="modal-eyebrow" id="consultModalTitle">
      ${icon('sparkles', { size: 14 })} Free design consultation
    </span>
    ${leadForm({
      id: 'consultForm',
      heading: '',
      sub: '',
      source: 'consult-modal',
    })}
  </div>
</div>`;

/* --------------------------------------------------------------- CTA band */
export const ctaBand = ({
  eyebrow = 'Start your project',
  title = 'Let\'s design a home you\'ll <span class="serif-italic gradient-text">never want to leave</span>',
  text = 'A free consultation with a senior designer, a concept built around how your family actually lives, and a delivery date you can hold us to.',
  points = [
    'Free consultation, no obligation',
    'Industry-fastest handover, written in the contract',
    'Designer-grade finish, value-driven throughout',
  ],
  form = true,
  source = 'cta-band',
} = {}) => `
<section class="section cta-band">
  <div class="container">
    <div class="cta-grid">
      <div class="reveal">
        <span class="eyebrow">${esc(eyebrow)}</span>
        <h2 class="section-title">${title}</h2>
        <p class="mb-8">${esc(text)}</p>
        <ul class="check-list mb-8">
          ${points.map((p) => `<li>${icon('checkCircle', { size: 18 })} <span style="color:rgba(255,255,255,.8)">${esc(p)}</span></li>`).join('')}
        </ul>
        <div class="btn-group">
          <a href="tel:${site.phone.tel}" class="btn btn-light">${icon('phone', { size: 18 })} ${esc(site.phone.display)}</a>
          <a href="${waLink()}" class="btn btn-glass" target="_blank" rel="noopener">${iconSolid('whatsapp', { size: 18 })} WhatsApp</a>
        </div>
      </div>
      ${form ? `<div class="cta-panel reveal delay-1">${leadForm({ id: 'ctaForm', compact: true, heading: 'Get a free consultation', sub: 'Takes under a minute. A senior designer calls you back.', source })}</div>` : ''}
    </div>
  </div>
</section>`;

/* ------------------------------------------------------- Testimonial cards */
export const quoteCard = (t) => `
<article class="quote-card">
  <div class="quote-mark">${iconSolid('quote', { size: 30 })}</div>
  ${stars(5)}
  <p class="quote-text mt-4">${esc(t.text)}</p>
  <div class="quote-foot">
    <span class="avatar" aria-hidden="true">${esc(t.name.charAt(0))}</span>
    <span class="quote-who">
      <span class="quote-name">${esc(t.name)}</span>
      <span class="quote-role">${esc(t.project)} · ${esc(t.location)}</span>
      ${t.verified === true ? `<span class="quote-verified">${icon('badgeCheck', { size: 12 })} Verified client</span>` : ''}
    </span>
  </div>
</article>`;

/* One [data-rail] scope wraps BOTH the arrows and the .rail they scroll.
   They used to sit in two sibling scopes, so the arrow scope contained no
   .rail and initRails threw before binding anything — dead arrows sitewide. */
export const testimonialSection = (items, { eyebrow = 'Client stories', title = 'What NCR homeowners say', sub = '' } = {}) => `
<section class="section bg-subtle cv-auto">
  <div class="container" data-rail>
    <div class="section-head-row">
      ${sectionHead({ eyebrow, title, sub })}
      <div class="rail-nav only-desktop">
        <button type="button" class="rail-btn" data-rail-prev aria-label="Show previous client stories">${icon('arrowLeft', { size: 18 })}</button>
        <button type="button" class="rail-btn" data-rail-next aria-label="Show more client stories">${icon('arrowRight', { size: 18 })}</button>
      </div>
    </div>
    <div class="rail" tabindex="0" role="group" aria-label="Client stories, scrollable">${items.map(quoteCard).join('')}</div>
    <div class="mt-8 text-center reveal">
      <a href="${url('/reviews/')}" class="link-arrow">${site.reviews.schema ? `Read all ${site.reviews.count} verified reviews` : 'Read client stories'} ${icon('arrowRight', { size: 16 })}</a>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ Folio cards
   Takes the bare project image path (e.g. /assets/img/projects/p1.jpg) and
   derives the responsive set itself. Callers used to hand-build the "-800.jpg"
   filename, which shipped a plain JPEG and ignored the AVIF/WebP derivatives
   that npm run images had already generated — roughly 40% wasted bytes on
   every portfolio grid. The first card is the LCP candidate, so it loads
   eagerly at high priority; the rest stay lazy. */
export const folioCard = (p, featured = false) => {
  const base = String(p.image).replace(/^.*\/assets\/img\//, '').replace(/(-\d+)?\.(jpg|jpeg|png|webp|avif)$/i, '');
  const set = (ext) => [420, 800, 1200]
    .map((w) => `${url(`/assets/img/${base}-${w}.${ext}`)} ${w}w`).join(', ');
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return `
<a href="${url('/portfolio/')}" class="folio-item${featured ? ' is-featured' : ''}" data-tags="${esc(p.tags.join(' '))}">
  <picture>
    <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
    <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
    <img src="${url(`/assets/img/${base}-800.jpg`)}" srcset="${set('jpg')}" sizes="${sizes}"
         alt="${esc(p.alt)}" width="800" height="600"
         ${featured ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'}>
  </picture>
  <span class="folio-veil"></span>
  <div class="folio-body">
    <span class="folio-cat">${esc(p.category)}</span>
    <h3 class="folio-title">${esc(p.title)}</h3>
    <div class="folio-meta">
      <span>${icon('mapPin', { size: 13 })} ${esc(p.location)}</span>
      <span>${icon('maximize', { size: 13 })} ${esc(p.area)}</span>
      <span>${icon('clock', { size: 13 })} ${esc(p.duration)}</span>
    </div>
    <span class="folio-cta">View project ${icon('arrowRight', { size: 15 })}</span>
  </div>
</a>`;
};

/* --------------------------------------------------- Credentials strip */
export const credentialStrip = (items) => `
<div class="grid grid-auto-sm gap-4 reveal-stagger">
  ${items.map((c) => `
  <div class="flex items-center gap-3" style="padding:var(--s-4);border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface)">
    <span style="color:var(--brand-500)">${icon(c.icon, { size: 20 })}</span>
    <span style="font-size:var(--fs-sm);font-weight:600;line-height:1.35">${esc(c.label)}</span>
  </div>`).join('')}
</div>`;
