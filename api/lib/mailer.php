<?php
/**
 * ============================================================================
 *  Nexora Spaces — mail transport
 * ============================================================================
 *  A dependency-free SMTP client (no Composer, no PHPMailer) plus an
 *  HTTP-API transport, because the two behave very differently on Vercel:
 *
 *   • SMTP (Gmail app password) — free and needs no third-party signup.
 *     Vercel leaves ports 465/587 open, but a serverless function is frozen
 *     the moment it returns, so the whole conversation is completed
 *     synchronously here before send() returns. Nothing is left in flight.
 *
 *   • Brevo / Resend HTTP API — plain HTTPS on 443. Immune to SMTP throttling
 *     and to any future egress policy change. Used automatically when a key
 *     is configured, and as the fallback when SMTP fails.
 *
 *  Every transport returns the same shape, so the handler never needs to know
 *  which one actually delivered the mail.
 * ============================================================================
 */

declare(strict_types=1);

/** Result helper: uniform shape from every transport. */
function mail_result(bool $ok, string $transport, string $detail = ''): array
{
    return ['ok' => $ok, 'transport' => $transport, 'detail' => $detail];
}

/**
 * Strip CR/LF from anything interpolated into a header.
 * Without this a crafted name/email can inject extra headers (Bcc, etc.).
 */
function header_safe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0", '%0a', '%0d'], '', $value));
}

/** RFC 2047 encode a display name so non-ASCII survives transport. */
function encode_display_name(string $name): string
{
    $name = header_safe($name);
    if ($name === '') {
        return '';
    }
    /* Quoting already makes header injection impossible, but a name carrying
       "Bcc:" or an <address> still renders as a confusing, phishy sender in
       the inbox. Strip those constructs so the display name stays a name. */
    $name = preg_replace('/<[^>]*>/', '', $name) ?? $name;
    $name = preg_replace('/\b(?:bcc|cc|to|from|reply-to|subject|content-type)\s*:/i', '', $name) ?? $name;
    $name = trim(preg_replace('/\s{2,}/', ' ', $name) ?? $name);
    if ($name === '') {
        return '';
    }
    if (preg_match('/^[\x20-\x7E]*$/', $name) === 1) {
        // Quote it if it contains characters that are special in a header.
        return preg_match('/[",:;<>@\[\]\\\\]/', $name) === 1
            ? '"' . addcslashes($name, '"\\') . '"'
            : $name;
    }
    return '=?UTF-8?B?' . base64_encode($name) . '?=';
}

/** Build a "Display Name <addr@host>" header value. */
function format_address(string $email, string $name = ''): string
{
    $email = header_safe($email);
    $name = encode_display_name($name);
    return $name === '' ? $email : $name . ' <' . $email . '>';
}

/**
 * Fold a header to keep lines under the 998-octet SMTP limit.
 * Long subjects otherwise get truncated or rejected outright.
 */
function fold_header(string $name, string $value): string
{
    $line = $name . ': ' . $value;
    if (strlen($line) <= 900) {
        return $line;
    }
    return $name . ': ' . wordwrap($value, 900, "\r\n ", true);
}

/**
 * SMTP dot-stuffing + CRLF normalisation.
 * A line consisting solely of "." would otherwise terminate the DATA phase.
 */
function smtp_prepare_body(string $body): string
{
    $body = preg_replace("/\r\n|\r|\n/", "\r\n", $body);
    return preg_replace('/^\./m', '..', $body);
}

/* ============================================================ SMTP client */

/**
 * Minimal synchronous SMTP client supporting STARTTLS (587) and implicit
 * TLS (465), with AUTH LOGIN and AUTH PLAIN.
 */
final class SmtpClient
{
    /** @var resource|null */
    private $socket = null;
    private array $log = [];

    public function __construct(
        private string $host,
        private int $port,
        private string $username,
        private string $password,
        private int $timeout = 12
    ) {
    }

    public function transcript(): string
    {
        return implode("\n", $this->log);
    }

    private function note(string $line): void
    {
        // Never let a password reach the log.
        $this->log[] = preg_replace('/^(AUTH [A-Z]+ ).*/', '$1<redacted>', $line);
        if (count($this->log) > 60) {
            array_shift($this->log);
        }
    }

