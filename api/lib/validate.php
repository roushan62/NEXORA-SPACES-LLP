<?php
/**
 * ============================================================================
 *  Nexora Spaces — lead validation + templating
 * ============================================================================
 *  Server-side validation is authoritative. The browser checks are a courtesy;
 *  anything can POST to this endpoint directly, so every rule is re-applied
 *  here and every value is escaped before it reaches an email body.
 * ============================================================================
 */

declare(strict_types=1);

/** Collapse whitespace, strip control characters, enforce a length ceiling. */
function clean_text(mixed $value, int $max = 500): string
{
    if (!is_scalar($value)) {
        return '';
    }
    $s = (string) $value;
    // Drop C0/C1 control characters except tab and newline.
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    $s = trim($s);
    if (function_exists('mb_substr')) {
        return mb_substr($s, 0, $max);
    }
    return substr($s, 0, $max);
}

/** Normalise an Indian mobile number to its 10 significant digits. */
function normalise_phone(string $raw): string
{
    $digits = preg_replace('/\D+/', '', $raw) ?? '';
    // Trim the country code / trunk prefix if present.
    if (strlen($digits) > 10 && str_starts_with($digits, '91')) {
        $digits = substr($digits, 2);
    }
    if (strlen($digits) === 11 && str_starts_with($digits, '0')) {
        $digits = substr($digits, 1);
    }
    return $digits;
}

/**
 * Validate a submitted lead.
 *
 * @return array{data:array<string,string>,errors:array<string,string>}
 */
function validate_lead(array $input): array
{
    $errors = [];
    $data = [];

    /* ---------------------------------------------------------- Full name */
    $data['name'] = clean_text($input['name'] ?? '', 120);
    if ($data['name'] === '') {
        $errors['name'] = 'Please tell us your name.';
    } elseif (mb_strlen($data['name']) < 2) {
        $errors['name'] = 'That name looks too short.';
    } elseif (preg_match('/https?:\/\/|\[url|<a\s/i', $data['name']) === 1) {
        // A URL in the name field is a reliable spam signal.
        $errors['name'] = 'Please enter a real name.';
    }

    /* -------------------------------------------------------------- Phone */
    $rawPhone = clean_text($input['phone'] ?? '', 32);
    $digits = normalise_phone($rawPhone);
    if ($digits === '') {
        $errors['phone'] = 'Please give us a number to call you on.';
    } elseif (strlen($digits) !== 10) {
        $errors['phone'] = 'Enter a valid 10-digit Indian mobile number.';
    } elseif (!in_array($digits[0], ['6', '7', '8', '9'], true)) {
        // Indian mobile numbers always start 6-9.
        $errors['phone'] = 'Enter a valid Indian mobile number.';
    } else {
        $data['phone'] = $digits;
        $data['phone_display'] = '+91 ' . substr($digits, 0, 5) . ' ' . substr($digits, 5);
    }

    /* -------------------------------------------------------------- Email */
    $email = clean_text($input['email'] ?? '', 180);
    if ($email !== '') {
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $errors['email'] = 'That email address does not look right.';
        } else {
            $data['email'] = strtolower($email);
        }
    }

    /* --------------------------------------------------------------- City */
    $allowedCities = ['Gurugram', 'Noida / Greater Noida', 'Delhi', 'Ghaziabad', 'Faridabad', 'Other'];
    $city = clean_text($input['city'] ?? '', 60);
    if ($city === '') {
        $errors['city'] = 'Please choose your city.';
    } elseif (!in_array($city, $allowedCities, true)) {
        // Unknown value: keep it (someone may have typed it) but cap the length.
        $data['city'] = mb_substr($city, 0, 60);
    } else {
        $data['city'] = $city;
    }

    /* ---------------------------------------------------------- Home type */
    $allowedTypes = ['Flat / Apartment', 'Villa', 'Independent House'];
    $homeType = clean_text($input['home_type'] ?? '', 60);
    if ($homeType === '') {
        $errors['home_type'] = 'Please choose your home type.';
    } else {
        $data['home_type'] = in_array($homeType, $allowedTypes, true)
            ? $homeType
            : mb_substr($homeType, 0, 60);
    }

    /* ------------------------------------------------------ Optional bits */
    $data['approx_area'] = clean_text($input['approx_area'] ?? '', 60);
    $data['message'] = clean_text($input['message'] ?? '', 2000);
    $data['source'] = clean_text($input['source'] ?? 'website', 60);
    $data['page'] = clean_text($input['page_url'] ?? '', 300);

    /* ------------------------------------------------------------ Consent */
    $consent = $input['consent'] ?? '';
    $consentGiven = in_array(
        is_string($consent) ? strtolower($consent) : $consent,
        ['on', 'yes', 'true', '1', 1, true],
        true
    );
    if (!$consentGiven) {
        $errors['consent'] = 'Please accept the contact consent to continue.';
    }
    $data['consent'] = $consentGiven ? 'Yes' : 'No';

    /* --------------------------------------------------- Spam heuristics */
    $haystack = strtolower($data['message'] . ' ' . $data['name']);
    $spamHits = 0;
    foreach (['viagra', 'casino', 'crypto', 'seo services', 'backlink', 'loan offer', 'bitcoin', 'porn'] as $term) {
        if (str_contains($haystack, $term)) {
            $spamHits++;
        }
    }
    // Three or more links in a short enquiry is almost always spam.
    $linkCount = preg_match_all('#https?://#i', $data['message']) ?: 0;
    if ($spamHits > 0 || $linkCount >= 3) {
        $errors['_spam'] = 'This submission looks like spam.';
    }

    return ['data' => $data, 'errors' => $errors];
}

