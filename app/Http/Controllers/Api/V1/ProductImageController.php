<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use Modules\Products\Models\Product;
use Modules\Products\Models\ProductImage;
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
            return $this->errorResponse('Unauthorized. You can only upload images for your own products.', 403);
        }

        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
                'is_primary' => 'boolean',
            ]);

            // Check if product exists and belongs to vendor
            if (!$product || ($user->isVendor() && $product->vendor_id !== $user->id)) {
                return $this->errorResponse('Product not found or access denied', 404);
            }

            // Limit images per product
            $imageCount = ProductImage::where('product_id', $product->id)->count();
            if ($imageCount >= 10) {
                return $this->errorResponse('Maximum 10 images allowed per product', 422);
            }

            // If this is set as primary, unset others
            if ($request->boolean('is_primary', false)) {
                ProductImage::where('product_id', $product->id)
                    ->update(['is_primary' => false]);
            } else {
                // If no images exist yet, make this primary
                if ($imageCount === 0) {
                    $request->merge(['is_primary' => true]);
                }
            }

            $file = $request->file('image');
            
            // Verify file is actually an image
            if (!getimagesize($file)) {
                return $this->errorResponse('Uploaded file is not a valid image', 422);
            }

            $path = $file->store('products', 'public');

            if (!$path) {
                return $this->errorResponse('Failed to store image', 500);
            }

            $maxSort = ProductImage::where('product_id', $product->id)->max('sort_order') ?? -1;

            $image = ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $path,
                'is_primary' => $request->boolean('is_primary', false),
                'sort_order' => $maxSort + 1,
            ]);

            return $this->successResponse([
                'id' => $image->id,
                'product_id' => $product->id,
                'image_path' => asset('storage/' . $path),
                'is_primary' => $image->is_primary,
                'sort_order' => $image->sort_order,
            ], 'Image uploaded successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Image upload failed: ' . $e->getMessage(), 500);
        }
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
            return $this->errorResponse('Unauthorized. You can only update images for your own products.', 403);
        }

        if ($image->product_id !== $product->id) {
            return $this->errorResponse('Image does not belong to this product', 404);
        }

        try {
            // Unset all primary images for this product
            ProductImage::where('product_id', $product->id)
                ->where('id', '!=', $image->id)
                ->update(['is_primary' => false]);

            // Set this as primary
            $image->update(['is_primary' => true]);

            return $this->successResponse(
                ['id' => $image->id, 'is_primary' => true],
                'Primary image set successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to set primary image: ' . $e->getMessage(), 500);
        }
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
            return $this->errorResponse('Unauthorized. You can only delete images from your own products.', 403);
        }

        if ($image->product_id !== $product->id) {
            return $this->errorResponse('Image does not belong to this product', 404);
        }

        try {
            // Check if image is primary
            $wasPrimary = $image->is_primary;

            // Delete file from storage
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }

            // Delete database record
            $image->delete();

            // If deleted image was primary, set another as primary
            if ($wasPrimary) {
                $nextImage = ProductImage::where('product_id', $product->id)
                    ->orderBy('sort_order')
                    ->first();

                if ($nextImage) {
                    $nextImage->update(['is_primary' => true]);
                }
            }

            return $this->successResponse(null, 'Image deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete image: ' . $e->getMessage(), 500);
        }
    }
}
