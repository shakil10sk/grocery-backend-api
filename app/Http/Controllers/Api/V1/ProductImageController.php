<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Product Images", description: "Product image management endpoints")]
class ProductImageController extends BaseController
{
    /**
     * Upload product image
     */
    #[OA\Post(
        path: "/api/v1/products/{productId}/images",
        summary: "Upload product image",
        tags: ["Product Images"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["image"],
                    properties: [
                        new OA\Property(property: "image", type: "string", format: "binary"),
                        new OA\Property(property: "is_primary", type: "boolean", example: false),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Image uploaded successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function store(Request $request, Product $product): JsonResponse
    {
        $user = auth()->user();

        // Only vendor can add images to their products
        if ($user->isVendor() && $product->vendor_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'is_primary' => 'boolean',
        ]);

        // If this is set as primary, unset others
        if ($request->is_primary) {
            ProductImage::where('product_id', $product->id)
                ->update(['is_primary' => false]);
        }

        $path = $request->file('image')->store('products', 'public');

        $image = ProductImage::create([
            'product_id' => $product->id,
            'image_path' => $path,
            'is_primary' => $request->is_primary ?? false,
            'sort_order' => ProductImage::where('product_id', $product->id)->max('sort_order') + 1,
        ]);

        return $this->successResponse([
            'id' => $image->id,
            'image_url' => asset('storage/' . $path),
            'is_primary' => $image->is_primary,
        ], 'Image uploaded successfully', 201);
    }

    /**
     * Set primary image
     */
    #[OA\Post(
        path: "/api/v1/products/{productId}/images/{imageId}/set-primary",
        summary: "Set primary product image",
        tags: ["Product Images"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "imageId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Primary image set successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Image not found"),
        ]
    )]
    public function setPrimary(Product $product, ProductImage $image): JsonResponse
    {
        $user = auth()->user();

        if ($user->isVendor() && $product->vendor_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if ($image->product_id !== $product->id) {
            return $this->errorResponse('Image not found', 404);
        }

        // Unset all primary images
        ProductImage::where('product_id', $product->id)
            ->update(['is_primary' => false]);

        // Set this as primary
        $image->update(['is_primary' => true]);

        return $this->successResponse(null, 'Primary image set successfully');
    }

    /**
     * Delete product image
     */
    #[OA\Delete(
        path: "/api/v1/products/{productId}/images/{imageId}",
        summary: "Delete product image",
        tags: ["Product Images"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "imageId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Image deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Image not found"),
        ]
    )]
    public function destroy(Product $product, ProductImage $image): JsonResponse
    {
        $user = auth()->user();

        if ($user->isVendor() && $product->vendor_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if ($image->product_id !== $product->id) {
            return $this->errorResponse('Image not found', 404);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($image->image_path)) {
            Storage::disk('public')->delete($image->image_path);
        }

        $image->delete();

        return $this->successResponse(null, 'Image deleted successfully');
    }
}
