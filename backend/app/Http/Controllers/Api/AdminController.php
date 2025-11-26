<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Image;
use App\Models\ActivityLog;
use App\Models\ContactSubmission;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    protected $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }
    /**
     * Get all users
     */
    public function users(Request $request)
    {
        try {
            $users = User::withCount('images')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json($users);
        } catch (\Exception $e) {
            \Log::error('Admin users error: ' . $e->getMessage());
            return response()->json([
                'data' => [],
                'total' => 0,
                'per_page' => 20,
                'current_page' => 1,
            ]);
        }
    }

    /**
     * Get analytics data
     */
    public function analytics(Request $request)
    {
        try {
            $period = $request->input('period', 'today'); // today, week, month

            $startDate = match($period) {
                'week' => Carbon::now()->subWeek(),
                'month' => Carbon::now()->subMonth(),
                default => Carbon::today(),
            };

            // Get stats with proper null handling
            $totalUsers = User::count();
            $totalImages = Image::where('created_at', '>=', $startDate)->count();
            
            // Calculate storage saved safely
            $storageSaved = 0;
            try {
                $images = Image::where('created_at', '>=', $startDate)
                    ->whereNotNull('original_size')
                    ->whereNotNull('processed_size')
                    ->get();
                
                foreach ($images as $image) {
                    $storageSaved += ($image->original_size - $image->processed_size);
                }
            } catch (\Exception $e) {
                \Log::warning('Error calculating storage saved: ' . $e->getMessage());
            }

            // Get traffic summary from AnalyticsService
            $trafficSummary = $this->analyticsService->getTrafficSummary($period);

            $stats = [
                'total_users' => $totalUsers,
                'total_images' => $totalImages,
                'daily_visitors' => Image::where('created_at', '>=', Carbon::today())
                    ->distinct('ip_address')
                    ->count('ip_address'),
                'active_today' => ActivityLog::where('created_at', '>=', Carbon::today())
                    ->distinct('user_id')
                    ->whereNotNull('user_id')
                    ->count('user_id'),
                'total_optimizations' => Image::where('operation', 'optimize')
                    ->where('created_at', '>=', $startDate)
                    ->count(),
                'total_conversions' => Image::where('operation', 'convert')
                    ->where('created_at', '>=', $startDate)
                    ->count(),
                'total_background_removals' => Image::where('operation', 'background_removal')
                    ->where('created_at', '>=', $startDate)
                    ->count(),
                'successful_background_removals' => Image::where('operation', 'background_removal')
                    ->where('success', true)
                    ->where('created_at', '>=', $startDate)
                    ->count(),
                'failed_background_removals' => Image::where('operation', 'background_removal')
                    ->where('success', false)
                    ->where('created_at', '>=', $startDate)
                    ->count(),
                'avg_processing_time' => round(Image::where('operation', 'background_removal')
                    ->where('created_at', '>=', $startDate)
                    ->whereNotNull('processing_time')
                    ->avg('processing_time'), 2),
                'total_storage_saved' => $storageSaved,
                // Add traffic summary data
                'page_views_today' => $trafficSummary['page_views_today'] ?? 0,
                'unique_visitors_today' => $trafficSummary['unique_visitors_today'] ?? 0,
                'avg_session_duration' => $trafficSummary['avg_session_duration'] ?? 0,
            ];

            // Daily breakdown with error handling
            $dailyStats = [];
            try {
                $dailyStats = Image::where('created_at', '>=', $startDate)
                    ->select(
                        DB::raw('DATE(created_at) as date'),
                        DB::raw('COUNT(*) as count'),
                        DB::raw('SUM(CASE WHEN operation = "optimize" THEN 1 ELSE 0 END) as optimizations'),
                        DB::raw('SUM(CASE WHEN operation = "convert" THEN 1 ELSE 0 END) as conversions'),
                        DB::raw('SUM(CASE WHEN operation = "background_removal" THEN 1 ELSE 0 END) as background_removals')
                    )
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();
            } catch (\Exception $e) {
                \Log::warning('Error fetching daily stats: ' . $e->getMessage());
            }

            return response()->json([
                'stats' => $stats,
                'daily_breakdown' => $dailyStats,
            ]);
        } catch (\Exception $e) {
            \Log::error('Admin analytics error: ' . $e->getMessage());
            
            // Return safe defaults on error
            return response()->json([
                'stats' => [
                    'total_users' => 0,
                    'total_images' => 0,
                    'daily_visitors' => 0,
                    'active_today' => 0,
                    'total_optimizations' => 0,
                    'total_conversions' => 0,
                    'total_storage_saved' => 0,
                    'page_views_today' => 0,
                    'unique_visitors_today' => 0,
                    'avg_session_duration' => 0,
                ],
                'daily_breakdown' => [],
            ]);
        }
    }

    /**
     * Get activity logs
     */
    public function logs(Request $request)
    {
        try {
            $logs = ActivityLog::with('user')
                ->orderBy('created_at', 'desc')
                ->paginate(50);

            return response()->json($logs);
        } catch (\Exception $e) {
            \Log::error('Admin logs error: ' . $e->getMessage());
            return response()->json([
                'data' => [],
                'total' => 0,
                'per_page' => 50,
                'current_page' => 1,
            ]);
        }
    }

    /**
     * Get contact submissions
     */
    public function contacts(Request $request)
    {
        try {
            $contacts = ContactSubmission::orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json($contacts);
        } catch (\Exception $e) {
            \Log::error('Admin contacts error: ' . $e->getMessage());
            return response()->json([
                'data' => [],
                'total' => 0,
                'per_page' => 20,
                'current_page' => 1,
            ]);
        }
    }

    /**
     * Mark contact as reviewed
     */
    public function markContactReviewed($id)
    {
        try {
            $contact = ContactSubmission::findOrFail($id);
            $contact->update(['is_reviewed' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Contact marked as reviewed',
            ]);
        } catch (\Exception $e) {
            \Log::error('Mark contact reviewed error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark contact as reviewed',
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            
            if ($user->role === 'admin') {
                return response()->json([
                    'error' => 'Cannot delete admin user',
                ], 403);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully',
            ]);
        } catch (\Exception $e) {
            \Log::error('Delete user error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
            ], 500);
        }
    }

    /**
     * Get page view analytics
     */
    public function pageViews(Request $request)
    {
        try {
            $period = $request->input('period', 'today');
            
            $pageViews = $this->analyticsService->getPageViewStats($period);
            $trafficSummary = $this->analyticsService->getTrafficSummary($period);

            return response()->json([
                'data' => $pageViews,
                'summary' => $trafficSummary,
            ]);
        } catch (\Exception $e) {
            \Log::error('Page views error: ' . $e->getMessage());
            return response()->json([
                'data' => [],
                'summary' => [
                    'page_views_today' => 0,
                    'unique_visitors_today' => 0,
                    'avg_session_duration' => 0,
                    'total_sessions' => 0,
                ],
            ]);
        }
    }

    /**
     * Get traffic summary
     */
    public function trafficSummary(Request $request)
    {
        try {
            $period = $request->input('period', 'today');
            $summary = $this->analyticsService->getTrafficSummary($period);

            return response()->json([
                'success' => true,
                'data' => $summary,
            ]);
        } catch (\Exception $e) {
            \Log::error('Traffic summary error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
            ], 500);
        }
    }

    /**
     * Track page view entry
     */
    public function trackPageView(Request $request)
    {
        try {
            $data = [
                'user_id' => $request->user()?->id,
                'session_id' => $request->input('session_id'),
                'ip_address' => $request->ip(),
                'page_path' => $request->input('page_path'),
                'referrer' => $request->input('referrer'),
                'user_agent' => $request->input('user_agent'),
                'entry_time' => $request->input('entry_time'),
            ];

            $pageView = $this->analyticsService->trackPageView($data);

            return response()->json([
                'success' => true,
                'message' => 'Page view tracked',
            ]);
        } catch (\Exception $e) {
            \Log::error('Track page view error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to track page view',
            ], 500);
        }
    }

    /**
     * Track page exit
     */
    public function trackPageExit(Request $request)
    {
        try {
            $data = [
                'session_id' => $request->input('session_id'),
                'page_path' => $request->input('page_path'),
                'exit_time' => $request->input('exit_time'),
                'duration' => $request->input('duration'),
            ];

            $pageView = $this->analyticsService->trackPageExit($data);

            return response()->json([
                'success' => true,
                'message' => 'Page exit tracked',
            ]);
        } catch (\Exception $e) {
            \Log::error('Track page exit error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to track page exit',
            ], 500);
        }
    }

    /**
     * Get page view trends
     */
    public function pageViewTrends(Request $request)
    {
        try {
            $days = $request->input('days', 7);
            $trends = $this->analyticsService->getPageViewTrends($days);

            return response()->json([
                'success' => true,
                'data' => $trends,
            ]);
        } catch (\Exception $e) {
            \Log::error('Page view trends error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
            ], 500);
        }
    }

    /**
     * Get top referrers
     */
    public function topReferrers(Request $request)
    {
        try {
            $period = $request->input('period', 'today');
            $limit = $request->input('limit', 10);
            
            $referrers = $this->analyticsService->getTopReferrers($period, $limit);

            return response()->json([
                'success' => true,
                'data' => $referrers,
            ]);
        } catch (\Exception $e) {
            \Log::error('Top referrers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
            ], 500);
        }
    }
}
