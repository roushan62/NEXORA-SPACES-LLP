import { site, waLink, yearsInBusiness } from '../config/site.config.js';
import { icon } from '../lib/icons.js';
import { esc } from '../lib/seo.js';
import { url } from '../layouts/base.js';
import { picture } from '../lib/picture.js';
import {
  pageHead, sectionHead, ctaBand, processRail,
} from '../layouts/sections.js';

/* ============================================================== TEAM
   Deliberately company-level: the six teams and what each one owns.
   No individual headshots or names — the site describes Nexora by
   function and accountability rather than by photos of people.      */

const teams = [
  {
    icon: 'ruler', name: 'Design studio', strength: '12 designers',
    d: 'Space planning, 3D visualisation, finish palettes, working drawings and itemised BOQs. This team decides how your home will look and function — and its drawings are the reference every other team builds to. Client briefs are held by senior designers only.',
    owns: ['Layouts, 3D views and palettes', 'Execution drawings & BOQs', 'Design sign-off at every stage'],
  },
  {
    icon: 'userCheck', name: 'Project management', strength: '6 managers + planners',
    d: 'One named project manager per home, backed by planners and expeditors. They hold the handover date, run the schedule, book the factory and site slots, and send your weekly photo report — one accountable line between you and every trade.',
    owns: ['Programme & deadline control', 'Vendor and material coordination', 'Weekly WhatsApp photo reports'],
  },
  {
    icon: 'hardHat', name: 'Production unit', strength: '20 craft + QC staff',
    d: 'Your woodwork is built in our own unit, not on your floor. CNC cutting, edge banding, membrane and PU finishing under controlled conditions, and a pre-dispatch quality check on every module before it earns a slot on the truck.',
    owns: ['CNC cutting & edge banding', 'Factory-controlled finishing', 'Pre-dispatch quality checks'],
  },
  {
    icon: 'wrench', name: 'Site execution', strength: '12 engineers & foremen',
    d: 'Site engineers, foremen and verified trade partners for civil work, plumbing, electrical, ceiling and painting. Insured teams, daily supervision, dust-sealed work zones and end-of-day housekeeping on homes the family is still living in.',
    owns: ['Civil, services and finishing trades', 'Daily on-site supervision', 'Occupied-home work discipline'],
  },
  {
    icon: 'badgeCheck', name: 'Quality & procurement', strength: '6 specialists',
    d: 'The team that checks what arrives is what was specified — brand, model, thickness, finish. Materials are bought against the written BOQ, verified on site before use, and rejected at the gate when they do not match the agreed line item.',
    owns: ['Branded, BOQ-matched purchasing', 'Material verification before use', 'Finish audits and snag listing'],
  },
  {
    icon: 'shieldCheck', name: 'Warranty & care', strength: '6 support staff',
    d: 'The desk that still answers in year eight. Snag closure at handover, hardware alignment and service visits, and a documented warranty handled by the same entity that built your home — not a call centre reading a script.',
    owns: ['Snag closure & handover documents', 'Scheduled warranty service visits', 'Post-handover support line'],
  },
];

const handoff = [
  { title: 'Design studio', text: 'Space planning, 3D views and final execution drawings are signed by you — the reference every later team builds to.', time: 'Week 1–2' },
  { title: 'Project management', text: 'Your named PM freezes the programme and books the factory and site slots against the committed date.', time: 'Week 2' },
  { title: 'Production unit', text: 'Modular joinery is cut, finished and QC-checked in the factory while site work runs in parallel.', time: 'Week 3–5' },
  { title: 'Site execution', text: 'Civil, services, ceiling and painting follow the same drawings, with installation sequenced room by room.', time: 'Week 3–6' },
  { title: 'Quality + warranty', text: 'Finish audit, snag closure and handover documents — after which the warranty desk takes over for the long run.', time: 'Handover →' },
];

const standards = [
  { icon: 'hardHat', t: 'Insured on every site', d: 'Every team member and trade partner works under site liability cover. If something goes wrong, liability is ours — it is written into the single contract you sign.' },
  { icon: 'fileText', t: 'The same documented scope', d: 'All six teams work off one written scope with named brands and quantities. There is no “the factory does it differently” — one document governs everyone.' },
  { icon: 'eye', t: 'Progress you can see', d: 'Site engineers photograph daily, and your project manager sends a weekly report on WhatsApp whether you ask or not. Remote owners never have to chase.' },
  { icon: 'heart', t: 'Respect for occupied homes', d: 'Dust-sealed work zones, protected floors and a swept site every evening. Renovation teams plan around families living in — including a working bathroom at the end of each day.' },
];

