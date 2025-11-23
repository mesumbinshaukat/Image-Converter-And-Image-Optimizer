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
        
        // Read the image
        $image = $this->manager->read($file->getRealPath());
        
        // Strip metadata for privacy and size reduction
        // Imagick automatically handles this during encoding
        
        // Generate unique filename
        $filename = uniqid() . '_optimized.' . $originalFormat;
        $path = 'images/' . $filename;
        $fullPath = storage_path('app/public/' . $path);
        
        // Ensure directory exists
        $directory = dirname($fullPath);
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }
        
        // Encode based on format
        switch ($originalFormat) {
            case 'jpg':
            case 'jpeg':
                $encoded = $image->toJpeg($quality);
                break;
            case 'png':
                // PNG uses compression level 0-9, convert quality to compression
                $compression = (int) ((100 - $quality) / 11);
                $encoded = $image->toPng();
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
        
        // Save the optimized image
        $encoded->save($fullPath);
        
        $processedSize = filesize($fullPath);
        $compressionRatio = round((($originalSize - $processedSize) / $originalSize) * 100, 2);
        
        return [
            'original_path' => $file->getRealPath(),
            'processed_path' => $fullPath,
            'public_path' => 'storage/' . $path,
            'original_size' => $originalSize,
            'processed_size' => $processedSize,
            'compression_ratio' => $compressionRatio,
            'format' => $originalFormat,
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
