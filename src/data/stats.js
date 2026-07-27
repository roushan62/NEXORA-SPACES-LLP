import { site, yearsInBusiness } from '../config/site.config.js';

/**
 * Headline numbers used on the home page, about page and city pages.
 *
 * ⚠️ These describe DELIVERY (homes, years, teams). They must never describe
 * money — no prices, rates, budgets or amounts anywhere on the site.
 */
export const stats = [
  { value: 850, suffix: '+', label: 'Homes delivered', sub: 'across Delhi NCR' },
  { value: 96, suffix: '%', label: 'On-time handover', sub: 'against contracted dates' },
  { value: 62, suffix: '+', label: 'In-house designers & PMs', sub: 'no commission freelancers' },
  { value: yearsInBusiness, suffix: '+ yrs', label: 'Building homes', sub: `since ${site.foundedYear}` },
];

export const statsWide = [
  { value: 850, suffix: '+', label: 'Homes delivered' },
  { value: 62, suffix: '+', label: 'In-house designers & PMs' },
  { value: 18, suffix: '+', label: 'NCR micro-markets served' },
  site.reviews.schema
    ? { value: site.reviews.rating, suffix: '/5', label: 'Average client rating', decimals: 1 }
    : { value: site.guarantees.warrantyYears, suffix: '-year', label: 'Documented modular warranty' },
];

/** Trust markers shown in the hero strip and sticky proof bar. */
export const trustBadges = [
  { icon: 'gem', label: 'Designer-Grade Finish' },
  { icon: 'clock', label: 'Industry-Fastest Handover' },
  { icon: 'receipt', label: 'Value-Driven Pricing' },
  { icon: 'hardHat', label: 'In-House Execution' },
];

/** Certification / credibility strip. Replace with your real credentials. */
export const credentials = [
  { icon: 'award', label: 'ISO 9001:2015 Certified Processes' },      // ⚠️ REPLACE
  { icon: 'building', label: 'MSME / Udyam Registered LLP' },
  site.reviews.schema
    ? { icon: 'star', label: `${site.reviews.rating}★ Google Rating · ${site.reviews.count} reviews` }
    : { icon: 'fileText', label: 'Written scope with named material specs' },
  { icon: 'leaf', label: 'BWP / BWR Grade Materials Only' },
  { icon: 'shield', label: 'Insured Site Execution' },                // ⚠️ REPLACE
];

export default stats;
