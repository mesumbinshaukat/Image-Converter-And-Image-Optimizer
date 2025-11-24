<?php

namespace App\Services;

use App\Models\PageView;
use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get page view statistics
     */
    public function getPageViewStats($period = 'today')
    {
        $startDate = $this->getStartDate($period);

        // Get most visited pages with average duration
        $pageViews = PageView::where('created_at', '>=', $startDate)
            ->select(
                'page_path',
                DB::raw('COUNT(*) as views'),
                DB::raw('AVG(duration) as avg_duration')
            )
            ->groupBy('page_path')
            ->orderBy('views', 'desc')
            ->limit(20)
            ->get();

        return $pageViews;
    }

    /**
     * Get traffic summary statistics
     */
    public function getTrafficSummary($period = 'today')
    {
        $startDate = $this->getStartDate($period);

        $stats = [
            'page_views_today' => PageView::where('created_at', '>=', $startDate)->count(),
            'unique_visitors_today' => PageView::where('created_at', '>=', $startDate)
                ->distinct('session_id')
                ->count('session_id'),
            'avg_session_duration' => PageView::where('created_at', '>=', $startDate)
                ->whereNotNull('duration')
                ->avg('duration'),
            'total_sessions' => PageView::where('created_at', '>=', $startDate)
                ->distinct('session_id')
                ->count('session_id'),
        ];

        return $stats;
    }

    /**
     * Get page view trends over time
     */
    public function getPageViewTrends($days = 7)
    {
        $startDate = Carbon::now()->subDays($days);

        $trends = PageView::where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT session_id) as unique_visitors')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $trends;
    }

    /**
     * Get top referrers
     */
    public function getTopReferrers($period = 'today', $limit = 10)
    {
        $startDate = $this->getStartDate($period);

        $referrers = PageView::where('created_at', '>=', $startDate)
            ->whereNotNull('referrer')
            ->where('referrer', '!=', '')
            ->select(
                'referrer',
                DB::raw('COUNT(*) as visits')
            )
            ->groupBy('referrer')
            ->orderBy('visits', 'desc')
            ->limit($limit)
            ->get();

        return $referrers;
    }

    /**
     * Get user journey (page flow)
     */
    public function getUserJourney($sessionId)
    {
        $journey = PageView::where('session_id', $sessionId)
            ->orderBy('entry_time')
            ->get(['page_path', 'entry_time', 'exit_time', 'duration']);

        return $journey;
    }

    /**
     * Track page view entry
     */
    public function trackPageView($data)
    {
        try {
            $pageView = PageView::create([
                'user_id' => $data['user_id'] ?? null,
                'session_id' => $data['session_id'],
                'ip_address' => $data['ip_address'],
                'page_path' => $data['page_path'],
                'referrer' => $data['referrer'] ?? null,
                'user_agent' => $data['user_agent'] ?? null,
                'entry_time' => $data['entry_time'] ?? now(),
            ]);

            // Also log to activity log
            ActivityLog::create([
                'user_id' => $data['user_id'] ?? null,
                'ip_address' => $data['ip_address'],
                'action' => 'page_view',
                'entity_type' => 'page',
                'description' => "Visited {$data['page_path']}",
                'level' => 'info',
                'status' => 'success',
                'metadata' => [
                    'page_path' => $data['page_path'],
                    'session_id' => $data['session_id'],
                ],
            ]);

            return $pageView;
        } catch (\Exception $e) {
            \Log::error('Error tracking page view: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update page view with exit time and duration
     */
    public function trackPageExit($data)
    {
        try {
            $pageView = PageView::where('session_id', $data['session_id'])
                ->where('page_path', $data['page_path'])
                ->whereNull('exit_time')
                ->orderBy('entry_time', 'desc')
                ->first();

            if ($pageView) {
                $pageView->update([
                    'exit_time' => $data['exit_time'] ?? now(),
                    'duration' => $data['duration'] ?? null,
                ]);

                return $pageView;
            }

            return null;
        } catch (\Exception $e) {
            \Log::error('Error tracking page exit: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get bounce rate (sessions with only one page view)
     */
    public function getBounceRate($period = 'today')
    {
        $startDate = $this->getStartDate($period);

        $totalSessions = PageView::where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        if ($totalSessions === 0) {
            return 0;
        }

        $bouncedSessions = PageView::where('created_at', '>=', $startDate)
            ->select('session_id', DB::raw('COUNT(*) as page_count'))
            ->groupBy('session_id')
            ->having('page_count', '=', 1)
            ->count();

        return round(($bouncedSessions / $totalSessions) * 100, 2);
    }

    /**
     * Get average pages per session
     */
    public function getAvgPagesPerSession($period = 'today')
    {
        $startDate = $this->getStartDate($period);

        $avgPages = PageView::where('created_at', '>=', $startDate)
            ->select('session_id', DB::raw('COUNT(*) as page_count'))
            ->groupBy('session_id')
            ->avg('page_count');

        return round($avgPages, 2);
    }

    /**
     * Helper method to get start date based on period
     */
    private function getStartDate($period)
    {
        return match($period) {
            'week' => Carbon::now()->subWeek(),
            'month' => Carbon::now()->subMonth(),
            'year' => Carbon::now()->subYear(),
            default => Carbon::today(),
        };
    }
}
