<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryProfile extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'license_number',
        'vehicle_type',
        'vehicle_number',
        'phone',
        'address',
        'status',
        'total_earnings',
        'pending_earnings',
        'available_balance',
        'is_available',
        'current_latitude',
        'current_longitude',
        'last_location_update',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'total_earnings' => 'decimal:2',
        'pending_earnings' => 'decimal:2',
        'available_balance' => 'decimal:2',
        'current_latitude' => 'decimal:8',
        'current_longitude' => 'decimal:8',
        'last_location_update' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
