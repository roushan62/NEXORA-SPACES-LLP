# Contact form backend (PHP on Vercel)

The website is static and lives on GitHub Pages. A static host cannot send
email, so the consultation form posts to **one PHP function on Vercel**, which
emails the enquiry to your inbox. Vercel's free Hobby plan covers this
comfortably.

```
Visitor → form on GitHub Pages → POST → Vercel /api/contact.php → your inbox
```

| File | Role |
|---|---|
| `api/contact.php` | The endpoint: CORS, validation, spam filtering, rate limiting |
| `api/lib/mailer.php` | SMTP client (no Composer) + Brevo/Resend HTTP transports |
| `api/lib/validate.php` | Server-side validation and the email templates |
| `vercel.json` | Pins the PHP runtime and routes `/api/contact` |
| `.vercelignore` | Keeps the site itself out of the function deployment |

---

## Deploy in 10 minutes

### 1 — Create a Gmail App Password

A normal Gmail password will **not** work; Google requires an App Password.

1. Turn on 2-Step Verification: <https://myaccount.google.com/signinoptions/two-step-verification>
2. Open <https://myaccount.google.com/apppasswords>
3. Create one named `Nexora Website`
4. Copy the 16-character code (looks like `abcd efgh ijkl mnop`) — spaces are fine

### 2 — Import the repo into Vercel

1. Go to <https://vercel.com/new> and import `roushan62/NEXORA-SPACES-LLP`
2. Framework preset: **Other**. Leave the build and output settings empty —
   `vercel.json` already tells Vercel everything it needs.
3. Click **Deploy**

### 3 — Add the environment variables

**Project → Settings → Environment Variables.** Add these for *Production*
(and *Preview*, if you want previews to send too):

| Name | Value | Notes |
|---|---|---|
| `MAIL_TO` | `kingboy620478@gmail.com` | ⚠️ **placeholder** — change to the real studio inbox at launch |
| `SMTP_HOST` | `smtp.gmail.com` | |
| `SMTP_PORT` | `587` | use `465` if 587 ever misbehaves |
| `SMTP_USER` | your full Gmail address | |
| `SMTP_PASS` | the 16-character App Password | never your login password |
| `MAIL_FROM` | same as `SMTP_USER` | Gmail rejects a From it does not own |

Optional:

| Name | Value | Effect |
|---|---|---|
| `SEND_AUTOREPLY` | `1` | also emails the enquirer a confirmation |
| `ALLOWED_ORIGINS` | comma-separated list | defaults already allow GitHub Pages + localhost |
| `RATE_LIMIT_MAX` | `6` | submissions allowed per IP per window |
| `MAIL_DRY_RUN` | `1` | compose but do not send — for testing a deploy |
| `BREVO_API_KEY` | key from brevo.com | HTTPS transport, used ahead of SMTP |

> **Redeploy after adding variables.** Vercel only injects them at build time,
> so values added after a deploy do not apply until the next one.

### 4 — Point the website at your endpoint

Copy your production URL from Vercel, then edit **`src/config/site.config.js`**:

```js
forms: {
  endpoint: 'https://YOUR-PROJECT.vercel.app/api/contact',
  ...
}
```

```bash
npm run build
git add -A && git commit -m "Point lead form at the Vercel endpoint" && git push
```

Until you set this, the form still works — it falls back to opening WhatsApp
with the enquiry pre-filled, so **no lead is ever lost**.

---

## Verify it works

**Is the function alive?** Open the endpoint in a browser — a `GET` returns a
health check and sends nothing:

```json
{ "ok": true, "service": "Nexora Spaces contact endpoint", "transport": "smtp" }
```

If `transport` says `not-configured`, the environment variables did not reach
this deployment — add them and redeploy.

**Send a real test:**

```bash
curl -X POST https://YOUR-PROJECT.vercel.app/api/contact \
  -H "Origin: https://roushan62.github.io" \
  -d "name=Test User" -d "phone=9811099110" -d "city=Gurugram" \
  -d "home_type=Villa" -d "consent=on" -d "email=you@example.com"
```

Expect `{"ok":true,...}` and an email within a few seconds. Then submit the
real form at `/contact/` and confirm it lands too.

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `{"transport":"not-configured"}` | Env vars missing on this deployment. Add them, then **redeploy**. |
| `502` and no email | Almost always a bad `SMTP_PASS`. Regenerate the App Password; paste it without the surrounding spaces. |
| `403 Origin not allowed` | You are posting from a domain that is not in `ALLOWED_ORIGINS`. Add it. |
| `429` | Rate limit hit. Wait, or raise `RATE_LIMIT_MAX`. |
| Mail lands in spam | Expected with a plain Gmail sender. Mark it "not spam" once, or move to Brevo/Resend with a verified domain. |
| Form opens WhatsApp instead of sending | `site.forms.endpoint` is still empty, or the request failed. Check the browser console. |

**Reading logs:** Vercel dashboard → your project → *Logs*, or `vercel logs --follow`.
Delivery failures are logged as `[nexora-contact] delivery failed — …`.
Credentials are never logged.

---

## Why SMTP is written the way it is

Vercel leaves ports 465/587 open, but a serverless function is **frozen the
moment it returns a response** — anything still in flight is dropped. So
`api/lib/mailer.php` completes the entire SMTP conversation synchronously
before responding, rather than firing and forgetting.

If SMTP ever fails, `deliver_mail()` automatically falls through to any
configured HTTP transport (Brevo or Resend, both plain HTTPS on 443), so a
blocked port degrades instead of losing the lead.

---

## Running it elsewhere

The code is plain PHP 8.1+ with no dependencies, so `api/contact.php` also
runs unchanged on cPanel, Hostinger or XAMPP. On classic shared hosting set
`ALLOW_PHP_MAIL=1` to permit the built-in `mail()` as a last resort. Set the
same variables in `.htaccess`, a `.env` loader, or directly in your panel.

---

## Testing

```bash
npm run test:api
```

This executes the real `api/contact.php` inside a PHP 8.2 WebAssembly runtime
— no PHP installation needed — and asserts 29 behaviours including validation,
CORS, the honeypot, rate limiting, header-injection resistance and that
credentials never leak into a response.
