# Fast Form Submission with Concurrent Webhooks - Implementation Guide

## Problem Statement

Form submissions were taking 4-6 seconds to respond because multiple external webhooks were firing **sequentially** (one after another):
- Google Sheets webhook: 2 seconds
- GHL Webhook #1: 2 seconds  
- **Total: 4-6 seconds blocking time**

This created a poor user experience where the submit button appeared frozen for 4-6 seconds.

## Solution

**Fire all webhooks concurrently (in parallel)** using Laravel's `Http::pool()` method.

Instead of waiting for each webhook sequentially (2s + 2s = 4s), all webhooks fire simultaneously and we only wait for the slowest one to complete (~2 seconds max).

## Architecture Overview

### Three-Stage Webhook System

**Stage 1: Form Submission (Immediate)**
- User submits form
- Create verification session (cache, 5 min TTL)
- Fire webhooks concurrently:
  - Google Sheets (backup/logging)
  - GHL Webhook #1 (unverified lead)
- Return response immediately (~2s)
- Redirect to thank you page
- Verification code displayed on thank you page (no SMS sent)

**Stage 2: User Verifies Code (Success Path)**
- User enters 4-digit code
- Fire GHL Webhook #2 with `verified=true`
- Clear cache
- Redirect to homepage after 3 seconds

**Stage 3: Alternative Outcomes**
- **User closes page** → GHL Webhook #2 with `verified=false, reason='page_closed'`
- **5-minute timeout** → GHL Webhook #2 with `verified=false, reason='timeout'`
- **User resends code** → New SMS sent (NO webhooks)

### Webhook Responsibility Matrix

| Webhook | Form Submit | Verification Success | Page Closed | Timeout |
|---------|-------------|---------------------|-------------|---------|
| Google Sheets | ✅ Yes | ❌ No | ❌ No | ❌ No |
| GHL Webhook #1 | ✅ Yes (unverified) | ❌ No | ❌ No | ❌ No |
| GHL Webhook #2 | ❌ No | ✅ Yes (verified=true) | ✅ Yes (verified=false) | ✅ Yes (verified=false) |

**Note**: Verification code is shown directly on the thank you page. No SMS is sent in this implementation.

## Implementation Code

### 1. Service Layer - Concurrent Webhooks

Create a method in your service class that uses `Http::pool()`:

```php
// app/Services/LeadWebhookService.php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

public function sendWebhooksConcurrently(array $lead, string $sessionId, string $verificationCode): void
{
    try {
        // Execute all webhooks in parallel using Http::pool()
        $responses = Http::pool(function ($pool) use ($lead, $sessionId, $verificationCode) {
            
            // Pool request 1: Google Sheets
            $googleSheetsUrl = 'https://script.google.com/macros/s/AKfycbz_4WW0k9-XnUNE90SNYTD3w3NVjINs2dKgdnKBA8kwuV-78rvzPiUBr9yppCsHtSij/exec';
            $pool->asJson()
                ->withOptions([
                    'allow_redirects' => [
                        'max' => 5,
                        'strict' => true,
                        'referer' => true,
                        'protocols' => ['https'],
                        'track_redirects' => false,
                    ],
                ])
                ->timeout(2)
                ->post($googleSheetsUrl, [
                    'secret' => 'auld-secret-2026',
                    'timestamp' => now()->toIso8601String(),
                    'name' => $lead['name'] ?? '',
                    'email' => $lead['email'] ?? '',
                    'phone' => $lead['phone'] ?? '',
                    'postcode' => $lead['postcode'] ?? '',
                    'service' => $lead['service'] ?? 'marketing-lead',
                    'source' => $lead['source'] ?? 'landing-page',
                ]);

            // Pool request 2: GHL Webhook #1 (unverified lead)
            $ghlUrl1 = 'https://services.leadconnectorhq.com/hooks/wqg41fHAr6E8zQBv2IDN/webhook-trigger/b2604b84-2770-42e1-b7c0-d322eb5308e6';
            $pool->timeout(2)->post($ghlUrl1, [
                'event' => 'lead_submitted',
                'verified' => false,
                'session_id' => $sessionId,
                'verification_code' => $verificationCode,
                'timestamp' => now()->toIso8601String(),
                ...$lead,
            ]);

            // OPTIONAL: Pool request 3: Twilio SMS (if you want to send verification code via SMS)
            // Currently NOT used in this project - verification code shown on screen instead
            /*
            if (config('services.twilio.enabled')) {
                $twilioSid = config('services.twilio.sid');
                $twilioToken = config('services.twilio.token');
                $twilioFrom = config('services.twilio.from');

                if ($twilioSid && $twilioToken && $twilioFrom) {
                    $cleanPhone = preg_replace('/[^0-9+]/', '', $lead['phone'] ?? '');
                    if (!str_starts_with($cleanPhone, '+')) {
                        $cleanPhone = '+44' . ltrim($cleanPhone, '0');
                    }

                    $message = "Your verification code is: {$verificationCode}";
                    $twilioUrl = "https://api.twilio.com/2010-04-01/Accounts/{$twilioSid}/Messages.json";

                    $pool->asForm()
                        ->withBasicAuth($twilioSid, $twilioToken)
                        ->timeout(3)
                        ->post($twilioUrl, [
                            'From' => $twilioFrom,
                            'To' => $cleanPhone,
                            'Body' => $message,
                        ]);
                }
            }
            */
        });

        // Log responses (non-blocking, for debugging)
        foreach ($responses as $index => $response) {
            if ($response->successful()) {
                Log::info("Webhook {$index} completed successfully");
            } else {
                Log::warning("Webhook {$index} failed", [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            }
        }
    } catch (\Throwable $e) {
        Log::error('Concurrent webhooks exception: ' . $e->getMessage());
    }
}
```