    /** Read a full multi-line SMTP reply ("250-..." lines then "250 ..."). */
    private function read(): array
    {
        $data = '';
        while (($line = fgets($this->socket, 1024)) !== false) {
            $data .= $line;
            // Last line has a space (not '-') in position 4.
            if (strlen($line) < 4 || $line[3] !== '-') {
                break;
            }
        }
        if ($data === '') {
            throw new RuntimeException('SMTP connection closed unexpectedly');
        }
        $this->note('S: ' . trim($data));
        return [(int) substr($data, 0, 3), $data];
    }

    private function write(string $command): void
    {
        $this->note('C: ' . $command);
        if (fwrite($this->socket, $command . "\r\n") === false) {
            throw new RuntimeException('Failed writing to SMTP socket');
        }
    }

    /** Send a command and assert the reply code. */
    private function command(string $command, array $expect): string
    {
        $this->write($command);
        [$code, $raw] = $this->read();
        if (!in_array($code, $expect, true)) {
            throw new RuntimeException(
                'SMTP ' . strtok($command, ' ') . ' failed: ' . trim($raw)
            );
        }
        return $raw;
    }

    public function send(array $msg): void
    {
        $implicitTls = $this->port === 465;
        $endpoint = ($implicitTls ? 'ssl://' : 'tcp://') . $this->host . ':' . $this->port;

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'SNI_enabled' => true,
                'peer_name' => $this->host,
            ],
        ]);

        $errNo = 0;
        $errStr = '';
        $this->socket = @stream_socket_client(
            $endpoint,
            $errNo,
            $errStr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$this->socket) {
            throw new RuntimeException("Cannot reach {$endpoint}: {$errStr} ({$errNo})");
        }

        stream_set_timeout($this->socket, $this->timeout);

        try {
            [$code] = $this->read();                       // 220 greeting
            if ($code !== 220) {
                throw new RuntimeException('Unexpected SMTP greeting');
            }

            $ehlo = 'nexora-spaces.vercel.app';
            $caps = $this->command('EHLO ' . $ehlo, [250]);

            if (!$implicitTls) {
                // Upgrade the plaintext connection before authenticating.
                $this->command('STARTTLS', [220]);
                $ok = @stream_socket_enable_crypto(
                    $this->socket,
                    true,
                    STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT
                );
                if ($ok !== true) {
                    throw new RuntimeException('STARTTLS negotiation failed');
                }
                // Capabilities must be re-read inside the TLS session.
                $caps = $this->command('EHLO ' . $ehlo, [250]);
            }

            if ($this->username !== '') {
                if (stripos($caps, 'AUTH') === false) {
                    throw new RuntimeException('Server advertises no AUTH mechanism');
                }
                if (stripos($caps, 'LOGIN') !== false) {
                    $this->command('AUTH LOGIN', [334]);
                    $this->command(base64_encode($this->username), [334]);
                    $this->command(base64_encode($this->password), [235]);
                } else {
                    $this->command(
                        'AUTH PLAIN ' . base64_encode("\0" . $this->username . "\0" . $this->password),
                        [235]
                    );
                }
            }

            $this->command('MAIL FROM:<' . $msg['fromEmail'] . '>', [250]);
            foreach ($msg['to'] as $rcpt) {
                $this->command('RCPT TO:<' . $rcpt . '>', [250, 251]);
            }

            $this->command('DATA', [354]);
            $this->write($msg['mime']);
            $this->write('.');
            [$code, $raw] = $this->read();
            if ($code !== 250) {
                throw new RuntimeException('Message rejected: ' . trim($raw));
            }

            // QUIT is best-effort; the mail is already accepted.
            try {
                $this->command('QUIT', [221]);
            } catch (Throwable $e) {
                // ignore
            }
        } finally {
            if (is_resource($this->socket)) {
                fclose($this->socket);
            }
            $this->socket = null;
        }
    }
}

/* ====================================================== MIME construction */

/**
 * Build a multipart/alternative message (plain text + HTML).
 * Both parts are always supplied so the mail scores well with spam filters.
 */
