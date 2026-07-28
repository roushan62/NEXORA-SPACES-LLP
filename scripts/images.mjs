/**
 * Image pipeline — generates responsive AVIF/WebP/JPEG derivatives plus
 * blur-up placeholders, favicons, PWA icons and the OG card.
 * Run: npm run images
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { galleryPackages, roomOrder } from '../src/data/gallery.js';

const SRC = 'src/assets-src';
const OUT = 'assets/img';

const ensure = (d) => fs.mkdir(d, { recursive: true });

/* ==========================================================================
   GALLERY PACKAGE SETS  —  10 homes × 8 rooms
   --------------------------------------------------------------------------
   ⚠️ PLACEHOLDER PIPELINE. Each room currently borrows one of the stand-in
   renders in src/assets-src/gallery/ (or an existing project photo) and gets a
   per-package colour grade + crop so every set reads as its own home.

   TO SWAP IN REAL PHOTOGRAPHY: drop a file named `<packageId>-<room>.jpg`
   into src/assets-src/gallery/ — e.g. `aurelia-kitchen.jpg`. The pipeline
   prefers a real file whenever one exists and only falls back to the graded
   placeholder when it does not. Then run `npm run images && npm run build`.
   ========================================================================== */

/** Fallback source render for each room type. Drawn from the library of real,
 *  full-colour residential renders (hero.jpg + p1–p9.jpg). The pipeline rotates
 *  which render each package pulls (`pick % pool.length`) so neighbouring cards
 *  in the grid never show the identical photo. */
const ROOM_FALLBACK = {
  overview: ['hero.jpg', 'p5.jpg', 'p1.jpg', 'p7.jpg', 'p3.jpg'],
  hall:     ['p1.jpg', 'p5.jpg', 'p7.jpg'],
  kitchen:  ['p2.jpg', 'p4.jpg'],
  bedroom:  ['p3.jpg', 'p6.jpg'],
  puja:     ['p3.jpg', 'p6.jpg', 'p8.jpg'],
  bath:     ['p8.jpg'],
  closet:   ['p9.jpg'],
  passage:  ['hero.jpg', 'p1.jpg', 'p5.jpg', 'p7.jpg'],
};

/** Subtle per-package grade — keeps the vivid, real-photo look while nudging
 *  brightness/hue and the crop frame so the ten sets read as different homes.
 *  (Saturation stays at ~1.0 so colour is never washed out.) */
const PKG_GRADE = {
  aurelia:  { saturation: 1.00, brightness: 1.00, hue: 0,   tint: null, crop: 'centre' },
  meridian: { saturation: 1.00, brightness: 1.03, hue: -4,  tint: null, crop: 'right'  },
  sereno:   { saturation: 1.00, brightness: 1.02, hue: 4,   tint: null, crop: 'left'   },
  aravalli: { saturation: 1.04, brightness: 0.98, hue: -6,  tint: null, crop: 'centre' },
  kalina:   { saturation: 1.00, brightness: 1.03, hue: 5,   tint: null, crop: 'left'    },
  vasant:   { saturation: 1.06, brightness: 0.99, hue: -8,  tint: null, crop: 'right'  },
  oakwood:  { saturation: 1.00, brightness: 1.01, hue: 2,   tint: null, crop: 'centre' },
  lumen:    { saturation: 1.03, brightness: 0.97, hue: -3,  tint: null, crop: 'right'  },
  palash:   { saturation: 1.00, brightness: 1.00, hue: 6,   tint: null, crop: 'left'    },
  nirvaan:  { saturation: 1.02, brightness: 1.00, hue: -2,  tint: null, crop: 'centre' },
};

const GALLERY_WIDTHS = { thumb: 640, full: 1400 };

async function firstExisting(candidates) {
  for (const c of candidates) {
    const p = path.join(SRC, c);
    try { await fs.access(p); return p; } catch { /* keep looking */ }
  }
  return null;
}