### 2. Controller - Form Submission Endpoint

```php
// app/Http/Controllers/LeadWebhookController.php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

public function initiateVerification(Request $request): JsonResponse
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'max:255'],
        'phone' => ['required', 'string', 'max:32'],
        'postcode' => ['nullable', 'string', 'max:32'],
        'service' => ['nullable', 'string', 'max:100'],
        'source' => ['nullable', 'string', 'max:100'],
    ]);

    $sessionId = (string) Str::uuid();
    $verificationCode = (string) random_int(1000, 9999);

    $lead = [
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone' => $validated['phone'],
        'postcode' => $validated['postcode'] ?? '',
        'service' => $validated['service'] ?? 'marketing-lead',
        'source' => $validated['source'] ?? 'landing-page',
    ];

    // Store verification session (5 minutes)
    $cacheKey = "lead_verification:{$sessionId}";
    Cache::put($cacheKey, [
        'lead' => $lead,
        'code' => $verificationCode,
        'verified' => false,
        'created_at' => now()->toIso8601String(),
    ], now()->addMinutes(5));

    // Schedule timeout job (fires after 5 minutes if not verified)
    SendUnverifiedLeadToWebhooks::dispatch($sessionId)->delay(now()->addMinutes(5));

    // Fire all webhooks concurrently (in parallel) - THIS IS THE KEY!
    // Instead of 2s + 2s = 4s sequential, we get max(2s, 2s) = ~2s parallel
    $this->service->sendWebhooksConcurrently($lead, $sessionId, $verificationCode);

    Log::info('Lead verification initiated', ['session_id' => $sessionId, 'email' => $lead['email']]);

    return response()->json([
        'success' => true,
        'session_id' => $sessionId,
        'message' => 'Verification code sent',
    ]);
}
```

### 3. Verification Success Endpoint

```php
public function verifyCode(Request $request): JsonResponse
{
    $validated = $request->validate([
        'session_id' => ['required', 'uuid'],
        'code' => ['required', 'string', 'size:4'],
    ]);

    $cacheKey = "lead_verification:{$validated['session_id']}";
    $sessionData = Cache::get($cacheKey);

    if ($sessionData === null) {
        return response()->json([
            'success' => false,
            'message' => 'Verification session expired.',
        ], 410);
    }

    if (!hash_equals((string) ($sessionData['code'] ?? ''), (string) $validated['code'])) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid verification code',
        ], 422);
    }

    $lead = $sessionData['lead'] ?? [];

    // Fire GHL Webhook #2 with verified=true
    $this->service->sendToGhlWebhook2($lead, $validated['session_id'], true, null);

    Cache::forget($cacheKey);
    
    return response()->json([
        'success' => true,
        'message' => 'Verified',
    ]);
}
```

