/**
 * Executes the REAL api/contact.php inside a PHP 8.2 WebAssembly runtime and
 * asserts its behaviour end to end — no PHP installation needed, so this runs
 * in CI and on any laptop.
 *
 * The file is executed unmodified: the request method, headers, body and
 * environment are all supplied the way a web server would. Delivery is put in
 * dry-run mode (MAIL_DRY_RUN=1), which exercises the genuine compose path and
 * writes the message to disk instead of opening a socket.
 *
 * Covers: method handling, CORS, validation, honeypot, spam, rate limiting,
 * header injection, both body encodings, and the rendered email itself.
 *
 * Run:  npm run test:api
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadNodeRuntime } from '@php-wasm/node';
import { PHP } from '@php-wasm/universal';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const passes = [];
const failures = [];
const ok = (m) => passes.push(m);
const bad = (m) => failures.push(m);

/** Fresh PHP with the api/ tree mounted, so no state leaks between tests. */
async function makePhp() {
  const php = new PHP(await loadNodeRuntime('8.2', { emscriptenOptions: { processId: 1 } }));
  php.mkdir('/app/api/lib');
  php.mkdir('/app/spool');
  php.writeFile('/app/api/contact.php', fs.readFileSync(path.join(ROOT, 'api/contact.php'), 'utf8'));
  for (const f of ['mailer.php', 'validate.php']) {
    php.writeFile(`/app/api/lib/${f}`, fs.readFileSync(path.join(ROOT, 'api/lib', f), 'utf8'));
  }
  return php;
}

const BASE_ENV = {
  MAIL_DRY_RUN: '1',
  MAIL_SPOOL_DIR: '/app/spool',
  SMTP_USER: 'studio@example.com',
  SMTP_PASS: 'super-secret-app-password',
};

/** Invoke the endpoint exactly as a web server would. */
async function call(php, {
  method = 'POST',
  body = null,
  json = false,
  origin = 'https://roushan62.github.io',
  env = {},
  ip = '203.0.113.9',
} = {}) {
  const headers = {};
  if (origin) headers.Origin = origin;
  headers['X-Forwarded-For'] = ip;

  let payload;
  if (json && body) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  } else if (body) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    payload = new URLSearchParams(body).toString();
  }

  // Clear the spool so each call's output is unambiguous.
  for (const f of php.listFiles('/app/spool')) php.unlink(`/app/spool/${f}`);

  const res = await php.run({
    scriptPath: '/app/api/contact.php',
    method,
    headers,
    body: payload,
    env: { ...BASE_ENV, ...env },
  });

  let sent = null;
  const spooled = php.listFiles('/app/spool');
  if (spooled.length) {
    try { sent = JSON.parse(php.readFileAsText(`/app/spool/${spooled[0]}`)); } catch { /* ignore */ }
  }

  let parsed = null;
  const text = res.text || '';
  try { parsed = JSON.parse(text.trim()); } catch { /* non-JSON body */ }

  return { status: res.httpStatusCode, raw: text, json: parsed, sent, headers: res.headers };
}

const VALID = {
  name: 'Aarti Sharma',
  phone: '9811099110',
  city: 'Gurugram',
  home_type: 'Flat / Apartment',
  approx_area: '1,250 sq.ft',
  message: 'Possession in October, need full home interiors.',
  consent: 'on',
  source: 'contact-page',
  email: 'aarti@example.com',
};

console.log('\n  Testing api/contact.php on PHP 8.2 (WebAssembly)\n');

/* --------------------------------------------------- 1. Method handling */
{
  const php = await makePhp();

  const get = await call(php, { method: 'GET' });
  if (get.status !== 200) bad(`GET should return 200 health info, got ${get.status}`);
  else if (!get.json?.ok) bad('GET health check did not report ok');
  else ok('GET returns a health check without sending mail');
  if (get.sent) bad('GET health check sent an email');

  const put = await call(php, { method: 'PUT', body: VALID });
  if (put.status !== 405) bad(`PUT should be 405, got ${put.status}`);
  else ok('non-POST verbs are rejected with 405');

  const opts = await call(php, { method: 'OPTIONS' });
  if (opts.status !== 204) bad(`OPTIONS preflight should be 204, got ${opts.status}`);
  else ok('CORS preflight answers 204');
}

