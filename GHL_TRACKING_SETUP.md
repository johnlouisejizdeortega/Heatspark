# GHL Embedded Form — Conversion Tracking Setup Guide

A reliable, iframe-safe method for tracking GoHighLevel embedded form submissions via GTM Enhanced Conversions. Works on any Laravel + Inertia.js stack (or any framework with a thank-you page route).

---

## How It Works

```
User submits GHL form
        ↓
GHL redirects browser to /thank-you?email=...&phone=...&first_name=...
        ↓
Server renders ThankYou page with contact data as props
        ↓
React component mounts → pushes user_data to window.dataLayer
        ↓
GTM fires Google Ads Conversion + Enhanced Conversions tag
        ↓
history.replaceState() strips PII from the URL bar
```

No iframe hacks. No postMessage listeners. 100% reliable.

---

## Part 1 — GHL Form Settings

1. Open the form in GHL → **Settings** tab
2. Under **On Submit**, select **Redirect to URL**
3. Paste this URL (replace the domain):

```
https://yourdomain.com/thank-you?email={{contact.email}}&phone={{contact.phone}}&first_name={{contact.first_name}}
```

4. Click **Save**

> GHL replaces `{{contact.email}}` etc. with the actual submitted values at redirect time.

---

## Part 2 — Laravel Route

In `routes/web.php`, add a route that forwards the GHL query params as Inertia props:

```php
use Illuminate\Http\Request;

Route::get('/thank-you', function (Request $request) {
    return inertia('ThankYou', [
        'email'      => $request->query('email', ''),
        'first_name' => $request->query('first_name', ''),
        'phone'      => $request->query('phone', ''),
        // keep any other props your page needs, e.g.:
        // 'session_id' => $request->query('session_id', ''),
    ]);
})->name('thank-you');
```

---

## Part 3 — ThankYou React Component

### Props type

```tsx
type ThankYouProps = {
    email?: string;
    first_name?: string;
    phone?: string;
};
```

### GHL mode detection + dataLayer push

Add this near the top of the component (before any early returns):

```tsx
export default function ThankYou({ email = '', first_name = '', phone = '' }: ThankYouProps) {

    // Detect GHL redirect mode: contact data present in props
    const isGhlMode = !!email || !!first_name || !!phone;

    // Fire Enhanced Conversions user_data on mount, then strip PII from URL
    useEffect(() => {
        if (!isGhlMode) return;

        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
            event: 'ghl_form_submitted',
            user_data: {
                ...(email      && { email_address: email }),
                ...(phone      && { phone_number: phone }),
                ...(first_name && { address: { first_name } }),
            },
        });

        // Remove PII from URL before any subsequent analytics page view fires
        history.replaceState({}, '', '/thank-you');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
```

### Minimal thank-you UI (copy-paste ready)

```tsx
    if (isGhlMode) {
        return (
            <>
                <Head title="Thank You">
                    <meta name="robots" content="noindex,nofollow" />
                </Head>

                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
                    <div style={{ maxWidth: 600, width: '100%', background: '#fff', borderRadius: 16, padding: '3rem', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        <h1>Thank You{first_name ? `, ${first_name}` : ''}!</h1>
                        <p>We've received your enquiry. Someone will be in touch within 24 hours.</p>
                        <a href="/">Return to Homepage</a>
                    </div>
                </main>
            </>
        );
    }

    // ... rest of your existing component (OTP flow, etc.)
```

---

## Part 4 — GTM Setup

### Step 1: Data Layer Variables

Create three **Data Layer Variable** variables in GTM:

| Variable Name         | Data Layer Variable Name        |
|-----------------------|---------------------------------|
| `dlv - email`         | `user_data.email_address`       |
| `dlv - phone`         | `user_data.phone_number`        |
| `dlv - first_name`    | `user_data.address.first_name`  |

### Step 2: Trigger

- Type: **Custom Event**
- Event Name: `ghl_form_submitted`
- Name it: `CE - GHL Form Submitted`

### Step 3: Google Ads Conversion Tag

- Tag type: **Google Ads Conversion Tracking**
- Conversion ID + Label: from your Google Ads account
- Enable **Enhanced Conversions**
- Set user-provided data fields:
  - Email → `{{dlv - email}}`
  - Phone → `{{dlv - phone}}`
  - First Name → `{{dlv - first_name}}`
- Firing trigger: `CE - GHL Form Submitted`

### Step 4: Publish

Submit and publish the GTM container.

---

## Part 5 — Verification

After deploying, test with GTM Preview mode:

1. Open GTM → **Preview** → enter your domain
2. Submit the GHL form
3. You'll be redirected to `/thank-you`
4. In the GTM debug panel, confirm:
   - Event `ghl_form_submitted` appears in the timeline
   - Your Google Ads tag fired on that event
   - `user_data` variables are populated

Alternatively in browser DevTools console, before submitting:
```js
window.addEventListener('message', e => console.log(e)); // not needed anymore
// Instead just watch:
window.dataLayer
// After submit navigate to /thank-you and run:
window.dataLayer.filter(e => e.event === 'ghl_form_submitted')
```

---

## Checklist for Each New Site

- [ ] GHL form → Settings → Redirect to URL (with `{{contact.*}}` tokens)
- [ ] Laravel `/thank-you` route passes `email`, `phone`, `first_name` as Inertia props
- [ ] `ThankYou` component detects GHL mode and pushes `user_data` to `dataLayer`
- [ ] `history.replaceState` strips PII from URL after push
- [ ] GTM: 3x Data Layer Variables created
- [ ] GTM: Custom Event trigger `ghl_form_submitted`
- [ ] GTM: Google Ads tag with Enhanced Conversions wired to variables
- [ ] GTM container published
- [ ] Tested with GTM Preview mode

---

## Notes

- **No postMessage / iframe listeners** — these are unreliable cross-origin and should not be used
- **PII is never logged server-side** — it passes through as query params and is only read client-side
- **`noindex,nofollow`** on the thank-you page prevents it appearing in search results
- If the site uses a different framework (Next.js, Nuxt, plain HTML), the same logic applies: read the query params on page load, push to `dataLayer`, clean the URL
