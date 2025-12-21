<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set maximum execution time from .env
        $maxExecutionTime = env('IMGIFY_MAX_EXECUTION_TIME', 300);
        @ini_set('max_execution_time', $maxExecutionTime);
        @set_time_limit($maxExecutionTime);

        // Ensure memory limit is sufficient for image processing
        // We'll also increase it dynamically in the ImageOptimizationService
        $memoryLimit = env('IMGIFY_MEMORY_LIMIT', '512M');
        @ini_set('memory_limit', $memoryLimit);
    }

}