/* ------------------------------------------------------- 2. Happy path */
{
  const php = await makePhp();
  const r = await call(php, { body: VALID });

  if (r.status !== 200) bad(`valid submission returned ${r.status}: ${r.raw.slice(0, 300)}`);
  else if (!r.json?.ok) bad(`valid submission not ok: ${r.raw.slice(0, 200)}`);
  else ok('a valid lead returns 200 with a success message');

  if (!r.sent) {
    bad('valid submission composed no email');
  } else {
    if (!r.sent.to.includes('kingboy620478@gmail.com')) {
      bad(`email did not go to the configured inbox: ${JSON.stringify(r.sent.to)}`);
    } else ok('email is addressed to the configured MAIL_TO inbox');

    const missing = ['Aarti Sharma', '98110 99110', 'Gurugram', 'Flat / Apartment', '1,250 sq.ft', 'Possession in October']
      .filter((n) => !r.sent.text.includes(n));
    if (missing.length) bad(`email body is missing: ${missing.join(', ')}`);
    else ok('email body contains every submitted field');

    if (r.sent.replyTo !== 'aarti@example.com') bad(`Reply-To is "${r.sent.replyTo}", not the enquirer`);
    else ok('Reply-To is the enquirer, so a reply reaches them directly');

    if (!r.sent.subject.includes('Aarti Sharma')) bad('subject line lacks the lead name');
    else ok('subject line identifies the lead at a glance');

    if (!/Content-Type: multipart\/alternative/i.test(r.sent.mime || '')) bad('MIME is not multipart/alternative');
    else ok('MIME is a proper multipart/alternative (plain text + HTML)');

    if (!/^To: /m.test(r.sent.mime || '')) bad('MIME has no To header');
    if (!/^Subject: /m.test(r.sent.mime || '')) bad('MIME has no Subject header');
    if (!/wa\.me\/919811099110/.test(r.sent.text)) bad('email has no click-to-WhatsApp callback link');
    else ok('email includes one-tap call and WhatsApp callback links');
  }
}

/* -------------------------------------------------------- 3. JSON body */
{
  const php = await makePhp();
  const r = await call(php, { body: VALID, json: true });
  if (r.status !== 200) bad(`JSON submission returned ${r.status}: ${r.raw.slice(0, 200)}`);
  else if (!r.sent) bad('JSON submission composed no email');
  else ok('accepts an application/json body as well as form encoding');
}

/* ------------------------------------------------------- 4. Validation */
{
  const cases = [
    ['missing name', { ...VALID, name: '' }, 'name'],
    ['missing phone', { ...VALID, phone: '' }, 'phone'],
    ['short phone', { ...VALID, phone: '12345' }, 'phone'],
    ['phone starting 1', { ...VALID, phone: '1234567890' }, 'phone'],
    ['missing city', { ...VALID, city: '' }, 'city'],
    ['missing home type', { ...VALID, home_type: '' }, 'home_type'],
    ['missing consent', { ...VALID, consent: '' }, 'consent'],
    ['bad email', { ...VALID, email: 'not-an-email' }, 'email'],
  ];
  const php = await makePhp();
  let n = 20;
  for (const [label, body, field] of cases) {
    // A distinct IP per case so the rate limiter never masks a validation result.
    const r = await call(php, { body, ip: `198.51.100.${n++}` });
    if (r.status !== 400) bad(`${label} → expected 400, got ${r.status}`);
    else if (!r.json?.errors?.[field]) bad(`${label} → no error reported for "${field}"`);
    if (r.sent) bad(`${label} → invalid data still composed an email`);
  }
  ok(`server-side validation rejects all ${cases.length} invalid submissions`);

  const r = await call(php, { body: { ...VALID, phone: '+91 98110-99110' }, ip: '198.51.100.60' });
  if (r.status !== 200) bad(`formatted phone "+91 98110-99110" was rejected (${r.status})`);
  else if (!r.sent?.text.includes('98110 99110')) bad('phone was not normalised for the email');
  else ok('phone numbers with +91, spaces and dashes are normalised');
}

/* ------------------------------------------------- 5. Header injection */
{
  const php = await makePhp();
  const r = await call(php, {
    body: { ...VALID, name: 'Evil\r\nBcc: attacker@evil.com', email: 'x@example.com' },
  });
  const mime = r.sent?.mime || '';
  const headerBlock = mime.split('\r\n\r\n')[0] || '';
  const headerLines = headerBlock.split('\r\n');

  // The real risk is a NEW header line, not the text appearing inside a value.
  if (headerLines.some((l) => /^bcc\s*:/i.test(l))) {
    bad('SECURITY: CRLF in the name field injected a Bcc header');
  } else ok('CRLF header-injection attempts are neutralised');

  // No recipient header may carry the attacker address.
  const recipientHeaders = headerLines.filter((l) => /^(to|cc|bcc)\s*:/i.test(l)).join('\n');
  if (recipientHeaders.includes('attacker@evil.com')) {
    bad('SECURITY: attacker address reached a recipient header');
  } else ok('injected addresses never reach a recipient header');

  // The envelope must still only address the configured inbox.
  if (r.sent && (r.sent.to.length !== 1 || !r.sent.to[0].includes('kingboy620478'))) {
    bad(`SECURITY: recipient list was altered: ${JSON.stringify(r.sent?.to)}`);
  } else ok('the recipient list cannot be widened by user input');

  // And the display name should not masquerade as a header.
  if (/^From:.*Bcc\s*:/im.test(headerBlock)) bad('SECURITY: "Bcc:" survived inside the From display name');
  else ok('header-like text is stripped from display names');
}

