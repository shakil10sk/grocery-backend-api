<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\VendorResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Vendors", description: "Vendor management endpoints")]
class VendorController extends BaseController
{
    /**
     * Display a listing of vendors
     */
    #[OA\Get(
        path: "/api/v1/vendors",
        summary: "List all vendors (Public)",
        tags: ["Vendors"],
        parameters: [
            new OA\Parameter(name: "status", in: "query", description: "Filter by status (active, inactive, pending)", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "verified", in: "query", description: "Filter by verification status (1 or 0)", required: false, schema: new OA\Schema(type: "boolean")),
            new OA\Parameter(name: "search", in: "query", description: "Search vendors by store name", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "page", in: "query", description: "Page number", required: false, schema: new OA\Schema(type: "integer")),
            new OA\Parameter(name: "limit", in: "query", description: "Items per page", required: false, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Vendors retrieved successfully"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = User::role('vendor')
            ->with('vendorProfile')
            ->whereHas('vendorProfile');

        // For public access, only show active and verified vendors
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            $query->where('status', 'active')
                ->whereHas('vendorProfile', function($q) {
                    $q->where('status', 'approved')
                      ->where('is_verified', true);
                });
        } else {
            // Admin can filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('verified')) {
                $query->whereHas('vendorProfile', function($q) use ($request) {
                    $q->where('is_verified', $request->boolean('verified'));
                });
            }
        }

        // Search by store name
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('vendorProfile', function($q) use ($search) {
                $q->where('store_name', 'like', "%{$search}%");
            });
        }

        $limit = $request->input('limit', 15);
        $vendors = $query->latest()->paginate($limit);

        return $this->paginatedResponse(
            $vendors->through(fn($vendor) => new VendorResource($vendor)),
            'Vendors retrieved successfully'
        );
    }

    /**
     * Display the specified vendor
     */
    #[OA\Get(
        path: "/api/v1/vendors/{id}",
        summary: "Get vendor details (Public)",
        tags: ["Vendors"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Vendor retrieved successfully"),
            new OA\Response(response: 404, description: "Vendor not found"),
        ]
    )]
    public function show(int $id): JsonResponse
    {
        $query = User::role('vendor')
            ->with('vendorProfile')
            ->whereHas('vendorProfile');

        // For public access, only show active and verified vendors
        if (!auth()->check() || !auth()->user()->isAdmin()) {
            $query->where('status', 'active')
                ->whereHas('vendorProfile', function($q) {
                    $q->where('status', 'approved')
                      ->where('is_verified', true);
                });
        }

        $vendor = $query->find($id);

        if (!$vendor) {
            return $this->errorResponse('Vendor not found', 404);
        }

        return $this->successResponse(
            new VendorResource($vendor),
            'Vendor retrieved successfully'
        );
    }

    /**
     * Get top vendors
     */
    public function top(): JsonResponse
    {
        $vendors = User::role('vendor')
            ->where('status', 'active')
            ->whereHas('vendorProfile', function($q) {
                $q->where('is_verified', true)
                  ->where('status', 'approved');
            })
            ->with(['vendorProfile', 'products' => function($q) {
                $q->approved()->with('reviews');
            }])
            ->get()
            ->map(function($vendor) {
                // Calculate average rating from all product reviews
                $allReviews = $vendor->products->flatMap->reviews;
                $averageRating = $allReviews->count() > 0 
                    ? round($allReviews->avg('rating'), 1) 
                    : 0;
                $totalReviews = $allReviews->count();
                
                $vendor->average_rating = $averageRating;
                $vendor->total_reviews = $totalReviews;
                return $vendor;
            })
            ->sortByDesc('average_rating')
            ->take(10)
            ->values();

        return $this->successResponse(
            VendorResource::collection($vendors),
            'Top vendors retrieved successfully'
        );
    }
}
