<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Imgify Configuration
    |--------------------------------------------------------------------------
    |
    | Custom configuration for Imgify image optimization and conversion tool
    |
    */

    // Rate Limiting
    'guest_batch_limit' => env('IMGIFY_GUEST_BATCH_LIMIT', 5),
    'guest_daily_limit' => env('IMGIFY_GUEST_DAILY_LIMIT', 20),
    'user_batch_limit' => env('IMGIFY_USER_BATCH_LIMIT', 50),
    'user_daily_limit' => env('IMGIFY_USER_DAILY_LIMIT', 500),

    // File Management
    'file_retention_hours' => env('IMGIFY_FILE_RETENTION_HOURS', 24),
    'log_retention_hours' => env('IMGIFY_LOG_RETENTION_HOURS', 24),
    'max_file_size' => env('IMGIFY_MAX_FILE_SIZE', 10240), // in KB

    // Allowed Formats
    'allowed_formats' => explode(',', env('IMGIFY_ALLOWED_FORMATS', 'jpg,jpeg,png,webp,gif,bmp,svg')),

    // Image Processing
    'default_quality' => 85,
    'max_dimensions' => 4096, // Maximum width or height in pixels
];
