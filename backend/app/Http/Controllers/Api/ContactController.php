<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Submit contact form
     */
    public function submit(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
            'honeypot' => 'nullable|string', // Bot protection
        ]);

        // Check honeypot (should be empty)
        if ($request->filled('honeypot')) {
            return response()->json([
                'success' => true,
                'message' => 'Thank you for your message',
            ]);
        }

        // Rate limiting for contact form
        $ipAddress = $request->ip();
        $recentSubmissions = ContactSubmission::where('ip_address', $ipAddress)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($recentSubmissions >= 3) {
            return response()->json([
                'error' => 'Too many submissions. Please try again later.',
            ], 429);
        }

        ContactSubmission::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
            'ip_address' => $ipAddress,
            'honeypot' => $request->honeypot,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your message. We will get back to you soon!',
        ]);
    }
}