/* ---------------------------------------------------------- 6. Honeypot */
{
  const php = await makePhp();
  const r = await call(php, { body: { ...VALID, _gotcha: 'bot-filled' } });
  if (r.status !== 200) bad(`honeypot should answer 200 to fool the bot, got ${r.status}`);
  if (r.sent) bad('honeypot submission still sent an email');
  else ok('honeypot silently discards bots while returning a fake success');
}

/* -------------------------------------------------------------- 7. Spam */
{
  const php = await makePhp();
  const r = await call(php, {
    body: { ...VALID, message: 'Cheap viagra and casino backlinks http://a.com http://b.com http://c.com' },
  });
  if (r.sent) bad('spam submission was emailed through');
  else ok('spam heuristics drop obvious junk without emailing it');
}

/* -------------------------------------------------------- 8. Rate limit */
{
  const php = await makePhp();
  let limited = 0;
  for (let i = 0; i < 9; i++) {
    const r = await call(php, { body: VALID, env: { RATE_LIMIT_MAX: '4' }, ip: '198.51.100.7' });
    if (r.status === 429) { limited = i + 1; break; }
  }
  if (!limited) bad('rate limiting never kicked in after 9 rapid submissions');
  else ok(`rate limiting blocks a burst from one IP (stopped at attempt ${limited})`);

  // A different IP must not be affected by another visitor's burst.
  const other = await call(php, { body: VALID, env: { RATE_LIMIT_MAX: '4' }, ip: '203.0.113.77' });
  if (other.status === 429) bad('rate limiting leaked across different IPs');
  else ok('rate limiting is scoped per IP, not global');
}

/* -------------------------------------------------------------- 9. CORS */
{
  const php = await makePhp();

  const evil = await call(php, { body: VALID, origin: 'https://evil.example.com', ip: '203.0.113.30' });
  if (evil.status !== 403) bad(`disallowed origin should be 403, got ${evil.status}`);
  else ok('requests from a disallowed origin are refused');
  if (evil.sent) bad('disallowed origin still triggered an email');

  const good = await call(php, { body: VALID, origin: 'https://roushan62.github.io', ip: '203.0.113.31' });
  if (good.status !== 200) bad(`the GitHub Pages origin was rejected (${good.status})`);
  else ok('the live GitHub Pages origin is accepted');

  const preview = await call(php, { body: VALID, origin: 'https://nexora-git-abc.vercel.app', ip: '203.0.113.32' });
  if (preview.status !== 200) bad(`a *.vercel.app preview origin was rejected (${preview.status})`);
  else ok('Vercel preview deployments are accepted');

  const acao = String(good.headers?.['access-control-allow-origin'] ?? '');
  if (!acao.includes('roushan62.github.io')) bad('no Access-Control-Allow-Origin header echoed back');
  else ok('Access-Control-Allow-Origin echoes the caller, never "*"');
}

/* ------------------------------------------------ 10. Transport failure */
{
  const php = await makePhp();
  const r = await call(php, { body: VALID, env: { MAIL_DRY_RUN: '0', SMTP_HOST: 'smtp.invalid.test', SMTP_PORT: '587' } });
  if (r.status !== 502) bad(`a failed send should return 502, got ${r.status}`);
  else if (r.json?.ok !== false) bad('failed send did not report ok:false');
  else if (!/call|whatsapp/i.test(r.json.error || '')) bad('failure message does not offer another way to reach you');
  else ok('a delivery failure returns 502 and points the user to phone/WhatsApp');

  if (r.raw.includes('super-secret-app-password')) bad('SECURITY: SMTP password leaked in an error response');
  else ok('credentials never leak, even on a transport error');
}

/* ------------------------------------------------------- 11. Empty body */
{
  const php = await makePhp();
  const r = await call(php, { body: null });
  if (r.status !== 400) bad(`empty POST should be 400, got ${r.status}`);
  else ok('an empty POST is rejected cleanly');
}

/* --------------------------------------------------- 12. Autoreply path */
{
  const php = await makePhp();
  const r = await call(php, { body: VALID, env: { SEND_AUTOREPLY: '1' } });
  if (r.status !== 200) bad(`autoreply run failed with ${r.status}`);
  else ok('the optional autoreply path runs without breaking the response');
}

/* ================================================================ Report */
console.log('');
if (failures.length) {
  console.log(`  ✗ ${failures.length} API TEST FAILURE${failures.length > 1 ? 'S' : ''}\n`);
  failures.forEach((f) => console.log(`    ✗ ${f}`));
  console.log('');
  process.exit(1);
}
console.log(`  ✓ ${passes.length} API checks passed\n`);
passes.forEach((p) => console.log(`    ✓ ${p}`));
console.log('\n  ✓ CONTACT API VERIFIED\n');
