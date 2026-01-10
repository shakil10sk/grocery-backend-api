<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        $categoryId = $this->route('category')->id;

        return [
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                Rule::notIn([$categoryId]), // Cannot be its own parent
            ],
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|mimes:jpeg,png,jpg,gif|max:2048',
            'sort_order' => 'nullable|integer|min:0',
            // 'is_active' => 'boolean',
        ];
    }
}
