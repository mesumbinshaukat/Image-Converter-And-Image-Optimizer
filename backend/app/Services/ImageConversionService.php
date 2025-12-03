<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;

class ImageConversionService
{
    protected $manager;

    public function __construct()
    {
        // Use GD driver for compatibility on Windows
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Convert an image to a different format
     *
     * @param UploadedFile $file
     * @param string $targetFormat
     * @param int $quality
     * @return array
     */
    public function convert(UploadedFile $file, string $targetFormat, int $quality = 90): array
    {
        $originalSize = $file->getSize();
        $originalFormat = strtolower($file->getClientOriginalExtension());
        $targetFormat = strtolower($targetFormat);

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
            $image = $this->manager->read($file->getRealPath());
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
        $filename = uniqid() . '_converted.' . $targetFormat;
        $path = 'images/' . $filename;
        $fullPath = storage_path('app/public/' . $path);

        // Ensure directory exists
        $directory = dirname($fullPath);
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        // Convert based on target format with error handling and progressive fallback
        $encoded = $this->encodeImageWithFallback($image, $targetFormat, $quality, $file->getClientOriginalName());

        // Save the converted image
        try {
            $encoded->save($fullPath);
        } catch (\Exception $e) {
            throw new \Exception("Failed to save converted image. Error: " . $e->getMessage());
        }

        $processedSize = filesize($fullPath);

        return [
            'original_path' => $file->getRealPath(),
            'processed_path' => $fullPath,
            'public_path' => 'storage/' . $path,
            'original_size' => $originalSize,
            'processed_size' => $processedSize,
            'original_format' => $originalFormat,
            'target_format' => $targetFormat,
        ];
    }

    /**
     * Batch convert multiple images
     *
     * @param array $files
     * @param string $targetFormat
     * @param int $quality
     * @return array
     */
    public function batchConvert(array $files, string $targetFormat, int $quality = 90): array
    {
        $results = [];
        foreach ($files as $file) {
            try {
                $results[] = $this->convert($file, $targetFormat, $quality);
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
            
            \Log::info("Increasing memory limit for large image processing", [
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
     * @param string $targetFormat
     * @param int $quality
     * @param string $filename
     * @return mixed
     * @throws \Exception
     */
    protected function encodeImageWithFallback($image, string $targetFormat, int $quality, string $filename)
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
                    \Log::warning("Attempting encoding with reduced quality", [
                        'format' => $targetFormat,
                        'quality' => $currentQuality,
                        'file' => $filename,
                        'attempt' => $index + 1
                    ]);
                }
                
                $encoded = $this->encodeImage($image, $targetFormat, $currentQuality);
                
                if ($index > 0) {
                    \Log::info("Successfully encoded image with reduced quality", [
                        'format' => $targetFormat,
                        'quality' => $currentQuality,
                        'file' => $filename
                    ]);
                }
                
                return $encoded;
                
            } catch (\Exception $e) {
                $lastError = $e;
                
                if ($index === count($qualityLevels) - 1) {
                    // This was the last attempt
                    \Log::error("All encoding attempts failed", [
                        'format' => $targetFormat,
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
        throw new \Exception("Failed to convert image to {$targetFormat} format after trying multiple quality levels. The image may be too large or complex for processing. Last error: " . ($lastError ? $lastError->getMessage() : 'Unknown error'));
    }

    /**
     * Encode image to target format
     *
     * @param mixed $image
     * @param string $targetFormat
     * @param int $quality
     * @return mixed
     * @throws \Exception
     */
    protected function encodeImage($image, string $targetFormat, int $quality)
    {
        try {
            switch ($targetFormat) {
                case 'jpg':
                case 'jpeg':
                    return $image->toJpeg($quality);
                case 'png':
                    return $image->toPng();
                case 'webp':
                    return $image->toWebp($quality);
                case 'gif':
                    return $image->toGif();
                case 'bmp':
                    return $image->toBitmap();
                default:
                    throw new \Exception("Unsupported target format: {$targetFormat}");
            }
        } catch (\Exception $e) {
            // Provide more context for encoding errors
            if (strpos($e->getMessage(), 'webp') !== false || $targetFormat === 'webp') {
                throw new \Exception("WebP encoding failed. This may be due to image size, complexity, or GD library limitations. Try reducing image dimensions or quality.");
            }
            throw $e;
        }
    }

    /**
     * Get list of supported formats
     *
     * @return array
     */
    public function getSupportedFormats(): array
    {
        return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
    }
}
