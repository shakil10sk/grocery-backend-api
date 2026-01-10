<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\BlogCategoryResource;
use App\Models\BlogCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Blog Categories", description: "Blog category management")]
class BlogCategoryController extends BaseController
{
    /**
     * Get blog categories
     */
    #[OA\Get(
        path: "/api/v1/blog/categories",
        summary: "List blog categories",
        tags: ["Blog Categories"],
        responses: [
            new OA\Response(response: 200, description: "Categories retrieved successfully"),
        ]
    )]
    public function index(): JsonResponse
    {
        $categories = BlogCategory::active()->orderBy('sort_order')->get();

        return $this->successResponse(
            BlogCategoryResource::collection($categories),
            'Blog categories retrieved successfully'
        );
    }

    /**
     * Store a new category (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/blog/categories",
        summary: "Create blog category (Admin only)",
        tags: ["Blog Categories"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name"],
                properties: [
                    new OA\Property(property: "name", type: "string"),
                    new OA\Property(property: "description", type: "string", nullable: true),
                    new OA\Property(property: "image", type: "string", nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Category created successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
        ]);

        $category = BlogCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'image' => $request->image,
            'sort_order' => 0,
            'is_active' => true,
        ]);

        return $this->successResponse(
            new BlogCategoryResource($category),
            'Blog category created successfully',
            201
        );
    }

    /**
     * Update category (Admin only)
     */
    #[OA\Put(
        path: "/api/v1/blog/categories/{id}",
        summary: "Update blog category (Admin only)",
        tags: ["Blog Categories"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Category updated successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Category not found"),
        ]
    )]
    public function update(Request $request, BlogCategory $category): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|url',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        $category->update($request->only(['name', 'description', 'image', 'is_active', 'sort_order']));

        return $this->successResponse(
            new BlogCategoryResource($category),
            'Blog category updated successfully'
        );
    }

    /**
     * Delete category (Admin only)
     */
    #[OA\Delete(
        path: "/api/v1/blog/categories/{id}",
        summary: "Delete blog category (Admin only)",
        tags: ["Blog Categories"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Category deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Category not found"),
        ]
    )]
    public function destroy(BlogCategory $category): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $category->delete();

        return $this->successResponse(null, 'Blog category deleted successfully');
    }
}
