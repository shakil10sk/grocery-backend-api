<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeaderSettings extends Model
{
    public $timestamps = true;

    protected $table = 'header_settings';

    protected $fillable = [
        'logo_url',
        'logo_alt_text',
        'logo_height',
        'logo_width',
        'menu_items',
        'announcement_text',
        'announcement_background_color',
        'announcement_text_color',
        'show_announcement',
        'show_search',
        'show_cart',
        'show_account',
        'primary_color',
        'secondary_color',
    ];

    protected $casts = [
        'menu_items' => 'array',
        'show_announcement' => 'boolean',
        'show_search' => 'boolean',
        'show_cart' => 'boolean',
        'show_account' => 'boolean',
    ];
}
