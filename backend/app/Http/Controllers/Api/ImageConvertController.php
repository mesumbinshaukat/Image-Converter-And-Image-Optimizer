<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Services\ImageConversionService;
use App\Services\RateLimitService;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ImageConvertController extends Controller
{
    protected $conversionService;
    protected $rateLimitService;

    public function __construct(ImageConversionService $conversionService, RateLimitService $rateLimitService)
    {
        $this->conversionService = $conversionService;
        $this->rateLimitService = $rateLimitService;
    }

    /**
     * Convert uploaded images to different format
     */
    public function convert(Request $request)
    {
        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'required|image|mimes:jpg,jpeg,png,webp,gif,bmp|max:' . config('imgify.file.max_size'),
            'format' => 'required|in:jpg,jpeg,png,webp,gif,bmp',
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

        $targetFormat = $request->input('format');
        $quality = $request->input('quality', config('imgify.conversion.default_quality'));
        $results = [];

        foreach ($request->file('images') as $file) {
            try {
                $result = $this->conversionService->convert($file, $targetFormat, $quality);
                
                // Save to database
                $image = Image::create([
                    'user_id' => $user ? $user->id : null,
                    'ip_address' => $ipAddress,
                    'original_filename' => $file->getClientOriginalName(),
                    'original_path' => $result['original_path'],
                    'processed_path' => $result['processed_path'],
                    'original_format' => $result['original_format'],
                    'processed_format' => $result['target_format'],
                    'original_size' => $result['original_size'],
                    'processed_size' => $result['processed_size'],
                    'operation' => 'convert',
                    'expires_at' => Carbon::now()->addHours(config('imgify.file.retention_hours')),
                ]);

                $results[] = [
                    'id' => $image->id,
                    'filename' => $file->getClientOriginalName(),
                    'original_format' => $result['original_format'],
                    'converted_format' => $result['target_format'],
                    'original_size' => $result['original_size'],
                    'converted_size' => $result['processed_size'],
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
     * Get supported formats
     */
    public function formats()
    {
        return response()->json([
            'formats' => $this->conversionService->getSupportedFormats(),
        ]);
    }
}
