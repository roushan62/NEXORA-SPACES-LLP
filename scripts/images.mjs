/**
 * Image pipeline — generates responsive AVIF/WebP/JPEG derivatives plus
 * blur-up placeholders, favicons, PWA icons and the OG card.
 * Run: npm run images
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'src/assets-src';
const OUT = 'assets/img';

const ensure = (d) => fs.mkdir(d, { recursive: true });

/** Which derivatives each source needs. */
const PLAN = [
  { src: 'hero.jpg', out: 'hero', widths: [640, 1024, 1536, 1920], fmt: ['avif', 'webp', 'jpg'], quality: 74 },
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
  { src: 'p5.jpg', out: 'pages/commercial', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p1.jpg', out: 'pages/about', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p3.jpg', out: 'pages/portfolio', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p4.jpg', out: 'pages/pricing', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p9.jpg', out: 'pages/process', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p2.jpg', out: 'pages/contact', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p6.jpg', out: 'pages/gurgaon', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p2.jpg', out: 'pages/noida', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  { src: 'p3.jpg', out: 'pages/delhi', widths: [960, 1600], fmt: ['avif', 'webp', 'jpg'], quality: 68 },
  /* Before / after pair for the portfolio slider */
  { src: 'p6.jpg', out: 'ba-before', widths: [1000], fmt: ['webp', 'jpg'], quality: 70, grade: 'before' },
  { src: 'p9.jpg', out: 'ba-after', widths: [1000], fmt: ['webp', 'jpg'], quality: 72 },
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
      let base = sharp(inPath).resize({
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
        const suffix = job.widths.length > 1 ? `-${w}` : '';
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
  <text x="143" y="108" font-family="Helvetica, Arial, sans-serif" font-size="12.5" fill="#CFA54F" letter-spacing="4.2">DESIGN · BUILD · DELIVER</text>
  <text x="64" y="268" font-family="Georgia, serif" font-size="66" fill="#ffffff" font-weight="600">Turnkey interiors for</text>
  <text x="64" y="344" font-family="Georgia, serif" font-size="66" fill="url(#gold)" font-style="italic">Delhi · Gurugram · Noida</text>
  <text x="64" y="404" font-family="Helvetica, Arial, sans-serif" font-size="23" fill="#ffffff" opacity="0.74">In-house design · Own production · Single contract</text>
  <g font-family="Helvetica, Arial, sans-serif" font-size="19" fill="#ffffff">
    <rect x="64" y="452" width="228" height="52" rx="26" fill="none" stroke="#CFA54F" stroke-width="1.5"/>
    <text x="96" y="484" fill="#CFA54F" font-weight="bold">10-Year Warranty</text>
    <rect x="308" y="452" width="216" height="52" rx="26" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>
    <text x="340" y="484" opacity="0.9">45-Day Delivery</text>
    <rect x="540" y="452" width="238" height="52" rx="26" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>
    <text x="572" y="484" opacity="0.9">850+ Homes Done</text>
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

build().catch((e) => { console.error(e); process.exit(1); });
