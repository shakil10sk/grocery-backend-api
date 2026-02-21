<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\StoreBlogPostRequest;
use App\Http\Requests\UpdateBlogPostRequest;
use App\Http\Requests\StoreBlogCommentRequest;
use App\Http\Resources\BlogPostResource;
use App\Http\Resources\BlogCommentResource;
use App\Models\BlogPost;
use App\Models\BlogComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Blog", description: "Blog post and comment management endpoints")]
class BlogController extends BaseController
{
    /**
     * Get blog posts
     */
    #[OA\Get(
        path: "/api/v1/blog/posts",
        summary: "List blog posts",
        tags: ["Blog"],
        parameters: [
            new OA\Parameter(name: "category_id", in: "query", description: "Filter by category", required: false, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "search", in: "query", description: "Search posts", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "admin_view", in: "query", description: "Show all posts (Admin only)", required: false, schema: new OA\Schema(type: "boolean")),
            new OA\Parameter(name: "status", in: "query", description: "Filter by status (Admin only)", required: false, schema: new OA\Schema(type: "string", enum: ["draft", "published", "archived"])),
            new OA\Parameter(name: "page", in: "query", description: "Page number", required: false, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Posts retrieved successfully"),
        ]
    )]
    public function indexPosts(Request $request): JsonResponse
    {
        $query = BlogPost::with(['category', 'author']);

        // Check if admin wants all posts (including unpublished/archived)
        // Only allow this if the user is authenticated as an admin
        $isAdminView = $request->boolean('admin_view') && auth('api')->check() && auth('api')->user()->isAdmin();

        if (!$isAdminView) {
            // Public view: only show published and active blogs
            $query->published();
        } else {
            // Admin view: can filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
        }

        if ($request->has('category_id')) {
            $query->where('blog_category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Ordering: published date for public, created date for admin
        $posts = $query->latest($isAdminView ? 'created_at' : 'published_at')->paginate(10);

        return $this->paginatedResponse(
            $posts->through(fn($post) => new BlogPostResource($post)),
            'Blog posts retrieved successfully'
        );
    }



    /**
     * Store a new blog post (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/blog/posts",
        summary: "Create blog post (Admin only)",
        tags: ["Blog"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["blog_category_id", "title", "content"],
                    properties: [
                        new OA\Property(property: "blog_category_id", type: "integer", example: 1),
                        new OA\Property(property: "title", type: "string", example: "Blog Post Title"),
                        new OA\Property(property: "content", type: "string", example: "Blog post content"),
                        new OA\Property(property: "excerpt", type: "string", example: "Short excerpt"),
                        new OA\Property(property: "featured_image", type: "string", format: "binary"),
                        new OA\Property(property: "status", type: "string", enum: ["draft", "published", "archived"]),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Post created successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
        ]
    )]
    public function storeBlogPost(StoreBlogPostRequest $request): JsonResponse
    {
        $data = $request->only(['blog_category_id', 'title', 'content', 'excerpt', 'status', 'published_at', 'meta']);
        $data['user_id'] = auth()->id();
        $data['slug'] = BlogPost::generateSlug($request->title);

        // dd($request->hasFile('featured_image'));
        // Handle featured image
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('blog', 'public');
            $data['featured_image'] = $path;
        }

        if($request->get('status') == 'published'){
            $data['published_at'] = now();
        }
        $post = BlogPost::create($data);
        $post->load(['category', 'author']);

        return $this->successResponse(
            new BlogPostResource($post),
            'Blog post created successfully',
            201
        );
    }

    /**
     * Get single blog post
     */
    #[OA\Get(
        path: "/api/v1/blog/posts/{id}",
        summary: "Get blog post",
        tags: ["Blog"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Post retrieved successfully"),
            new OA\Response(response: 404, description: "Post not found"),
        ]
    )]
    public function showBlogPost(BlogPost $post): JsonResponse
    {
        // Increment view count
        $post->increment('views_count');
        $post->load(['category', 'author']);

        return $this->successResponse(
            new BlogPostResource($post),
            'Blog post retrieved successfully'
        );
    }

    /**
     * Update blog post (Admin only)
     */
    #[OA\Put(
        path: "/api/v1/blog/posts/{id}",
        summary: "Update blog post (Admin only)",
        tags: ["Blog"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Post updated successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Post not found"),
        ]
    )]
    public function updateBlogPost(UpdateBlogPostRequest $request, BlogPost $post): JsonResponse
    {
        $data = $request->only(['blog_category_id', 'title', 'content', 'excerpt', 'status', 'published_at', 'meta']);

        // Handle featured image
        // dd($request->hasFile('featured_image'));
        if ($request->hasFile('featured_image')) {
            // Delete old image
            if ($post->featured_image && Storage::disk('public')->exists($post->featured_image)) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $path = $request->file('featured_image')->store('blog', 'public');
            dd($path, 33);
            $data['featured_image'] = $path;
        }

        if($request->get('status') == 'published' && $post->published_at == null){
            $data['published_at'] = now();
        }
        
        $post->update($data);
        $post->load(['category', 'author']);

        return $this->successResponse(
            new BlogPostResource($post),
            'Blog post updated successfully'
        );
    }

    /**
     * Delete blog post (Admin only)
     */
    #[OA\Delete(
        path: "/api/v1/blog/posts/{id}",
        summary: "Delete blog post (Admin only)",
        tags: ["Blog"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Post deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function deleteBlogPost(BlogPost $post): JsonResponse
    {
        if ($post->featured_image && Storage::disk('public')->exists($post->featured_image)) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return $this->successResponse(null, 'Blog post deleted successfully');
    }

    /**
     * Get blog comments
     */
    #[OA\Get(
        path: "/api/v1/blog/posts/{postId}/comments",
        summary: "Get post comments",
        tags: ["Blog"],
        parameters: [
            new OA\Parameter(name: "postId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Comments retrieved successfully"),
        ]
    )]
    public function indexComments(BlogPost $post): JsonResponse
    {
        $comments = $post->comments()->approved()->latest()->paginate(20);

        return $this->paginatedResponse(
            $comments->through(fn($comment) => new BlogCommentResource($comment)),
            'Comments retrieved successfully'
        );
    }

    /**
     * Store a comment
     */
    #[OA\Post(
        path: "/api/v1/blog/posts/{postId}/comments",
        summary: "Add comment to post",
        tags: ["Blog"],
        parameters: [
            new OA\Parameter(name: "postId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["comment"],
                properties: [
                    new OA\Property(property: "comment", type: "string", example: "Great post!"),
                    new OA\Property(property: "name", type: "string", nullable: true),
                    new OA\Property(property: "email", type: "string", nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Comment created successfully"),
            new OA\Response(response: 404, description: "Post not found"),
        ]
    )]
    public function storeComment(StoreBlogCommentRequest $request, BlogPost $post): JsonResponse
    {
        $data = [
            'blog_post_id' => $post->id,
            'comment' => $request->comment,
        ];

        if (auth()->check()) {
            $data['user_id'] = auth()->id();
        } else {
            $data['name'] = $request->name;
            $data['email'] = $request->email;
        }

        $comment = BlogComment::create($data);
        $comment->load('user');

        return $this->successResponse(
            new BlogCommentResource($comment),
            'Comment created successfully. Awaiting moderation.',
            201
        );
    }

    /**
     * Delete comment (Admin or author only)
     */
    #[OA\Delete(
        path: "/api/v1/blog/comments/{id}",
        summary: "Delete comment",
        tags: ["Blog"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Comment deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function deleteComment(BlogComment $comment): JsonResponse
    {
        if (auth()->id() !== $comment->user_id && !auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $comment->delete();

        return $this->successResponse(null, 'Comment deleted successfully');
    }

    /**
     * Approve comment (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/blog/comments/{id}/approve",
        summary: "Approve comment (Admin only)",
        tags: ["Blog"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Comment approved successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function approveComment(BlogComment $comment): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $comment->update(['is_approved' => true]);

        return $this->successResponse(
            new BlogCommentResource($comment),
            'Comment approved successfully'
        );
    }
}
