<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'image' => $this->image ? asset('storage/' . $this->image) : null,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'parent' => $this->whenLoaded('parent', function () {
                return [
                    'id' => $this->parent->id,
                    'name' => $this->parent->name,
                    'slug' => $this->parent->slug,
                ];
            }),
            'children' => $this->whenLoaded('children', function () {
                return CategoryResource::collection($this->children);
            }),
            'products_count' => $this->when(isset($this->products_count), $this->products_count),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
