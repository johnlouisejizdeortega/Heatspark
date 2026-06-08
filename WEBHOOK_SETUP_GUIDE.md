# 🚀 Webhook Automation System - Complete Setup Guide

A comprehensive guide for implementing phone verification and webhook automation for any form in your application. This system provides instant lead backup to Google Sheets and dual GHL webhook integration with verification status tracking.

---

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Google Sheets Setup](#google-sheets-setup)
- [GHL Webhook Setup](#ghl-webhook-setup)
- [SMS Setup (Optional)](#sms-setup-optional)
- [Integrating with Forms](#integrating-with-forms)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

### What This System Does

1. **Instant Lead Backup** - Every form submission is immediately saved to Google Sheets
2. **GHL Webhook Integration** - Dual webhook system for CRM automation:
   - **Webhook 1**: Fires on form submission with unverified status
   - **Webhook 2**: Fires on verification outcome (verified/closed/timeout)
3. **Phone Verification** - SMS-based 4-digit code verification (5-minute window)
4. **Queue-Based Timeout** - Automatically sends timeout webhook after 5 minutes if not verified

### The Complete Flow

```
📝 User Submits Form
    ├─→ ✅ Google Sheets (immediate backup)
    ├─→ 📞 GHL Webhook 1 (unverified, includes verification code)
    ├─→ 📱 SMS Code Sent
    └─→ ⏱️ 5-Minute Timer Starts
        │
        ├─→ ✓ User Verifies → GHL Webhook 2 (verified: true)
        ├─→ ✗ User Closes Modal → GHL Webhook 2 (verified: false, reason: modal_closed)
        └─→ ⏰ Timeout → GHL Webhook 2 (verified: false, reason: timeout)
```

### What's Included

- ✅ **Backend Controller** - LeadWebhookController with 4 API endpoints
- ✅ **Queue Job** - SendUnverifiedLeadToWebhooks for timeout handling
- ✅ **Verification Modal** - React component with countdown timer
- ✅ **Google Apps Script** - Ready-to-use script for Google Sheets
- ✅ **Secret Generation** - Pre-configured authentication secret
- ✅ **API Routes** - RESTful endpoints for verification flow
- ✅ **Comprehensive Logging** - Debug-friendly logging throughout

---

## ⚡ Quick Start

### 1. Install Dependencies

```bash
# PHP dependencies (if using Twilio SMS later)
composer require twilio/sdk

# JavaScript dependencies
npm install

# Clear all caches
php artisan optimize:clear
```

### 2. Configure Environment Variables

Add these to your `.env` file:

```env
# Google Sheets Integration
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
GOOGLE_SHEETS_WEB_APP_SECRET=BOD_GHL_WEBHOOK_SECRET_2026_7f8a9b2c3d4e5f6a

# GHL (GoHighLevel) Webhooks
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/YOUR_LOCATION/webhook-trigger/WEBHOOK_1_ID
GHL_WEBHOOK_URL_2=https://services.leadconnectorhq.com/hooks/YOUR_LOCATION/webhook-trigger/WEBHOOK_2_ID

# SMS Provider (Twilio - Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=

# Queue Configuration
QUEUE_CONNECTION=database
CACHE_STORE=database
```

### 3. Set Up Google Sheets

See the complete guide in [google-apps-script/SETUP.md](google-apps-script/SETUP.md)

**Quick Steps:**
1. Open your Google Sheet
2. Extensions → Apps Script
3. Copy code from `google-apps-script/Code.gs`
4. Add secret to Script Properties: `BOD_GHL_WEBHOOK_SECRET_2026_7f8a9b2c3d4e5f6a`
5. Deploy as Web App
6. Copy URL to `.env`

### 4. Start Queue Worker

**Development:**
```bash
php artisan queue:work
```

**Production:** Set up supervisor (see [Production Deployment](#production-deployment))

### 5. Build Frontend

```bash
npm run build
# or for development
npm run dev
```

---

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┐         ┌─────────────────────────┐      │
│  │  Your Form   │────────→│  VerificationModal      │      │
│  │  Component   │         │  (Phone Verification)   │      │
│  └──────────────┘         └─────────────────────────┘      │
└───────────────────────┬─────────────────────────────────────┘
                        │ axios POST
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend (Laravel Controller)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  LeadWebhookController                               │  │
│  │  • initiateVerification()                            │  │
│  │  • verifyCode()                                      │  │
│  │  • resendCode()                                      │  │
│  │  • closeWithoutVerification()                        │  │
│  └──────────────────────────────────────────────────────┘  │
└───────┬─────────────────┬─────────────────┬────────────────┘
        │                 │                 │
        ↓                 ↓                 ↓
┌─────────────┐  ┌──────────────┐  ┌────────────────┐
│   Google    │  │  GHL         │  │   Laravel      │
│   Sheets    │  │  Webhooks    │  │   Queue        │
│  (Backup)   │  │  (CRM)       │  │  (Timeout)     │
└─────────────┘  └──────────────┘  └────────────────┘
```

### Data Flow

**Step 1: Form Submission**
```php
POST /api/lead/initiate-verification
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "07123456789",
  "postcode": "SW1A 1AA",
  "urgency": "asap",
  "homeowner": "yes"
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "uuid-here",
  "message": "Verification code sent"
}
```

**Step 2: Verification**
```php
POST /api/lead/verify-code
{
  "session_id": "uuid-here",
  "code": "1234"
}
```

**Step 3: Close Without Verification (Optional)**
```php
POST /api/lead/close-verification
{
  "session_id": "uuid-here"
}
```

---

## ⚙️ Configuration

### Service Configuration (config/services.php)

Already configured in your application:

```php
'google_sheets' => [
    'web_app_url' => env('GOOGLE_SHEETS_WEB_APP_URL'),
    'breakdown_url' => env('GOOGLE_SHEETS_BREAKDOWN_URL'),
    'secret' => env('GOOGLE_SHEETS_WEB_APP_SECRET'),
],

'ghl' => [
    'webhook_url' => env('GHL_WEBHOOK_URL'),
    'webhook_url_2' => env('GHL_WEBHOOK_URL_2'),
],

'twilio' => [
    'sid' => env('TWILIO_ACCOUNT_SID'),
    'token' => env('TWILIO_AUTH_TOKEN'),
    'from' => env('TWILIO_FROM_NUMBER'),
],
```

### API Routes (routes/web.php)

Already configured:

```php
Route::post('/api/lead/initiate-verification', [LeadWebhookController::class, 'initiateVerification']);
Route::post('/api/lead/verify-code', [LeadWebhookController::class, 'verifyCode']);
Route::post('/api/lead/resend-code', [LeadWebhookController::class, 'resendCode']);
Route::post('/api/lead/close-verification', [LeadWebhookController::class, 'closeWithoutVerification']);
```

---

## 📊 Google Sheets Setup

### Quick Setup

1. **Copy the script**: `google-apps-script/Code.gs`
2. **Follow the guide**: `google-apps-script/SETUP.md`
3. **Your secret**: `BOD_GHL_WEBHOOK_SECRET_2026_7f8a9b2c3d4e5f6a`

### Sheet Structure

The Google Sheet will have these columns:

| Column | Data |
|--------|------|
| DATE | 2026-02-08 10:30:00 |
| NAME | John Doe |
| PHONE NUMBER | 07123456789 |
| EMAIL | john@example.com |
| POSTCODE | SW1A 1AA |
| URGENCY | asap |
| HOMEOWNER? | yes |

### Test Google Sheets Connection

```bash
php test_google_sheets.php
```

Expected output:
```
✅ Success! Check your Google Sheet for the test row.
```

---

## 🔗 GHL Webhook Setup

### Webhook 1: Form Submission Trigger

**Purpose**: Fires immediately on form submission with unverified status

**Payload Format** (form-encoded):
```
first_name: John
last_name: Doe
email: john@example.com
phone: 07123456789
postcode: SW1A 1AA
urgency: asap
homeowner: yes
source: website-lead-form
verification_status: false
verification_code: 1234
```

**When It Fires:**
- Immediately after form submission
- Before SMS is sent
- Always has `verification_status: false`
- Includes the 4-digit `verification_code`

### Webhook 2: Verification Outcome Trigger

**Purpose**: Fires after verification outcome is determined

**Payload Format** (form-encoded):

**If Verified:**
```
first_name: John
last_name: Doe
email: john@example.com
phone: 07123456789
postcode: SW1A 1AA
urgency: asap
homeowner: yes
source: website-lead-form
verification_status: true
verified_at: 2026-02-08 10:32:15
```

**If Not Verified (Modal Closed):**
```
first_name: John
last_name: Doe
email: john@example.com
phone: 07123456789
postcode: SW1A 1AA
urgency: asap
homeowner: yes
source: website-lead-form
verification_status: false
reason: modal_closed
failed_at: 2026-02-08 10:31:30
```

**If Not Verified (Timeout):**
```
first_name: John
last_name: Doe
email: john@example.com
phone: 07123456789
postcode: SW1A 1AA
urgency: asap
homeowner: yes
source: website-lead-form
verification_status: false
reason: timeout
failed_at: 2026-02-08 10:35:00
```

**When It Fires:**
- User successfully verifies → `verification_status: true`
- User closes modal → `verification_status: false`, `reason: modal_closed`
- 5 minutes elapse → `verification_status: false`, `reason: timeout`

### GHL Configuration

1. **Create Workflows in GHL:**
   - Workflow 1: "New Lead - Initial Capture"
   - Workflow 2: "Lead Verification Status"

2. **Set Up Webhook Triggers:**
   - Each workflow needs a webhook trigger
   - Copy the webhook URLs
   - Add to `.env` file

3. **Important: Check Account Balance:**
   - Go to Settings → Billing → Wallet
   - Each webhook call consumes credits
   - Set up auto-recharge to prevent failures
   - Monitor usage regularly

4. **Test Webhooks:**
```bash
php test_webhook.php  # Tests Webhook 2 connectivity
```

---

## 📱 SMS Setup (Optional)

### Current Behavior (Development)

Verification codes are **logged** instead of sent via SMS:

```bash
tail -f storage/logs/laravel.log
```

You'll see:
```
[2026-02-08 10:30:00] local.INFO: SMS Verification Code 
{"phone":"07123456789","code":"1234","message":"Your BOD verification code is: 1234. Valid for 5 minutes."}
```

### Enable Real SMS (Production)

**1. Sign Up for Twilio:**
- Visit https://www.twilio.com/
- Create account
- Purchase a phone number (UK number for UK customers)

**2. Get Credentials:**
- Account SID
- Auth Token  
- Phone Number (E.164 format: +447123456789)

**3. Update .env:**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+447123456789
```

**4. Install SDK:**
```bash
composer require twilio/sdk
```

**5. Enable in Controller:**

Find this in `app/Http/Controllers/LeadWebhookController.php` (around line 360):

```php
private function sendVerificationSMS(string $phone, string $code): void
{
    try {
        // TODO: Implement SMS sending with your SMS provider
        // For now, just log it
        Log::info('SMS Verification Code', [
            'phone' => $phone,
            'code' => $code,
            'message' => "Your BOD verification code is: {$code}. Valid for 5 minutes.",
        ]);

        // Uncomment when ready to use Twilio:
        /*
        $twilio = new \Twilio\Rest\Client(
            config('services.twilio.sid'),
            config('services.twilio.token')
        );

        $twilio->messages->create($phone, [
            'from' => config('services.twilio.from'),
            'body' => "Your BOD verification code is: {$code}. Valid for 5 minutes."
        ]);
        */
    } catch (\Exception $e) {
        Log::error('SMS sending failed: ' . $e->getMessage());
    }
}
```

**Uncomment the Twilio code** and remove the log-only section.

---

## 🎨 Integrating with Forms

### Basic Integration Example

```tsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import VerificationModal from '@/components/VerificationModal';

export default function MyForm() {
  const [loading, setLoading] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const response = await axios.post('/api/lead/initiate-verification', {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        postcode: formData.get('postcode'),
        urgency: formData.get('urgency'),
        homeowner: formData.get('homeowner'),
        service: 'Your Service Type',  // Customize per form
      });

      if (response.data.success) {
        setSessionId(response.data.session_id);
        setPhone(formData.get('phone') as string);
        setVerificationOpen(true);
      } else {
        toast.error(response.data.message || 'Submission failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerified = () => {
    toast.success('Thank you! We\'ll be in touch soon.');
    // Reset form, redirect, etc.
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" required />
        <input type="email" name="email" required />
        <input type="tel" name="phone" required />
        <input type="text" name="postcode" required />
        
        <select name="urgency" required>
          <option value="asap">ASAP</option>
          <option value="1-2-days">1-2 Days</option>
          <option value="flexible">Flexible</option>
        </select>

        <select name="homeowner" required>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Get Quote'}
        </button>
      </form>

      <VerificationModal
        open={verificationOpen}
        onOpenChange={setVerificationOpen}
        sessionId={sessionId}
        phone={phone}
        onVerified={handleVerified}
      />
    </>
  );
}
```

### Required Form Fields

The backend expects these fields (adjust validation in controller as needed):

```typescript
{
  name: string;        // Required
  email: string;       // Required (email format)
  phone: string;       // Required
  postcode: string;    // Required
  service?: string;    // Optional (default: 'boiler-quote')
  homeowner?: string;  // Optional
  urgency?: string;    // Optional
}
```

### Customizing for Different Forms

**Contact Form:**
```javascript
{
  name: formData.get('name'),
  email: formData.get('email'),
  phone: formData.get('phone'),
  postcode: formData.get('postcode'),
  service: 'General Inquiry',
  urgency: 'flexible',
  homeowner: 'unknown',
}
```

**Emergency Form:**
```javascript
{
  name: formData.get('name'),
  email: formData.get('email'),
  phone: formData.get('phone'),
  postcode: formData.get('postcode'),
  service: 'Emergency Repair',
  urgency: 'asap',
  homeowner: formData.get('homeowner'),
}
```

---

## 🧪 Testing

### 1. Test Google Sheets Integration

```bash
php test_google_sheets.php
```

Expected output:
```
✅ Success! Check your Google Sheet for the test row.
Look for: Test User - 1234567890
```

**Check:** Row should appear in Google Sheet with all fields populated.

### 2. Test GHL Webhook 2 Connectivity

```bash
php test_webhook.php
```

Expected output:
```
Status: 200
Body: {"status":"Success: test request received"}
✅ Webhook 2 is reachable and accepting data!
```

### 3. Test Complete Flow (Manual)

**Step 1:** Submit a form on your website

**Step 2:** Check logs:
```bash
tail -f storage/logs/laravel.log
```

**Expected log sequence:**
```
[INFO] Sending to Google Sheets
[INFO] Successfully sent to Google Sheets {"status":200}
[INFO] GHL Webhook 1 (Form Submission) - Sending webhook
[INFO] GHL Webhook 1 (Form Submission) response {"status":200}
[INFO] SMS Verification Code {"phone":"...","code":"1234"}
[INFO] Lead verification initiated {"session_id":"..."}
```

**Step 3:** Close modal without verifying

**Expected logs:**
```
[INFO] closeWithoutVerification called
[INFO] Modal closed - calling sendToAuthenticator
[INFO] sendToAuthenticator called {"verified":false,"reason":"modal_closed"}
[INFO] GHL Webhook 2 (Authenticator) - Sending webhook
[INFO] GHL Webhook 2 (Authenticator) response {"status":200}
[INFO] Session cache cleared
```

**Step 4:** Check your systems:
- ✅ Google Sheet: New row with form data
- ✅ GHL Webhook 1: Triggered with `verification_status: false`
- ✅ GHL Webhook 2: Triggered with `verification_status: false`, `reason: modal_closed`

### 4. Test Verification Success

Submit form → Enter correct code → Verify

**Expected logs:**
```
[INFO] Lead verified successfully
[INFO] sendToAuthenticator called {"verified":true}
[INFO] GHL Webhook 2 (Authenticator) response {"status":200}
```

### 5. Test Timeout (Wait 5 Minutes)

Submit form → Don't verify → Wait 5 minutes

**Expected logs:**
```
[INFO] Lead verification initiated
... [5 minutes later] ...
[INFO] Processing unverified lead webhook
[INFO] sendToAuthenticator called {"verified":false,"reason":"timeout"}
[INFO] GHL Webhook 2 (Authenticator) response {"status":200}
```

---

## 🚀 Production Deployment

### 1. Queue Worker Setup (Critical!)

The timeout functionality requires a queue worker running continuously.

**Install Supervisor:**
```bash
sudo apt-get install supervisor
```

**Create config** `/etc/supervisor/conf.d/bod-worker.conf`:
```ini
[program:bod-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/your-project/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/your-project/storage/logs/worker.log
stopwaitsecs=3600
```

**Start supervisor:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start bod-worker:*
```

**Check status:**
```bash
sudo supervisorctl status bod-worker:*
```

### 2. Production Environment Variables

```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=info

QUEUE_CONNECTION=database  # or redis for better performance
CACHE_STORE=redis  # recommended for production

# All webhook URLs properly configured
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/.../exec
GOOGLE_SHEETS_WEB_APP_SECRET=BOD_GHL_WEBHOOK_SECRET_2026_7f8a9b2c3d4e5f6a
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/.../webhook-trigger/...
GHL_WEBHOOK_URL_2=https://services.leadconnectorhq.com/hooks/.../webhook-trigger/...
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_FROM_NUMBER=+447123456789
```

### 3. Optimize Laravel

```bash
# Optimize configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (if any)
php artisan migrate --force

# Build frontend assets
npm run build
```

### 4. Set Up Log Rotation

Create `/etc/logrotate.d/laravel`:
```
/var/www/your-project/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 5. Pre-Launch Checklist

- [ ] All environment variables configured in production `.env`
- [ ] Google Sheets Web App deployed and tested
- [ ] GHL account has sufficient credits
- [ ] GHL webhooks tested and responding
- [ ] Twilio configured and sending real SMS
- [ ] Twilio SDK installed: `composer require twilio/sdk`
- [ ] Twilio code uncommented in `LeadWebhookController.php`
- [ ] Supervisor configured and queue worker running
- [ ] `php artisan optimize` executed
- [ ] Frontend assets built: `npm run build`
- [ ] Complete flow tested with real phone number
- [ ] Logs monitored for first few submissions
- [ ] Error monitoring/alerting set up (Sentry, Bugsnag, etc.)
- [ ] Backup strategy for Google Sheets in place

### 6. Monitoring

**Check Queue Status:**
```bash
# View queued jobs
php artisan queue:monitor

# View failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all
```

**Monitor Logs:**
```bash
# Real-time monitoring
tail -f storage/logs/laravel.log

# Check for errors
grep -i "error\|failed" storage/logs/laravel.log

# Check webhook activity
grep "GHL\|Google Sheets" storage/logs/laravel.log
```

---

## 🔧 Troubleshooting

### Common Issues

#### "GOOGLE_SHEETS_WEB_APP_URL not configured"

**Cause:** Environment variable not loaded or config cached

**Solution:**
```bash
# Clear all caches
php artisan optimize:clear

# Verify config loaded
php artisan tinker
>>> config('services.google_sheets.web_app_url')

# Restart server (if using php artisan serve)
```

#### Google Sheet Receives Empty Data

**Cause:** JSON format instead of form data

**Solution:** Verify `Http::asForm()` is used in controller:
```php
$response = Http::asForm()->timeout(10)->post($googleSheetsUrl, $payload);
```

#### GHL Webhook Returns 422 "Billing failure"

**Cause:** Insufficient credits in GHL account

**Solution:**
1. Login to GHL account
2. Go to Settings → Billing → Wallet
3. Add credits
4. Set up auto-recharge
5. Monitor usage regularly

#### "Authentication failed" from Google Sheets

**Cause:** Secret mismatch

**Solution:**
1. Check `.env`: `GOOGLE_SHEETS_WEB_APP_SECRET`
2. Check Google Apps Script → Project Settings → Script Properties
3. Secrets must match **exactly** (case-sensitive)
4. Clear config cache: `php artisan config:clear`

#### Webhook 2 Not Firing on Modal Close

**Cause:** Old code cached or queue worker not running

**Solution:**
```bash
# Clear all caches
php artisan optimize:clear

# Check if queue worker is running
ps aux | grep "queue:work"

# Start queue worker if not running
php artisan queue:work

# Check logs for debug info
tail -f storage/logs/laravel.log
```

#### SMS Not Sending

**Causes & Solutions:**

1. **Twilio not configured:**
   ```bash
   # Check .env has all three:
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_FROM_NUMBER=
   ```

2. **Twilio SDK not installed:**
   ```bash
   composer require twilio/sdk
   ```

3. **Code still commented out:**
   - Open `app/Http/Controllers/LeadWebhookController.php`
   - Find `sendVerificationSMS()` method (line ~360)
   - Uncomment Twilio code block

4. **Wrong phone format:**
   - Must be E.164 format: `+447123456789`
   - Not: `07123456789`, `+44 7123 456789`, etc.

#### Verification Modal Not Appearing

**Causes & Solutions:**

1. **Axios not installed:**
   ```bash
   npm install
   npm run build
   ```

2. **API endpoint failing:**
   - Check browser console for errors
   - Check network tab for failed requests
   - Check Laravel logs for exceptions

3. **State not updating:**
   - Verify `setVerificationOpen(true)` is called
   - Verify `sessionId` is set from response
   - Check React DevTools for state changes

#### Queue Jobs Not Processing

**Causes & Solutions:**

1. **Worker not running:**
   ```bash
   # Development
   php artisan queue:work

   # Production
   sudo supervisorctl status bod-worker:*
   ```

2. **Database queue table missing:**
   ```bash
   php artisan queue:table
   php artisan migrate
   ```

3. **Failed jobs:**
   ```bash
   # View failed jobs
   php artisan queue:failed

   # Retry all failed
   php artisan queue:retry all

   # Clear failed jobs
   php artisan queue:flush
   ```

### Debug Mode

Enable detailed logging temporarily:

```php
// In LeadWebhookController.php, add to any method:
Log::debug('Debug checkpoint', [
    'variable' => $value,
    'array' => $data,
]);
```

Then check logs:
```bash
tail -f storage/logs/laravel.log | grep -i "debug\|error"
```

### Performance Issues

**High queue depth:**
```bash
# Check queue size
php artisan queue:monitor

# Add more workers (edit supervisor config)
numprocs=4  # Increase from 2

# Reload supervisor
sudo supervisorctl reread
sudo supervisorctl update
```

**Slow webhook responses:**
- Check GHL account status
- Verify internet connectivity
- Consider increasing timeout in controller
- Monitor with `Http::timeout(15)` instead of 10

---

## 📚 Additional Resources

### Documentation Files

- **[WEBHOOK_AUTOMATION_DOCUMENTATION.md](WEBHOOK_AUTOMATION_DOCUMENTATION.md)** - Comprehensive system documentation
- **[google-apps-script/SETUP.md](google-apps-script/SETUP.md)** - Step-by-step Google Sheets setup
- **[google-apps-script/SECRET.md](google-apps-script/SECRET.md)** - Your secret token and quick reference
- **[google-apps-script/README.md](google-apps-script/README.md)** - Google Apps Script overview

### Test Scripts

- **test_google_sheets.php** - Test Google Sheets connectivity and data format
- **test_webhook.php** - Test GHL Webhook 2 connectivity

### External Documentation

- [Laravel Queues](https://laravel.com/docs/queues) - Official queue documentation
- [Twilio PHP SDK](https://www.twilio.com/docs/libraries/php) - Twilio integration guide
- [Google Apps Script](https://developers.google.com/apps-script) - Apps Script reference
- [GoHighLevel](https://help.gohighlevel.com/) - GHL documentation

---

## 💡 Best Practices

### Development
1. **Always test in development first** - Use log-only SMS mode
2. **Monitor logs actively** - Keep `tail -f storage/logs/laravel.log` running
3. **Test all three outcomes** - Verified, modal closed, timeout
4. **Use meaningful test data** - Makes debugging easier

### Production
1. **Monitor GHL account balance** - Set up low-balance alerts
2. **Keep logs organized** - Implement log rotation
3. **Set up error monitoring** - Use Sentry, Bugsnag, or similar
4. **Monitor queue depth** - Alert if > 100 jobs queued
5. **Backup Google Sheets regularly** - Export as CSV weekly
6. **Test after deployments** - Always verify webhooks still work
7. **Document customizations** - Keep notes on any custom fields added

### Security
1. **Never commit secrets** - `.env` is in `.gitignore`
2. **Regenerate secrets if exposed** - Change in both Laravel and Google Apps Script
3. **Keep dependencies updated** - Regular `composer update` and `npm update`
4. **Validate all form inputs** - The controller validates, but frontend should too
5. **Monitor for unusual activity** - Watch for spam submissions or failed authentications

---

## ✨ What's Next?

### Optional Enhancements

- [ ] **Email notifications** - Send confirmation emails via Laravel Mail
- [ ] **Admin dashboard** - View all leads in a custom admin panel
- [ ] **Lead status updates** - Update verification status in database
- [ ] **Analytics integration** - Track conversion rates, drop-off points
- [ ] **A/B testing** - Test different form layouts, copy, urgency options
- [ ] **Multiple SMS providers** - Fallback if Twilio fails
- [ ] **WhatsApp verification** - Alternative to SMS for international customers
- [ ] **Voice call verification** - For users who don't receive SMS
- [ ] **Rate limiting** - Prevent brute force code guessing
- [ ] **Geolocation** - Pre-fill postcode based on location
- [ ] **Duplicate detection** - Warn if phone/email submitted recently

### Scaling Considerations

**For High Traffic (>1000 leads/day):**
- Switch to Redis for queue and cache
- Add Redis to `.env`:
  ```env
  QUEUE_CONNECTION=redis
  CACHE_STORE=redis
  REDIS_CLIENT=phpredis
  REDIS_HOST=127.0.0.1
  REDIS_PORT=6379
  ```
- Increase queue workers (4-8 workers)
- Consider dedicated Redis server
- Implement API rate limiting
- Add database indexing on phone/email fields
- Consider separate SMS queue for better throughput

---

## 🎉 You're Ready!

Your webhook automation system is now fully configured and ready to use. The system will:

✅ **Capture every lead** in Google Sheets instantly  
✅ **Verify phone numbers** with SMS codes  
✅ **Track verification status** in GHL  
✅ **Handle timeouts automatically** via queue jobs  
✅ **Send detailed webhook data** for CRM automation  

### Next Steps

1. **Follow the [Quick Start](#quick-start)** if you haven't already
2. **Set up Google Sheets** using the guide in `google-apps-script/`
3. **Configure your GHL webhooks** in your account
4. **Test the complete flow** with a real submission
5. **Monitor logs** for the first few submissions
6. **Go live** with confidence!

---

**Need help?** Check the [Troubleshooting](#troubleshooting) section or review the logs at `storage/logs/laravel.log`.

**Want to dive deeper?** Read the full documentation in [WEBHOOK_AUTOMATION_DOCUMENTATION.md](WEBHOOK_AUTOMATION_DOCUMENTATION.md).

---

*Last updated: February 8, 2026*