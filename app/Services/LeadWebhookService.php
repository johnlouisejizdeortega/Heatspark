<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LeadWebhookService
{
    /**
     * Always send the initial lead to Google Sheets (backup).
     */
    public function sendToGoogleSheets(array $lead): void
    {
        $url = 'https://script.google.com/macros/s/AKfycbz_4WW0k9-XnUNE90SNYTD3w3NVjINs2dKgdnKBA8kwuV-78rvzPiUBr9yppCsHtSij/exec';

        try {
            $payload = [
                'secret'    => 'auld-secret-2026',
                'timestamp' => now()->toIso8601String(),
                'name'      => $lead['name'] ?? '',
                'email'     => $lead['email'] ?? '',
                'phone'     => $lead['phone'] ?? '',
                'postcode'  => $lead['postcode'] ?? '',
                'service'   => $lead['service'] ?? 'marketing-lead',
                'source'    => $lead['source'] ?? 'landing-page',
            ];

            // Must use asJson() — Apps Script expects JSON in e.postData.contents.
            // Must use strict redirects — Google redirects the /exec URL and
            // default Guzzle behaviour converts POST→GET on redirect (hits doGet, not doPost).
            $response = Http::asJson()
                ->withOptions([
                    'allow_redirects' => [
                        'max'             => 5,
                        'strict'          => true,  // keep POST method through redirects
                        'referer'         => true,
                        'protocols'       => ['https'],
                        'track_redirects' => false,
                    ],
                ])
                ->timeout(2)
                ->post($url, $payload);

            if (!$response->successful()) {
                Log::error('Google Sheets request failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Google Sheets exception: '.$e->getMessage());
        }
    }

    /**
     * GHL webhook #1: called once on form submission only.
     */
    public function sendToGhlWebhook1(array $lead, string $sessionId, string $verificationCode): void
    {
        $url = 'https://services.leadconnectorhq.com/hooks/wqg41fHAr6E8zQBv2IDN/webhook-trigger/b2604b84-2770-42e1-b7c0-d322eb5308e6';

        try {
            $payload = [
                'event' => 'lead_submitted',
                'verified' => false,
                'session_id' => $sessionId,
                'verification_code' => $verificationCode,
                'timestamp' => now()->toIso8601String(),
                ...$lead,
            ];

            $response = Http::timeout(2)->post($url, $payload);

            if (!$response->successful()) {
                Log::error('GHL webhook #1 request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('GHL webhook #1 exception: '.$e->getMessage());
        }
    }

    /**
     * GHL webhook #2: called once per outcome (verified / closed / timeout).
     */
    public function sendToGhlWebhook2(array $lead, string $sessionId, bool $verified, ?string $reason = null): void
    {
        $url = 'https://services.leadconnectorhq.com/hooks/wqg41fHAr6E8zQBv2IDN/webhook-trigger/4fd16be7-4330-42f5-ba3f-cbf3f8900377';

        try {
            $payload = [
                'event' => 'lead_verification_outcome',
                'verified' => $verified,
                'reason' => $reason,
                'session_id' => $sessionId,
                'timestamp' => now()->toIso8601String(),
                ...$lead,
            ];

            $response = Http::timeout(2)->post($url, $payload);

            if (!$response->successful()) {
                Log::error('GHL webhook #2 request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('GHL webhook #2 exception: '.$e->getMessage());
        }
    }

    /**
     * Optional SMS provider hook.
     * This template intentionally logs instead of sending if Twilio isn't installed/configured.
     */
    public function sendVerificationSms(string $phone, string $code): void
    {
        $message = "Your verification code is {$code}. It expires in 5 minutes.";

        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $from = config('services.twilio.from');

        if (!$sid || !$token || !$from) {
            Log::info('Twilio not configured; skipping SMS send.', ['phone' => $phone]);
            return;
        }

        if (!class_exists('Twilio\\Rest\\Client')) {
            Log::warning('Twilio SDK not installed; skipping SMS send.', ['phone' => $phone]);
            return;
        }

        try {
            /** @var class-string $clientClass */
            $clientClass = 'Twilio\\Rest\\Client';
            $client = new $clientClass($sid, $token);
            $client->messages->create($phone, [
                'from' => $from,
                'body' => $message,
            ]);
        } catch (\Throwable $e) {
            Log::error('Twilio SMS exception: '.$e->getMessage(), ['phone' => $phone]);
        }
    }

    /**
     * Fire all initial webhooks concurrently (in parallel) to minimize response time.
     * Instead of sequential 2s + 2s + 2s = 6s, we get max(2s, 2s, 2s) = ~2s.
     */
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

                // Pool request 2: GHL Webhook #1
                $ghlUrl1 = 'https://services.leadconnectorhq.com/hooks/wqg41fHAr6E8zQBv2IDN/webhook-trigger/b2604b84-2770-42e1-b7c0-d322eb5308e6';
                $pool->timeout(2)->post($ghlUrl1, [
                    'event' => 'lead_submitted',
                    'verified' => false,
                    'session_id' => $sessionId,
                    'verification_code' => $verificationCode,
                    'timestamp' => now()->toIso8601String(),
                    ...$lead,
                ]);

                // Pool request 3: Twilio SMS (if configured)
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
            });

            // Log responses (non-blocking, just for debugging)
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
}
