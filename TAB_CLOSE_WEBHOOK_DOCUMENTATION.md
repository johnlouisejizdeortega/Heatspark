# Tab Close Webhook Trigger — Implementation Documentation

Fire a webhook when a user closes or refreshes a browser tab on a **specific page only**, without affecting any other page on the site.

---

## Use Case

You have a verification or checkout flow on a specific page (e.g. `/thank-you`). If the user abandons the page by closing the tab, refreshing, or navigating away via the browser (not internal navigation), you want to fire a webhook to record the abandonment — but **only from that page**.

---

## How It Works

| Trigger | Method |
|---|---|
| Close/refresh browser tab | `beforeunload` + `navigator.sendBeacon` |
| Click internal "go back" button | Standard `fetch` POST |
| Successful completion | Neither fires (guarded by status check) |
| Any other page | Never fires (listener scoped to component) |

---

## Stack Used

- **Frontend:** React + TypeScript (Inertia.js / any React SPA)
- **Backend:** Laravel (PHP) — but the pattern works with any backend
- **CSRF:** Laravel web middleware group (`_token` query param for beacon)

---

## Frontend Implementation (React/TypeScript)

### Step 1 — Track status in a ref (prevents stale closures)

```tsx
const [status, setStatus] = useState<'idle' | 'loading' | 'completed'>('idle');

// Ref mirrors state so beforeunload handler always reads the LATEST value
const statusRef = useRef(status);
useEffect(() => { statusRef.current = status; }, [status]);
```

> **Why a ref?** `beforeunload` closures capture the initial value of state variables. Without a ref, `status` inside the handler would always read `'idle'` even after the user completes the action. The ref is always up to date.

---

### Step 2 — Attach the `beforeunload` listener (scoped to this component only)

```tsx
useEffect(() => {
    const handleBeforeUnload = () => {
        // Don't fire if the user already completed the action
        if (statusRef.current === 'completed') return;

        const token = getCsrfToken(); // Get CSRF token from meta tag
        const payload = JSON.stringify({ session_id });

        if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: 'application/json' });
            // Pass CSRF token as query param — required for Laravel web routes
            navigator.sendBeacon(
                `/api/your-endpoint${token ? `?_token=${encodeURIComponent(token)}` : ''}`,
                blob
            );
        }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // CRITICAL: cleanup removes the listener when this component unmounts
    // This means it ONLY fires on this page and never on any other page
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [session_id]); // re-registers only if session_id changes
```

> **Why `sendBeacon`?** Regular `fetch` is cancelled by the browser before completing when a tab closes. `sendBeacon` is specifically designed to survive tab/window teardown — it's the **only** reliable way to send data on unload.

> **Why `Blob` with `application/json`?** `sendBeacon` sends `text/plain` by default. Wrapping in a `Blob` with the correct MIME type ensures the server receives and parses it as JSON.

---

### Step 3 — Helper to get the CSRF token

```ts
// lib/csrf.ts
export function getCsrfToken(): string | null {
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? null;
}
```

Make sure your HTML `<head>` has:
```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

---

### Step 4 — "Go back" button also fires the webhook (via normal fetch)

```tsx
const goBackHome = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (status !== 'completed') {
        try {
            await fetch('/api/your-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken() ?? '',
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ session_id }),
            });
        } catch {
            // Silent fail — still navigate
        }
    }
    window.location.href = '/';
};
```

---

## Backend Implementation (Laravel)

### Route (web.php)

```php
Route::prefix('api/lead')->group(function () {
    Route::post('close-verification', [YourController::class, 'closeWithoutVerification']);
});
```

> Routes in the `web` middleware group have CSRF protection. Laravel accepts the token as either the `X-CSRF-TOKEN` header **or** the `_token` query parameter — both work.

---

### Controller Method

```php
public function closeWithoutVerification(Request $request): JsonResponse
{
    $validated = $request->validate([
        'session_id' => ['required', 'uuid'],
    ]);

    $cacheKey = "your_session_prefix:{$validated['session_id']}";
    $sessionData = Cache::get($cacheKey);

    // Guard 1: session already expired or previously closed
    if ($sessionData === null) {
        return response()->json(['success' => true, 'message' => 'Session already closed/expired']);
    }

    // Guard 2: user already completed the action — don't fire abandonment webhook
    if (($sessionData['completed'] ?? false) === true) {
        Cache::forget($cacheKey);
        return response()->json(['success' => true, 'message' => 'Already completed']);
    }

    // Fire your abandonment webhook here
    $lead = $sessionData['lead'] ?? [];
    $this->webhookService->sendAbandonmentWebhook($lead, $validated['session_id']);

    // CRITICAL: forget the cache so this can never fire twice
    Cache::forget($cacheKey);

    Log::info('Tab closed without completion', ['session_id' => $validated['session_id']]);

    return response()->json(['success' => true, 'message' => 'Abandonment recorded']);
}
```

> **Why `Cache::forget` after firing?** This is the deduplication lock. Both the `beforeunload` beacon and the "go back" button click can race each other. The first one to hit the backend fires the webhook and deletes the cache. The second one finds `null` and returns early — so the webhook **never fires twice**.

---

## Deduplication Flow

```
Tab close fires beacon ──────────────────────────────┐
                                                       ▼
                                          Backend checks Cache
                                          ┌─────────────────────┐
"Go back" button click ──► fetch POST ──► │ session exists?      │
                                          │  YES → fire webhook  │
                                          │      → Cache::forget │
                                          │  NO  → return early  │
                                          └─────────────────────┘
                                          (second call always hits NO)
```

---

## Applying to a Non-Laravel Backend

The same approach works with any backend. The only difference is how you handle CSRF:

| Backend | CSRF approach |
|---|---|
| Laravel | `?_token=` query param or `X-CSRF-TOKEN` header |
| Express/Node | Disable CSRF on this route or use custom header |
| Django | `X-CSRFToken` header (add to beacon via query param workaround) |
| No CSRF | Just send the JSON body as-is |

For non-CSRF backends, the beacon call simplifies to:
```ts
navigator.sendBeacon('/api/your-endpoint', new Blob([JSON.stringify({ session_id })], { type: 'application/json' }));
```

---

## Checklist for New Projects

- [ ] Add `<meta name="csrf-token">` to your HTML head
- [ ] Create a `getCsrfToken()` helper
- [ ] Add `statusRef` that mirrors your completion state
- [ ] Add `beforeunload` `useEffect` with cleanup return
- [ ] Backend endpoint has two early-return guards (null session, already completed)
- [ ] Backend calls `Cache::forget` (or equivalent) after firing webhook
- [ ] Test: complete the action → close tab → confirm webhook does NOT fire
- [ ] Test: don't complete → close tab → confirm webhook fires exactly once
- [ ] Test: don't complete → click "go back" → close tab → confirm webhook fires only once

---

## Files in This Project

| File | Purpose |
|---|---|
| `resources/js/pages/ThankYou.tsx` | Frontend — `beforeunload` listener + `goBackHome` handler |
| `app/Http/Controllers/LeadWebhookController.php` | Backend — `closeWithoutVerification()` method |
| `app/Services/LeadWebhookService.php` | Webhook service — `sendToGhlWebhook2()` |
| `routes/web.php` | Route registration under `api/lead` prefix |