### 4. Page Close Endpoint (Tracking Abandonment)

```php
public function closeWithoutVerification(Request $request): JsonResponse
{
    $validated = $request->validate([
        'session_id' => ['required', 'uuid'],
    ]);

    $cacheKey = "lead_verification:{$validated['session_id']}";
    $sessionData = Cache::get($cacheKey);

    if ($sessionData === null || ($sessionData['verified'] ?? false)) {
        return response()->json(['success' => true]);
    }

    $lead = $sessionData['lead'] ?? [];
    
    // Fire GHL Webhook #2 with verified=false, reason='page_closed'
    $this->service->sendToGhlWebhook2($lead, $validated['session_id'], false, 'page_closed');

    Cache::forget($cacheKey);
    
    return response()->json(['success' => true]);
}
```

### 5. Frontend - Thank You Page with Close Button

```tsx
// resources/js/pages/ThankYou.tsx

const handleClose = async () => {
    try {
        // Fire webhook to track abandonment before redirecting
        await postJson<ApiResponse>('/api/lead/close-verification', { 
            session_id: sessionId 
        });
    } catch (e) {
        // Ignore errors, just redirect
    } finally {
        window.location.href = '/';
    }
};

return (
    <div className={styles.content}>
        <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close and return to homepage"
        >
            ✕
        </button>
        
        {/* Verification form UI */}
    </div>
);
```

### 6. Background Job - 5-Minute Timeout Handler

```php
// app/Jobs/SendUnverifiedLeadToWebhooks.php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Services\LeadWebhookService;

class SendUnverifiedLeadToWebhooks implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private readonly string $sessionId,
    ) {}

    public function handle(LeadWebhookService $service): void
    {
        $cacheKey = "lead_verification:{$this->sessionId}";
        $sessionData = Cache::get($cacheKey);

        if ($sessionData === null) {
            Log::info('Timeout job: session already closed or expired', [
                'session_id' => $this->sessionId,
            ]);
            return;
        }

        if (($sessionData['verified'] ?? false) === true) {
            Cache::forget($cacheKey);
            Log::info('Timeout job: lead already verified, clearing cache', [
                'session_id' => $this->sessionId,
            ]);
            return;
        }

        $lead = $sessionData['lead'] ?? [];
        
        // Fire GHL Webhook #2 with verified=false, reason='timeout'
        $service->sendToGhlWebhook2($lead, $this->sessionId, false, 'timeout');

        Cache::forget($cacheKey);
        
        Log::info('Timeout job: verification timed out, webhook sent, cache cleared', [
            'session_id' => $this->sessionId,
        ]);
    }
}
```

### 7. Routes Configuration

```php
// routes/web.php

Route::prefix('api/lead')->group(function () {
    Route::post('initiate-verification', [LeadWebhookController::class, 'initiateVerification']);
    Route::post('verify-code', [LeadWebhookController::class, 'verifyCode']);
    Route::post('resend-code', [LeadWebhookController::class, 'resendCode']);
    Route::post('close-verification', [LeadWebhookController::class, 'closeWithoutVerification']);
});
```

## Key Technical Points

### 1. HTTP Pool Syntax (Critical!)

