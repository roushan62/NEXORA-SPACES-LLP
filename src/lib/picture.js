/** Responsive <picture> helper — AVIF → WebP → JPEG with correct sizes. */
import { url } from '../layouts/base.js';
import { esc } from './seo.js';

export function picture({
  name, alt, widths = [420, 800, 1200], sizes = '100vw',
  width = 800, height = 600, loading = 'lazy', priority = false, className = '', imgClass = '',
}) {
  const set = (ext) => widths.map((w) => `${url(`/assets/img/${name}-${w}.${ext}`)} ${w}w`).join(', ');
  const fallback = url(`/assets/img/${name}-${widths[widths.length - 1]}.jpg`);
  return `<picture class="${className}">
  <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
  <img src="${fallback}" alt="${esc(alt)}" width="${width}" height="${height}"
       class="${imgClass}" ${priority ? 'fetchpriority="high"' : `loading="${loading}"`} decoding="async">
</picture>`;
}

/** Simple <img> for single-size assets. */
export const img = ({ src, alt, width, height, cls = '', loading = 'lazy' }) =>
  `<img src="${url(src)}" alt="${esc(alt)}" width="${width}" height="${height}" class="${cls}" loading="${loading}" decoding="async">`;
