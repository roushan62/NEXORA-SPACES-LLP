/**
 * Reusable page sections — composed by every page template.
 */
import { site, waLink } from '../config/site.config.js';
import { icon, iconSolid } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url } from './base.js';

/* --------------------------------------------------------------- Helpers */
export const stars = (n = 5, cls = '') =>
  `<span class="stars ${cls}" aria-label="${n} out of 5 stars">${Array.from({ length: n }, () => iconSolid('star', { size: 15 })).join('')}</span>`;

export const sectionHead = ({ eyebrow, title, sub, center = false, wide = false, cls = '' }) => `
<div class="section-head${center ? ' center' : ''}${wide ? ' wide' : ''} ${cls} reveal">
  ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
  ${title ? `<h2 class="section-title">${title}</h2>` : ''}
  ${sub ? `<p class="section-sub">${sub}</p>` : ''}
</div>`;

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
export const pageHead = ({ crumbs, title, sub, actions = [], stats = [], image, light = false }) => `
<section class="page-head${light ? ' page-head-light' : ''}">
  ${image && !light ? `<div class="page-head-media"><img src="${url(image)}" alt="" width="1600" height="700" fetchpriority="high" decoding="async"></div>` : ''}
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
          <div class="acc-panel"><div><div class="acc-body">${f.a}</div></div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

/* -------------------------------------------------------------- Lead form */
export const leadForm = ({
  id = 'leadForm',
  compact = false,
  heading = 'Book your free design consultation',
  sub = 'Share a few details. A senior designer calls you within 2 working hours.',
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
  <input type="hidden" name="_subject" value="New website enquiry — ${esc(site.name)}">
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
      <label class="field-label" for="${id}-phone">Mobile <span class="req">*</span></label>
      <input class="field-input" id="${id}-phone" name="phone" type="tel" required autocomplete="tel" inputmode="numeric" placeholder="10-digit number">
      <span class="field-error"></span>
    </div>
  </div>

  ${compact ? '' : `
  <div class="field">
    <label class="field-label" for="${id}-email">Email</label>
    <input class="field-input" id="${id}-email" name="email" type="email" autocomplete="email" placeholder="you@example.com">
    <span class="field-error"></span>
  </div>`}

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
      <label class="field-label" for="${id}-type">Property <span class="req">*</span></label>
      <select class="field-select" id="${id}-type" name="property" required>
        <option value="">Select type</option>
        <option>1 BHK</option>
        <option>2 BHK</option>
        <option>3 BHK</option>
        <option>4 BHK / Villa</option>
        <option>Office / Commercial</option>
      </select>
      <span class="field-error"></span>
    </div>
  </div>

  ${compact ? '' : `
  <div class="field">
    <label class="field-label" for="${id}-msg">Tell us about your project</label>
    <textarea class="field-textarea" id="${id}-msg" name="message" rows="3"
      placeholder="Possession date, rooms to be done, budget range, anything specific…"></textarea>
  </div>`}

  <label class="consent mb-6">
    <input type="checkbox" name="consent" required>
    <span>I agree to be contacted by ${esc(site.name)} on call, SMS and WhatsApp, and accept the <a href="${url('/privacy/')}">privacy policy</a>.</span>
  </label>

  <button type="submit" class="btn btn-accent btn-block btn-lg">
    <span class="btn-text">Get my free design</span>
    ${icon('arrowRight', { size: 18 })}
  </button>
  <p class="mt-4 text-center" style="font-size:var(--fs-xs);opacity:.6">
    ${icon('lock', { size: 12 })} No spam. Your details stay with our design team only.
  </p>
</form>`;
};

/* --------------------------------------------------------------- CTA band */
export const ctaBand = ({
  eyebrow = 'Start your project',
  title = 'Let\'s design a home you\'ll <span class="serif-italic gradient-text">never want to leave</span>',
  text = 'Free consultation, free 3D concept, and a fixed-price quote in 72 hours. No pressure, no hidden charges.',
  points = [
    'Free 3D design & itemised BOQ',
    '45-day delivery, written in the contract',
    '10-year warranty on modular work',
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
      ${form ? `<div class="cta-panel reveal delay-1">${leadForm({ id: 'ctaForm', compact: true, heading: 'Get your free 3D design', sub: 'Takes 40 seconds. A designer calls you within 2 working hours.', source })}</div>` : ''}
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
      ${t.verified !== false ? `<span class="quote-verified">${icon('badgeCheck', { size: 12 })} Verified client</span>` : ''}
    </span>
  </div>
</article>`;

export const testimonialSection = (items, { eyebrow = 'Client stories', title = 'What NCR homeowners say', sub = '' } = {}) => `
<section class="section bg-subtle cv-auto">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({ eyebrow, title, sub })}
      <div class="rail-nav only-desktop" data-rail>
        <button class="rail-btn" data-rail-prev aria-label="Previous">${icon('arrowLeft', { size: 18 })}</button>
        <button class="rail-btn" data-rail-next aria-label="Next">${icon('arrowRight', { size: 18 })}</button>
      </div>
    </div>
    <div data-rail>
      <div class="rail-nav only-mobile mb-4" style="display:none"></div>
      <div class="rail">${items.map(quoteCard).join('')}</div>
    </div>
    <div class="mt-8 text-center reveal">
      <a href="${url('/reviews/')}" class="link-arrow">Read all ${site.reviews.count} verified reviews ${icon('arrowRight', { size: 16 })}</a>
    </div>
  </div>
</section>`;

/* ------------------------------------------------------------ Folio cards */
export const folioCard = (p, featured = false) => `
<a href="${url('/portfolio/')}" class="folio-item${featured ? ' is-featured' : ''}" data-tags="${esc(p.tags.join(' '))}">
  <img src="${url(p.image)}" alt="${esc(p.alt)}" width="800" height="600" loading="lazy" decoding="async">
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

/* --------------------------------------------------- Credentials strip */
export const credentialStrip = (items) => `
<div class="grid grid-auto-sm gap-4 reveal-stagger">
  ${items.map((c) => `
  <div class="flex items-center gap-3" style="padding:var(--s-4);border:1px solid var(--line);border-radius:var(--r-md);background:var(--surface)">
    <span style="color:var(--brand-500)">${icon(c.icon, { size: 20 })}</span>
    <span style="font-size:var(--fs-sm);font-weight:600;line-height:1.35">${esc(c.label)}</span>
  </div>`).join('')}
</div>`;
