<?php

namespace App\Jobs;

use App\Services\LeadWebhookService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendUnverifiedLeadToWebhooks implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public string $sessionId,
    ) {
    }

    public function handle(LeadWebhookService $service): void
    {
        $cacheKey = "lead_verification:{$this->sessionId}";
        $verificationData = Cache::get($cacheKey);

        // CRITICAL: if cache is null, the outcome already happened (verified/closed), skip.
        if ($verificationData === null) {
            Log::info('SendUnverifiedLeadToWebhooks: Cache is null, outcome already handled. Skipping timeout webhook.', [
                'session_id' => $this->sessionId,
            ]);
            return;
        }

        if (($verificationData['verified'] ?? false) === true) {
            Log::info('SendUnverifiedLeadToWebhooks: Lead already verified. Skipping timeout webhook.', [
                'session_id' => $this->sessionId,
            ]);
            return;
        }

        $lead = $verificationData['lead'] ?? [];

        // GHL webhook #2 timeout outcome
        $service->sendToGhlWebhook2($lead, $this->sessionId, false, 'timeout');

        Cache::forget($cacheKey);
        Log::info('SendUnverifiedLeadToWebhooks: Timeout outcome sent; cache cleared.', [
            'session_id' => $this->sessionId,
        ]);
    }
}
