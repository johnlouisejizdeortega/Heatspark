<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class HeatsparkController extends Controller
{
    public function home()
    {
        return Inertia::render('Heatspark/Home');
    }

    public function about()
    {
        return Inertia::render('Heatspark/About');
    }

    public function services()
    {
        return Inertia::render('Heatspark/Services');
    }

    public function portfolio()
    {
        return Inertia::render('Heatspark/Portfolio');
    }

    public function contact()
    {
        return Inertia::render('Heatspark/Contact');
    }

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'firstName' => ['required', 'string', 'max:100'],
            'lastName'  => ['required', 'string', 'max:100'],
            'email'     => ['required', 'email', 'max:255'],
            'phone'     => ['nullable', 'string', 'max:30'],
            'service'   => ['nullable', 'string', 'max:100'],
            'message'   => ['required', 'string', 'max:2000'],
        ]);

        try {
            Mail::raw(
                "New enquiry from {$validated['firstName']} {$validated['lastName']}\n\n"
                . "Email: {$validated['email']}\n"
                . "Phone: " . ($validated['phone'] ?? 'Not provided') . "\n"
                . "Service: " . ($validated['service'] ?? 'Not specified') . "\n\n"
                . "Message:\n{$validated['message']}",
                function ($message) use ($validated) {
                    $message->to('admin@heatsparkenergy.co.uk')
                            ->from(config('mail.from.address'), 'Heat Spark Website')
                            ->replyTo($validated['email'], "{$validated['firstName']} {$validated['lastName']}")
                            ->subject("New Quote Request — {$validated['firstName']} {$validated['lastName']}");
                }
            );
        } catch (\Exception $e) {
            return response()->json(['message' => 'Mail error'], 500);
        }

        return response()->json(['message' => 'Sent']);
    }
}
