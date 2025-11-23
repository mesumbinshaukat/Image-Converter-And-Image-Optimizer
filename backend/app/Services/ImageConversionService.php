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

        // Read the image
        $image = $this->manager->read($file->getRealPath());

        // Generate unique filename
        $filename = uniqid() . '_converted.' . $targetFormat;
        $path = 'images/' . $filename;
        $fullPath = storage_path('app/public/' . $path);

        // Ensure directory exists
        $directory = dirname($fullPath);
        if (!file_exists($directory)) {
            mkdir($directory, 0755, true);
        }

        // Convert based on target format
        switch ($targetFormat) {
            case 'jpg':
            case 'jpeg':
                $encoded = $image->toJpeg($quality);
                break;
            case 'png':
                $encoded = $image->toPng();
                break;
            case 'webp':
                $encoded = $image->toWebp($quality);
                break;
            case 'gif':
                $encoded = $image->toGif();
                break;
            case 'bmp':
                $encoded = $image->toBitmap();
                break;
            default:
                throw new \Exception("Unsupported target format: {$targetFormat}");
        }

        // Save the converted image
        $encoded->save($fullPath);

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
     * Get list of supported formats
     *
     * @return array
     */
    public function getSupportedFormats(): array
    {
        return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'];
    }
}
