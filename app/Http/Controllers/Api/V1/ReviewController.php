<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use Modules\Products\Models\Product;
use Modules\Products\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Reviews", description: "Product review management endpoints")]
class ReviewController extends BaseController
{
    /**
     * Get product reviews
     */
    #[OA\Get(
        path: "/api/v1/products/{productId}/reviews",
        summary: "Get product reviews",
        tags: ["Reviews"],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Reviews retrieved successfully"),
        ]
    )]
    public function index(Product $product): JsonResponse
    {
        $reviews = $product->reviews()->approved()->latest()->paginate(10);

        return $this->paginatedResponse(
            $reviews->through(fn($review) => new ReviewResource($review)),
            'Reviews retrieved successfully'
        );
    }

    /**
     * List all reviews (admin/vendor view)
     */
    public function indexAll(Request $request): JsonResponse
    {
        $user = auth()->user();

        $query = Review::with(['user', 'product'])->latest();

        // Vendor should only see reviews for their products
        if ($user && $user->isVendor()) {
            $query->whereHas('product', function ($q) use ($user) {
                $q->where('vendor_id', $user->id);
            });
        }

        // Filter by approval status
        if ($request->has('filter') && $request->filter !== 'all') {
            if ($request->filter === 'pending') {
                $query->where('is_approved', false);
            } elseif ($request->filter === 'approved') {
                $query->where('is_approved', true);
            }
        }

        $perPage = (int) $request->get('per_page', 15);
        $reviews = $query->paginate($perPage);

        return $this->paginatedResponse(
            $reviews->through(fn($review) => new ReviewResource($review)),
            'Reviews retrieved successfully'
        );
    }

    /**
     * Store a new review
     */
    #[OA\Post(
        path: "/api/v1/products/{productId}/reviews",
        summary: "Create product review",
        tags: ["Reviews"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "productId", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["rating"],
                properties: [
                    new OA\Property(property: "rating", type: "integer", example: 5),
                    new OA\Property(property: "title", type: "string", example: "Great product!"),
                    new OA\Property(property: "comment", type: "string", example: "This product is excellent!"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Review created successfully"),
            new OA\Response(response: 404, description: "Product not found"),
        ]
    )]
    public function store(StoreReviewRequest $request, Product $product): JsonResponse
    {
        // Check if user already reviewed this product
        $existingReview = Review::where('product_id', $product->id)
                                ->where('user_id', auth()->id())
                                ->first();

        if ($existingReview) {
            return $this->errorResponse('You have already reviewed this product.', 422);
        }

        $review = Review::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'is_verified_purchase' => true, // Should check order history
            'is_approved' => true, // Can be auto-approved or require admin approval
        ]);

        return $this->successResponse(
            new ReviewResource($review),
            'Review created successfully',
            201
        );
    }

    /**
     * Get single review
     */
    #[OA\Get(
        path: "/api/v1/reviews/{id}",
        summary: "Get review details",
        tags: ["Reviews"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Review retrieved successfully"),
            new OA\Response(response: 404, description: "Review not found"),
        ]
    )]
    public function show(Review $review): JsonResponse
    {
        $review->load('user');

        return $this->successResponse(
            new ReviewResource($review),
            'Review retrieved successfully'
        );
    }

    /**
     * Update a review
     */
    #[OA\Put(
        path: "/api/v1/reviews/{id}",
        summary: "Update review",
        tags: ["Reviews"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Review updated successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Review not found"),
        ]
    )]
    public function update(UpdateReviewRequest $request, Review $review): JsonResponse
    {
        // Check authorization
        if (auth()->id() !== $review->user_id && !auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $review->update($request->only(['rating', 'title', 'comment']));
        $review->load('user');

        return $this->successResponse(
            new ReviewResource($review),
            'Review updated successfully'
        );
    }

    /**
     * Delete a review
     */
    #[OA\Delete(
        path: "/api/v1/reviews/{id}",
        summary: "Delete review",
        tags: ["Reviews"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Review deleted successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 404, description: "Review not found"),
        ]
    )]
    public function destroy(Review $review): JsonResponse
    {
        // Check authorization
        if (auth()->id() !== $review->user_id && !auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $review->delete();

        return $this->successResponse(null, 'Review deleted successfully');
    }

    /**
     * Admin approve review
     */
    #[OA\Post(
        path: "/api/v1/reviews/{id}/approve",
        summary: "Approve review (Admin only)",
        tags: ["Reviews"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Review approved successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function approve(Review $review): JsonResponse
    {
        if (!auth()->user()->isAdmin()) {
            return $this->errorResponse('Unauthorized', 403);
        }

        $review->update(['is_approved' => true]);

        return $this->successResponse(
            new ReviewResource($review),
            'Review approved successfully'
        );
    }
}
