import { site, waLink } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import { pageHead, sectionHead, ctaBand, folioCard, testimonialSection } from '../layouts/sections.js';
import { projects, testimonials } from '../data/content.js';

const filters = [
  { id: 'all', label: 'All projects' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: '2bhk', label: '2 BHK' },
  { id: '3bhk', label: '3 BHK' },
  { id: 'villa', label: 'Villas' },
  { id: 'kitchen', label: 'Kitchens' },
  { id: 'gurugram', label: 'Gurugram' },
  { id: 'noida', label: 'Noida' },
  { id: 'delhi', label: 'Delhi' },
];

export default {
  route: '/portfolio/',
  title: 'Interior Design Portfolio — Delhi, Gurgaon & Noida Projects | Nexora Spaces',
  metaTitle: 'Portfolio | Interior Design Projects in Delhi NCR',
  description:
    'Completed interior projects across Delhi, Gurugram and Noida — apartments, villas, kitchens and offices, with real areas, timelines and budgets.',
  keywords: 'interior design portfolio delhi, interior design projects gurgaon, home interior gallery noida, before after interior design india',
  ogImage: '/assets/img/pages/portfolio-1600.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Portfolio', href: '/portfolio/' }],
  extraSchema: [{
    '@type': 'CollectionPage',
    '@id': `${site.baseUrl}${site.basePath}/portfolio/#collection`,
    name: 'Nexora Spaces Interior Design Portfolio',
    description: 'Completed interior design and fit-out projects across Delhi NCR.',
    hasPart: projects.map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      description: p.summary,
      locationCreated: { '@type': 'Place', name: p.location },
      image: `${site.baseUrl}${site.basePath}/assets/img/projects/${p.image.split('/').pop().replace('.jpg', '')}-1200.jpg`,
    })),
  }],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Portfolio', href: '/portfolio/' }],
      title: 'Work we have<br>actually handed over',
      sub: 'Every project below is a real handover with a real budget and a real timeline. No renders posing as photographs, no competitor work borrowed for the gallery.',
      image: '/assets/img/pages/portfolio-1600.jpg',
      stats: [
        { value: '850+', label: 'Projects delivered' },
        { value: '4.2 L', label: 'Sq.ft executed' },
        { value: '18+', label: 'NCR micro-markets' },
        { value: '96%', label: 'On-time handover' },
      ],
    }),

    /* -------------------------------------------------------- Gallery */
    `<section class="section">
      <div class="container">
        <div class="section-head-row">
          ${sectionHead({ eyebrow: 'Gallery', title: 'Browse by type or city' })}
        </div>
        <div class="filters mb-10 reveal" data-filter-group data-filter-target="#folioGrid" data-filter-empty="#folioEmpty">
          ${filters.map((f, i) => `
          <button class="filter-pill${i === 0 ? ' is-active' : ''}" data-filter="${esc(f.id)}" aria-pressed="${i === 0}">
            ${esc(f.label)}
          </button>`).join('')}
        </div>

        <div class="folio-grid" id="folioGrid">
          ${projects.map((p, i) => folioCard(p, i === 0)).join('')}
        </div>

        <p id="folioEmpty" style="display:none;text-align:center;padding:var(--s-16) 0;color:var(--text-muted)">
          ${icon('search', { size: 32 })}<br><br>No projects match that filter yet — try another.
        </p>
      </div>
    </section>`,

    /* --------------------------------------------------- Project detail */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Case detail',
          title: 'The numbers behind each project',
          sub: 'Area, duration and final billed value — because a gallery without budgets tells you nothing useful.',
          center: true,
        })}
        <div class="table-wrap reveal">
          <table class="table">
            <thead>
              <tr><th>Project</th><th>Location</th><th class="num">Carpet area</th><th class="num">Duration</th><th class="num">Final value</th></tr>
            </thead>
            <tbody>
              ${projects.map((p) => `
              <tr>
                <td><strong>${esc(p.title)}</strong><br><span style="font-size:var(--fs-xs);color:var(--text-muted)">${esc(p.category)}</span></td>
                <td>${esc(p.location)}</td>
                <td class="num">${esc(p.area)}</td>
                <td class="num">${esc(p.duration)}</td>
                <td class="num"><strong>${esc(p.budget)}</strong></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-center mt-5" style="font-size:var(--fs-xs);color:var(--text-subtle)">
          ${icon('info', { size: 13 })} Values are final billed amounts excluding GST, shared with client permission.
        </p>
      </div>
    </section>`,

    /* ------------------------------------------------------ Before/After */
    `<section class="section" id="before-after">
      <div class="container">
        <div class="split">
          <div class="reveal">
            ${sectionHead({
              eyebrow: 'Transformation',
              title: 'Before and after',
              sub: 'Drag the handle to see what a full renovation changes. This is a real Dwarka 2 BHK — the same room, the same camera position.',
            })}
            <ul class="check-list mb-8">
              <li>${icon('checkCircle', { size: 18 })} Full-height wardrobe replaced a freestanding almirah</li>
              <li>${icon('checkCircle', { size: 18 })} Ceiling lowered with cove lighting to hide old conduits</li>
              <li>${icon('checkCircle', { size: 18 })} Fold-down study added on the window wall</li>
              <li>${icon('checkCircle', { size: 18 })} Delivered in 38 days, with the family living in</li>
            </ul>
            <a href="${url('/services/renovation/')}" class="btn btn-primary">Explore renovation ${icon('arrowRight', { size: 16 })}</a>
          </div>
          <div class="split-media reveal delay-1">
            <div class="ba" tabindex="0" role="slider" aria-label="Before and after comparison slider"
                 aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="--pos:50%">
              <picture>
                <source type="image/webp" srcset="${url('/assets/img/ba-before.webp')}">
                <img src="${url('/assets/img/ba-before.jpg')}" alt="Bedroom before renovation — dated finishes and freestanding storage" width="1000" height="625" loading="lazy" decoding="async">
              </picture>
              <picture class="ba-after">
                <source type="image/webp" srcset="${url('/assets/img/ba-after.webp')}">
                <img src="${url('/assets/img/ba-after.jpg')}" alt="The same bedroom after Nexora Spaces renovation — fitted wardrobe and layered lighting" width="1000" height="625" loading="lazy" decoding="async">
              </picture>
              <span class="ba-tag left">Before</span>
              <span class="ba-tag right">After</span>
              <span class="ba-handle"><span class="ba-knob">${icon('chevronLeft', { size: 9 })}${icon('chevronRight', { size: 9 })}</span></span>
            </div>
            <p class="mt-3 text-center" style="font-size:var(--fs-xs);color:var(--text-subtle)">
              ${icon('maximize', { size: 12 })} Drag the handle, or use arrow keys
            </p>
          </div>
        </div>
      </div>
    </section>`,

    testimonialSection(testimonials, { eyebrow: 'Client stories', title: 'What the owners of these homes say' }),
    ctaBand({
      eyebrow: 'Your project next',
      title: 'Want your home<br><span class="serif-italic gradient-text">in this gallery?</span>',
      text: 'Send us your floor plan and we will show you what is possible — with a photoreal 3D concept and an itemised BOQ, free of charge.',
      points: ['Free 3D design in 72 hours', 'Itemised, brand-named BOQ', 'No obligation to proceed'],
      source: 'portfolio',
    }),
  ].join('\n'),
};
