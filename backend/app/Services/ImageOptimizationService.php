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
        $maxDimensions = config('imgify.max_dimensions', 100000);
        
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
        
        // Removed forced quality adjustment for small files to respect user choice

        
        // Encode based on format with error handling and progressive fallback
        \Log::info("Starting optimization", [
            'filename' => $file->getClientOriginalName(),
            'format' => $originalFormat,
            'requested_quality' => $quality,
            'original_size' => $originalSize
        ]);

        $encoded = $this->encodeImageWithFallback($image, $originalFormat, $quality, $file->getClientOriginalName());
        
        // Save the optimized image to temporary location first
        try {
            $encoded->save($fullPath);
        } catch (\Exception $e) {
            throw new \Exception("Failed to save optimized image. Error: " . $e->getMessage());
        }
        
        $processedSize = filesize($fullPath);
        
        \Log::info("Optimization complete", [
            'filename' => $file->getClientOriginalName(),
            'processed_size' => $processedSize,
            'original_size' => $originalSize,
            'delta' => $originalSize - $processedSize
        ]);

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
            'applied_quality' => $quality
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

        // Check if image type is supported (getimagesize doesn't always detect HEIC correctly)
        // We'll rely more on the file extension and Intervention's read() for HEIC
        $supportedTypes = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_GIF, IMAGETYPE_BMP, IMAGETYPE_WEBP];
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($imageInfo[2], $supportedTypes) && !in_array($extension, ['heic', 'heif'])) {
            throw new \Exception("Unsupported image type. Please upload a JPEG, PNG, GIF, BMP, WebP, or HEIC image.");
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
        // For WebP and large images, we need more memory
        $width = $imageInfo[0];
        $height = $imageInfo[1];
        $channels = 4; // RGBA
        
        // Use higher multiplier for very large images (WebP encoding is memory intensive)
        $pixelCount = $width * $height;
        if ($pixelCount > 10000000) { // > 10 megapixels
            $safetyMultiplier = 3.0; // Triple memory for very large images
        } elseif ($pixelCount > 5000000) { // > 5 megapixels
            $safetyMultiplier = 2.5;
        } else {
            $safetyMultiplier = 1.5;
        }
        
        $requiredMemory = $width * $height * $channels * $safetyMultiplier;

        // Add current memory usage
        $currentMemory = memory_get_usage(true);
        $totalRequired = $currentMemory + $requiredMemory;

        // Get current memory limit
        $memoryLimit = $this->getMemoryLimit();

        // If required memory exceeds 70% of limit, increase it (was 80%, now more aggressive)
        if ($totalRequired > ($memoryLimit * 0.7)) {
            $newLimit = (int)($totalRequired * 1.5); // 50% buffer (was 30%)
            $newLimitMB = ceil($newLimit / 1024 / 1024);
            
            \Log::info("Increasing memory limit for large image optimization", [
                'current_limit_mb' => round($memoryLimit / 1024 / 1024),
                'new_limit_mb' => $newLimitMB,
                'image_dimensions' => "{$width}x{$height}",
                'pixel_count' => $pixelCount
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
     * Encode image with progressive quality fallback
     *
     * @param mixed $image
     * @param string $format
     * @param int $quality
     * @param string $filename
     * @return mixed
     * @throws \Exception
     */
    protected function encodeImageWithFallback($image, string $format, int $quality, string $filename)
    {
        // Progressive quality levels to try
        $qualityLevels = [$quality];
        
        // Add fallback quality levels if original quality is high
        if ($quality > 75) {
            $qualityLevels[] = 75;
        }
        if ($quality > 60) {
            $qualityLevels[] = 60;
        }
        if ($quality > 50) {
            $qualityLevels[] = 50;
        }
        if ($quality > 40) {
            $qualityLevels[] = 40;
        }
        
        $lastError = null;
        
        foreach ($qualityLevels as $index => $currentQuality) {
            try {
                if ($index > 0) {
                    \Log::warning("Attempting optimization with reduced quality", [
                        'format' => $format,
                        'quality' => $currentQuality,
                        'file' => $filename,
                        'attempt' => $index + 1
                    ]);
                }
                
                $encoded = $this->encodeImage($image, $format, $currentQuality);
                
                if ($index > 0) {
                    \Log::info("Successfully optimized image with reduced quality", [
                        'format' => $format,
                        'quality' => $currentQuality,
                        'file' => $filename
                    ]);
                }
                
                return $encoded;
                
            } catch (\Exception $e) {
                $lastError = $e;
                
                if ($index === count($qualityLevels) - 1) {
                    // This was the last attempt
                    \Log::error("All optimization attempts failed", [
                        'format' => $format,
                        'file' => $filename,
                        'attempts' => count($qualityLevels),
                        'final_error' => $e->getMessage()
                    ]);
                }
                
                // Continue to next quality level
                continue;
            }
        }
        
        // If we get here, all attempts failed
        throw new \Exception("Failed to optimize image after trying multiple quality levels. The image may be too large or complex for processing. Last error: " . ($lastError ? $lastError->getMessage() : 'Unknown error'));
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
                    // PNG is lossless, so "quality" doesn't strictly apply to the encoder.
                    // To achieve optimization based on quality, we reduce the color palette.
                    if ($quality < 100) {
                        // Map quality 60-99 to color limits 32-256
                        // 100 = No reduction
                        // 90 = 256 colors
                        // 80 = 128 colors
                        // 70 = 64 colors
                        // 60 = 32 colors
                        $colorLimit = 256;
                        if ($quality <= 60) $colorLimit = 32;
                        elseif ($quality <= 70) $colorLimit = 64;
                        elseif ($quality <= 80) $colorLimit = 128;
                        elseif ($quality <= 90) $colorLimit = 256;
                        
                        $image->reduceColors($colorLimit);
                    }
                    return $image->toPng();
                case 'webp':
                    return $image->toWebp($quality);
                case 'gif':
                    // Similar to PNG, GIF is indexed.
                    if ($quality < 100) {
                        $colorLimit = 256;
                        if ($quality <= 60) $colorLimit = 32;
                        elseif ($quality <= 70) $colorLimit = 64;
                        elseif ($quality <= 80) $colorLimit = 128;
                        
                        $image->reduceColors($colorLimit);
                    }
                    return $image->toGif();
                case 'bmp':
                    return $image->toBitmap();
                case 'heic':
                case 'heif':
                    // Many browsers don't support HEIC natively, so if optimizing for web,
                    // we might want to convert to WebP or JPEG. 
                    // But if user specifically wants to keep HEIC format:
                    try {
                        return $image->toHeic($quality);
                    } catch (\Exception $e) {
                        // If direct HEIC encoding fails, fallback to something else? 
                        // For now, let's just try toHeic.
                        throw $e;
                    }
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

