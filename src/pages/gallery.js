import { site } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import { pageHead, sectionHead, ctaBand, testimonialSection } from '../layouts/sections.js';
import { galleryPackages, galleryFilters, roomOrder } from '../data/gallery.js';
import { testimonials } from '../data/content.js';

/* ------------------------------------------------------------ Package card
   The cover card. Clicking it opens the lightbox (see app.js → initGallery),
   which walks through all eight rooms of that home. The <a> href points at the
   package anchor so the card still works with JavaScript disabled. */
const packageCard = (p, i) => `
<article class="pkg-card pkg-card-lg" id="${esc(p.id)}" data-tags="${esc(p.tags.join(' '))}">
  <a class="pkg-cover" href="${url('/gallery/#' + p.id)}"
     data-gallery-open="${esc(p.id)}" aria-label="Open the ${esc(p.name)} photo set">
    <div class="pkg-media zoom-parent">
      <!-- TODO: replace with real project photo -->
      ${picture({
        name: `gallery/${p.id}-hall`, alt: p.rooms.hall.alt,
        widths: [640, 1400], sizes: '(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw',
        width: 640, height: 427, imgClass: 'zoom-img',
        priority: i === 0,
      })}
      <span class="pkg-count">${icon('image', { size: 13 })} ${roomOrder.length} rooms</span>
      <span class="pkg-open">${icon('maximize', { size: 18 })}<span>View full home</span></span>
    </div>
  </a>
  <div class="pkg-body">
    <div class="pkg-meta">
      <span class="badge badge-outline badge-caps">${esc(p.config)}</span>
      <span class="pkg-style">${esc(p.style)}</span>
    </div>
    <h3 class="pkg-name">${esc(p.name)}</h3>
    <p class="pkg-summary">${esc(p.summary)}</p>
    <ul class="pkg-highlights">
      ${p.highlights.map((h) => `<li>${icon('check', { size: 15 })} ${esc(h)}</li>`).join('')}
    </ul>
    <button type="button" class="btn btn-outline btn-block"
            aria-label="Walk through all ${roomOrder.length} rooms of the ${esc(p.name)}"
            data-gallery-open="${esc(p.id)}">
      ${icon('image', { size: 16 })} Walk through all ${roomOrder.length} rooms
    </button>
  </div>
</article>`;

/* ----------------------------------------------------------- Lightbox data
   Every room image for every package is emitted once as a JSON payload the
   runtime reads. Keeps the DOM light (no 80 hidden <img> tags) while still
   being fully static and dependency-free. */
