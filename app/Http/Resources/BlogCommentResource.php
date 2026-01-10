<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogCommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'blog_post_id' => $this->blog_post_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'name' => $this->name,
            'email' => $this->email,
            'comment' => $this->comment,
            'is_approved' => $this->is_approved,
            'created_at' => $this->created_at,
        ];
    }
}
