<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'featured_image' => $this->featured_image,
            'category' => new BlogCategoryResource($this->whenLoaded('category')),
            'author' => new UserResource($this->whenLoaded('author')),
            'status' => $this->status,
            'published_at' => $this->published_at,
            'views_count' => $this->views_count,
            'meta' => $this->meta,
            'comments_count' => $this->whenLoaded('comments', $this->comments()->count()),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
