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
  tagline: 'Design · Build · Deliver',
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
    schema: true,
    googleUrl: 'https://g.page/nexoraspaces',              // ⚠️ REPLACE
  },

  /* ----------------------------------------------------------- Lead forms
   * No backend needed. Pick ONE:
   *  1. Formspree  → endpoint: 'https://formspree.io/f/xxxxxxx'
   *  2. Web3Forms  → endpoint: 'https://api.web3forms.com/submit' + accessKey
   *  3. Leave endpoint empty ('') → the form falls back to opening WhatsApp
   *     with the enquiry pre-filled, so you never lose a lead.
   */
  forms: {
    endpoint: '',                 // ⚠️ REPLACE with your Formspree/Web3Forms URL
    accessKey: '',                // only for Web3Forms
    successRoute: '/thank-you/',
  },

  /* --------------------------------------------------------- Analytics IDs
   * Leave empty to skip loading the script entirely (keeps the site fast).
   */
  analytics: {
    ga4: '',                      // e.g. 'G-XXXXXXXXXX'
    gtm: '',                      // e.g. 'GTM-XXXXXXX'
    searchConsoleVerification: '',// google-site-verification content value
  },

  /* -------------------------------------------------------------- Promises */
  guarantees: {
    warrantyYears: 10,
    warrantyLabel: '10-Year Warranty',
    warrantyDetail: '10 years on modular woodwork & hardware, 1 year on on-site services',
    deliveryDays: 45,
    deliveryLabel: '45-Day Delivery',
    deliveryDetail: 'Standard 45-day handover for full-home interiors, contractually committed',
    milestonePayments: true,
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
