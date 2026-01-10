<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Cart", description: "Shopping cart management endpoints")]
class CartController extends BaseController
{
    /**
     * Get cart items
     */
    #[OA\Get(
        path: "/api/v1/cart",
        summary: "Get cart items",
        tags: ["Cart"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Cart retrieved successfully"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $sessionId = $request->session()->getId();

        $query = Cart::with(['product.category', 'product.images', 'variation'])
            ->where(function($q) use ($user, $sessionId) {
                if ($user) {
                    $q->where('user_id', $user->id);
                } else {
                    $q->where('session_id', $sessionId);
                }
            });

        $cartItems = $query->get();

        $total = $cartItems->sum(fn($item) => $item->price * $item->quantity);

        return $this->successResponse([
            'items' => CartResource::collection($cartItems),
            'total' => $total,
            'items_count' => $cartItems->sum('quantity'),
        ], 'Cart retrieved successfully');
    }

    /**
     * Add item to cart
     */
    #[OA\Post(
        path: "/api/v1/cart",
        summary: "Add item to cart",
        tags: ["Cart"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["product_id", "quantity"],
                properties: [
                    new OA\Property(property: "product_id", type: "integer", example: 1),
                    new OA\Property(property: "product_variation_id", type: "integer", nullable: true, example: 1),
                    new OA\Property(property: "quantity", type: "integer", example: 2),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Item added to cart"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variation_id' => 'nullable|exists:product_variations,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is available
        if ($product->status !== 'approved' || !$product->is_active) {
            return $this->errorResponse('Product is not available', 422);
        }

        // Check stock
        if ($product->track_stock) {
            $availableStock = $request->product_variation_id 
                ? $product->variations()->find($request->product_variation_id)?->stock_quantity ?? 0
                : $product->stock_quantity;

            if ($availableStock < $request->quantity) {
                return $this->errorResponse('Insufficient stock', 422);
            }
        }

        $user = auth()->user();
        $sessionId = $user ? null : $request->session()->getId();

        // Get price
        $price = $request->product_variation_id
            ? $product->variations()->find($request->product_variation_id)->price
            : $product->price;

        // Check if item already exists
        $existingItem = Cart::where('product_id', $request->product_id)
            ->where('product_variation_id', $request->product_variation_id)
            ->where(function($q) use ($user, $sessionId) {
                if ($user) {
                    $q->where('user_id', $user->id);
                } else {
                    $q->where('session_id', $sessionId);
                }
            })
            ->first();

        if ($existingItem) {
            $existingItem->update([
                'quantity' => $existingItem->quantity + $request->quantity,
                'price' => $price, // Update price in case it changed
            ]);
            $cartItem = $existingItem;
        } else {
            $cartItem = Cart::create([
                'user_id' => $user?->id,
                'session_id' => $sessionId,
                'product_id' => $request->product_id,
                'product_variation_id' => $request->product_variation_id,
                'quantity' => $request->quantity,
                'price' => $price,
            ]);
        }

        return $this->successResponse(
            new CartResource($cartItem->load(['product', 'variation'])),
            'Item added to cart',
            201
        );
    }

    /**
     * Update cart item
     */
    #[OA\Put(
        path: "/api/v1/cart/{id}",
        summary: "Update cart item",
        tags: ["Cart"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["quantity"],
                properties: [
                    new OA\Property(property: "quantity", type: "integer", example: 3),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Cart item updated"),
            new OA\Response(response: 404, description: "Cart item not found"),
        ]
    )]
    public function update(Request $request, Cart $cart): JsonResponse
    {
        $user = auth()->user();
        $sessionId = $request->session()->getId();

        // Verify ownership
        if (($user && $cart->user_id !== $user->id) || (!$user && $cart->session_id !== $sessionId)) {
            return $this->errorResponse('Cart item not found', 404);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check stock
        $product = $cart->product;
        if ($product->track_stock) {
            $availableStock = $cart->product_variation_id
                ? $product->variations()->find($cart->product_variation_id)?->stock_quantity ?? 0
                : $product->stock_quantity;

            if ($availableStock < $request->quantity) {
                return $this->errorResponse('Insufficient stock', 422);
            }
        }

        $cart->update(['quantity' => $request->quantity]);

        return $this->successResponse(
            new CartResource($cart->load(['product', 'variation'])),
            'Cart item updated'
        );
    }

    /**
     * Remove item from cart
     */
    #[OA\Delete(
        path: "/api/v1/cart/{id}",
        summary: "Remove item from cart",
        tags: ["Cart"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Item removed from cart"),
            new OA\Response(response: 404, description: "Cart item not found"),
        ]
    )]
    public function destroy(Request $request, Cart $cart): JsonResponse
    {
        $user = auth()->user();
        $sessionId = $request->session()->getId();

        // Verify ownership
        if (($user && $cart->user_id !== $user->id) || (!$user && $cart->session_id !== $sessionId)) {
            return $this->errorResponse('Cart item not found', 404);
        }

        $cart->delete();

        return $this->successResponse(null, 'Item removed from cart');
    }

    /**
     * Clear cart
     */
    #[OA\Delete(
        path: "/api/v1/cart",
        summary: "Clear cart",
        tags: ["Cart"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Cart cleared"),
        ]
    )]
    public function clear(Request $request): JsonResponse
    {
        $user = auth()->user();
        $sessionId = $request->session()->getId();

        Cart::where(function($q) use ($user, $sessionId) {
            if ($user) {
                $q->where('user_id', $user->id);
            } else {
                $q->where('session_id', $sessionId);
            }
        })->delete();

        return $this->successResponse(null, 'Cart cleared');
    }

    /**
     * Merge guest cart with user cart on login
     */
    public function merge(Request $request): JsonResponse
    {
        $user = auth()->user();
        $sessionId = $request->session()->getId();

        // Get guest cart items
        $guestItems = Cart::where('session_id', $sessionId)->get();

        foreach ($guestItems as $guestItem) {
            // Check if user already has this item
            $existingItem = Cart::where('user_id', $user->id)
                ->where('product_id', $guestItem->product_id)
                ->where('product_variation_id', $guestItem->product_variation_id)
                ->first();

            if ($existingItem) {
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $guestItem->quantity,
                ]);
                $guestItem->delete();
            } else {
                $guestItem->update([
                    'user_id' => $user->id,
                    'session_id' => null,
                ]);
            }
        }

        return $this->successResponse(null, 'Cart merged successfully');
    }
}
