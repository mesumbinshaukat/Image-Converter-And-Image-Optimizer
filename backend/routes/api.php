<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ImageOptimizeController;
use App\Http\Controllers\Api\ImageConvertController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ImageDownloadController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/contact', [ContactController::class, 'submit']);

// Image processing (guest + authenticated)
Route::post('/optimize', [ImageOptimizeController::class, 'optimize']);
Route::post('/convert', [ImageConvertController::class, 'convert']);
Route::get('/formats', [ImageConvertController::class, 'formats']);
Route::get('/download/{id}', [ImageDownloadController::class, 'download']);

// Analytics tracking (public - no auth required)
Route::post('/analytics/page-view', [AdminController::class, 'trackPageView']);
Route::post('/analytics/page-exit', [AdminController::class, 'trackPageExit']);
Route::post('/analytics/background-removal', [AnalyticsController::class, 'trackBackgroundRemoval']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
    Route::get('/analytics/page-views', [AdminController::class, 'pageViews']);
    Route::get('/analytics/traffic-summary', [AdminController::class, 'trafficSummary']);
    Route::get('/analytics/trends', [AdminController::class, 'pageViewTrends']);
    Route::get('/analytics/referrers', [AdminController::class, 'topReferrers']);
    Route::get('/logs', [AdminController::class, 'logs']);
    Route::get('/contacts', [AdminController::class, 'contacts']);
    Route::patch('/contacts/{id}/review', [AdminController::class, 'markContactReviewed']);
});
