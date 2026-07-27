import { yearsInBusiness } from '../config/site.config.js';

/** Headline numbers used on the home page, about page and city pages. */
export const stats = [
  { value: 850, suffix: '+', label: 'Homes delivered', sub: 'across Delhi NCR' },
  { value: 45, suffix: ' days', label: 'Average handover', sub: 'contractually committed' },
  { value: 96, suffix: '%', label: 'On-time delivery', sub: 'FY 2025–26 audited' },
  { value: yearsInBusiness, suffix: '+ yrs', label: 'Building interiors', sub: `since ${2020}` },
];

export const statsWide = [
  { value: 850, suffix: '+', label: 'Homes & offices delivered' },
  { value: 62, suffix: '+', label: 'In-house designers & PMs' },
  { value: 18, suffix: '+', label: 'Micro-markets served' },
  { value: 4.9, suffix: '/5', label: 'Average client rating', decimals: 1 },
];

/** Trust markers shown in the hero strip and sticky proof bar. */
export const trustBadges = [
  { icon: 'shield', label: '10-Year Warranty' },
  { icon: 'clock', label: '45-Day Delivery' },
  { icon: 'receipt', label: 'Zero Hidden Costs' },
  { icon: 'hardHat', label: 'In-House Execution' },
];

/** Certification / credibility strip. Replace with your real credentials. */
export const credentials = [
  { icon: 'award', label: 'ISO 9001:2015 Certified Processes' },      // ⚠️ REPLACE
  { icon: 'building', label: 'MSME / Udyam Registered LLP' },
  { icon: 'star', label: '4.9★ Google Rating · 218 reviews' },        // ⚠️ REPLACE
  { icon: 'leaf', label: 'BWP / BWR Grade Materials Only' },
  { icon: 'shield', label: '₹1 Cr Site Liability Insurance' },        // ⚠️ REPLACE
];

export default stats;
