/** Tiny static preview server (mirrors GitHub Pages path behaviour). */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/config/site.config.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = process.env.PORT || 4321;
const BASE = site.basePath || '';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || '/';
  let file = path.join(ROOT, p);

  try {
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      const alt = path.join(ROOT, p + '.html');
      if (fs.existsSync(alt)) file = alt;
      else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        const nf = path.join(ROOT, '404.html');
        return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found');
      }
    }
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end(String(e));
  }
}).listen(PORT, () => console.log(`→ http://localhost:${PORT}${BASE}/`));
