<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Track background removal analytics
     */
    public function trackBackgroundRemoval(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'originalSize' => 'required|integer',
            'processedSize' => 'required|integer',
            'processingTime' => 'required|numeric',
            'success' => 'required|boolean',
            'errorMessage' => 'nullable|string',
        ]);

        $ipAddress = $request->ip();
        $user = $request->user();

        try {
            // Save to database using existing Image model
            $image = Image::create([
                'user_id' => $user?->id,
                'ip_address' => $ipAddress,
                'original_filename' => $request->input('filename'),
                'original_path' => null, // Client-side processing, no server path
                'processed_path' => null, // Client-side processing, no server path
                'original_format' => pathinfo($request->input('filename'), PATHINFO_EXTENSION),
                'processed_format' => 'png', // Always PNG for background removal
                'original_size' => $request->input('originalSize'),
                'processed_size' => $request->input('processedSize'),
                'operation' => 'background_removal',
                'processing_time' => $request->input('processingTime'),
                'success' => $request->input('success'),
                'error_message' => $request->input('errorMessage'),
                'expires_at' => Carbon::now()->addHours(config('imgify.file_retention_hours', 24)),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Analytics tracked successfully',
                'id' => $image->id,
            ]);
        } catch (\Exception $e) {
            // Fail silently for analytics - don't break user experience
            return response()->json([
                'success' => false,
                'message' => 'Failed to track analytics',
            ], 500);
        }
    }
}
