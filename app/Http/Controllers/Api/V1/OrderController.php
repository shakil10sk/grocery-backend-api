<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Orders", description: "Order management endpoints")]
class OrderController extends BaseController
{
    /**
     * Display a listing of orders
     */
    #[OA\Get(
        path: "/api/v1/orders",
        summary: "List orders",
        tags: ["Orders"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "status", in: "query", description: "Filter by status", required: false, schema: new OA\Schema(type: "string", enum: ["pending", "processing", "on_the_way", "delivered", "cancelled"])),
            new OA\Parameter(name: "page", in: "query", description: "Page number", required: false, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Orders retrieved successfully"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        $query = Order::with(['customer', 'vendor', 'address', 'items']);

        // Role-based filtering
        if ($user->isCustomer()) {
            $query->forCustomer($user->id);
        } elseif ($user->isVendor()) {
            $query->forVendor($user->id);
        } elseif ($user->isDeliveryBoy()) {
            $query->where('delivery_boy_id', $user->id);
        }
        // Admin sees all

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(15);

        return $this->paginatedResponse(
            $orders->through(fn($order) => new OrderResource($order)),
            'Orders retrieved successfully'
        );
    }

    /**
     * Store a newly created order
     */
    #[OA\Post(
        path: "/api/v1/orders",
        summary: "Create order from cart",
        tags: ["Orders"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["address_id", "payment_method"],
                properties: [
                    new OA\Property(property: "address_id", type: "integer", example: 1),
                    new OA\Property(property: "payment_method", type: "string", enum: ["stripe", "paypal", "razorpay", "cash_on_delivery"], example: "stripe"),
                    new OA\Property(property: "notes", type: "string", nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Order created successfully"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $user = auth()->user();
        $address = Address::findOrFail($request->address_id);

        // Verify address ownership
        if ($address->user_id !== $user->id) {
            return $this->errorResponse('Invalid address', 422);
        }

        // Get cart items
        $cartItems = Cart::with(['product', 'variation'])
            ->where('user_id', $user->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return $this->errorResponse('Cart is empty', 422);
        }

        // Group by vendor for order splitting
        $ordersByVendor = [];

        DB::beginTransaction();
        try {
            foreach ($cartItems->groupBy('product.vendor_id') as $vendorId => $vendorCartItems) {
                $subtotal = $vendorCartItems->sum(fn($item) => $item->price * $item->quantity);
                $tax = $subtotal * 0.10; // 10% tax (configurable)
                $deliveryFee = 50.00; // Fixed delivery fee (configurable)
                $total = $subtotal + $tax + $deliveryFee;

                $order = Order::create([
                    'order_number' => Order::generateOrderNumber(),
                    'customer_id' => $user->id,
                    'vendor_id' => $vendorId,
                    'address_id' => $address->id,
                    'status' => 'pending',
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'delivery_fee' => $deliveryFee,
                    'discount' => 0,
                    'total' => $total,
                    'payment_method' => $request->payment_method,
                    'payment_status' => $request->payment_method === 'cash_on_delivery' ? 'pending' : 'pending',
                    'notes' => $request->notes,
                ]);

                // Create order items
                foreach ($vendorCartItems as $cartItem) {
                    $product = $cartItem->product;
                    $variation = $cartItem->variation;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_variation_id' => $variation?->id,
                        'product_name' => $product->name . ($variation ? ' - ' . $variation->name : ''),
                        'product_sku' => $variation?->sku ?? $product->sku,
                        'quantity' => $cartItem->quantity,
                        'unit_price' => $cartItem->price,
                        'total_price' => $cartItem->price * $cartItem->quantity,
                    ]);

                    // Update stock
                    if ($product->track_stock) {
                        if ($variation) {
                            $variation->decrement('stock_quantity', $cartItem->quantity);
                        } else {
                            $product->decrement('stock_quantity', $cartItem->quantity);
                        }
                    }
                }

                // Delete cart items for this vendor
                Cart::whereIn('id', $vendorCartItems->pluck('id'))->delete();

                $ordersByVendor[] = $order;
            }

            DB::commit();

            return $this->successResponse(
                OrderResource::collection(collect($ordersByVendor)->load(['customer', 'vendor', 'address', 'items'])),
                'Order(s) created successfully',
                201
            );
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified order
     */
    #[OA\Get(
        path: "/api/v1/orders/{id}",
        summary: "Get order details",
        tags: ["Orders"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Order retrieved successfully"),
            new OA\Response(response: 404, description: "Order not found"),
        ]
    )]
    public function show(Order $order): JsonResponse
    {
        $user = auth()->user();

        // Verify access
        if ($user->isCustomer() && $order->customer_id !== $user->id) {
            return $this->errorResponse('Order not found', 404);
        }
        if ($user->isVendor() && $order->vendor_id !== $user->id) {
            return $this->errorResponse('Order not found', 404);
        }
        if ($user->isDeliveryBoy() && $order->delivery_boy_id !== $user->id) {
            return $this->errorResponse('Order not found', 404);
        }

        $order->load(['customer', 'vendor', 'address', 'items', 'payments']);

        return $this->successResponse(
            new OrderResource($order),
            'Order retrieved successfully'
        );
    }

