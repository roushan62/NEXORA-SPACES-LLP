<?php
/**
 * ============================================================================
 *  POST /api/contact  —  Nexora Spaces lead endpoint
 * ============================================================================
 *  Runs on Vercel through the `vercel-php` community runtime, and unchanged on
 *  any classic PHP host (cPanel, Hostinger, XAMPP).
 *
 *  Accepts multipart/form-data, urlencoded or JSON. Always answers JSON:
 *
 *    200 { "ok": true,  "message": "..." }
 *    400 { "ok": false, "errors": { "phone": "..." } }
 *    405 { "ok": false, "error": "Method not allowed" }
 *    429 { "ok": false, "error": "..." }         — rate limited
 *    502 { "ok": false, "error": "..." }         — every transport failed
 *
 *  CONFIGURE WITH ENVIRONMENT VARIABLES (never hard-code credentials):
 *
 *    MAIL_TO         inbox that receives leads   (default: the testing address)
 *    SMTP_HOST       smtp.gmail.com
 *    SMTP_PORT       587 (STARTTLS) or 465 (TLS)
 *    SMTP_USER       your.address@gmail.com
 *    SMTP_PASS       16-character Google App Password — NOT your login password
 *    MAIL_FROM       envelope sender (defaults to SMTP_USER)
 *    BREVO_API_KEY   optional HTTPS transport, used first when present
 *    RESEND_API_KEY  optional HTTPS transport
 *    SEND_AUTOREPLY  "1" to also confirm receipt to the enquirer
 *    ALLOWED_ORIGINS comma-separated list for CORS
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/lib/mailer.php';
require_once __DIR__ . '/lib/validate.php';

/* ------------------------------------------------------------------ Setup */

// Never leak a stack trace (which could contain the SMTP password) to a client.
ini_set('display_errors', '0');
error_reporting(E_ALL);

/** Read an env var from any of the places a host might expose it. */
function env(string $key, string $default = ''): string
{
    $v = getenv($key);
    if ($v === false || $v === '') {
        $v = $_ENV[$key] ?? $_SERVER[$key] ?? '';
    }
    return is_string($v) && $v !== '' ? trim($v) : $default;
}

/** Emit JSON and stop. */
function respond(int $status, array $payload): never
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/* -------------------------------------------------------------------- CORS
 * The site is served from GitHub Pages while this function runs on Vercel, so
 * the browser sends a cross-origin request. Only the origins listed here are
 * allowed — a wildcard would let any site post through your mail credentials.
 */
$defaultOrigins = [
    'https://roushan62.github.io',
    'http://localhost:4321',
    'http://127.0.0.1:4321',
];
$allowed = array_values(array_filter(array_map(
    'trim',
    explode(',', env('ALLOWED_ORIGINS', implode(',', $defaultOrigins)))
)));

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$originAllowed = $origin !== '' && in_array($origin, $allowed, true);

// Also accept any *.vercel.app preview of this project.
if (!$originAllowed && $origin !== '' && preg_match('#^https://[a-z0-9-]+\.vercel\.app$#i', $origin) === 1) {
    $originAllowed = true;
}

if ($originAllowed) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Max-Age: 86400');

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// A GET is useful as a deploy smoke-test: it proves the function is live and
// reports which transport is configured, without exposing any secret.
if ($method === 'GET') {
    respond(200, [
        'ok' => true,
        'service' => 'Nexora Spaces contact endpoint',
        'method' => 'POST a lead to this URL',
        'php' => PHP_VERSION,
        'transport' => env('BREVO_API_KEY') !== '' ? 'brevo'
            : (env('RESEND_API_KEY') !== '' ? 'resend'
            : (env('SMTP_USER') !== '' ? 'smtp' : 'not-configured')),
        'mailTo' => env('MAIL_TO') !== '' ? 'configured' : 'default',
    ]);
}

if ($method !== 'POST') {
    header('Allow: POST, OPTIONS');
    respond(405, ['ok' => false, 'error' => 'Method not allowed. Use POST.']);
}

if ($origin !== '' && !$originAllowed) {
    respond(403, ['ok' => false, 'error' => 'Origin not allowed.']);
}

/* ------------------------------------------------------------ Parse input */

$input = [];
$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '');

if (str_contains($contentType, 'application/json')) {
    $raw = file_get_contents('php://input') ?: '';
    if (strlen($raw) > 64000) {
        respond(413, ['ok' => false, 'error' => 'Payload too large.']);
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        respond(400, ['ok' => false, 'error' => 'Malformed JSON body.']);
    }
    $input = $decoded;
} else {
    $input = $_POST;
    // Some runtimes hand urlencoded bodies over without populating $_POST.
    if (!$input) {
        $raw = file_get_contents('php://input') ?: '';
        if ($raw !== '' && strlen($raw) < 64000) {
            parse_str($raw, $input);
        }
    }
}

if (!is_array($input) || $input === []) {
    respond(400, ['ok' => false, 'error' => 'Empty submission.']);
}

/* ---------------------------------------------------------------- Honeypot
 * A hidden field no human ever fills. Answer 200 so the bot believes it
 * succeeded and does not retry with a different strategy.
 */
foreach (['_gotcha', 'website', 'url'] as $trap) {
    if (!empty($input[$trap])) {
        respond(200, ['ok' => true, 'message' => 'Thank you — your enquiry has been received.']);
    }
}

/* ------------------------------------------------------------- Rate limit
 * Serverless instances are ephemeral, so this is a best-effort per-instance
 * guard against a burst from one IP — not a substitute for a WAF.
 */
