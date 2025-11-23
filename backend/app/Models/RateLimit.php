<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RateLimit extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'daily_count',
        'current_batch_count',
        'last_reset_date',
    ];

    protected $casts = [
        'last_reset_date' => 'date',
    ];
}