/** HTML-escape for safe interpolation into the notification email. */
function e(string $v): string
{
    return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Notification email sent to the studio inbox. */
function render_lead_email(array $d, array $meta): array
{
    $rows = [
        'Name' => $d['name'] ?? '',
        'Phone' => $d['phone_display'] ?? '',
        'Email' => $d['email'] ?? '—',
        'City' => $d['city'] ?? '',
        'Home type' => $d['home_type'] ?? '',
        'Approx. area' => $d['approx_area'] !== '' ? $d['approx_area'] : '—',
        'Consent given' => $d['consent'] ?? 'No',
        'Form source' => $d['source'] ?? 'website',
        'Page' => $d['page'] !== '' ? $d['page'] : '—',
        'Received' => $meta['received'],
        'IP' => $meta['ip'],
    ];

    /* ------------------------------------------------------------- Plain */
    $text = "NEW CONSULTATION REQUEST\n"
        . str_repeat('=', 46) . "\n\n";
    foreach ($rows as $k => $v) {
        $text .= str_pad($k, 15) . ': ' . $v . "\n";
    }
    if (($d['message'] ?? '') !== '') {
        $text .= "\nMessage:\n" . $d['message'] . "\n";
    }
    $text .= "\n" . str_repeat('=', 46) . "\n";
    if (!empty($d['phone'])) {
        $text .= 'Call back: +91' . $d['phone'] . "\n";
        $text .= 'WhatsApp : https://wa.me/91' . $d['phone'] . "\n";
    }

    /* -------------------------------------------------------------- HTML */
    $rowsHtml = '';
    foreach ($rows as $k => $v) {
        $rowsHtml .= '<tr>'
            . '<td style="padding:10px 14px;border-bottom:1px solid #ecebe8;color:#5d656e;'
            . 'font-size:13px;white-space:nowrap;vertical-align:top">' . e($k) . '</td>'
            . '<td style="padding:10px 14px;border-bottom:1px solid #ecebe8;color:#16181d;'
            . 'font-size:14px;font-weight:600">' . e((string) $v) . '</td>'
            . '</tr>';
    }

    $messageHtml = '';
    if (($d['message'] ?? '') !== '') {
        $messageHtml = '<div style="margin-top:22px">'
            . '<p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5d656e">Message</p>'
            . '<div style="background:#faf9f7;border:1px solid #ecebe8;border-radius:10px;padding:14px 16px;'
            . 'font-size:14px;line-height:1.6;color:#16181d;white-space:pre-wrap">'
            . nl2br(e($d['message'])) . '</div></div>';
    }

    $actions = '';
    if (!empty($d['phone'])) {
        $actions = '<div style="margin-top:24px">'
            . '<a href="tel:+91' . e($d['phone']) . '" style="display:inline-block;background:#16181d;color:#fff;'
            . 'text-decoration:none;padding:11px 20px;border-radius:8px;font-size:14px;font-weight:600;margin-right:8px">'
            . 'Call ' . e($d['phone_display'] ?? '') . '</a>'
            . '<a href="https://wa.me/91' . e($d['phone']) . '" style="display:inline-block;background:#1faa54;color:#fff;'
            . 'text-decoration:none;padding:11px 20px;border-radius:8px;font-size:14px;font-weight:600">'
            . 'WhatsApp</a></div>';
    }

    $html = '<!doctype html><html><body style="margin:0;padding:24px;background:#f4f2ef;'
        . 'font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif">'
        . '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;'
        . 'box-shadow:0 2px 8px rgba(0,0,0,.06)">'
        . '<div style="background:#16181d;padding:22px 26px">'
        . '<p style="margin:0;color:#c9a227;font-size:11px;letter-spacing:.14em;text-transform:uppercase">Nexora Spaces</p>'
        . '<h1 style="margin:6px 0 0;color:#fff;font-size:21px;font-weight:600">New consultation request</h1>'
        . '</div>'
        . '<div style="padding:24px 26px">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">'
        . $rowsHtml . '</table>' . $messageHtml . $actions
        . '<p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #ecebe8;color:#8b9099;font-size:12px">'
        . 'Sent automatically from the Nexora Spaces website contact form.</p>'
        . '</div></div></body></html>';

    return ['text' => $text, 'html' => $html];
}

/** Optional confirmation email back to the enquirer. */
function render_autoreply_email(array $d, string $brand, string $phoneDisplay, string $waNumber): array
{
    $first = explode(' ', trim($d['name'] ?? ''))[0] ?: 'there';

    $text = "Hi {$first},\n\n"
        . "Thank you for reaching out to {$brand}. We have received your enquiry and a senior designer "
        . "will call you within 2 working hours (Mon-Sat, 10:00 AM - 7:30 PM).\n\n"
        . "Here is what you shared with us:\n"
        . '  City      : ' . ($d['city'] ?? '') . "\n"
        . '  Home type : ' . ($d['home_type'] ?? '') . "\n"
        . (($d['approx_area'] ?? '') !== '' ? '  Area      : ' . $d['approx_area'] . "\n" : '')
        . "\nIf you would like to talk sooner, call us on {$phoneDisplay} "
        . "or WhatsApp https://wa.me/{$waNumber}.\n\n"
        . "— The {$brand} design team\n";

    $html = '<!doctype html><html><body style="margin:0;padding:24px;background:#f4f2ef;'
        . 'font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif">'
        . '<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden">'
        . '<div style="background:#16181d;padding:24px 28px">'
        . '<p style="margin:0;color:#c9a227;font-size:11px;letter-spacing:.14em;text-transform:uppercase">' . e($brand) . '</p>'
        . '<h1 style="margin:6px 0 0;color:#fff;font-size:22px;font-weight:600">Thank you, ' . e($first) . '</h1></div>'
        . '<div style="padding:26px 28px;color:#16181d;font-size:15px;line-height:1.65">'
        . '<p style="margin:0 0 16px">We have your enquiry. A <strong>senior designer</strong> will call you '
        . 'within <strong>2 working hours</strong> (Mon–Sat, 10:00 AM – 7:30 PM).</p>'
        . '<div style="background:#faf9f7;border:1px solid #ecebe8;border-radius:10px;padding:16px;margin:18px 0">'
        . '<p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5d656e">Your details</p>'
        . '<p style="margin:0;font-size:14px">City: <strong>' . e($d['city'] ?? '') . '</strong><br>'
        . 'Home type: <strong>' . e($d['home_type'] ?? '') . '</strong>'
        . (($d['approx_area'] ?? '') !== '' ? '<br>Approx. area: <strong>' . e($d['approx_area']) . '</strong>' : '')
        . '</p></div>'
        . '<p style="margin:0 0 18px">Prefer to talk now?</p>'
        . '<a href="tel:' . e(str_replace(' ', '', $phoneDisplay)) . '" style="display:inline-block;background:#16181d;'
        . 'color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;font-size:14px;margin-right:8px">'
        . 'Call ' . e($phoneDisplay) . '</a>'
        . '<a href="https://wa.me/' . e($waNumber) . '" style="display:inline-block;background:#1faa54;color:#fff;'
        . 'text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;font-size:14px">WhatsApp us</a>'
        . '<p style="margin:26px 0 0;padding-top:16px;border-top:1px solid #ecebe8;color:#8b9099;font-size:12px">'
        . 'You are receiving this because you submitted an enquiry on our website. '
        . 'This mailbox is not monitored — please reply to our designer\'s call or WhatsApp instead.</p>'
        . '</div></div></body></html>';

    return ['text' => $text, 'html' => $html];
}
