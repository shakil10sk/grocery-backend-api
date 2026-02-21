<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'video_url' => $this->video_url,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price ? (float) $this->compare_at_price : null,
            'stock_quantity' => $this->stock_quantity,
            'track_stock' => $this->track_stock,
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'status' => $this->status,
            'rejection_reason' => $this->when(auth()->user()?->isVendor() && $this->status === 'rejected', $this->rejection_reason),
            'weight' => $this->weight ? (float) $this->weight : null,
            'unit' => $this->unit,
            'thumbnail_url' => $this->images->where('is_primary', true)->first()?->image_path 
                ? (str_starts_with($image_path = $this->images->where('is_primary', true)->first()->image_path, 'http') 
                    ? $image_path 
                    : asset('storage/' . $image_path))
                : ($this->images->first()?->image_path 
                    ? (str_starts_with($image_path = $this->images->first()->image_path, 'http') 
                        ? $image_path 
                        : asset('storage/' . $image_path))
                    : null),
            'category' => $this->whenLoaded('category', function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                ];
            }),
            'vendor' => $this->whenLoaded('vendor', function () {
                return [
                    'id' => $this->vendor->id,
                    'name' => $this->vendor->name,
                    'vendor_profile' => $this->vendor->vendorProfile ? [
                        'store_name' => $this->vendor->vendorProfile->store_name,
                        'store_slug' => $this->vendor->vendorProfile->store_slug,
                        'is_verified' => $this->vendor->vendorProfile->is_verified,
                    ] : null,
                ];
            }),
            'variations' => $this->whenLoaded('variations', function () {
                return $this->variations->map(fn($variation) => [
                    'id' => $variation->id,
                    'name' => $variation->name,
                    'sku' => $variation->sku,
                    'price' => (float) $variation->price,
                    'stock_quantity' => $variation->stock_quantity,
                    'is_default' => $variation->is_default,
                ]);
            }),
            'images' => $this->whenLoaded('images', function () {
                return $this->images->map(fn($image) => [
                    'id' => $image->id,
                    'image_path' => str_starts_with($image->image_path, 'http') ? $image->image_path : asset('storage/' . $image->image_path),
                    'is_primary' => $image->is_primary,
                    'sort_order' => $image->sort_order,
                ])->sortBy('sort_order')->values();
            }),
            'reviews' => $this->whenLoaded('reviews', function () {
                return ReviewResource::collection($this->reviews()->approved()->get());
            }),
            'reviews_count' => $this->whenLoaded('reviews', $this->reviews()->approved()->count()),
            'average_rating' => $this->whenLoaded('reviews', function () {
                return round($this->reviews()->approved()->avg('rating'), 1);
            }),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
