<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'ip_address',
        'page_path',
        'referrer',
        'user_agent',
        'entry_time',
        'exit_time',
        'duration',
    ];

    protected $casts = [
        'entry_time' => 'datetime',
        'exit_time' => 'datetime',
    ];

    /**
     * Get the user that owns the page view.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
