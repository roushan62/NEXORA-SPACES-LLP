/**
 * ============================================================================
 *  NEXORA SPACES LLP — SINGLE SOURCE OF TRUTH
 * ============================================================================
 *  Edit THIS file to update business details across the ENTIRE website.
 *  Every phone number, email, address, price and social link on all 30+ pages
 *  is generated from the values below.
 *
 *  Items marked  // ⚠️ REPLACE  are realistic placeholders — swap them for your
 *  real details before going live. Then run:  npm run build
 * ============================================================================
 */

export const site = {
  /* ---------------------------------------------------------------- Brand */
  name: 'Nexora Spaces',
  legalName: 'Nexora Spaces LLP',
  shortName: 'Nexora',
  tagline: 'Homes, Beautifully Built',
  foundedYear: 2020,

  /* ------------------------------------------------------------ Deployment
   * baseUrl   = the live origin (no trailing slash)
   * basePath  = sub-folder the site is served from ('' for a custom domain,
   *             '/REPO-NAME' for GitHub Project Pages)
   * Switching to a custom domain later? Set:
   *   baseUrl: 'https://www.nexoraspaces.in',  basePath: ''
   * ...and put the domain in the CNAME file. Nothing else needs to change.
   */
  baseUrl: 'https://roushan62.github.io',
  basePath: '/NEXORA-SPACES-LLP',

  /* -------------------------------------------------------------- Contact */
  phone: {
    display: '+91 98110 12345',      // ⚠️ REPLACE
    tel: '+919811012345',            // ⚠️ REPLACE — used by click-to-call
    whatsapp: '919811012345',        // ⚠️ REPLACE — country code + number, no "+"
  },
  email: {
    general: 'hello@nexoraspaces.in',    // ⚠️ REPLACE
    sales: 'projects@nexoraspaces.in',   // ⚠️ REPLACE
    careers: 'careers@nexoraspaces.in',  // ⚠️ REPLACE
  },
  hours: {
    display: 'Mon – Sat · 10:00 AM – 7:30 PM',
    schema: ['Mo-Sa 10:00-19:30'],
    sundayNote: 'Sunday site visits by appointment',
  },

  /* --------------------------------------------------------------- Studios
   * The first office with isHq:true powers the LocalBusiness schema.
   */
  offices: [
    {
      id: 'gurugram',
      isHq: true,
      city: 'Gurugram',
      label: 'Gurugram — Head Office & Experience Centre',
      street: 'Unit 812, Tower B, Emaar Digital Greens',   // ⚠️ REPLACE
      area: 'Golf Course Extension Road, Sector 61',        // ⚠️ REPLACE
      region: 'Haryana',
      postalCode: '122102',
      geo: { lat: 28.4089, lng: 77.0926 },                  // ⚠️ REPLACE
      phone: '+91 98110 12345',                             // ⚠️ REPLACE
      mapQuery: 'Emaar Digital Greens, Sector 61, Gurugram',
    },
    {
      id: 'noida',
      city: 'Noida',
      label: 'Noida — Design Studio',
      street: 'A-58, Second Floor, Sector 63',              // ⚠️ REPLACE
      area: 'Noida Electronic City',                        // ⚠️ REPLACE
      region: 'Uttar Pradesh',
      postalCode: '201301',
      geo: { lat: 28.6206, lng: 77.3719 },                  // ⚠️ REPLACE
      phone: '+91 98110 12346',                             // ⚠️ REPLACE
      mapQuery: 'A-58 Sector 63, Noida',
    },
    {
      id: 'delhi',
      city: 'New Delhi',
      label: 'South Delhi — Client Lounge',
      street: 'First Floor, 45 Ring Road',                  // ⚠️ REPLACE
      area: 'Lajpat Nagar IV',                              // ⚠️ REPLACE
      region: 'Delhi',
      postalCode: '110024',
      geo: { lat: 28.5674, lng: 77.2436 },                  // ⚠️ REPLACE
      phone: '+91 98110 12347',                             // ⚠️ REPLACE
      mapQuery: 'Lajpat Nagar IV, New Delhi',
    },
  ],

  /* ------------------------------------------------------- Statutory / legal */
  legal: {
    llpin: 'AAX-8821',                       // ⚠️ REPLACE (LLP Identification No.)
    gstin: '06ABCFN1234A1Z5',                // ⚠️ REPLACE
    msme: 'UDYAM-HR-05-0012345',             // ⚠️ REPLACE
    registeredAddress: 'Unit 812, Tower B, Emaar Digital Greens, Sector 61, Gurugram, Haryana 122102', // ⚠️ REPLACE
    jurisdiction: 'Gurugram, Haryana',
  },

  /* --------------------------------------------------------------- Social */
  social: {
    instagram: 'https://www.instagram.com/nexoraspaces',   // ⚠️ REPLACE
    facebook: 'https://www.facebook.com/nexoraspaces',     // ⚠️ REPLACE
    linkedin: 'https://www.linkedin.com/company/nexoraspaces', // ⚠️ REPLACE
    youtube: 'https://www.youtube.com/@nexoraspaces',      // ⚠️ REPLACE
    pinterest: 'https://in.pinterest.com/nexoraspaces',    // ⚠️ REPLACE
  },

  /* --------------------------------------------------------------- Reviews
   * ⚠️ IMPORTANT: only keep schema:true once these numbers reflect REAL,
   * verifiable reviews. Fake rating markup can trigger a Google penalty.
   */
  reviews: {
    rating: 4.9,
    count: 218,
    // Keep disabled until the Google Business Profile rating/count and the
    // testimonials below are real and verifiable. Enabling unverified review
    // markup can trigger a Google structured-data manual action.
    schema: false,
    googleUrl: 'https://g.page/nexoraspaces',              // ⚠️ REPLACE
  },

  /* ----------------------------------------------------------- Lead forms
   * The form posts to our own PHP function on Vercel (see api/contact.php),
   * which emails the enquiry to site.forms.inbox.
   *
   * ⚠️ AFTER YOUR FIRST `vercel deploy`, paste the deployment URL below.
   *    Vercel gives you a stable production domain such as
   *      https://nexora-spaces.vercel.app
   *    so the endpoint becomes
   *      https://nexora-spaces.vercel.app/api/contact
   *
   * Leave `endpoint` empty and the form still works — it falls back to
   * opening WhatsApp with the enquiry pre-filled, so no lead is ever lost.
   *
   * Other backends drop in unchanged if you ever prefer one:
   *   Formspree → 'https://formspree.io/f/xxxxxxx'
   *   Web3Forms → 'https://api.web3forms.com/submit' + accessKey
   */
  forms: {
    endpoint: '',                 // ⚠️ REPLACE after deploying, e.g. 'https://your-project.vercel.app/api/contact'
    accessKey: '',                // only for Web3Forms
    successRoute: '/thank-you/',
    /* ⚠️ PLACEHOLDER inbox — this is the testing address. Change it here AND
       in the Vercel MAIL_TO environment variable when you go live. The env var
       is what actually routes the mail; this value is documentation only. */
    inbox: 'kingboy620478@gmail.com',
  },

  /* --------------------------------------------------------- Analytics IDs
   * Leave empty to skip loading the script entirely (keeps the site fast).
   */
  analytics: {
    ga4: '',                      // e.g. 'G-XXXXXXXXXX'
    gtm: '',                      // e.g. 'GTM-XXXXXXX'
    searchConsoleVerification: '',// google-site-verification content value
  },

  /* -------------------------------------------------------------- Promises
   * Worded, never numeric where money is concerned. The site must not display
   * prices, rates, EMI or any calculated amount anywhere — see README.
   */
  guarantees: {
    warrantyYears: 10,
    warrantyLabel: 'Long-Term Warranty',
    warrantyDetail: 'A documented, written warranty on modular woodwork and hardware',
    deliveryLabel: 'Industry-Fastest Handover',
    deliveryDetail: 'Committed handover dates written into your contract, not promised verbally',
    valueLabel: 'Value-Driven Pricing',
    valueDetail: 'Budget-smart luxury — designer-grade finish without the designer-brand markup',
    qualityLabel: 'Best-in-Class Execution',
    qualityDetail: 'Factory-finished modular work and supervised site delivery on every home',
    milestonePayments: true,
  },

  /* ------------------------------------------------------------ Hero video
   * Full-bleed interior walkthrough behind the homepage hero.
   *
   * `sources` is intentionally EMPTY until real footage is supplied. While it
   * is empty the hero renders an animated, cross-fading room walkthrough built
   * from the gallery stills (autoplays everywhere, no download cost, no 404s).
   *
   * ⚠️ TO GO LIVE WITH REAL FOOTAGE: drop the files into assets/video/ and list
   * them here, smallest/most-compatible last. Nothing else needs to change.
   *   sources: [
   *     { src: '/assets/video/home-walkthrough.webm', type: 'video/webm' },
   *     { src: '/assets/video/home-walkthrough.mp4',  type: 'video/mp4'  },
   *   ],
   */
  heroVideo: {
    sources: [],
    poster: '/assets/img/hero-1536.jpg',
    /* Below this viewport width the <video> is never fetched — the poster and
       the CSS walkthrough carry the hero, which keeps mobile data use at zero. */
    mobileBreakpoint: 768,
  },
};

/* --------------------------------------------------------------- Derived */
export const currentYear = new Date().getFullYear();
export const yearsInBusiness = currentYear - site.foundedYear;
export const hq = site.offices.find((o) => o.isHq) || site.offices[0];

export const absoluteUrl = (route = '/') =>
  `${site.baseUrl}${site.basePath}${route}`.replace(/([^:]\/)\/+/g, '$1');

export const waLink = (message) =>
  `https://wa.me/${site.phone.whatsapp}?text=${encodeURIComponent(
    message || `Hi ${site.name}, I'd like a free design consultation for my home interiors.`
  )}`;

export default site;