const galleryData = () => {
  const data = galleryPackages.map((p) => ({
    id: p.id,
    name: p.name,
    config: p.config,
    style: p.style,
    rooms: roomOrder.map((r) => ({
      label: r.label,
      caption: p.rooms[r.id].caption,
      alt: p.rooms[r.id].alt,
      src: url(`/assets/img/gallery/${p.id}-${r.id}-1400.jpg`),
      srcset: `${url(`/assets/img/gallery/${p.id}-${r.id}-640.webp`)} 640w, ${url(`/assets/img/gallery/${p.id}-${r.id}-1400.webp`)} 1400w`,
      thumb: url(`/assets/img/gallery/${p.id}-${r.id}-640.jpg`),
    })),
  }));
  return `<script type="application/json" id="galleryData">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
};

/* -------------------------------------------------------------- Lightbox */
const lightbox = () => `
<div class="lb" id="lightbox" role="dialog" aria-modal="true" aria-label="Home package gallery" hidden>
  <div class="lb-bar">
    <div class="lb-title">
      <strong id="lbName"></strong>
      <span id="lbRoom"></span>
    </div>
    <div class="lb-tools">
      <span class="lb-counter" id="lbCount"></span>
      <button type="button" class="lb-btn" id="lbClose" aria-label="Close gallery">${icon('close', { size: 20 })}</button>
    </div>
  </div>

  <button type="button" class="lb-nav lb-prev" id="lbPrev" aria-label="Previous room">${icon('chevronLeft', { size: 26 })}</button>
  <button type="button" class="lb-nav lb-next" id="lbNext" aria-label="Next room">${icon('chevronRight', { size: 26 })}</button>

  <figure class="lb-stage">
    <img id="lbImg" src="${url('/assets/img/gallery/aurelia-overview-1400.jpg')}" alt=""
         width="1400" height="933" decoding="async">
    <figcaption class="lb-caption" id="lbCaption"></figcaption>
  </figure>

  <div class="lb-thumbs" id="lbThumbs" role="tablist" aria-label="Rooms in this home"></div>
</div>`;

export default {
  route: '/gallery/',
  title: 'Home Interior Gallery — 10 Complete Packages | Nexora Spaces LLP',
  metaTitle: 'Home Interior Gallery | Nexora Spaces LLP',
  description:
    'Ten complete home interior packages from Nexora Spaces — walk through the hall, kitchen, bedrooms, puja room, washrooms, walk-in wardrobe and passage of each home.',
  keywords:
    'home interior gallery delhi ncr, flat interior design photos, 2 bhk interior package, 3 bhk interior design gallery, villa interior photos, puja room design, modular kitchen gallery',
  ogImage: '/assets/img/og-default.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery/' }],
  extraSchema: [{
    '@type': 'CollectionPage',
    '@id': `${site.baseUrl}${site.basePath}/gallery/#collection`,
    name: 'Nexora Spaces home interior gallery',
    description: 'Complete residential interior packages across Delhi NCR, shown room by room.',
    hasPart: galleryPackages.map((p) => ({
      '@type': 'ImageGallery',
      name: p.name,
      description: p.summary,
      image: `${site.baseUrl}${site.basePath}/assets/img/gallery/${p.id}-hall-1400.jpg`,
    })),
  }],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery/' }],
      title: 'Complete homes,<br>not pretty corners',
      sub: 'Ten full home packages. Each one walks you through every room we deliver — living and hall, kitchen, bedrooms, puja room, washrooms, walk-in wardrobe, passage, and the home as a whole.',
      image: '/assets/img/pages/portfolio-1600.jpg',
      actions: [
        `<button type="button" class="btn btn-accent btn-lg" aria-label="Open the free consultation form" data-consult-open>${icon('sparkles', { size: 18 })} Get free consultation</button>`,
        `<a href="${url('/services/turnkey-interiors/')}" class="btn btn-glass btn-lg">See what's included</a>`,
      ],
    }),

    /* ------------------------------------------------------------ Grid */
    `<section class="section">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({
            eyebrow: 'Home packages',
            title: `${galleryPackages.length} complete homes to walk through`,
            sub: 'Filter by home size, then open any package to move through it room by room.',
          })}
        </div>

        <div class="filters mb-10 reveal" data-filter-group data-filter-target="#pkgGrid" data-filter-empty="#pkgEmpty">
          ${galleryFilters.map((f, i) => `
          <button class="filter-pill${i === 0 ? ' is-active' : ''}" data-filter="${esc(f.id)}" aria-pressed="${i === 0}">
            ${esc(f.label)}
          </button>`).join('')}
        </div>

        <div class="pkg-grid pkg-grid-lg reveal-stagger" id="pkgGrid">
          ${galleryPackages.map(packageCard).join('')}
        </div>

        <p id="pkgEmpty" style="display:none;text-align:center;padding:var(--s-16) 0;color:var(--text-muted)">
          ${icon('search', { size: 32 })}<br><br>No homes match that filter yet — try another.
        </p>

        <div class="alert alert-brand mt-10 reveal">
          ${icon('info', { size: 20 })}
          <p><span class="alert-title">About this gallery</span>
          These sets are shown to illustrate scope, finish and room coverage. Photography of your own home is
          taken at handover, with your permission, and never used without it.</p>
        </div>
      </div>
    </section>`,

    /* --------------------------------------------------------- Room list */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'What every package covers',
          title: 'The eight spaces we detail in every home',
          sub: 'A home is not finished when the living room photographs well. These are the spaces that decide whether it actually works day to day.',
          center: true,
        })}
        <div class="grid grid-4 gap-5 reveal-stagger">
          ${[
            { icon: 'sofa', label: 'Living / hall', text: 'Seating layout, TV panelling, feature walls and the first impression from the door.' },
            { icon: 'kitchen', label: 'Modular kitchen', text: 'Work triangle, tall storage, counters, dado and appliance integration.' },
            { icon: 'bed', label: 'Bedrooms', text: 'Bedbacks, storage beds, wardrobes, side niches and reading light.' },
            { icon: 'sparkles', label: 'Puja room', text: 'A dedicated mandir — freestanding, niche or full room — detailed properly.' },
            { icon: 'droplet', label: 'Washrooms', text: 'Vanities, mirrors, fittings, niches and anti-skid, easy-clean surfaces.' },
            { icon: 'package', label: 'Walk-in wardrobe', text: 'Hanging, folding, drawers and sensor lighting planned around what you own.' },
            { icon: 'compass', label: 'Passage / corridor', text: 'The circulation that usually gets ignored — lit, finished and made useful.' },
            { icon: 'home', label: 'The whole home', text: 'One palette, one lighting language, and joinery that lines up room to room.' },
          ].map((r) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(r.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-base)">${esc(r.label)}</h3>
            <p class="card-text" style="font-size:var(--fs-sm)">${esc(r.text)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    testimonialSection(testimonials, {
      eyebrow: 'Client stories',
      title: 'What the families in these homes say',
    }),

    ctaBand({
      eyebrow: 'Your home next',
      title: 'Want a package<br><span class="serif-italic gradient-text">built around your home?</span>',
      text: 'Send us your floor plan and we will show you what is possible, room by room — free, and with no obligation to proceed.',
      points: ['A concept built around your actual layout', 'Materials and finishes named in writing', 'No obligation to proceed'],
      source: 'gallery',
    }),

    galleryData(),
    lightbox(),
  ].join('\n'),
};
