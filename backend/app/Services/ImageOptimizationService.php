<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ImageOptimizationService
{
    protected $manager;

    public function __construct()
    {
        // Use GD driver for better compatibility
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Optimize an image by compressing it without significant quality loss
     *
     * @param UploadedFile $file
     * @param int $quality
     * @return array
     */
    public function optimize(UploadedFile $file, int $quality = 85): array
    {
        $originalSize = $file->getSize();
        $originalFormat = strtolower($file->getClientOriginalExtension());
        $originalPath = $file->getRealPath();
        
        // Read the image
        $image = $this->manager->read($originalPath);
        
        // Generate unique filename
        $filename = uniqid() . '_optimized.' . $originalFormat;
        $path = 'images/' . $filename;
        $fullPath = storage_path('app/public/' . $path);
        
        // Ensure directory exists
        $directory = dirname($fullPath);
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }
        
        // Smart quality adjustment for very small files
        // For files under 50KB, use higher quality to avoid quality loss
        if ($originalSize < 51200 && $quality < 90) {
            $quality = 90;
        }
        
        // Encode based on format with proper compression
        switch ($originalFormat) {
            case 'jpg':
            case 'jpeg':
                $encoded = $image->toJpeg($quality);
                break;
            case 'png':
                // PNG uses compression level 0-9, convert quality to compression
                // Higher quality = lower compression number (0 = no compression, 9 = max compression)
                $compression = max(0, min(9, (int) ((100 - $quality) / 11)));
                $encoded = $image->toPng(compression: $compression);
                break;
            case 'webp':
                $encoded = $image->toWebp($quality);
                break;
            case 'gif':
                $encoded = $image->toGif();
                break;
            default:
                $encoded = $image->toJpeg($quality);
        }
        
        // Save the optimized image to temporary location first
        $encoded->save($fullPath);
        
        $processedSize = filesize($fullPath);
        
        // CRITICAL: Never return a larger file than the original
        // If optimization increased size, use the original file instead
        if ($processedSize >= $originalSize) {
            // Delete the larger optimized file
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
            
            // Copy original file as the "optimized" version
            copy($originalPath, $fullPath);
            $processedSize = $originalSize;
            $compressionRatio = 0; // No compression achieved
            $usedOriginal = true;
        } else {
            $compressionRatio = round((($originalSize - $processedSize) / $originalSize) * 100, 2);
            $usedOriginal = false;
        }
        
        return [
            'original_path' => $originalPath,
            'processed_path' => $fullPath,
            'public_path' => 'storage/' . $path,
            'original_size' => $originalSize,
            'processed_size' => $processedSize,
            'compression_ratio' => $compressionRatio,
            'format' => $originalFormat,
            'used_original' => $usedOriginal,
        ];
    }

    /**
     * Batch optimize multiple images
     *
     * @param array $files
     * @param int $quality
     * @return array
     */
    public function batchOptimize(array $files, int $quality = 85): array
    {
        $results = [];
        
        foreach ($files as $file) {
            try {
                $results[] = $this->optimize($file, $quality);
            } catch (\Exception $e) {
                $results[] = [
                    'error' => $e->getMessage(),
                    'file' => $file->getClientOriginalName(),
                ];
            }
        }
        
        return $results;
    }
}