function build_mime(array $m): string
{
    $boundary = 'nx-' . bin2hex(random_bytes(12));
    $date = date('r');
    $messageId = '<' . bin2hex(random_bytes(16)) . '@' . ($m['messageIdDomain'] ?? 'nexoraspaces.in') . '>';

    $headers = [
        fold_header('From', format_address($m['fromEmail'], $m['fromName'] ?? '')),
        fold_header('To', implode(', ', array_map('header_safe', $m['to']))),
        fold_header('Subject', encode_header_text($m['subject'])),
        'Date: ' . $date,
        'Message-ID: ' . $messageId,
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];

    if (!empty($m['replyTo'])) {
        $headers[] = fold_header('Reply-To', format_address($m['replyTo'], $m['replyToName'] ?? ''));
    }
    // Keeps auto-responders and out-of-office replies from looping.
    $headers[] = 'Auto-Submitted: auto-generated';
    $headers[] = 'X-Mailer: Nexora Spaces Website';

    $body = "This is a multi-part message in MIME format.\r\n\r\n"
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($m['text']), 76, "\r\n")
        . "\r\n--" . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($m['html']), 76, "\r\n")
        . "\r\n--" . $boundary . "--\r\n";

    return implode("\r\n", $headers) . "\r\n\r\n" . smtp_prepare_body($body);
}

/** Encode a subject line if it carries non-ASCII characters. */
function encode_header_text(string $text): string
{
    $text = header_safe($text);
    if (preg_match('/^[\x20-\x7E]*$/', $text) === 1) {
        return $text;
    }
    return '=?UTF-8?B?' . base64_encode($text) . '?=';
}

/* ==================================================== HTTP API transports */

/** POST JSON and return [status, body]. */
function http_post_json(string $url, array $payload, array $headers, int $timeout = 12): array
{
    $body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => array_merge(['Content-Type: application/json'], $headers),
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_CONNECTTIMEOUT => $timeout,
        ]);
        $res = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        if ($res === false) {
            throw new RuntimeException('HTTP transport error: ' . $err);
        }
        return [$status, (string) $res];
    }

    // Fallback when cURL is unavailable in the runtime.
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", array_merge(['Content-Type: application/json'], $headers)),
            'content' => $body,
            'timeout' => $timeout,
            'ignore_errors' => true,
        ],
    ]);
    $res = @file_get_contents($url, false, $ctx);
    $status = 0;
    if (isset($http_response_header[0]) &&
        preg_match('#HTTP/\S+\s+(\d{3})#', $http_response_header[0], $mm) === 1) {
        $status = (int) $mm[1];
    }
    if ($res === false) {
        throw new RuntimeException('HTTP transport error: request failed');
    }
    return [$status, (string) $res];
}

function send_via_brevo(array $m, string $apiKey): array
{
    [$status, $body] = http_post_json('https://api.brevo.com/v3/smtp/email', [
        'sender' => ['email' => $m['fromEmail'], 'name' => $m['fromName'] ?? 'Website'],
        'to' => array_map(static fn ($e) => ['email' => $e], $m['to']),
        'replyTo' => !empty($m['replyTo'])
            ? ['email' => $m['replyTo'], 'name' => $m['replyToName'] ?? '']
            : null,
        'subject' => $m['subject'],
        'htmlContent' => $m['html'],
        'textContent' => $m['text'],
    ], ['api-key: ' . $apiKey, 'Accept: application/json']);

    if ($status >= 200 && $status < 300) {
        return mail_result(true, 'brevo');
    }
    throw new RuntimeException("Brevo responded {$status}: " . substr($body, 0, 300));
}

function send_via_resend(array $m, string $apiKey): array
{
    [$status, $body] = http_post_json('https://api.resend.com/emails', array_filter([
        'from' => format_address($m['fromEmail'], $m['fromName'] ?? ''),
        'to' => $m['to'],
        'subject' => $m['subject'],
        'html' => $m['html'],
        'text' => $m['text'],
        'reply_to' => $m['replyTo'] ?? null,
    ]), ['Authorization: Bearer ' . $apiKey]);

    if ($status >= 200 && $status < 300) {
        return mail_result(true, 'resend');
    }
    throw new RuntimeException("Resend responded {$status}: " . substr($body, 0, 300));
}

