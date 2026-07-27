/** Site-wide information architecture. Change once, updates everywhere.
 *
 *  Residential only. There is no pricing, calculator or commercial section —
 *  the site never shows rates, and Nexora does not take office/retail work.
 */

export const nav = [
  {
    label: 'Home Interiors',
    /* navLabel: shorter text for the desktop bar only. The full `label` is
       still used in the drawer, where there is room for it. Without this the
       five links need 998px and collide with the phone number and CTA. */
    navLabel: 'Interiors',
    href: '/residential/',
    mega: 'wide',
    columns: [
      {
        title: 'By home size',
        links: [
          { label: '1 BHK Interiors', href: '/residential/1-bhk/', desc: 'Compact flats, planned to the inch', icon: 'home' },
          { label: '2 BHK Interiors', href: '/residential/2-bhk/', desc: 'Our most-delivered home size', icon: 'home', tag: 'Popular' },
          { label: '3 BHK Interiors', href: '/residential/3-bhk/', desc: 'Family homes with room to grow', icon: 'home' },
          { label: '4 BHK, Villa & Floors', href: '/residential/4-bhk-villa/', desc: 'Large-format luxury homes', icon: 'building' },
        ],
      },
      {
        title: 'By scope of work',
        links: [
          { label: 'Modular Kitchen', href: '/services/modular-kitchen/', desc: 'Factory-finished, built to last', icon: 'kitchen' },
          { label: 'Wardrobes & Storage', href: '/services/wardrobes/', desc: 'Sliding, hinged and walk-in', icon: 'package' },
          { label: 'Full Home Turnkey', href: '/services/turnkey-interiors/', desc: 'Design to handover, one contract', icon: 'key' },
          { label: 'Home Renovation', href: '/services/renovation/', desc: 'Upgrades with you still living in', icon: 'refresh' },
        ],
      },
    ],
    feature: {
      title: 'A designer-grade home, faster',
      text: 'Share your floor plan and our senior designer will walk you through the concept, the finishes and the delivery plan — free, with no obligation.',
      cta: 'Get free consultation',
      href: '/contact/',
    },
  },
  {
    label: 'Gallery',
    href: '/gallery/',
    badge: 'Full sets',
    columns: [
      {
        title: 'Complete home packages',
        links: [
          { label: 'All Home Packages', href: '/gallery/', desc: 'Ten full homes, room by room', icon: 'image', tag: 'New' },
          { label: '2 BHK Packages', href: '/gallery/#2bhk', desc: 'Compact family homes', icon: 'home' },
          { label: '3 BHK Packages', href: '/gallery/#3bhk', desc: 'Larger family layouts', icon: 'home' },
          { label: 'Villas & Floors', href: '/gallery/#villa', desc: 'Large-format residences', icon: 'building' },
        ],
      },
      {
        title: 'Explore further',
        links: [
          { label: 'Project Portfolio', href: '/portfolio/', desc: 'Homes we have handed over', icon: 'layers' },
          { label: 'Before & After', href: '/portfolio/#before-after', desc: 'See the transformation', icon: 'maximize' },
          { label: 'Client Stories', href: '/reviews/', desc: 'What homeowners tell us', icon: 'star' },
        ],
      },
    ],
  },
  {
    label: 'Services',
    href: '/services/turnkey-interiors/',
    columns: [
      {
        title: 'What we build',
        links: [
          { label: 'Full Home Interiors', href: '/services/turnkey-interiors/', desc: 'Everything, under one contract', icon: 'key' },
          { label: 'Modular Kitchen', href: '/services/modular-kitchen/', desc: 'Built in the factory, not on site', icon: 'kitchen' },
          { label: 'Wardrobes & Walk-ins', href: '/services/wardrobes/', desc: 'Storage that actually fits', icon: 'package' },
          { label: 'Home Renovation', href: '/services/renovation/', desc: 'Room-by-room or whole home', icon: 'refresh' },
        ],
      },
      {
        title: 'Finishing trades',
        links: [
          { label: 'False Ceiling & Lighting', href: '/services/turnkey-interiors/#scope', desc: 'Cove, profile and scene lighting', icon: 'lamp' },
          { label: 'Painting & Wall Finishes', href: '/services/turnkey-interiors/#scope', desc: 'Texture, veneer and panelling', icon: 'palette' },
          { label: 'Electrical & Plumbing', href: '/services/turnkey-interiors/#scope', desc: 'New points and concealed runs', icon: 'zap' },
          { label: 'Puja Room Design', href: '/services/turnkey-interiors/#scope', desc: 'Traditional detail, modern build', icon: 'sparkles' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    href: '/about/',
    columns: [
      {
        title: 'About Nexora',
        links: [
          { label: 'About Us', href: '/about/', desc: 'Who we are and how we work', icon: 'users' },
          { label: 'Our Process', href: '/process/', desc: 'The 7-stage delivery system', icon: 'compass' },
          { label: 'Quality & Warranty', href: '/warranty/', desc: 'What our warranty covers', icon: 'shieldCheck' },
          { label: 'Careers', href: '/careers/', desc: 'Join the studio', icon: 'briefcase' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Design Journal', href: '/blog/', desc: 'Guides for homeowners', icon: 'fileText' },
          { label: 'FAQs', href: '/faq/', desc: 'Straight answers, no fluff', icon: 'helpCircle' },
          { label: 'Contact & Studios', href: '/contact/', desc: 'Gurugram · Noida · Delhi', icon: 'mapPin' },
        ],
      },
    ],
  },
  {
    label: 'Where We Work',
    navLabel: 'Locations',
    href: '/interior-designers-in-gurgaon/',
    columns: [
      {
        title: 'Delhi NCR',
        links: [
          { label: 'Interiors in Gurugram', href: '/interior-designers-in-gurgaon/', desc: 'DLF, Sohna Road, Golf Course', icon: 'mapPin' },
          { label: 'Interiors in Noida', href: '/interior-designers-in-noida/', desc: 'Sectors 74–150, Greater Noida', icon: 'mapPin' },
          { label: 'Interiors in Delhi', href: '/interior-designers-in-delhi/', desc: 'South, West & Central Delhi', icon: 'mapPin' },
        ],
      },
    ],
  },
];

/** Footer link groups. */
export const footerNav = [
  {
    title: 'Home Interiors',
    links: [
      { label: '1 BHK Interiors', href: '/residential/1-bhk/' },
      { label: '2 BHK Interiors', href: '/residential/2-bhk/' },
      { label: '3 BHK Interiors', href: '/residential/3-bhk/' },
      { label: '4 BHK & Villas', href: '/residential/4-bhk-villa/' },
      { label: 'All Home Interiors', href: '/residential/' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Full Home Turnkey', href: '/services/turnkey-interiors/' },
      { label: 'Modular Kitchen', href: '/services/modular-kitchen/' },
      { label: 'Wardrobes & Storage', href: '/services/wardrobes/' },
      { label: 'Home Renovation', href: '/services/renovation/' },
      { label: 'Our Process', href: '/process/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about/' },
      { label: 'Home Gallery', href: '/gallery/' },
      { label: 'Portfolio', href: '/portfolio/' },
      { label: 'Client Stories', href: '/reviews/' },
      { label: 'Design Journal', href: '/blog/' },
      { label: 'Careers', href: '/careers/' },
    ],
  },
  {
    title: 'Plan & Support',
    links: [
      { label: 'Free Consultation', href: '/contact/' },
      { label: 'Warranty', href: '/warranty/' },
      { label: 'FAQs', href: '/faq/' },
      { label: 'Contact Us', href: '/contact/' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
];

/** Locality links — internal-linking fuel for local SEO. */
export const serviceAreas = [
  { label: 'Interior Designers in Gurgaon', href: '/interior-designers-in-gurgaon/' },
  { label: 'Interior Designers in Noida', href: '/interior-designers-in-noida/' },
  { label: 'Interior Designers in Delhi', href: '/interior-designers-in-delhi/' },
  { label: 'DLF Phase 1–5', href: '/interior-designers-in-gurgaon/' },
  { label: 'Golf Course Road', href: '/interior-designers-in-gurgaon/' },
  { label: 'Sohna Road', href: '/interior-designers-in-gurgaon/' },
  { label: 'Sector 57 Gurugram', href: '/interior-designers-in-gurgaon/' },
  { label: 'New Gurgaon (Sec 79–95)', href: '/interior-designers-in-gurgaon/' },
  { label: 'Noida Sector 150', href: '/interior-designers-in-noida/' },
  { label: 'Noida Expressway', href: '/interior-designers-in-noida/' },
  { label: 'Sector 137 Noida', href: '/interior-designers-in-noida/' },
  { label: 'Greater Noida West', href: '/interior-designers-in-noida/' },
  { label: 'Dwarka', href: '/interior-designers-in-delhi/' },
  { label: 'Saket & Greater Kailash', href: '/interior-designers-in-delhi/' },
  { label: 'Vasant Kunj', href: '/interior-designers-in-delhi/' },
  { label: 'Rohini & Pitampura', href: '/interior-designers-in-delhi/' },
  { label: 'Indirapuram, Ghaziabad', href: '/interior-designers-in-noida/' },
  { label: 'Faridabad', href: '/interior-designers-in-delhi/' },
];

export const legalNav = [
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Terms of Service', href: '/terms/' },
  { label: 'Cancellation & Refund', href: '/refund/' },
  { label: 'Warranty Policy', href: '/warranty/' },
];
