/**
 * Base HTML shell — every page is rendered through this.
 * Guarantees consistent SEO, navigation, footer and performance hints.
 */
import { site, hq, currentYear, absoluteUrl, waLink, yearsInBusiness } from '../config/site.config.js';
import { nav, footerNav, serviceAreas, legalNav } from './../lib/nav.js';
import { icon, iconSolid, spriteFor } from '../lib/icons.js';
import {
  metaTags, orgSchema, websiteSchema, webPageSchema,
  breadcrumbSchema, faqSchema, jsonLd, esc,
} from '../lib/seo.js';
import { consultModal } from './sections.js';

/* Resolve a root-relative href to include the deploy basePath */
export const url = (href = '/') => {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  return `${site.basePath}${href}`.replace(/\/{2,}/g, '/') || '/';
};

/**
 * Rewrite root-relative links inside authored rich text (FAQ answers, blog
 * bodies) so they respect the deploy basePath. Without this, a hand-written
 * <a href="/warranty/"> in content data 404s on GitHub Project Pages.
 */
export const richText = (html = '') =>
  String(html).replace(/(href|src)="(\/(?!\/)[^"]*)"/g, (m, attr, href) => `${attr}="${url(href)}"`);

/* ------------------------------------------------------------------- Logo */
export const logoMark = (size = 42) => `
<svg class="brand-mark" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" role="img" aria-label="${esc(site.legalName)} logo">
  <defs>
    <linearGradient id="nxGold" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
      <stop stop-color="#9B7028"/><stop offset=".45" stop-color="#CFA54F"/><stop offset="1" stop-color="#EAD7A8"/>
    </linearGradient>
  </defs>
  <rect x="1.25" y="1.25" width="45.5" height="45.5" rx="11" stroke="url(#nxGold)" stroke-width="1.5"/>
  <path d="M15 34V15.5c0-.35.42-.52.66-.27L32 32.2" stroke="url(#nxGold)" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M33 14v18.5c0 .35-.42.52-.66.27L16 15.8" stroke="url(#nxGold)" stroke-width="2.6" stroke-linecap="round" opacity=".55"/>
</svg>`;

const brandBlock = (cls = '') => `
<a href="${url('/')}" class="brand ${cls}" aria-label="${esc(site.legalName)} home">
  ${logoMark()}
  <span class="brand-text">
    <span class="brand-name">${esc(site.name)}</span>
    <span class="brand-tag">${esc(site.tagline)}</span>
  </span>
</a>`;

/* --------------------------------------------------------- Announcement */
const announceBar = () => `
<div class="announce">
  <div class="container announce-inner">
    <span class="announce-item announce-primary">
      ${icon('sparkles', { size: 14 })}
      <span>Residential interiors only — <strong>free design consultation</strong></span>
    </span>
    <span class="announce-sep" aria-hidden="true">|</span>
    <span class="announce-item">
      ${icon('mapPin', { size: 14 })}
      <span>Gurugram · Noida · Delhi</span>
    </span>
    <span class="announce-sep" aria-hidden="true">|</span>
    <span class="announce-item">
      ${icon('phone', { size: 14 })}
      <a href="tel:${site.phone.tel}">${esc(site.phone.display)}</a>
    </span>
  </div>
</div>`;

/* ---------------------------------------------------------------- Navbar */
const megaColumn = (col) => `
<div class="mega-col">
  <p class="mega-col-title">${esc(col.title)}</p>
  ${col.links.map((l) => `
    <a href="${url(l.href)}" class="mega-link">
      <span class="mega-ico">${icon(l.icon || 'chevronRight', { size: 18 })}</span>
      <span>
        <span class="mega-name">${esc(l.label)}${l.tag ? ` <span class="badge badge-accent badge-caps">${esc(l.tag)}</span>` : ''}</span>
        <span class="mega-desc">${esc(l.desc || '')}</span>
      </span>
    </a>`).join('')}
</div>`;

