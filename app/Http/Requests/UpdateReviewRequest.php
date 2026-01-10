<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isAdmin() || auth()->id() === $this->review->user_id;
    }

    public function rules(): array
    {
        return [
            'rating' => 'sometimes|integer|between:1,5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
        ];
    }
}
