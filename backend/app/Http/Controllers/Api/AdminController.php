<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Image;
use App\Models\ActivityLog;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all users
     */
    public function users(Request $request)
    {
        $users = User::withCount('images')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($users);
    }

    /**
     * Get analytics data
     */
    public function analytics(Request $request)
    {
        $period = $request->input('period', 'today'); // today, week, month

        $startDate = match($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            default => Carbon::today(),
        };

        $stats = [
            'total_users' => User::count(),
            'total_images_processed' => Image::where('created_at', '>=', $startDate)->count(),
            'total_optimizations' => Image::where('operation', 'optimize')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'total_conversions' => Image::where('operation', 'convert')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'unique_visitors' => Image::where('created_at', '>=', $startDate)
                ->distinct('ip_address')
                ->count('ip_address'),
            'total_storage_saved' => Image::where('created_at', '>=', $startDate)
                ->sum(DB::raw('original_size - processed_size')),
        ];

        // Daily breakdown
        $dailyStats = Image::where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(CASE WHEN operation = "optimize" THEN 1 ELSE 0 END) as optimizations'),
                DB::raw('SUM(CASE WHEN operation = "convert" THEN 1 ELSE 0 END) as conversions')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'stats' => $stats,
            'daily_breakdown' => $dailyStats,
        ]);
    }

    /**
     * Get activity logs
     */
    public function logs(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($logs);
    }

    /**
     * Get contact submissions
     */
    public function contacts(Request $request)
    {
        $contacts = ContactSubmission::orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($contacts);
    }

    /**
     * Mark contact as reviewed
     */
    public function markContactReviewed($id)
    {
        $contact = ContactSubmission::findOrFail($id);
        $contact->update(['is_reviewed' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Contact marked as reviewed',
        ]);
    }

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
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
    }
}
