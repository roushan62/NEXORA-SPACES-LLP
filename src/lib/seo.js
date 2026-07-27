/**
 * SEO helpers — meta tags, canonical/hreflang, Open Graph, JSON-LD schema.
 * Everything Google needs to understand and rank the site.
 */
import { site, hq, absoluteUrl, currentYear } from '../config/site.config.js';

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Build the full <head> meta block for a page. */
export function metaTags(page) {
  const url = absoluteUrl(page.route);
  const title = page.metaTitle || page.title;
  const desc = page.description;
  const img = absoluteUrl(page.ogImage || '/assets/img/og-default.jpg');
  const robots = page.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  ${page.keywords ? `<meta name="keywords" content="${esc(page.keywords)}">` : ''}
  <link rel="canonical" href="${url}">
  <meta name="robots" content="${robots}">
  <meta name="googlebot" content="${robots}">
  <meta name="author" content="${esc(site.legalName)}">
  <meta name="publisher" content="${esc(site.legalName)}">
  <meta name="theme-color" content="#0b0d0f" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#fdfcfa" media="(prefers-color-scheme: light)">
  <meta name="format-detection" content="telephone=yes">
  <meta name="geo.region" content="IN-HR">
  <meta name="geo.placename" content="${esc(hq.city)}, Delhi NCR">
  <meta name="geo.position" content="${hq.geo.lat};${hq.geo.lng}">
  <meta name="ICBM" content="${hq.geo.lat}, ${hq.geo.lng}">
  ${site.analytics.searchConsoleVerification
      ? `<meta name="google-site-verification" content="${esc(site.analytics.searchConsoleVerification)}">` : ''}

  <meta property="og:type" content="${page.ogType || 'website'}">
  <meta property="og:site_name" content="${esc(site.legalName)}">
  <meta property="og:title" content="${esc(page.ogTitle || title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(page.ogImageAlt || site.legalName + ' — interior design in Delhi NCR')}">
  <meta property="og:locale" content="en_IN">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.ogTitle || title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${img}">

  <link rel="alternate" hreflang="en-in" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">`;
}

/* ------------------------------------------------------------------ Schema */

const areaServed = [
  'Delhi', 'New Delhi', 'South Delhi', 'Gurugram', 'Gurgaon', 'Noida',
  'Greater Noida', 'Ghaziabad', 'Faridabad', 'Delhi NCR',
].map((n) => ({ '@type': 'City', name: n }));

/** Organization + LocalBusiness (the big one for local SEO) */
export function orgSchema() {
  const node = {
    '@type': ['HomeAndConstructionBusiness', 'GeneralContractor', 'Organization'],
    '@id': absoluteUrl('/#organization'),
    name: site.legalName,
    alternateName: site.name,
    legalName: site.legalName,
    url: absoluteUrl('/'),
    logo: {
      '@type': 'ImageObject',
      '@id': absoluteUrl('/#logo'),
      url: absoluteUrl('/assets/img/logo-512.png'),
      width: 512,
      height: 512,
      caption: site.legalName,
    },
    image: absoluteUrl('/assets/img/og-default.jpg'),
    description:
      'Nexora Spaces LLP is a residential interior fit-out and design-build studio serving Delhi, Gurugram and Noida. ' +
      'In-house design, factory-made modular woodwork, and site execution for flats, apartments and villas.',
    slogan: site.tagline,
    foundingDate: String(site.foundedYear),
    currenciesAccepted: 'INR',
    paymentAccepted: 'UPI, Bank Transfer, Credit Card',
    telephone: site.phone.tel,
    email: site.email.general,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${hq.street}, ${hq.area}`,
      addressLocality: hq.city,
      addressRegion: hq.region,
      postalCode: hq.postalCode,
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: hq.geo.lat, longitude: hq.geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hq.mapQuery)}`,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:30',
      },
    ],
    areaServed,
    sameAs: Object.values(site.social),
    knowsAbout: [
      'Interior design', 'Modular kitchen', 'Wardrobe design', 'Turnkey fit-out',
      'False ceiling', 'Home renovation', 'Office interior design', 'Space planning',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phone.tel,
        contactType: 'sales',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
        contactOption: 'TollFree',
      },
      {
        '@type': 'ContactPoint',
        telephone: site.phone.tel,
        contactType: 'customer support',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
  };

  if (site.reviews.schema && site.reviews.count > 0) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: site.reviews.rating,
      reviewCount: site.reviews.count,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return node;
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: absoluteUrl('/'),
    name: site.legalName,
    description: 'Residential interior fit-out for homes in Delhi, Gurugram and Noida.',
    publisher: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: absoluteUrl('/portfolio/?q={search_term_string}') },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageSchema(page) {
  return {
    '@type': page.pageType || 'WebPage',
    '@id': absoluteUrl(page.route) + '#webpage',
    url: absoluteUrl(page.route),
    name: page.metaTitle || page.title,
    description: page.description,
    isPartOf: { '@id': absoluteUrl('/#website') },
    about: { '@id': absoluteUrl('/#organization') },
    inLanguage: 'en-IN',
    datePublished: page.datePublished || '2024-01-15',
    dateModified: page.dateModified || new Date().toISOString().slice(0, 10),
    primaryImageOfPage: page.ogImage ? { '@type': 'ImageObject', url: absoluteUrl(page.ogImage) } : undefined,
  };
}

export function breadcrumbSchema(crumbs, route) {
  if (!crumbs || crumbs.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': absoluteUrl(route) + '#breadcrumb',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.href ? absoluteUrl(c.href) : absoluteUrl(route),
    })),
  };
}

export function faqSchema(faqs, route) {
  if (!faqs || !faqs.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': absoluteUrl(route) + '#faq',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: String(f.a).replace(/<[^>]+>/g, '') },
    })),
  };
}

export function serviceSchema(svc, route) {
  return {
    '@type': 'Service',
    '@id': absoluteUrl(route) + '#service',
    name: svc.name,
    description: svc.description,
    serviceType: svc.serviceType || svc.name,
    provider: { '@id': absoluteUrl('/#organization') },
    areaServed,
    audience: { '@type': 'Audience', audienceType: svc.audience || 'Homeowners in Delhi NCR' },
  };
  /* NOTE: no `offers` / price markup is ever emitted. The site does not
     publish pricing, so advertising a price in structured data would be
     both inaccurate and a structured-data policy risk. */
}

export function articleSchema(post, route) {
  return {
    '@type': 'BlogPosting',
    '@id': absoluteUrl(route) + '#article',
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image || '/assets/img/og-default.jpg'),
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'Nexora Design Studio',
      url: absoluteUrl('/about/'),
    },
    publisher: { '@id': absoluteUrl('/#organization') },
    mainEntityOfPage: { '@id': absoluteUrl(route) + '#webpage' },
    articleSection: post.category,
    wordCount: post.wordCount,
    inLanguage: 'en-IN',
  };
}

/** Combine everything into one @graph — the cleanest way to ship JSON-LD. */
export function jsonLd(nodes) {
  const graph = nodes.filter(Boolean);
  return `<script type="application/ld+json">${JSON.stringify(
    { '@context': 'https://schema.org', '@graph': graph },
    (k, v) => (v === undefined ? undefined : v)
  )}</script>`;
}

export { esc, currentYear };
