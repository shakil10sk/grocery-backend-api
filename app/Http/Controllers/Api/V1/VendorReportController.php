<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\VendorReport;
use Modules\Products\Models\Order;
use Modules\Products\Models\OrderItem;
use Modules\Products\Models\Product;
use Modules\Products\Models\Cart;
use Modules\Products\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class VendorReportController extends BaseController
{
    /**
     * List vendor reports (paginated)
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Only vendors or admins
        if (!$user->isVendor() && !$user->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $query = VendorReport::query();

        if ($user->isVendor()) {
            $query->where('vendor_id', $user->id);
        } elseif ($request->has('vendor_id') && $user->isAdmin()) {
            $query->where('vendor_id', $request->vendor_id);
        }

        $reports = $query->orderBy('report_date', 'desc')->paginate(15);

        return $this->paginatedResponse($reports, 'Reports retrieved successfully');
    }

    /**
     * Show report for specific date (YYYY-MM-DD)
     */
    public function show(string $date): JsonResponse
    {
        $user = auth()->user();

        if (!$user->isVendor() && !$user->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $query = VendorReport::where('report_date', $date);
        if ($user->isVendor()) {
            $query->where('vendor_id', $user->id);
        }

        $report = $query->first();

        if (!$report) {
            return $this->errorResponse('Report not found', 404);
        }

        return $this->successResponse($report, 'Report retrieved');
    }

    /**
     * Generate report for a date (or today)
     */
    public function generate(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (!$user->isVendor() && !$user->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $date = $request->input('date', now()->toDateString());
        $vendorId = $request->input('vendor_id', $user->isAdmin() ? null : $user->id);

        if (!$vendorId) {
            return $this->errorResponse('vendor_id is required for admins', 422);
        }

        // aggregate data
        try {
            $start = $date . ' 00:00:00';
            $end = $date . ' 23:59:59';

            // Total products created / updated
            $totalProductsCreated = Product::where('vendor_id', $vendorId)
                ->whereDate('created_at', $date)
                ->count();

            $totalProductsUpdated = Product::where('vendor_id', $vendorId)
                ->whereDate('updated_at', $date)
                ->count();

            // Orders and revenue
            $ordersQuery = Order::where('vendor_id', $vendorId)->whereBetween('created_at', [$start, $end]);
            $totalOrders = $ordersQuery->count();
            $totalRevenue = $ordersQuery->sum('total');

            // Items sold
            $itemsSold = OrderItem::whereHas('order', function ($q) use ($vendorId, $start, $end) {
                $q->where('vendor_id', $vendorId)->whereBetween('created_at', [$start, $end]);
            })->sum('quantity');

            // Cart additions
            $cartAdditions = Cart::whereHas('product', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })->whereDate('created_at', $date)->count();

            // Best selling product
            $best = OrderItem::select('product_id', DB::raw('SUM(quantity) as qty'))
                ->whereHas('order', function ($q) use ($vendorId, $start, $end) {
                    $q->where('vendor_id', $vendorId)->whereBetween('created_at', [$start, $end]);
                })
                ->groupBy('product_id')
                ->orderByDesc('qty')
                ->first();

            $bestProductId = $best->product_id ?? null;
            $bestProductQty = $best->qty ?? 0;

            // Most added to cart
            $mostCart = Cart::select('product_id', DB::raw('COUNT(*) as cnt'))
                ->whereHas('product', function ($q) use ($vendorId) {
                    $q->where('vendor_id', $vendorId);
                })->whereDate('created_at', $date)
                ->groupBy('product_id')
                ->orderByDesc('cnt')
                ->first();

            $mostCartProductId = $mostCart->product_id ?? null;
            $mostCartCount = $mostCart->cnt ?? 0;

            // Reviews & rating
            $reviewsQuery = Review::whereHas('product', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })->whereDate('created_at', $date);

            $totalReviews = $reviewsQuery->count();
            $avgRating = $reviewsQuery->avg('rating') ?? 0;

            // Customers
            $uniqueBuyers = Order::where('vendor_id', $vendorId)
                ->whereBetween('created_at', [$start, $end])
                ->distinct('customer_id')
                ->count('customer_id');

            $newCustomers = User::whereDate('created_at', $date)
                ->whereHas('orders', function ($q) use ($vendorId, $start, $end) {
                    $q->where('vendor_id', $vendorId)->whereBetween('created_at', [$start, $end]);
                })->count();

            $returningCustomers = max(0, $uniqueBuyers - $newCustomers);

            // Build breakdowns (basic)
            $productBreakdown = OrderItem::select('product_id', DB::raw('SUM(quantity) as qty'), DB::raw('SUM(total_price) as revenue'))
                ->whereHas('order', function ($q) use ($vendorId, $start, $end) {
                    $q->where('vendor_id', $vendorId)->whereBetween('created_at', [$start, $end]);
                })
                ->groupBy('product_id')
                ->orderByDesc('qty')
                ->get()
                ->map(fn($r) => [
                    'product_id' => $r->product_id,
                    'quantity' => (int)$r->qty,
                    'revenue' => (float)$r->revenue,
                ]);

            // Save or update report
            $report = VendorReport::updateOrCreate(
                ['vendor_id' => $vendorId, 'report_date' => $date],
                [
                    'total_products_created' => $totalProductsCreated,
                    'total_products_updated' => $totalProductsUpdated,
                    'total_orders' => $totalOrders,
                    'total_revenue' => $totalRevenue,
                    'total_items_sold' => $itemsSold,
                    'total_cart_additions' => $cartAdditions,
                    'total_product_views' => 0,
                    'total_product_wishlists' => 0,
                    'best_selling_product_id' => $bestProductId,
                    'best_selling_product_quantity' => $bestProductQty,
                    'most_added_to_cart_product_id' => $mostCartProductId,
                    'most_added_to_cart_count' => $mostCartCount,
                    'total_unique_buyers' => $uniqueBuyers,
                    'new_customers' => $newCustomers,
                    'returning_customers' => $returningCustomers,
                    'average_order_value' => $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0,
                    'average_rating' => round($avgRating, 2),
                    'total_reviews_received' => $totalReviews,
                    'product_breakdown' => $productBreakdown,
                ]
            );

            return $this->successResponse($report, 'Report generated');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to generate report: ' . $e->getMessage(), 500);
        }
    }
}
