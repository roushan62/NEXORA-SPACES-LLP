/** Site-wide information architecture. Change once, updates everywhere. */

export const nav = [
  {
    label: 'Residential',
    href: '/residential/',
    mega: 'wide',
    columns: [
      {
        title: 'By home size',
        links: [
          { label: '1 BHK Interiors', href: '/residential/1-bhk/', desc: 'Compact homes, 400–550 sq.ft', icon: 'home' },
          { label: '2 BHK Interiors', href: '/residential/2-bhk/', desc: 'Most-booked package in NCR', icon: 'home', tag: 'Popular' },
          { label: '3 BHK Interiors', href: '/residential/3-bhk/', desc: 'Family homes, 1000–1300 sq.ft', icon: 'home' },
          { label: '4 BHK, Villa & Penthouse', href: '/residential/4-bhk-villa/', desc: 'Large-format luxury builds', icon: 'building' },
        ],
      },
      {
        title: 'By scope of work',
        links: [
          { label: 'Modular Kitchen', href: '/services/modular-kitchen/', desc: 'Factory-finished, 10-yr warranty', icon: 'kitchen' },
          { label: 'Wardrobes & Storage', href: '/services/wardrobes/', desc: 'Sliding, hinged and walk-in', icon: 'package' },
          { label: 'Full Home Turnkey', href: '/services/turnkey-interiors/', desc: 'Design to handover, one contract', icon: 'key' },
          { label: 'Renovation & Retrofit', href: '/services/renovation/', desc: 'Occupied-home upgrades', icon: 'refresh' },
        ],
      },
    ],
    feature: {
      title: 'Free 3D design in 72 hours',
      text: 'Share your floor plan and get a photoreal 3D concept plus an itemised BOQ — no cost, no obligation.',
      cta: 'Book a consultation',
      href: '/contact/',
    },
  },
  {
    label: 'Commercial',
    href: '/commercial/',
    badge: 'Advisory',
    columns: [
      {
        title: 'Sectors',
        links: [
          { label: 'Corporate Offices', href: '/commercial/office-interiors/', desc: 'Workplace strategy & fit-out', icon: 'briefcase' },
          { label: 'Retail & Showrooms', href: '/commercial/retail/', desc: 'Brand-led store rollouts', icon: 'store' },
          { label: 'Cafés & Restaurants', href: '/commercial/hospitality/', desc: 'F&B and hospitality concepts', icon: 'utensils' },
          { label: 'Clinics & Studios', href: '/commercial/clinics/', desc: 'Compliance-first healthcare', icon: 'stethoscope' },
        ],
      },
      {
        title: 'How we engage',
        links: [
          { label: 'Design Consultancy', href: '/commercial/#engagement', desc: 'Concept, drawings, BOQ', icon: 'ruler' },
          { label: 'Project Management', href: '/commercial/#engagement', desc: 'PMC & site supervision', icon: 'hardHat' },
          { label: 'Turnkey Fit-Out', href: '/commercial/#engagement', desc: 'Single-window execution', icon: 'layers' },
        ],
      },
    ],
  },
  {
    label: 'Work',
    href: '/portfolio/',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Full Portfolio', href: '/portfolio/', desc: '850+ completed projects', icon: 'image' },
          { label: 'Before & After', href: '/portfolio/#before-after', desc: 'See the transformation', icon: 'maximize' },
          { label: 'Client Reviews', href: '/reviews/', desc: 'Verified homeowner stories', icon: 'star' },
        ],
      },
      {
        title: 'By city',
        links: [
          { label: 'Projects in Gurugram', href: '/interior-designers-in-gurgaon/', desc: 'DLF, Sohna Road, Golf Course', icon: 'mapPin' },
          { label: 'Projects in Noida', href: '/interior-designers-in-noida/', desc: 'Sectors 74–150, Greater Noida', icon: 'mapPin' },
          { label: 'Projects in Delhi', href: '/interior-designers-in-delhi/', desc: 'South, West & Central Delhi', icon: 'mapPin' },
        ],
      },
    ],
  },
  {
    label: 'Pricing',
    href: '/pricing/',
    columns: [
      {
        title: 'Plan your budget',
        links: [
          { label: 'Packages & Inclusions', href: '/pricing/', desc: 'Essential, Signature, Luxe', icon: 'receipt' },
          { label: 'Interior Cost Calculator', href: '/cost-calculator/', desc: 'Instant NCR estimate', icon: 'calculator', tag: 'Tool' },
          { label: 'What Drives Cost', href: '/pricing/#drivers', desc: 'Material and scope guide', icon: 'trendingUp' },
          { label: 'Finance & EMI', href: '/pricing/#emi', desc: 'Interior loans and EMI', icon: 'rupee' },
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
          { label: 'Our Story & Team', href: '/about/', desc: 'Who builds your home', icon: 'users' },
          { label: 'How We Work', href: '/process/', desc: 'The 7-stage delivery system', icon: 'compass' },
          { label: 'Quality & Warranty', href: '/warranty/', desc: 'What 10 years really covers', icon: 'shieldCheck' },
          { label: 'Careers', href: '/careers/', desc: 'Join the studio', icon: 'briefcase' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Design Journal', href: '/blog/', desc: 'Guides, costs and trends', icon: 'fileText' },
          { label: 'FAQs', href: '/faq/', desc: '40+ answers, no fluff', icon: 'helpCircle' },
          { label: 'Contact & Studios', href: '/contact/', desc: 'Gurugram · Noida · Delhi', icon: 'mapPin' },
        ],
      },
    ],
  },
];

/** Footer link groups. */
export const footerNav = [
  {
    title: 'Residential',
    links: [
      { label: '1 BHK Interiors', href: '/residential/1-bhk/' },
      { label: '2 BHK Interiors', href: '/residential/2-bhk/' },
      { label: '3 BHK Interiors', href: '/residential/3-bhk/' },
      { label: '4 BHK & Villas', href: '/residential/4-bhk-villa/' },
      { label: 'Modular Kitchen', href: '/services/modular-kitchen/' },
      { label: 'Wardrobes', href: '/services/wardrobes/' },
    ],
  },
  {
    title: 'Commercial',
    links: [
      { label: 'Office Interiors', href: '/commercial/office-interiors/' },
      { label: 'Retail & Showrooms', href: '/commercial/retail/' },
      { label: 'Cafés & Restaurants', href: '/commercial/hospitality/' },
      { label: 'Clinics & Studios', href: '/commercial/clinics/' },
      { label: 'Turnkey Fit-Out', href: '/services/turnkey-interiors/' },
      { label: 'Renovation', href: '/services/renovation/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about/' },
      { label: 'Our Process', href: '/process/' },
      { label: 'Portfolio', href: '/portfolio/' },
      { label: 'Client Reviews', href: '/reviews/' },
      { label: 'Design Journal', href: '/blog/' },
      { label: 'Careers', href: '/careers/' },
    ],
  },
  {
    title: 'Plan & Support',
    links: [
      { label: 'Pricing & Packages', href: '/pricing/' },
      { label: 'Cost Calculator', href: '/cost-calculator/' },
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