$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$ip = trim(explode(',', (string) $ip)[0]);

$bucketDir = sys_get_temp_dir() . '/nexora-rate';
$maxPerWindow = (int) env('RATE_LIMIT_MAX', '6');
$windowSeconds = (int) env('RATE_LIMIT_WINDOW', '600');

if ($ip !== 'unknown' && $maxPerWindow > 0) {
    // hash the IP: we never write a raw address to disk
    $bucket = $bucketDir . '/' . hash('sha256', $ip) . '.json';
    @mkdir($bucketDir, 0700, true);
    $hits = [];
    if (is_readable($bucket)) {
        $decoded = json_decode((string) @file_get_contents($bucket), true);
        if (is_array($decoded)) {
            $hits = $decoded;
        }
    }
    $now = time();
    $hits = array_values(array_filter($hits, static fn ($t) => is_int($t) && $t > $now - $windowSeconds));
    if (count($hits) >= $maxPerWindow) {
        respond(429, [
            'ok' => false,
            'error' => 'Too many submissions from this connection. Please try again shortly, or call us directly.',
        ]);
    }
    $hits[] = $now;
    @file_put_contents($bucket, json_encode($hits), LOCK_EX);
}

/* ------------------------------------------------------------- Validation */

$result = validate_lead($input);
$data = $result['data'];
$errors = $result['errors'];

// Spam verdicts get a 200 too, for the same reason as the honeypot.
if (isset($errors['_spam'])) {
    respond(200, ['ok' => true, 'message' => 'Thank you — your enquiry has been received.']);
}

if ($errors !== []) {
    respond(400, [
        'ok' => false,
        'error' => 'Please correct the highlighted fields.',
        'errors' => $errors,
    ]);
}

/* ------------------------------------------------------------- Compose it */

$brand = env('BRAND_NAME', 'Nexora Spaces');
$phoneDisplay = env('BRAND_PHONE', '+91 98110 12345');
$waNumber = env('BRAND_WHATSAPP', '919811012345');

/* ⚠️ PLACEHOLDER — swap MAIL_TO in the Vercel dashboard for the real studio
   inbox when you go live. This default is the testing address only. */
$mailTo = env('MAIL_TO', 'kingboy620478@gmail.com');
$recipients = array_values(array_filter(array_map('trim', explode(',', $mailTo))));
if ($recipients === []) {
    respond(500, ['ok' => false, 'error' => 'Mail recipient is not configured.']);
}

$smtpUser = env('SMTP_USER');
$fromEmail = env('MAIL_FROM', $smtpUser !== '' ? $smtpUser : $recipients[0]);

$meta = [
    'received' => date('D, d M Y · H:i') . ' IST',
    'ip' => $ip,
];
// Report Indian local time regardless of the region the function runs in.
$tz = date_default_timezone_get();
date_default_timezone_set('Asia/Kolkata');
$meta['received'] = date('D, d M Y · h:i A') . ' IST';
date_default_timezone_set($tz);

$body = render_lead_email($data, $meta);

$subject = sprintf(
    'New enquiry — %s, %s (%s)',
    $data['name'],
    $data['city'] ?? '',
    $data['home_type'] ?? ''
);

$cfg = [
    'transport' => env('MAIL_TRANSPORT'),
    'smtpHost' => env('SMTP_HOST', 'smtp.gmail.com'),
    'smtpPort' => env('SMTP_PORT', '587'),
    'smtpUser' => $smtpUser,
    'smtpPass' => env('SMTP_PASS'),
    'brevoKey' => env('BREVO_API_KEY'),
    'resendKey' => env('RESEND_API_KEY'),
    'allowPhpMail' => env('ALLOW_PHP_MAIL', '0') === '1',
    /* Set MAIL_DRY_RUN=1 to compose without sending — verifies a deployment
       without delivering anything to the studio inbox. */
    'dryRun' => env('MAIL_DRY_RUN', '0') === '1',
    'dryRunDir' => env('MAIL_SPOOL_DIR', sys_get_temp_dir()),
];

$sent = deliver_mail([
    'to' => $recipients,
    'fromEmail' => $fromEmail,
    'fromName' => $brand . ' Website',
    // Replying in the inbox goes straight to the enquirer when they gave one.
    'replyTo' => $data['email'] ?? null,
    'replyToName' => $data['name'],
    'subject' => $subject,
    'text' => $body['text'],
    'html' => $body['html'],
], $cfg);

if (!$sent['ok']) {
    // Log server-side for debugging; never return credentials or internals.
    error_log('[nexora-contact] delivery failed — ' . $sent['detail']);
    respond(502, [
        'ok' => false,
        'error' => 'We could not send your enquiry just now. Please call or WhatsApp us instead.',
    ]);
}

/* ----------------------------------------------------- Optional autoreply */

if (env('SEND_AUTOREPLY', '0') === '1' && !empty($data['email'])) {
    $reply = render_autoreply_email($data, $brand, $phoneDisplay, $waNumber);
    // A failed confirmation must never fail the request — the lead is safe.
    try {
        deliver_mail([
            'to' => [$data['email']],
            'fromEmail' => $fromEmail,
            'fromName' => $brand,
            'subject' => 'We have your enquiry — ' . $brand,
            'text' => $reply['text'],
            'html' => $reply['html'],
        ], $cfg);
    } catch (Throwable $e) {
        error_log('[nexora-contact] autoreply failed — ' . $e->getMessage());
    }
}

respond(200, [
    'ok' => true,
    'message' => 'Thank you — a senior designer will call you within 2 working hours.',
    'transport' => $sent['transport'],
]);
