<?php

namespace App\Services;

use App\Models\RateLimit;
use App\Models\User;
use Carbon\Carbon;

class RateLimitService
{
    /**
     * Check if the request is within rate limits
     *
     * @param string $ipAddress
     * @param User|null $user
     * @param int $imageCount
     * @return array
     */
    public function checkLimit(string $ipAddress, ?User $user, int $imageCount): array
    {
        $limits = $this->getLimits($user);
        
        $rateLimit = RateLimit::firstOrCreate(
            ['ip_address' => $ipAddress],
            [
                'daily_count' => 0,
                'current_batch_count' => 0,
                'last_reset_date' => today()
            ]
        );

        // Reset daily count if new day
        if ($rateLimit->last_reset_date < today()) {
            $rateLimit->update([
                'daily_count' => 0,
                'current_batch_count' => 0,
                'last_reset_date' => today()
            ]);
        }

        // Check batch limit
        if ($imageCount > $limits['batch_limit']) {
            return [
                'allowed' => false,
                'message' => "Batch limit exceeded. Maximum {$limits['batch_limit']} images per batch.",
                'limits' => $this->getRemainingLimit($ipAddress, $user)
            ];
        }

        // Check daily limit
        if ($rateLimit->daily_count + $imageCount > $limits['daily_limit']) {
            $remaining = $limits['daily_limit'] - $rateLimit->daily_count;
            return [
                'allowed' => false,
                'message' => "Daily limit exceeded. You have {$remaining} images remaining today.",
                'limits' => $this->getRemainingLimit($ipAddress, $user)
            ];
        }

        return [
            'allowed' => true,
            'limits' => $this->getRemainingLimit($ipAddress, $user)
        ];
    }

    /**
     * Increment the usage count
     *
     * @param string $ipAddress
     * @param int $count
     * @return void
     */
    public function incrementCount(string $ipAddress, int $count): void
    {
        $rateLimit = RateLimit::where('ip_address', $ipAddress)->first();
        
        if ($rateLimit) {
            $rateLimit->increment('daily_count', $count);
            $rateLimit->update(['current_batch_count' => $count]);
        }
    }

    /**
     * Get rate limits based on user type
     *
     * @param User|null $user
     * @return array
     */
    protected function getLimits(?User $user): array
    {
        if ($user) {
            return [
                'batch_limit' => config('imgify.user.batch_limit'),
                'daily_limit' => config('imgify.user.daily_limit'),
            ];
        }

        return [
            'batch_limit' => config('imgify.guest.batch_limit'),
            'daily_limit' => config('imgify.guest.daily_limit'),
        ];
    }

    /**
     * Get remaining limits for the user/IP
     *
     * @param string $ipAddress
     * @param User|null $user
     * @return array
     */
    public function getRemainingLimit(string $ipAddress, ?User $user): array
    {
        $limits = $this->getLimits($user);
        $rateLimit = RateLimit::where('ip_address', $ipAddress)->first();

        if (!$rateLimit || $rateLimit->last_reset_date < today()) {
            return [
                'daily_remaining' => $limits['daily_limit'],
                'daily_limit' => $limits['daily_limit'],
                'batch_limit' => $limits['batch_limit'],
                'user_type' => $user ? 'registered' : 'guest',
            ];
        }

        return [
            'daily_remaining' => max(0, $limits['daily_limit'] - $rateLimit->daily_count),
            'daily_limit' => $limits['daily_limit'],
            'batch_limit' => $limits['batch_limit'],
            'daily_used' => $rateLimit->daily_count,
            'user_type' => $user ? 'registered' : 'guest',
        ];
    }
}
