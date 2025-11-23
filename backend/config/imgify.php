<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Imgify Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration settings for the Imgify image optimizer and converter
    |
    */

    'guest' => [
        'batch_limit' => env('IMGIFY_GUEST_BATCH_LIMIT', 5),
        'daily_limit' => env('IMGIFY_GUEST_DAILY_LIMIT', 20),
    ],

    'user' => [
        'batch_limit' => env('IMGIFY_USER_BATCH_LIMIT', 50),
        'daily_limit' => env('IMGIFY_USER_DAILY_LIMIT', 500),
    ],

    'file' => [
        'retention_hours' => env('IMGIFY_FILE_RETENTION_HOURS', 24),
        'max_size' => env('IMGIFY_MAX_FILE_SIZE', 10240), // in KB
        'allowed_formats' => explode(',', env('IMGIFY_ALLOWED_FORMATS', 'jpg,jpeg,png,webp,gif,bmp,svg')),
    ],

    'log' => [
        'retention_hours' => env('IMGIFY_LOG_RETENTION_HOURS', 24),
    ],

    'optimization' => [
        'quality' => 85, // Default quality for optimization
        'strip_metadata' => true,
    ],

    'conversion' => [
        'default_quality' => 90,
    ],
];
