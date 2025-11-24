<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'ip_address',
        'honeypot',
        'is_reviewed',
    ];

    protected $casts = [
        'is_reviewed' => 'boolean',
    ];

    protected $appends = [
        'reviewed',
    ];

    /**
     * Get the reviewed attribute (alias for is_reviewed)
     */
    public function getReviewedAttribute()
    {
        return $this->is_reviewed;
    }
}
