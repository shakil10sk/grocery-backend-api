<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $product = $this->route('product');
        // Vendor can update their own products, Admin can update any
        return auth()->user()->isAdmin() || 
               (auth()->user()->isVendor() && $product->vendor_id === auth()->id());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return [
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'video_url' => 'nullable|url',
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('products', 'sku')->ignore($productId),
            ],
            'price' => 'sometimes|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0|gt:price',
            'stock_quantity' => 'sometimes|integer|min:0',
            'track_stock' => 'boolean',
            'weight' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|in:kg,g,lb,oz,piece',
            'is_featured' => 'boolean',
        ];
    }
}
