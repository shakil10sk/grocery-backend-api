<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'rating' => $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'is_verified_purchase' => $this->is_verified_purchase,
            'is_approved' => $this->is_approved,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
