<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        if(env('APP_ENV') == 'local') {
            return true;
        }
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'parent_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'sort_order' => 'nullable|integer|min:0',
            // 'is_active' => 'boolean',
        ];
    }
}
