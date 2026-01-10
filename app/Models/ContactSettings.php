<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSettings extends Model
{
    public $timestamps = true;

    protected $table = 'contact_settings';

    protected $fillable = [
        'company_name',
        'company_description',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'linkedin_url',
        'youtube_url',
        'office_hours',
    ];

    protected $casts = [
        'office_hours' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}
