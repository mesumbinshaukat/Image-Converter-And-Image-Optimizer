<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Image;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CleanupOldFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'imgify:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up files and records older than 24 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting cleanup process...');
        
        $retentionHours = config('imgify.file_retention_hours', 24);
        $cutoffTime = Carbon::now()->subHours($retentionHours);
        
        // Get old images
        $oldImages = Image::where('created_at', '<', $cutoffTime)->get();
        
        $deletedFiles = 0;
        $deletedRecords = 0;
        
        foreach ($oldImages as $image) {
            // Delete the physical file
            if ($image->processed_path && Storage::exists($image->processed_path)) {
                Storage::delete($image->processed_path);
                $deletedFiles++;
            }
            
            // Delete the database record
            $image->delete();
            $deletedRecords++;
        }
        
        $this->info("Deleted {$deletedFiles} files and {$deletedRecords} database records.");
        
        // Clean up activity logs older than 24 hours
        $logRetentionHours = config('imgify.log_retention_hours', 24);
        $logCutoffTime = Carbon::now()->subHours($logRetentionHours);
        
        $deletedLogs = DB::table('activity_logs')
            ->where('created_at', '<', $logCutoffTime)
            ->delete();
        
        $this->info("Deleted {$deletedLogs} old activity logs.");
        
        // Clean up old rate limit records
        $deletedRateLimits = DB::table('rate_limits')
            ->where('created_at', '<', Carbon::now()->subDay())
            ->delete();
        
        $this->info("Deleted {$deletedRateLimits} old rate limit records.");
        
        $this->info('Cleanup completed successfully!');
        
        return Command::SUCCESS;
    }
}