    /**
     * Update order status
     */
    #[OA\Post(
        path: "/api/v1/orders/{id}/status",
        summary: "Update order status",
        tags: ["Orders"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["status"],
                properties: [
                    new OA\Property(property: "status", type: "string", enum: ["pending", "processing", "on_the_way", "delivered", "cancelled"], example: "processing"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Status updated successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $user = auth()->user();
        $request->validate([
            'status' => 'required|in:pending,processing,on_the_way,delivered,cancelled',
        ]);

        // Role-based status updates
        if ($user->isVendor()) {
            if ($order->vendor_id !== $user->id) {
                return $this->errorResponse('Unauthorized', 403);
            }
            // Vendor can: pending -> processing
            if ($order->status === 'pending' && $request->status === 'processing') {
                $order->updateStatus($request->status);
            } else {
                return $this->errorResponse('Invalid status transition', 422);
            }
        } elseif ($user->isDeliveryBoy()) {
            if ($order->delivery_boy_id !== $user->id) {
                return $this->errorResponse('Unauthorized', 403);
            }
            // Delivery can: on_the_way -> delivered
            if ($order->status === 'on_the_way' && $request->status === 'delivered') {
                $order->updateStatus($request->status);
            } else {
                return $this->errorResponse('Invalid status transition', 422);
            }
        } elseif ($user->isAdmin()) {
            // Admin can do any status change
            $order->updateStatus($request->status);
            
            // Assign delivery boy if status is on_the_way
            if ($request->status === 'on_the_way' && $request->has('delivery_boy_id')) {
                $order->update(['delivery_boy_id' => $request->delivery_boy_id]);
            }
        } else {
            return $this->errorResponse('Unauthorized', 403);
        }

        $order->load(['customer', 'vendor', 'address', 'items']);

        return $this->successResponse(
            new OrderResource($order),
            'Status updated successfully'
        );
    }

    /**
     * Cancel order
     */
    #[OA\Post(
        path: "/api/v1/orders/{id}/cancel",
        summary: "Cancel order",
        tags: ["Orders"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Order cancelled successfully"),
            new OA\Response(response: 422, description: "Order cannot be cancelled"),
        ]
    )]
    public function cancel(Order $order): JsonResponse
    {
        $user = auth()->user();

        // Only customer or admin can cancel
        if (!$user->isAdmin() && ($order->customer_id !== $user->id)) {
            return $this->errorResponse('Unauthorized', 403);
        }

        if (!$order->canBeCancelled()) {
            return $this->errorResponse('Order cannot be cancelled at this stage', 422);
        }

        $order->updateStatus('cancelled');

        // Restore stock
        foreach ($order->items as $item) {
            $product = Product::find($item->product_id);
            if ($product && $product->track_stock) {
                if ($item->product_variation_id) {
                    $variation = $product->variations()->find($item->product_variation_id);
                    if ($variation) {
                        $variation->increment('stock_quantity', $item->quantity);
                    }
                } else {
                    $product->increment('stock_quantity', $item->quantity);
                }
            }
        }

        return $this->successResponse(
            new OrderResource($order->load(['customer', 'vendor', 'address', 'items'])),
            'Order cancelled successfully'
        );
    }
}
