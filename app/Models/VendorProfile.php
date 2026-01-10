<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VendorProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'store_name',
        'store_slug',
        'description',
        'logo',
        'cover_image',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'commission_rate',
        'total_earnings',
        'pending_earnings',
        'available_balance',
        'status',
        'rejection_reason',
        'is_verified',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'commission_rate' => 'decimal:2',
        'total_earnings' => 'decimal:2',
        'pending_earnings' => 'decimal:2',
        'available_balance' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
