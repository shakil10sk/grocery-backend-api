<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use Modules\Products\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Categories", description: "Category management endpoints")]
class CategoryController extends BaseController
{
    /**
     * Display a listing of categories
     */
    #[OA\Get(
        path: "/api/v1/categories",
        summary: "List categories",
        tags: ["Categories"],
        parameters: [
            new OA\Parameter(name: "parent_id", in: "query", description: "Filter by parent ID", required: false, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "active_only", in: "query", description: "Show only active categories", required: false, schema: new OA\Schema(type: "boolean")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Categories retrieved successfully"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = Category::with(['parent', 'children']);

        if ($request->has('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        } else {
            $query->root(); // Show root categories by default
        }

        if ($request->boolean('active_only') || auth()->guest() || auth()->user()->isCustomer()) {
            $query->active();
        }

        $categories = $query->orderBy('sort_order')->get();

        return $this->successResponse(
            CategoryResource::collection($categories),
            'Categories retrieved successfully'
        );
    }

    /**
     * Store a newly created category (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/categories",
        summary: "Create category (Admin only)",
        tags: ["Categories"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 201, description: "Category created successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
        ]
    )]
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $category = Category::create([
            'parent_id' => $request->parent_id,
            'name' => $request->name,
            'slug' => Category::generateSlug($request->name),
            'description' => $request->description,
            'sort_order' => $request->sort_order ?? 0,
            'is_active' => $request->is_active ? 1 : 0,
        ]);

        return $this->successResponse(
            new CategoryResource($category),
            'Category created successfully'
        );
    }

    /**
     * Display the specified category
     */
    #[OA\Get(
        path: "/api/v1/categories/{id}",
        summary: "Get category details",
        tags: ["Categories"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Category retrieved successfully"),
            new OA\Response(response: 404, description: "Category not found"),
        ]
    )]
    public function show(Category $category): JsonResponse
    {
        $category->load(['parent', 'children', 'products']);

        return $this->successResponse(
            new CategoryResource($category),
            'Category retrieved successfully'
        );
    }

    /**
     * Update the specified category (Admin only)
     */
    #[OA\Put(
        path: "/api/v1/categories/{id}",
        summary: "Update category (Admin only)",
        tags: ["Categories"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Category updated successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
        ]
    )]
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $updateData = $request->only([
            'parent_id', 'name', 'description', 'sort_order', 'is_active'
        ]);

        if (isset($updateData['name']) && $updateData['name'] !== $category->name) {
            $updateData['slug'] = Category::generateSlug($updateData['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
            $path = $request->file('image')->store('categories', 'public');
            $updateData['image'] = $path;
        } elseif ($request->has('image') && $request->image === null) {
            // Allow removing image by sending null
            if ($category->image && Storage::disk('public')->exists($category->image)) {
                Storage::disk('public')->delete($category->image);
            }
            $updateData['image'] = null;
        }

        $category->update($updateData);
        $category->load(['parent', 'children']);

        return $this->successResponse(
            new CategoryResource($category),
            'Category updated successfully'
        );
    }

    /**
     * Remove the specified category (Admin only)
     */
    #[OA\Delete(
        path: "/api/v1/categories/{id}",
        summary: "Delete category (Admin only)",
        tags: ["Categories"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Category deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
        ]
    )]
    public function destroy(Category $category): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        // Check if category has products
        if ($category->products()->count() > 0) {
            return $this->errorResponse('Cannot delete category with existing products.', 422);
        }

        // Delete image if exists
        if ($category->image && Storage::disk('public')->exists($category->image)) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();

        return $this->successResponse(null, 'Category deleted successfully');
    }

    /**
     * Toggle category status (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/categories/{id}/toggle-status",
        summary: "Toggle category status (Admin only)",
        tags: ["Categories"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Status updated successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
        ]
    )]
    public function toggleStatus(Category $category): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $category->update(['is_active' => !$category->is_active]);

        return $this->successResponse(
            new CategoryResource($category->load(['parent', 'children'])),
            'Status updated successfully'
        );
    }
}
