<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VendorResource extends JsonResource
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
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar,
            'status' => $this->status,
            'vendor_profile' => [
                'store_name' => $this->vendorProfile?->store_name,
                'store_slug' => $this->vendorProfile?->store_slug,
                'description' => $this->vendorProfile?->description,
                'logo' => $this->vendorProfile?->logo && !str_starts_with($this->vendorProfile->logo, 'http') ? asset('storage/' . $this->vendorProfile->logo) : $this->vendorProfile?->logo,
                'cover_image' => $this->vendorProfile?->cover_image && !str_starts_with($this->vendorProfile->cover_image, 'http') ? asset('storage/' . $this->vendorProfile->cover_image) : $this->vendorProfile?->cover_image,
                'phone' => $this->vendorProfile?->phone,
                'email' => $this->vendorProfile?->email,
                'address' => $this->vendorProfile?->address,
                'city' => $this->vendorProfile?->city,
                'state' => $this->vendorProfile?->state,
                'postal_code' => $this->vendorProfile?->postal_code,
                'country' => $this->vendorProfile?->country,
                'latitude' => $this->vendorProfile?->latitude,
                'longitude' => $this->vendorProfile?->longitude,
                'status' => $this->vendorProfile?->status,
                'is_verified' => $this->vendorProfile?->is_verified,
            ],
            'average_rating' => (float) ($this->average_rating ?? 0),
            'total_reviews' => (int) ($this->total_reviews ?? 0),
            'products_count' => (int) ($this->products_count ?? 0),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
