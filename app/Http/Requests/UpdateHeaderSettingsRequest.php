<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHeaderSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'logo_url' => 'nullable|url',
            'logo_alt_text' => 'nullable|string|max:255',
            'logo_height' => 'nullable|integer|min:1',
            'logo_width' => 'nullable|integer|min:1',
            'menu_items' => 'nullable|array',
            'announcement_text' => 'nullable|string|max:500',
            'announcement_background_color' => 'nullable|string|max:7',
            'announcement_text_color' => 'nullable|string|max:7',
            'show_announcement' => 'boolean',
            'show_search' => 'boolean',
            'show_cart' => 'boolean',
            'show_account' => 'boolean',
            'primary_color' => 'nullable|string|max:7',
            'secondary_color' => 'nullable|string|max:7',
        ];
    }
}
