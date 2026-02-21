<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use Modules\Products\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Products", description: "Product management endpoints")]
class ProductController extends BaseController
{
    /**
     * Display a listing of products
     */
    #[OA\Get(
        path: "/api/v1/products",
        summary: "List products",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "vendor_id", in: "query", description: "Filter by vendor ID", required: false, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "category_id", in: "query", description: "Filter by category ID", required: false, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "status", in: "query", description: "Filter by status", required: false, schema: new OA\Schema(type: "string", enum: ["pending", "approved", "rejected"])),
            new OA\Parameter(name: "search", in: "query", description: "Search products", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "page", in: "query", description: "Page number", required: false, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Products retrieved successfully"),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        $query = Product::with(['category', 'vendor', 'images', 'variations']);

        // If user is authenticated, apply role-based filtering
        if ($user) {
            // Vendors see only their products
            if ($user->isVendor()) {
                $query->where('vendor_id', $user->id);
            } elseif ($user->isCustomer()) {
                // Customers see only approved and active products
                $query->approved();
            }
            // Admins see all products (no filter)
        } else {
            // Public/unauthenticated users see only approved and active products
            $query->where('status', 'approved')
                  ->where('is_active', true);
        }

        // Filters
        if ($request->has('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        if ($request->boolean('featured')) {
            $query->featured();
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('status') && ($user && ($user->isAdmin() || $user->isVendor()))) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        $limit = $request->input('limit', 15);
        $products = $query->latest()->paginate($limit);

        return $this->paginatedResponse(
            $products->through(fn($product) => new ProductResource($product)),
            'Products retrieved successfully'
        );
    }

    /**
     * Store a newly created product
     */
    #[OA\Post(
        path: "/api/v1/products",
        summary: "Create product (Vendor only)",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["category_id", "name", "price", "stock_quantity"],
                properties: [
                    new OA\Property(property: "category_id", type: "integer", example: 1),
                    new OA\Property(property: "name", type: "string", example: "Organic Apples"),
                    new OA\Property(property: "description", type: "string", nullable: true),
                    new OA\Property(property: "short_description", type: "string", nullable: true),
                    new OA\Property(property: "sku", type: "string", nullable: true, example: "APP-001"),
                    new OA\Property(property: "price", type: "number", example: 29.99),
                    new OA\Property(property: "compare_at_price", type: "number", nullable: true, example: 39.99),
                    new OA\Property(property: "stock_quantity", type: "integer", example: 100),
                    new OA\Property(property: "track_stock", type: "boolean", example: true),
                    new OA\Property(property: "weight", type: "number", nullable: true, example: 1.5),
                    new OA\Property(property: "unit", type: "string", enum: ["kg", "g", "lb", "oz", "piece"], example: "kg"),
                    new OA\Property(property: "is_featured", type: "boolean", example: false),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Product created successfully"),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 403, description: "Forbidden - Vendor only"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = Product::create([
            'vendor_id' => auth()->id(),
            'category_id' => $request->category_id,
            'name' => $request->name,
            'slug' => Product::generateSlug($request->name),
            'description' => $request->description,
            'short_description' => $request->short_description,
            'video_url' => $request->video_url,
            'sku' => $request->sku,
            'price' => $request->price,
            'compare_at_price' => $request->compare_at_price,
            'stock_quantity' => $request->stock_quantity,
            'track_stock' => $request->track_stock ?? true,
            'weight' => $request->weight,
            'unit' => $request->unit ?? 'piece',
            'is_featured' => $request->is_featured ?? false,
            'status' => 'pending', // Requires admin approval
            'is_active' => false, // Inactive until approved
            'meta' => $request->meta,
        ]);

        $product->load(['category', 'vendor', 'images', 'variations']);

        return $this->successResponse(
            new ProductResource($product),
            'Product created successfully. Waiting for admin approval.',
            201
        );
    }

    /**
     * Display the specified product
     */
    #[OA\Get(
        path: "/api/v1/products/{id}",
        summary: "Get product details",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Product retrieved successfully"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function show(Product $product): JsonResponse
    {
        $user = auth()->user();

        // If user is authenticated, apply role-based access control
        if ($user) {
            // Vendors can only see their own products
            if ($user->isVendor() && $product->vendor_id !== $user->id) {
                return $this->errorResponse('Product not found', 404);
            }

            // Customers can only see approved products
            if ($user->isCustomer() && ($product->status !== 'approved' || !$product->is_active)) {
                return $this->errorResponse('Product not found', 404);
            }
        } else {
            // Public/unauthenticated users can only see approved and active products
            if ($product->status !== 'approved' || !$product->is_active) {
                return $this->errorResponse('Product not found', 404);
            }
        }

        $product->load(['category', 'vendor', 'images', 'variations', 'reviews']);

        return $this->successResponse(
            new ProductResource($product),
            'Product retrieved successfully'
        );
    }

    /**
     * Update the specified product
     */
    #[OA\Put(
        path: "/api/v1/products/{id}",
        summary: "Update product",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Product updated successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $updateData = $request->only([
            'category_id',
            'name',
            'description',
            'short_description',
            'sku',
            'price',
            'compare_at_price',
            'stock_quantity',
            'track_stock',
            'weight',
            'unit',
            'is_featured',
        ]);

        // If name changed, regenerate slug
        if (isset($updateData['name']) && $updateData['name'] !== $product->name) {
            $updateData['slug'] = Product::generateSlug($updateData['name']);
        }

        // If vendor updates, reset to pending for admin approval
        if (auth()->user()->isVendor() && $product->status === 'approved') {
            $updateData['status'] = 'pending';
            $updateData['is_active'] = false;
        }

        $product->update($updateData);
        $product->load(['category', 'vendor', 'images', 'variations']);

        return $this->successResponse(
            new ProductResource($product),
            'Product updated successfully'
        );
    }

    /**
     * Remove the specified product
     */
    #[OA\Delete(
        path: "/api/v1/products/{id}",
        summary: "Delete product",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Product deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function destroy($id): JsonResponse
    {
        try{
            $user = auth()->user();
            if(empty($user)){
                return $this->errorResponse('Unauthorized', 403);
            }
            $product = Product::findOrFail($id);
            if(empty($product)) {
                return $this->errorResponse('Product not found.', 400);
            }

            // Vendors and admin can only delete their own products
            if (($user->isVendor() && $product->vendor_id !== $user->id) || !$user->isAdmin()) {
                return $this->errorResponse('Unauthorized', 403);
            }

            $product->delete();

            return $this->successResponse(null, 'Product deleted successfully');
        }catch(Exception $e){
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    /**
     * Approve product (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/products/{id}/approve",
        summary: "Approve product (Admin only)",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Product approved successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function approve($id): JsonResponse
    {
        $product = Product::findOrFail($id);

        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $product->update([
            'status' => 'approved',
            'is_active' => true,
        ]);

        $product->load(['category', 'vendor', 'images', 'variations']);

        return $this->successResponse(
            new ProductResource($product),
            'Product approved successfully'
        );
    }

    /**
     * Reject product (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/products/{id}/reject",
        summary: "Reject product (Admin only)",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["rejection_reason"],
                properties: [
                    new OA\Property(property: "rejection_reason", type: "string", example: "Product does not meet quality standards"),
                ]
            )
        ),
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Product rejected successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function reject(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized. Admin access required.', 403);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $product->update([
            'status' => 'rejected',
            'is_active' => false,
            'rejection_reason' => $request->rejection_reason,
        ]);

        $product->load(['category', 'vendor', 'images', 'variations']);

        return $this->successResponse(
            new ProductResource($product),
            'Product rejected successfully'
        );
    }

    /**
     * Update stock quantity
     */
    #[OA\Post(
        path: "/api/v1/products/{id}/stock",
        summary: "Update product stock",
        tags: ["Products"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["stock_quantity"],
                properties: [
                    new OA\Property(property: "stock_quantity", type: "integer", example: 150),
                ]
            )
        ),
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Stock updated successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function updateStock(Request $request, Product $product): JsonResponse
    {
        $user = auth()->user();

        // Vendors can only update their own products
        if ($user->isVendor() && $product->vendor_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        $product->update([
            'stock_quantity' => $request->stock_quantity,
        ]);

        return $this->successResponse(
            new ProductResource($product->load(['category', 'vendor', 'images', 'variations'])),
            'Stock updated successfully'
        );
    }
}