const navbar = () => `
<header class="navbar" id="navbar">
  <div class="container nav-inner">
    ${brandBlock()}

    <nav class="nav-menu" aria-label="Primary">
      ${nav.map((item) => {
        if (!item.columns) {
          return `<div class="nav-item"><a href="${url(item.href)}" class="nav-link">${esc(item.label)}</a></div>`;
        }
        const cols = item.columns.map(megaColumn).join('');
        const feature = item.feature ? `
          <div class="mega-feature">
            <div>
              <h4>${esc(item.feature.title)}</h4>
              <p>${esc(item.feature.text)}</p>
            </div>
            <a href="${url(item.feature.href)}" class="link-arrow">${esc(item.feature.cta)} ${icon('arrowRight', { size: 16 })}</a>
          </div>` : '';
        const gridCls = item.feature ? 'mega-grid mega-grid-3' : `mega-grid${item.columns.length > 2 ? ' mega-grid-3' : ''}`;
        return `
        <div class="nav-item">
          <a href="${url(item.href)}" class="nav-link" aria-haspopup="true">
            ${esc(item.label)}
            ${item.badge ? `<span class="badge badge-accent badge-caps">${esc(item.badge)}</span>` : ''}
            ${icon('chevronDown', { size: 14 })}
          </a>
          <div class="mega ${item.mega === 'wide' ? 'mega-wide' : ''}">
            <div class="${gridCls}">${cols}${feature}</div>
            <div class="mega-foot">
              <span>${icon('shieldCheck', { size: 15 })} ${site.guarantees.qualityLabel} · ${site.guarantees.deliveryLabel}</span>
              <a href="${url(item.href)}" class="link-arrow">View all ${esc(item.label.toLowerCase())} ${icon('arrowRight', { size: 15 })}</a>
            </div>
          </div>
        </div>`;
      }).join('')}
    </nav>

    <div class="nav-actions">
      <a href="tel:${site.phone.tel}" class="nav-phone" aria-label="Call ${esc(site.phone.display)}">
        ${icon('phone', { size: 16 })}<span>${esc(site.phone.display)}</span>
      </a>
      <a href="${url('/gallery/')}" class="btn btn-outline btn-sm">View our work</a>
      <button type="button" class="btn btn-primary btn-sm" data-consult-open>Free consultation</button>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">
        <span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>
      </button>
    </div>
  </div>
</header>`;

/* --------------------------------------------------------- Mobile drawer */
const drawer = () => `
<div class="drawer-scrim" id="drawerScrim" aria-hidden="true"></div>
<aside class="drawer" id="drawer" aria-hidden="true" aria-label="Mobile navigation">
  <div class="drawer-head">
    ${brandBlock()}
    <button class="drawer-close" id="drawerClose" aria-label="Close menu">${icon('close', { size: 20 })}</button>
  </div>
  <div class="drawer-body">
    ${nav.map((item) => {
      if (!item.columns) {
        return `<div class="drawer-group"><a href="${url(item.href)}" class="drawer-link">${esc(item.label)}</a></div>`;
      }
      const links = item.columns.flatMap((c) => c.links);
      return `
      <div class="drawer-group">
        <button class="drawer-link drawer-toggle" aria-expanded="false">
          ${esc(item.label)} ${icon('chevronDown', { size: 18 })}
        </button>
        <div class="drawer-sub">
          <div class="pad-b">
            <a href="${url(item.href)}"><strong>All ${esc(item.label)}</strong></a>
            ${links.map((l) => `<a href="${url(l.href)}">${esc(l.label)}</a>`).join('')}
          </div>
        </div>
      </div>`;
    }).join('')}
    <div class="drawer-group"><a href="${url('/contact/')}" class="drawer-link">Contact</a></div>
  </div>
  <div class="drawer-foot">
    <button type="button" class="btn btn-primary btn-block" data-consult-open>Get free consultation</button>
    <a href="${waLink()}" class="btn btn-whatsapp btn-block" target="_blank" rel="noopener">
      ${iconSolid('whatsapp', { size: 18 })} Chat on WhatsApp
    </a>
    <div class="drawer-contact">${icon('phone', { size: 16 })} <a href="tel:${site.phone.tel}">${esc(site.phone.display)}</a></div>
    <div class="drawer-contact">${icon('clock', { size: 16 })} <span>${esc(site.hours.display)}</span></div>
  </div>
</aside>`;

/* ------------------------------------------------------------ Mobile dock */
const mobileDock = () => `
<nav class="mobile-dock" id="mobileDock" aria-label="Quick actions">
  <div class="mobile-dock-inner">
    <a href="tel:${site.phone.tel}" class="dock-item">${icon('phone', { size: 19 })}<span>Call</span></a>
    <a href="${waLink()}" class="dock-item wa" target="_blank" rel="noopener">${iconSolid('whatsapp', { size: 19 })}<span>WhatsApp</span></a>
    <button type="button" class="dock-item primary" aria-label="Open the free consultation form" data-consult-open>${icon('calendar', { size: 19 })}<span>Free consult</span></button>
  </div>
</nav>`;

