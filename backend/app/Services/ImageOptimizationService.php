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
        
        // Validate file size against environment configuration
        $maxFileSize = config('imgify.max_file_size') * 1024; // Convert KB to bytes
        if ($originalSize > $maxFileSize) {
            throw new \Exception("Image file size (" . round($originalSize / 1024 / 1024, 2) . "MB) exceeds maximum allowed size (" . round($maxFileSize / 1024 / 1024, 2) . "MB). Please upload a smaller image.");
        }

        // Validate image before processing
        $this->validateImage($file);

        // Ensure sufficient memory for processing
        $this->ensureSufficientMemory($file);
        
        // Read the image
        try {
            $image = $this->manager->read($originalPath);
        } catch (\Exception $e) {
            throw new \Exception("Failed to read image file. The image may be corrupted or in an unsupported format. Error: " . $e->getMessage());
        }

        // Check image dimensions
        $dimensions = $this->getImageDimensions($image);
        $maxDimensions = config('imgify.max_dimensions', 4096);
        
        if ($dimensions['width'] > $maxDimensions || $dimensions['height'] > $maxDimensions) {
            throw new \Exception("Image dimensions ({$dimensions['width']}x{$dimensions['height']}px) exceed maximum allowed dimensions ({$maxDimensions}x{$maxDimensions}px). Please resize the image before uploading.");
        }
        
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
        
        // Encode based on format with error handling and fallback
        try {
            $encoded = $this->encodeImage($image, $originalFormat, $quality);
        } catch (\Exception $e) {
            // Try with reduced quality as fallback
            \Log::warning("Image optimization encoding failed at quality {$quality}, attempting fallback", [
                'format' => $originalFormat,
                'original_error' => $e->getMessage(),
                'file' => $file->getClientOriginalName()
            ]);
            
            if ($quality > 75) {
                try {
                    $encoded = $this->encodeImage($image, $originalFormat, 75);
                    \Log::info("Successfully optimized image with reduced quality (75)");
                } catch (\Exception $fallbackError) {
                    throw new \Exception("Failed to optimize image. This may be due to image complexity or size. Original error: " . $e->getMessage());
                }
            } else {
                throw new \Exception("Failed to optimize image. Error: " . $e->getMessage());
            }
        }
        
        // Save the optimized image to temporary location first
        try {
            $encoded->save($fullPath);
        } catch (\Exception $e) {
            throw new \Exception("Failed to save optimized image. Error: " . $e->getMessage());
        }
        
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

    /**
     * Validate image file
     *
     * @param UploadedFile $file
     * @throws \Exception
     */
    protected function validateImage(UploadedFile $file): void
    {
        // Check if file is a valid image
        $imageInfo = @getimagesize($file->getRealPath());
        
        if ($imageInfo === false) {
            throw new \Exception("Invalid image file. The file may be corrupted or not a valid image format.");
        }

        // Check if image type is supported
        $supportedTypes = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_GIF, IMAGETYPE_BMP, IMAGETYPE_WEBP];
        if (!in_array($imageInfo[2], $supportedTypes)) {
            throw new \Exception("Unsupported image type. Please upload a JPEG, PNG, GIF, BMP, or WebP image.");
        }
    }

    /**
     * Ensure sufficient memory for image processing
     *
     * @param UploadedFile $file
     */
    protected function ensureSufficientMemory(UploadedFile $file): void
    {
        $imageInfo = @getimagesize($file->getRealPath());
        
        if ($imageInfo === false) {
            return; // Will be caught by validateImage
        }

        // Calculate required memory (width * height * channels * bytes_per_channel * safety_multiplier)
        // Typical calculation: width * height * 4 (RGBA) * 1.5 (safety buffer)
        $width = $imageInfo[0];
        $height = $imageInfo[1];
        $channels = 4; // RGBA
        $requiredMemory = $width * $height * $channels * 1.5;

        // Add current memory usage
        $currentMemory = memory_get_usage(true);
        $totalRequired = $currentMemory + $requiredMemory;

        // Get current memory limit
        $memoryLimit = $this->getMemoryLimit();

        // If required memory exceeds 80% of limit, try to increase it
        if ($totalRequired > ($memoryLimit * 0.8)) {
            $newLimit = (int)($totalRequired * 1.3); // 30% buffer
            $newLimitMB = ceil($newLimit / 1024 / 1024);
            
            \Log::info("Increasing memory limit for large image optimization", [
                'current_limit_mb' => round($memoryLimit / 1024 / 1024),
                'new_limit_mb' => $newLimitMB,
                'image_dimensions' => "{$width}x{$height}"
            ]);

            @ini_set('memory_limit', $newLimitMB . 'M');
        }
    }

    /**
     * Get current memory limit in bytes
     *
     * @return int
     */
    protected function getMemoryLimit(): int
    {
        $memoryLimit = ini_get('memory_limit');
        
        if ($memoryLimit == -1) {
            return PHP_INT_MAX;
        }

        $unit = strtoupper(substr($memoryLimit, -1));
        $value = (int)$memoryLimit;

        switch ($unit) {
            case 'G':
                $value *= 1024;
            case 'M':
                $value *= 1024;
            case 'K':
                $value *= 1024;
        }

        return $value;
    }

    /**
     * Get image dimensions
     *
     * @param mixed $image
     * @return array
     */
    protected function getImageDimensions($image): array
    {
        return [
            'width' => $image->width(),
            'height' => $image->height(),
        ];
    }

    /**
     * Encode image in its original format
     *
     * @param mixed $image
     * @param string $format
     * @param int $quality
     * @return mixed
     * @throws \Exception
     */
    protected function encodeImage($image, string $format, int $quality)
    {
        try {
            switch ($format) {
                case 'jpg':
                case 'jpeg':
                    return $image->toJpeg($quality);
                case 'png':
                    // PNG uses compression level 0-9, convert quality to compression
                    // Higher quality = lower compression number (0 = no compression, 9 = max compression)
                    $compression = max(0, min(9, (int) ((100 - $quality) / 11)));
                    return $image->toPng(compression: $compression);
                case 'webp':
                    return $image->toWebp($quality);
                case 'gif':
                    return $image->toGif();
                default:
                    return $image->toJpeg($quality);
            }
        } catch (\Exception $e) {
            // Provide more context for encoding errors
            if (strpos($e->getMessage(), 'webp') !== false || $format === 'webp') {
                throw new \Exception("WebP encoding failed. This may be due to image size, complexity, or GD library limitations. Try reducing image dimensions or quality.");
            }
            throw $e;
        }
    }
}
