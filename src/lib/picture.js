/** Responsive <picture> helper — AVIF → WebP → JPEG with correct sizes. */
import { url } from '../layouts/base.js';
import { esc } from './seo.js';

export function picture({
  name, alt, widths = [420, 800, 1200], sizes = '100vw',
  width = 800, height = 600, loading = 'lazy', priority = false, className = '', imgClass = '',
}) {
  const set = (ext) => widths.map((w) => `${url(`/assets/img/${name}-${w}.${ext}`)} ${w}w`).join(', ');
  const fallback = url(`/assets/img/${name}-${widths[widths.length - 1]}.jpg`);
  /* The <img> carries a JPEG srcset too, not just the largest file. Without it
     a browser that cannot decode AVIF or WebP ignored the small derivatives
     entirely and pulled the full-width JPEG onto a phone. */
  return `<picture class="${className}">
  <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
  <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
  <img src="${fallback}" srcset="${set('jpg')}" sizes="${sizes}"
       alt="${esc(alt)}" width="${width}" height="${height}"
       class="${imgClass}" ${priority ? 'fetchpriority="high" decoding="sync"' : `loading="${loading}" decoding="async"`}>
</picture>`;
}

/** Simple <img> for single-size assets. */
export const img = ({ src, alt, width, height, cls = '', loading = 'lazy' }) =>
  `<img src="${url(src)}" alt="${esc(alt)}" width="${width}" height="${height}" class="${cls}" loading="${loading}" decoding="async">`;
