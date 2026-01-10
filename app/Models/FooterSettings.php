<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterSettings extends Model
{
    public $timestamps = true;

    protected $table = 'footer_settings';

    protected $fillable = [
        'company_name',
        'company_description',
        'logo_url',
        'copyright_text',
        'quick_links',
        'company_links',
        'support_links',
        'legal_links',
        'contact_email',
        'contact_phone',
        'facebook_url',
        'twitter_url',
        'instagram_url',
        'linkedin_url',
        'youtube_url',
        'payment_methods',
    ];

    protected $casts = [
        'quick_links' => 'array',
        'company_links' => 'array',
        'support_links' => 'array',
        'legal_links' => 'array',
        'payment_methods' => 'array',
    ];
}
