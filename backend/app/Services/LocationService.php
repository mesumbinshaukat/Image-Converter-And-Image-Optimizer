<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LocationService
{
    /**
     * Get country name from IP address
     *
     * @param string $ipAddress
     * @return string
     */
    public function getCountryFromIp(string $ipAddress): string
    {
        // Skip localhost/private IPs
        if ($this->isPrivateIp($ipAddress)) {
            return 'Local';
        }

        // Cache for 24 hours to avoid hitting API limits
        $cacheKey = "ip_country_{$ipAddress}";
        
        return Cache::remember($cacheKey, 86400, function () use ($ipAddress) {
            try {
                // Use ipapi.co free API (1,000 requests/day)
                $response = Http::timeout(2)->get("https://ipapi.co/{$ipAddress}/country_name/");
                
                if ($response->successful() && !empty($response->body())) {
                    return trim($response->body());
                }
            } catch (\Exception $e) {
                Log::warning("Failed to get location for IP: {$ipAddress}", [
                    'error' => $e->getMessage()
                ]);
            }
            
            return 'Unknown';
        });
    }

    /**
     * Check if IP is private/local
     *
     * @param string $ip
     * @return bool
     */
    private function isPrivateIp(string $ip): bool
    {
        // Check for localhost
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return true;
        }

        // Filter out private and reserved IP ranges
        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false;
    }

    /**
     * Get country code (2-letter) from IP address
     *
     * @param string $ipAddress
     * @return string
     */
    public function getCountryCodeFromIp(string $ipAddress): string
    {
        if ($this->isPrivateIp($ipAddress)) {
            return 'XX';
        }

        $cacheKey = "ip_country_code_{$ipAddress}";
        
        return Cache::remember($cacheKey, 86400, function () use ($ipAddress) {
            try {
                $response = Http::timeout(2)->get("https://ipapi.co/{$ipAddress}/country/");
                
                if ($response->successful() && !empty($response->body())) {
                    return strtoupper(trim($response->body()));
                }
            } catch (\Exception $e) {
                Log::warning("Failed to get country code for IP: {$ipAddress}");
            }
            
            return 'XX';
        });
    }
}