/* ---------------------------------------------------------------- Footer */
const footer = () => `
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        ${brandBlock()}
        <p class="footer-about">
          ${esc(site.legalName)} is a residential interior fit-out and design-build studio for
          homes across Delhi, Gurugram and Noida — flats, apartments, villas and individual rooms.
          In-house designers, own production, and one contract from concept to handover.
        </p>
        <ul class="footer-contact">
          <li>${icon('mapPin', { size: 16 })}<span>${esc(hq.street)},<br>${esc(hq.area)}, ${esc(hq.city)} ${esc(hq.postalCode)}</span></li>
          <li>${icon('phone', { size: 16 })}<a href="tel:${site.phone.tel}">${esc(site.phone.display)}</a></li>
          <li>${icon('mail', { size: 16 })}<a href="mailto:${site.email.general}">${esc(site.email.general)}</a></li>
          <li>${icon('clock', { size: 16 })}<span>${esc(site.hours.display)}</span></li>
        </ul>
        <div class="footer-social">
          <a href="${site.social.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${icon('instagram', { size: 17 })}</a>
          <a href="${site.social.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${icon('facebook', { size: 17 })}</a>
          <a href="${site.social.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${icon('linkedin', { size: 17 })}</a>
          <a href="${site.social.youtube}" target="_blank" rel="noopener noreferrer" aria-label="YouTube">${icon('youtube', { size: 17 })}</a>
          <a href="${site.social.pinterest}" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">${icon('pinterest', { size: 17 })}</a>
        </div>
      </div>

      ${footerNav.map((col) => `
      <div class="footer-col">
        <h4>${esc(col.title)}</h4>
        <ul>${col.links.map((l) => `<li><a href="${url(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>
      </div>`).join('')}
    </div>

    <div class="footer-areas">
      <h4>Interior design services across Delhi NCR</h4>
      <ul class="area-links">
        ${serviceAreas.map((a) => `<li><a href="${url(a.href)}">${esc(a.label)}</a></li>`).join('')}
      </ul>
    </div>

    <div class="footer-bottom">
      <div>
        <p>&copy; ${currentYear} ${esc(site.legalName)}. All rights reserved.</p>
        <p class="footer-reg">LLPIN: ${esc(site.legal.llpin)} · GSTIN: ${esc(site.legal.gstin)} · ${esc(site.legal.msme)}</p>
      </div>
      <div class="footer-legal-links">
        ${legalNav.map((l) => `<a href="${url(l.href)}">${esc(l.label)}</a>`).join('')}
      </div>
    </div>
  </div>
</footer>`;

/* -------------------------------------------------------- Floating layer */
const floatingLayer = () => `
<div class="float-stack">
  <button class="fab fab-top" id="toTop" aria-label="Back to top">${icon('chevronUp', { size: 20 })}</button>
  <a href="${waLink()}" class="fab fab-wa" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
    <span class="fab-label">Chat with a designer</span>
    ${iconSolid('whatsapp', { size: 26 })}
  </a>
</div>
<div class="toast" id="toast" role="status" aria-live="polite">
  ${icon('checkCircle', { size: 20 })}<span class="toast-text"></span>
</div>`;

/* ------------------------------------------------------------- Analytics */
const analytics = () => {
  const { ga4, gtm } = site.analytics;
  let out = '';
  if (gtm) {
    out += `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');</script>`;
  }
  if (ga4) {
    out += `<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}',{anonymize_ip:true});</script>`;
  }
  return out;
};

/* ============================================================ RENDER PAGE */
export function renderPage(page) {
  const {
    route = '/',
    body = '',
    crumbs = null,
    faqs = null,
    extraSchema = [],
    bodyClass = '',
    preloadImage = null,
  } = page;

  const schema = jsonLd([
    orgSchema(),
    websiteSchema(),
    webPageSchema(page),
    breadcrumbSchema(crumbs, route),
    faqSchema(faqs, route),
    ...extraSchema,
  ]);

  const asset = (p) => url(p);

  /* Assemble the document body first, then generate an icon sprite containing
     ONLY the symbols this page actually references. Each <svg><use> is ~90
     bytes instead of repeating full path data for every occurrence. */
  const pageBody = `
<a href="#main" class="skip-link">Skip to main content</a>
<div class="scroll-bar" id="scrollBar" aria-hidden="true"></div>

${announceBar()}
${navbar()}
${drawer()}

<main id="main">
${body}
</main>

${footer()}
${mobileDock()}
${floatingLayer()}
${consultModal()}`;

  const sprite = spriteFor(pageBody);

  return `<!DOCTYPE html>
<html lang="en-IN" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${metaTags(page)}

<link rel="preconnect" href="${site.baseUrl}">
<link rel="preload" as="font" type="font/woff2" href="${asset('/assets/fonts/inter-var.woff2')}" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="${asset('/assets/fonts/fraunces-var.woff2')}" crossorigin>
${preloadImage ? `<link rel="preload" as="image" href="${asset(preloadImage)}" fetchpriority="high">` : ''}

<link rel="stylesheet" href="${asset('/assets/css/main.css')}">

<link rel="icon" href="${asset('/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset('/assets/img/logo-192.png')}">
<link rel="manifest" href="${asset('/site.webmanifest')}">

${schema}
${analytics()}
</head>
<body class="${bodyClass}">
${sprite}
${pageBody}

<script src="${asset('/assets/js/app.js')}" defer></script>
</body>
</html>`;
}

export { icon, iconSolid, esc, site, hq, currentYear, yearsInBusiness, waLink, absoluteUrl };
