<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|string|in:stripe,paypal,razorpay,cash_on_delivery',
            'notes' => 'nullable|string|max:500',
        ];
    }
}
