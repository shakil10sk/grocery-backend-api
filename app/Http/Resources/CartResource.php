<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'slug' => $this->product->slug,
                'price' => (float) $this->product->price,
                'image' => $this->product->images()->where('is_primary', true)->first()
                    ? asset('storage/' . $this->product->images()->where('is_primary', true)->first()->image_path)
                    : null,
            ],
            'variation' => $this->when($this->variation, function () {
                return [
                    'id' => $this->variation->id,
                    'name' => $this->variation->name,
                    'price' => (float) $this->variation->price,
                ];
            }),
            'quantity' => $this->quantity,
            'price' => (float) $this->price,
            'subtotal' => (float) ($this->price * $this->quantity),
        ];
    }
}
