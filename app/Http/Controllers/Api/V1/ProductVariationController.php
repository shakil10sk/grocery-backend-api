<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use Modules\Products\Models\Product;
use Modules\Products\Models\ProductVariation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Product Variations", description: "Product variation management endpoints")]
class ProductVariationController extends BaseController
{
    /**
     * Store a new variation for a product
     */
    #[OA\Post(
        path: "/api/v1/products/{productId}/variations",
        summary: "Create product variation",
        tags: ["Product Variations"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "price", "stock_quantity"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "1kg"),
                    new OA\Property(property: "sku", type: "string", nullable: true),
                    new OA\Property(property: "price", type: "number", example: 29.99),
                    new OA\Property(property: "compare_at_price", type: "number", nullable: true),
                    new OA\Property(property: "stock_quantity", type: "integer", example: 50),
                    new OA\Property(property: "is_default", type: "boolean", example: false),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Variation created successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function store(Request $request, Product $product): JsonResponse
    {
        $user = auth()->user();

        // Only vendor can add variations to their products
        if ($user->isVendor() && $product->vendor_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:product_variations,sku',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0|gt:price',
            'stock_quantity' => 'required|integer|min:0',
            'is_default' => 'boolean',
        ]);

        // If this is set as default, unset others
        if ($request->is_default) {
            ProductVariation::where('product_id', $product->id)
                ->update(['is_default' => false]);
        }

        $variation = ProductVariation::create([
            'product_id' => $product->id,
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'compare_at_price' => $request->compare_at_price,
            'stock_quantity' => $request->stock_quantity,
            'is_default' => $request->is_default ?? false,
            'sort_order' => ProductVariation::where('product_id', $product->id)->max('sort_order') + 1,
        ]);

        return $this->successResponse($variation, 'Variation created successfully', 201);
    }

    /**
     * Update a variation
     */
    #[OA\Put(
        path: "/api/v1/products/{productId}/variations/{variationId}",
        summary: "Update product variation",
        tags: ["Product Variations"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "variationId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Variation updated successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Variation not found"),
        ]
    )]
    public function update(Request $request, Product $product, ProductVariation $variation): JsonResponse
    {
        $user = auth()->user();

        if ($user->isVendor() && $product->vendor_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if ($variation->product_id !== $product->id) {
            return $this->errorResponse('Variation not found', 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'sku' => 'nullable|string|max:100|unique:product_variations,sku,' . $variation->id,
            'price' => 'sometimes|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0|gt:price',
            'stock_quantity' => 'sometimes|integer|min:0',
            'is_default' => 'boolean',
        ]);

        // If this is set as default, unset others
        if ($request->is_default) {
            ProductVariation::where('product_id', $product->id)
                ->where('id', '!=', $variation->id)
                ->update(['is_default' => false]);
        }

        $variation->update($request->only([
            'name', 'sku', 'price', 'compare_at_price', 'stock_quantity', 'is_default'
        ]));

        return $this->successResponse($variation, 'Variation updated successfully');
    }

    /**
     * Delete a variation
     */
    #[OA\Delete(
        path: "/api/v1/products/{productId}/variations/{variationId}",
        summary: "Delete product variation",
        tags: ["Product Variations"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "variationId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Variation deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Variation not found"),
        ]
    )]
    public function destroy(Product $product, ProductVariation $variation): JsonResponse
    {
        $user = auth()->user();

        if ($user->isVendor() && $product->vendor_id !== $user->id) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if ($variation->product_id !== $product->id) {
            return $this->errorResponse('Variation not found', 404);
        }

        $variation->delete();

        return $this->successResponse(null, 'Variation deleted successfully');
    }
}
