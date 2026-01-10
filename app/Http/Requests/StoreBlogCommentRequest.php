<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Allow guest comments
    }

    public function rules(): array
    {
        return [
            'comment' => 'required|string|max:1000',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ];
    }
}