/**
 * Deliver a message using whichever transport is configured.
 *
 * Order: explicit MAIL_TRANSPORT → Brevo/Resend key → SMTP → PHP mail().
 * On SMTP failure it automatically retries over an HTTP API when one is
 * available, so a blocked port never silently loses a lead.
 *
 * @return array{ok:bool,transport:string,detail:string}
 */
function deliver_mail(array $m, array $cfg): array
{
    $attempts = [];
    $preferred = strtolower(trim((string) ($cfg['transport'] ?? '')));

    /* Dry run: compose the message for real (so MIME, encoding and header
       sanitisation are all exercised) but write it to disk instead of sending.
       Used by the test suite, and handy for verifying a deploy without
       spamming the studio inbox. */
    if (!empty($cfg['dryRun'])) {
        $dir = $cfg['dryRunDir'] ?? sys_get_temp_dir();
        if (!is_dir($dir)) {
            @mkdir($dir, 0700, true);
        }
        $record = [
            'to' => $m['to'],
            'fromEmail' => $m['fromEmail'],
            'replyTo' => $m['replyTo'] ?? null,
            'subject' => $m['subject'],
            'text' => $m['text'],
            'html' => $m['html'],
            'mime' => build_mime($m),
        ];
        @file_put_contents(
            rtrim($dir, '/') . '/mail-' . bin2hex(random_bytes(6)) . '.json',
            json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        );
        return mail_result(true, 'dry-run');
    }

    $trySmtp = static function () use ($m, $cfg): array {
        $client = new SmtpClient(
            $cfg['smtpHost'],
            (int) $cfg['smtpPort'],
            $cfg['smtpUser'],
            $cfg['smtpPass']
        );
        $client->send($m + ['mime' => build_mime($m)]);
        return mail_result(true, 'smtp');
    };

    $order = [];
    if ($preferred === 'smtp') {
        $order[] = 'smtp';
    } elseif ($preferred === 'brevo' || $preferred === 'resend') {
        $order[] = $preferred;
    }

    // Whatever is configured, in preference order.
    if (!empty($cfg['brevoKey'])) {
        $order[] = 'brevo';
    }
    if (!empty($cfg['resendKey'])) {
        $order[] = 'resend';
    }
    if (!empty($cfg['smtpHost']) && !empty($cfg['smtpUser'])) {
        $order[] = 'smtp';
    }
    $order[] = 'php-mail';
    $order = array_values(array_unique($order));

    foreach ($order as $transport) {
        try {
            switch ($transport) {
                case 'brevo':
                    if (empty($cfg['brevoKey'])) {
                        continue 2;
                    }
                    return send_via_brevo($m, $cfg['brevoKey']);

                case 'resend':
                    if (empty($cfg['resendKey'])) {
                        continue 2;
                    }
                    return send_via_resend($m, $cfg['resendKey']);

                case 'smtp':
                    if (empty($cfg['smtpHost']) || empty($cfg['smtpUser'])) {
                        continue 2;
                    }
                    return $trySmtp();

                case 'php-mail':
                    // Last resort: only meaningful on classic shared hosting.
                    if (!function_exists('mail') || empty($cfg['allowPhpMail'])) {
                        continue 2;
                    }
                    $headers = 'From: ' . format_address($m['fromEmail'], $m['fromName'] ?? '') . "\r\n"
                        . (!empty($m['replyTo']) ? 'Reply-To: ' . $m['replyTo'] . "\r\n" : '')
                        . "MIME-Version: 1.0\r\n"
                        . "Content-Type: text/html; charset=UTF-8\r\n";
                    $sent = @mail(
                        implode(', ', $m['to']),
                        encode_header_text($m['subject']),
                        $m['html'],
                        $headers
                    );
                    if ($sent) {
                        return mail_result(true, 'php-mail');
                    }
                    throw new RuntimeException('php mail() returned false');
            }
        } catch (Throwable $e) {
            $attempts[] = $transport . ': ' . $e->getMessage();
            // Try the next transport rather than dropping the lead.
        }
    }

    return mail_result(false, 'none', implode(' | ', $attempts));
}