**WRONG** ❌ (This doesn't work):
```php
$pool[] = Http::timeout(2)->post($url, $data);
```

**CORRECT** ✅ (This works):
```php
$pool->timeout(2)->post($url, $data);
```

### 2. Timeout Values

- **Google Sheets**: 2 seconds (strict redirects required for Apps Script)
- **GHL Webhooks**: 2 seconds

Keep timeouts as low as possible while still allowing successful delivery.

**Note**: If you add SMS verification with Twilio, set timeout to 3 seconds due to SMS carrier routing delays.

### 3. Error Handling

All webhooks are wrapped in try-catch blocks. **Webhook failures should NOT break the user flow**. Log failures but always return success to the user.

### 4. Cache Strategy

- **TTL**: 5 minutes (matches verification timeout)
- **Key format**: `lead_verification:{uuid}`
- **Cleanup**: Always delete cache after verification (success/failure/timeout)

### 5. Queue Configuration

Ensure your queue worker is running for the timeout job:

```bash
php artisan queue:work --daemon
```

For production, use Supervisor or similar process manager to keep the queue worker running.

## Performance Results

### Before (Sequential Webhooks)
- Form submit response time: **4-6 seconds**
- User experience: Button appears frozen
- Webhooks fire: Google Sheets (2s) → wait → GHL (2s) → response

### After (Concurrent Webhooks)
- Form submit response time: **~2 seconds**
- User experience: Fast, responsive
- Webhooks fire: Both simultaneously, wait only for slowest

**Performance improvement: 2-3× faster response time** 🚀

## Adaptation Guide for Other Projects

### Step 1: Install Laravel HTTP Client
Already included in Laravel 8+. No additional packages needed.

### Step 2: Create Service Class
Copy `LeadWebhookService.php` and modify webhook URLs and payloads for your project.

### Step 3: Create Controller
Copy `LeadWebhookController.php` and adjust validation rules for your form fields.

### Step 4: Create Background Job
Copy `SendUnverifiedLeadToWebhooks.php` for timeout handling.

### Step 5: Set Up Routes
Add API routes as shown above.

### Step 6: Frontend Integration
- Create thank you page with verification code input
- Add close button with webhook trigger
- Handle auto-redirect after 3 seconds on success

### Step 7: Configure Queue Worker
Set up queue worker in production (Supervisor recommended).

### Step 8: Environment Configuration

Add to `.env`:
```env
QUEUE_CONNECTION=database

# Twilio SMS (OPTIONAL - not used in this project)
# Verification code is shown on screen instead of SMS
# Uncomment below if you want to add SMS verification:
# TWILIO_ENABLED=true
# TWILIO_SID=your_twilio_sid
# TWILIO_TOKEN=your_twilio_auth_token
# TWILIO_FROM=+1234567890
```

## Testing Checklist

- [ ] Form submits in ~2 seconds (not 4-6+ seconds)
- [ ] Google Sheets receives lead data
- [ ] GHL Webhook #1 fires on form submit
- [ ] Verification code displayed on thank you page
- [ ] Correct code verification triggers GHL Webhook #2 (verified=true)
- [ ] Close button triggers GHL Webhook #2 (verified=false, page_closed)
- [ ] 5-minute timeout triggers GHL Webhook #2 (verified=false, timeout)
- [ ] All webhooks logged in `storage/logs/laravel.log`
- [ ] No PHP errors in error log

## Common Issues & Solutions

### Issue: Webhooks not firing
**Solution**: Check syntax - use `$pool->` not `$pool[] =`

### Issue: Google Sheets returning 302/405
**Solution**: Add strict redirect configuration in `withOptions()`

### Issue: Form still slow
**Solution**: Check if webhooks are actually running in parallel - inspect logs

### Issue: Timeout job never fires
**Solution**: Ensure queue worker is running: `php artisan queue:work`

## Security Considerations

1. **CSRF Protection**: All POST endpoints require CSRF token
2. **UUID Session IDs**: Use UUIDs instead of incremental IDs
3. **Code Validation**: Use `hash_equals()` to prevent timing attacks
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **Input Validation**: Always validate all inputs with Laravel validation rules

## Support & Maintenance

### Monitoring
- Monitor webhook success rates in logs
- Track average form submission time
- Alert on webhook failures

### Logging
All webhook calls are logged with:
- Timestamp
- Session ID
- Success/failure status
- Error messages (if any)

### Scaling
This solution scales horizontally - add more web servers as needed. Each request is independent.

---

## Summary

**The core innovation**: Instead of waiting for webhooks sequentially, we fire them all at once using `Http::pool()`, reducing response time from 4-6 seconds to ~2 seconds while maintaining full webhook reliability.

**Key takeaway**: Concurrent HTTP requests are essential for fast form submissions when multiple external APIs must be called.

**This implementation**: Fires 2 webhooks concurrently (Google Sheets + GHL). Verification code is shown on screen - no SMS needed.

Copy this implementation guide to any Laravel project to achieve fast form submissions with reliable webhook delivery. 🚀