const team = {
  route: '/team/',
  title: 'Our Team — Design, Production, Site & Warranty Teams | Nexora Spaces LLP',
  metaTitle: 'Our Teams | The People Behind Your Home | Nexora',
  description:
    'The six specialised teams behind every Nexora home — design studio, project management, production, site execution, quality and warranty care, across Delhi NCR.',
  keywords: 'nexora spaces team, interior design team delhi ncr, interior company team gurgaon, interior fit-out teams noida',
  ogImage: '/assets/img/pages/about-1600.jpg',
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Our Team', href: '/team/' }],
  body: [
    pageHead({
      crumbs: [{ label: 'Home', href: '/' }, { label: 'Our Team', href: '/team/' }],
      title: 'The teams behind<br>every Nexora home',
      sub: 'One studio, six specialised teams, and a single accountable line from first sketch to warranty care. This is who actually builds your home — described by function, the way our own roster runs.',
      image: '/assets/img/pages/about-1600.jpg',
      stats: [
        { value: '62', label: 'People in-house' },
        { value: '6', label: 'Specialised teams' },
        { value: '850+', label: 'Homes delivered' },
        { value: '96%', label: 'On-time handover' },
      ],
    }),

    /* -------------------------------------------------------------------- Intro */
    `<section class="section">
      <div class="container">
        <div class="split split-start">
          <div class="reveal">
            ${sectionHead({ eyebrow: 'Who we are', title: 'One studio, organised like a relay team' })}
            <div class="prose">
              <p>A home interior project fails between functions — when the designer's drawing does not reach the factory floor, or the site electrician never hears what the carpenter needed. ${esc(site.shortName)} was structured around exactly that weakness: <strong>six teams that hand over to each other on paper</strong>, with one named project manager accountable for the whole race.</p>
              <p>We present ourselves at team level rather than parading headshots. What protects your home is not a face on a website — it is knowing which team owns which stage, and that every one of them works to the same documented scope, the same programme and the same warranty.</p>
              <p>Designers, engineers, craftspeople and service staff — 62 people in-house, plus verified trade partners, all working to one process refined over ${yearsInBusiness} years and 850+ homes across Delhi, Gurugram and Noida.</p>
            </div>
            <div class="btn-group mt-8">
              <a href="${url('/about/')}" class="btn btn-primary">Our story</a>
              <a href="${url('/process/')}" class="btn btn-ghost">The 7-stage process</a>
            </div>
          </div>
          <div class="split-media reveal delay-1" data-parallax="0.05">
            <div class="img-offset">
              ${picture({ name: 'pages/about', alt: 'Nexora Spaces studio workspace with material samples and floor plans for an active home project', widths: [960, 1600], sizes: '(max-width:1024px) 100vw, 50vw', width: 960, height: 640, className: 'img-round img-shadow' })}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    /* ---------------------------------------------------------- The six teams */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'The organisation',
          title: 'Six teams, each with a stage to own',
          sub: 'Every home passes through all six. Team sizes are our current roster — the same people, project after project, which is precisely how quality stays consistent.',
          center: true,
        })}
        <div class="grid grid-3 gap-6 reveal-stagger">
          ${teams.map((t) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(t.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(t.name)}</h3>
            <span class="badge badge-outline badge-caps mb-3" style="align-self:flex-start">${esc(t.strength)}</span>
            <p class="card-text">${esc(t.d)}</p>
            <ul class="check-list mt-4">
              ${t.owns.map((o) => `<li>${icon('check', { size: 16 })} ${esc(o)}</li>`).join('')}
            </ul>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* ------------------------------------------------------------- Handoffs */
    `<section class="section">
      <div class="container">
        ${sectionHead({
          eyebrow: 'How it flows',
          title: 'One home, five clean handovers',
          sub: 'Timings shown are for a typical 2–3 BHK turnkey home. Each handover is documented — the receiving team signs against the same drawings before work continues.',
          center: true,
        })}
        ${processRail(handoff)}
      </div>
    </section>`,

    /* ------------------------------------------------------------- Standards */
    `<section class="section bg-subtle cv-auto">
      <div class="container">
        ${sectionHead({
          eyebrow: 'Ground rules',
          title: 'Working standards every team signs up to',
          sub: 'These are operating rules with consequences attached — reviewed in induction, checked at site audits.',
          center: true,
        })}
        <div class="grid grid-2 gap-6 reveal-stagger">
          ${standards.map((s) => `
          <div class="card card-hover">
            <span class="card-icon">${icon(s.icon, { size: 22 })}</span>
            <h3 class="card-title" style="font-size:var(--fs-lg)">${esc(s.t)}</h3>
            <p class="card-text">${esc(s.d)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>`,

    /* ---------------------------------------------------------- Careers pull */
    `<section class="section">
      <div class="container">
        <div class="magnet reveal" style="margin-top:0">
          <div>
            <h3>Want to build homes with us?</h3>
            <p>We hire across the design studio, production unit, site engineering and the warranty desk — people who like documented processes and finished homes they can be proud of.</p>
          </div>
          <div class="btn-group" style="margin:0">
            <a href="${url('/careers/')}" class="btn btn-primary">${icon('briefcase', { size: 18 })} See open roles</a>
            <a href="${waLink('Hi Nexora, I would like to know about current openings on your team.')}" class="btn btn-ghost" target="_blank" rel="noopener">WhatsApp HR</a>
          </div>
        </div>
      </div>
    </section>`,

    ctaBand({ source: 'team' }),
  ].join('\n'),
};

export default [team];
