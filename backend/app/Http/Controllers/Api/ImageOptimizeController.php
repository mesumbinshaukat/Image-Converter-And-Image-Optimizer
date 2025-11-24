<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Services\ImageOptimizationService;
use App\Services\RateLimitService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ImageOptimizeController extends Controller
{
    protected $optimizationService;
    protected $rateLimitService;

    public function __construct(ImageOptimizationService $optimizationService, RateLimitService $rateLimitService)
    {
        $this->optimizationService = $optimizationService;
        $this->rateLimitService = $rateLimitService;
    }

    /**
     * Optimize uploaded images
     */
    public function optimize(Request $request)
    {
        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp,gif,bmp|max:' . config('imgify.max_file_size'),
            'quality' => 'nullable|integer|min:1|max:100',
        ]);

        $ipAddress = $request->ip();
        $user = $request->user();
        $imageCount = count($request->file('images'));

        // Check rate limits
        $limitCheck = $this->rateLimitService->checkLimit($ipAddress, $user, $imageCount);
        
        if (!$limitCheck['allowed']) {
            return response()->json([
                'error' => $limitCheck['message'],
                'limits' => $limitCheck['limits'],
            ], 429);
        }

        $quality = $request->input('quality', config('imgify.default_quality'));
        $results = [];

        foreach ($request->file('images') as $file) {
            try {
                $result = $this->optimizationService->optimize($file, $quality);
                
                // Save to database
                $image = Image::create([
                    'user_id' => $user?->id,
                    'ip_address' => $ipAddress,
                    'original_filename' => $file->getClientOriginalName(),
                    'original_path' => $result['original_path'],
                    'processed_path' => $result['processed_path'],
                    'original_format' => $result['format'],
                    'processed_format' => $result['format'],
                    'original_size' => $result['original_size'],
                    'processed_size' => $result['processed_size'],
                    'operation' => 'optimize',
                    'expires_at' => Carbon::now()->addHours(config('imgify.file_retention_hours')),
                ]);

                $results[] = [
                    'id' => $image->id,
                    'filename' => $file->getClientOriginalName(),
                    'original_size' => $result['original_size'],
                    'optimized_size' => $result['processed_size'],
                    'compression_ratio' => $result['compression_ratio'],
                    'download_url' => url('/api/download/' . $image->id),
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'filename' => $file->getClientOriginalName(),
                    'error' => $e->getMessage(),
                ];
            }
        }

        // Increment rate limit counter
        $this->rateLimitService->incrementCount($ipAddress, $imageCount);

        return response()->json([
            'success' => true,
            'results' => $results,
            'limits' => $this->rateLimitService->getRemainingLimit($ipAddress, $user),
        ]);
    }

    /**
     * Download optimized image
     */
    public function download($id)
    {
        $image = Image::findOrFail($id);

        // Check if expired
        if ($image->expires_at < Carbon::now()) {
            return response()->json([
                'error' => 'Image has expired and been deleted',
            ], 404);
        }

        if (!file_exists($image->processed_path)) {
            return response()->json([
                'error' => 'Image file not found',
            ], 404);
        }

        return response()->download($image->processed_path, $image->original_filename);
    }
}
