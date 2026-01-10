<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFooterSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'company_name' => 'sometimes|string|max:255',
            'company_description' => 'nullable|string',
            'logo_url' => 'nullable|url',
            'copyright_text' => 'nullable|string',
            'quick_links' => 'nullable|array',
            'company_links' => 'nullable|array',
            'support_links' => 'nullable|array',
            'legal_links' => 'nullable|array',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string|max:20',
            'facebook_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'payment_methods' => 'nullable|array',
        ];
    }
}