async function buildGallery() {
  await ensure(path.join(OUT, 'gallery'));
  let count = 0, bytes = 0;

  for (const pkg of galleryPackages) {
    const grade = PKG_GRADE[pkg.id] || PKG_GRADE.aurelia;
    /* Vary which fallback render each package pulls, so neighbouring cards
       in the grid never show the identical photo. */
    const pick = galleryPackages.indexOf(pkg);

    for (const room of roomOrder) {
      /* Real photography wins if it has been supplied. */
      const real = await firstExisting([`gallery/${pkg.id}-${room.id}.jpg`, `gallery/${pkg.id}-${room.id}.png`]);
      const pool = ROOM_FALLBACK[room.id] || ROOM_FALLBACK.hall;
      const inPath = real || (await firstExisting([pool[pick % pool.length], ...pool]));
      if (!inPath) { console.warn(`  ! no source for ${pkg.id}-${room.id}`); continue; }

      for (const [label, w] of Object.entries(GALLERY_WIDTHS)) {
        const h = Math.round((w * 2) / 3);
        let pipe = sharp(inPath).resize(w, h, {
          fit: 'cover',
          position: real ? 'centre' : (grade.crop || 'centre'),
        });

        /* Grading is only applied to placeholders — never to real photos. */
        if (!real) {
          pipe = pipe.modulate({
            saturation: grade.saturation,
            brightness: grade.brightness,
            hue: grade.hue,
          });
          if (grade.tint) pipe = pipe.tint(grade.tint);
        }

        const buf = await pipe.toBuffer();
        const stem = path.join(OUT, 'gallery', `${pkg.id}-${room.id}-${w}`);

        await Promise.all([
          sharp(buf).avif({ quality: 58, effort: 2 }).toFile(`${stem}.avif`),
          sharp(buf).webp({ quality: 70, effort: 4 }).toFile(`${stem}.webp`),
          sharp(buf).jpeg({ quality: 74, progressive: true, mozjpeg: true }).toFile(`${stem}.jpg`),
        ]);

        for (const ext of ['avif', 'webp', 'jpg']) {
          bytes += (await fs.stat(`${stem}.${ext}`)).size;
          count++;
        }
        void label;
      }
    }
  }

  console.log(`✓ gallery: ${count} files, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
  return { count, bytes };
}

/** Which derivatives each source needs. */
const PLAN = [
  /* Only the 1536 poster is referenced (site.heroVideo.poster). The 640/1024/
     1920 derivatives were generated but never linked from any page.
     `suffixAlways` keeps the -1536 in the filename even though there is now a
     single width, since the config points at hero-1536.jpg by name. */
  { src: 'hero.jpg', out: 'hero', widths: [1536], fmt: ['avif', 'webp', 'jpg'], quality: 74, suffixAlways: true },
  ...['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9'].map((n) => ({
    src: `${n}.jpg`, out: `projects/${n}`, widths: [420, 800, 1200], fmt: ['avif', 'webp', 'jpg'], quality: 72,
  })),
  /* Blog imagery reuses project photography (crop-shifted so it reads differently) */
  { src: 'p1.jpg', out: 'blog/b1', widths: [420, 800], fmt: ['avif', 'webp', 'jpg'], quality: 70, crop: 'right' },
  { src: 'p4.jpg', out: 'blog/b2', widths: [420, 800], fmt: ['avif', 'webp', 'jpg'], quality: 70, crop: 'left' },
  { src: 'p6.jpg', out: 'blog/b3', widths: [420, 800], fmt: ['avif', 'webp', 'jpg'], quality: 70, crop: 'right' },
  { src: 'p2.jpg', out: 'blog/b4', widths: [420, 800], fmt: ['avif', 'webp', 'jpg'], quality: 70, crop: 'left' },
  { src: 'p3.jpg', out: 'blog/b5', widths: [420, 800], fmt: ['avif', 'webp', 'jpg'], quality: 70, crop: 'right' },
  { src: 'p5.jpg', out: 'blog/b6', widths: [420, 800], fmt: ['avif', 'webp', 'jpg'], quality: 70, crop: 'left' },
  /* Section / page-header imagery */
  { src: 'p7.jpg', out: 'pages/residential', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p1.jpg', out: 'pages/about', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p3.jpg', out: 'pages/portfolio', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p9.jpg', out: 'pages/process', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p2.jpg', out: 'pages/contact', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p6.jpg', out: 'pages/gurgaon', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p2.jpg', out: 'pages/noida', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p3.jpg', out: 'pages/delhi', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  /* Before / after pair for the portfolio slider.
     Dedicated REAL source photos: the same room shot from the same position,
     raw on one side and fully finished on the other. Fixed 1000×625 frame so
     both halves always align pixel-for-pixel inside the comparison slider. */
  { src: 'ba-before.jpg', out: 'ba-before', widths: [1000], fmt: ['webp', 'jpg'], quality: 70, height: 625 },
  { src: 'ba-after.jpg', out: 'ba-after', widths: [1000], fmt: ['webp', 'jpg'], quality: 72, height: 625 },
];

const cropPos = { left: 'left', right: 'right', center: 'centre' };

async function build() {
  await ensure(OUT);
  let count = 0;
  let bytes = 0;

  for (const job of PLAN) {
    const inPath = path.join(SRC, job.src);
    await ensure(path.join(OUT, path.dirname(job.out)));

    for (const w of job.widths) {
      const base = sharp(inPath).resize(job.height ? {
        width: w,
        height: job.height,
        fit: 'cover',
        withoutEnlargement: true,
        position: cropPos[job.crop] || 'centre',
      } : {
        width: w,
        withoutEnlargement: true,
        position: cropPos[job.crop] || 'centre',
      });

      /* "before" grade: make the source read as a tired, unrenovated room */
      if (job.grade === 'before') {
        base = base.modulate({ saturation: 0.42, brightness: 0.86 }).tint({ r: 224, g: 220, b: 208 });
      }

      const buf = await base.toBuffer();

      for (const fmt of job.fmt) {
        const suffix = (job.widths.length > 1 || job.suffixAlways) ? `-${w}` : '';
        const file = path.join(OUT, `${job.out}${suffix}.${fmt}`);
        const pipe = sharp(buf);
        if (fmt === 'avif') await pipe.avif({ quality: job.quality - 8, effort: 6 }).toFile(file);
        else if (fmt === 'webp') await pipe.webp({ quality: job.quality, effort: 5 }).toFile(file);
        else await pipe.jpeg({ quality: job.quality + 4, progressive: true, mozjpeg: true }).toFile(file);
        const st = await fs.stat(file);
        bytes += st.size;
        count++;
      }
    }
  }

  /* ---------------------------------------------------- Social share card */
  const ogW = 1200, ogH = 630;
  const heroCrop = await sharp(path.join(SRC, 'hero.jpg'))
    .resize(ogW, ogH, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.58 })
    .toBuffer();

  const ogOverlay = Buffer.from(`
<svg width="${ogW}" height="${ogH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0%" stop-color="#0b0d0f" stop-opacity="0.93"/>
      <stop offset="62%" stop-color="#0b0d0f" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#0b0d0f" stop-opacity="0.35"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#9B7028"/><stop offset="50%" stop-color="#CFA54F"/><stop offset="100%" stop-color="#EAD7A8"/>
    </linearGradient>
  </defs>
  <rect width="${ogW}" height="${ogH}" fill="url(#g)"/>
  <rect x="64" y="56" width="60" height="60" rx="15" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <path d="M82 102V64.5c0-.7.85-1.05 1.33-.55L116 98" stroke="url(#gold)" stroke-width="3.4" stroke-linecap="round" fill="none"/>
  <text x="142" y="86" font-family="Georgia, serif" font-size="30" fill="#ffffff" font-weight="600">NEXORA SPACES</text>
  <text x="143" y="108" font-family="Helvetica, Arial, sans-serif" font-size="11" fill="#CFA54F" letter-spacing="3.1">RESIDENTIAL INTERIOR FIT-OUT</text>
  <text x="64" y="268" font-family="Georgia, serif" font-size="62" fill="#ffffff" font-weight="600">Crafting homes</text>
  <text x="64" y="344" font-family="Georgia, serif" font-size="62" fill="url(#gold)" font-style="italic">that feel like you</text>
  <text x="64" y="404" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="#ffffff" opacity="0.74">Flats · Apartments · Villas — Delhi, Gurugram &amp; Noida</text>
  <g font-family="Helvetica, Arial, sans-serif" font-size="19" fill="#ffffff">
    <rect x="64" y="452" width="250" height="52" rx="26" fill="none" stroke="#CFA54F" stroke-width="1.5"/>
    <text x="94" y="484" fill="#CFA54F" font-weight="bold">Designer-Grade Finish</text>
    <rect x="330" y="452" width="242" height="52" rx="26" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>
    <text x="360" y="484" opacity="0.9">Fastest Handover</text>
    <rect x="588" y="452" width="238" height="52" rx="26" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>
    <text x="618" y="484" opacity="0.9">850+ Homes Done</text>
  </g>
</svg>`);

  await sharp(heroCrop)
    .composite([{ input: ogOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 86, progressive: true, mozjpeg: true })
    .toFile(path.join(OUT, 'og-default.jpg'));
  count++;

  /* ------------------------------------------------------------ App icons */
  const logoSvg = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#9B7028"/><stop offset="48%" stop-color="#CFA54F"/><stop offset="100%" stop-color="#EAD7A8"/>
  </linearGradient></defs>
  <rect width="512" height="512" rx="112" fill="#0b0d0f"/>
  <path d="M160 366V148c0-4.2 5.1-6.3 8-3.3L344 330" stroke="url(#g)" stroke-width="30" stroke-linecap="round" fill="none"/>
  <path d="M352 146v218c0 4.2-5.1 6.3-8 3.3L168 182" stroke="url(#g)" stroke-width="30" stroke-linecap="round" fill="none" opacity="0.5"/>
</svg>`);

  for (const size of [192, 512]) {
    await sharp(logoSvg).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(OUT, `logo-${size}.png`));
    count++;
  }
  await sharp(logoSvg).resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(OUT, 'apple-touch-icon.png'));
  await sharp(logoSvg).resize(32, 32).png({ compressionLevel: 9 }).toFile('favicon-32.png');
  count += 2;

  /* -------------------------------------------------- Blur-up placeholders
     Tiny base64 LQIP written to a JSON map the build can inline.           */
  const lqip = {};
  for (const n of ['hero', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9']) {
    const b = await sharp(path.join(SRC, `${n}.jpg`)).resize(20).blur(1.1).webp({ quality: 22 }).toBuffer();
    lqip[n] = `data:image/webp;base64,${b.toString('base64')}`;
  }
  await fs.writeFile('src/data/lqip.json', JSON.stringify(lqip, null, 2));

  console.log(`✓ images: ${count} files, ${(bytes / 1024 / 1024).toFixed(2)} MB total`);
}

await build().catch((e) => { console.error(e); process.exit(1); });
await buildGallery().catch((e) => { console.error(e); process.exit(1); });
