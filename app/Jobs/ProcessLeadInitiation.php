<?php

namespace App\Jobs;

use App\Services\LeadWebhookService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessLeadInitiation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public array $lead,
        public string $sessionId,
        public string $verificationCode,
    ) {
    }

    /**
     * Execute the job.
     * Sends Google Sheets, GHL webhook #1, and SMS verification in the background.
     */
    public function handle(LeadWebhookService $service): void
    {
        $service->sendToGoogleSheets($this->lead);
        $service->sendToGhlWebhook1($this->lead, $this->sessionId, $this->verificationCode);
        $service->sendVerificationSms($this->lead['phone'], $this->verificationCode);
    }
}
