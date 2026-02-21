<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Sliders", description: "Slider management for hero sections")]
class SliderController extends BaseController
{
    /**
     * Get all active sliders (public)
     */
    #[OA\Get(
        path: "/api/v1/sliders",
        summary: "Get all active sliders",
        tags: ["Sliders"],
        responses: [
            new OA\Response(response: 200, description: "Sliders retrieved successfully"),
        ]
    )]
    public function index(): JsonResponse
    {
        $sliders = Slider::valid()->ordered()->get();

        return $this->successResponse($sliders, 'Sliders retrieved successfully');
    }

    /**
     * Get all sliders (admin only, includes inactive)
     */
    #[OA\Get(
        path: "/api/v1/sliders/all",
        summary: "Get all sliders including inactive (Admin only)",
        tags: ["Sliders"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "All sliders retrieved"),
        ]
    )]
    public function indexAll(): JsonResponse
    {
        $sliders = Slider::ordered()->get();

        return $this->successResponse($sliders, 'All sliders retrieved successfully');
    }

    /**
     * Create a slider (admin only)
     */
    #[OA\Post(
        path: "/api/v1/sliders",
        summary: "Create a new slider (Admin only)",
        tags: ["Sliders"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["title", "image_url"],
                properties: [
                    new OA\Property(property: "title", type: "string"),
                    new OA\Property(property: "description", type: "string", nullable: true),
                    new OA\Property(property: "image_url", type: "string"),
                    new OA\Property(property: "link_url", type: "string", nullable: true),
                    new OA\Property(property: "link_text", type: "string", nullable: true),
                    new OA\Property(property: "order", type: "integer", nullable: true),
                    new OA\Property(property: "is_active", type: "boolean"),
                    new OA\Property(property: "start_date", type: "string", format: "date-time", nullable: true),
                    new OA\Property(property: "end_date", type: "string", format: "date-time", nullable: true),
                    new OA\Property(property: "button_color", type: "string", nullable: true),
                    new OA\Property(property: "text_overlay_color", type: "string", nullable: true),
                    new OA\Property(property: "overlay_opacity", type: "string", nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Slider created"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'required|string|url',
            'link_url' => 'nullable|string|url',
            'link_text' => 'nullable|string|max:100',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'button_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'text_overlay_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'overlay_opacity' => 'nullable|string|regex:/^\d+(\.\d+)?$/',
        ]);

        $slider = Slider::create($validated);

        return $this->successResponse($slider, 'Slider created successfully', 201);
    }

    /**
     * Get a specific slider
     */
    #[OA\Get(
        path: "/api/v1/sliders/{id}",
        summary: "Get a specific slider",
        tags: ["Sliders"],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Slider retrieved"),
            new OA\Response(response: 404, description: "Slider not found"),
        ]
    )]
    public function show(Slider $slider): JsonResponse
    {
        return $this->successResponse($slider, 'Slider retrieved successfully');
    }

    /**
     * Update a slider (admin only)
     */
    #[OA\Put(
        path: "/api/v1/sliders/{id}",
        summary: "Update a slider (Admin only)",
        tags: ["Sliders"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Slider updated"),
            new OA\Response(response: 404, description: "Slider not found"),
        ]
    )]
    public function update(Request $request, Slider $slider): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'string|url',
            'link_url' => 'nullable|string|url',
            'link_text' => 'nullable|string|max:100',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            // Allow simple dates like "2026-02-21" as well as full datetimes
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'button_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'text_overlay_color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'overlay_opacity' => 'nullable|string|regex:/^\d+(\.\d+)?$/',
        ]);

        $slider->update($validated);

        return $this->successResponse($slider, 'Slider updated successfully');
    }

    /**
     * Delete a slider (admin only)
     */
    #[OA\Delete(
        path: "/api/v1/sliders/{id}",
        summary: "Delete a slider (Admin only)",
        tags: ["Sliders"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 204, description: "Slider deleted"),
            new OA\Response(response: 404, description: "Slider not found"),
        ]
    )]
    public function destroy(Slider $slider): JsonResponse
    {
        $slider->delete();

        return $this->successResponse(null, 'Slider deleted successfully');
    }

    /**
     * Toggle slider status
     */
    #[OA\Post(
        path: "/api/v1/sliders/{id}/toggle",
        summary: "Toggle slider active status (Admin only)",
        tags: ["Sliders"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Status toggled"),
        ]
    )]
    public function toggle(Slider $slider): JsonResponse
    {
        $slider->update(['is_active' => !$slider->is_active]);

        return $this->successResponse($slider, 'Slider status toggled successfully');
    }

    /**
     * Reorder sliders
     */
    #[OA\Post(
        path: "/api/v1/sliders/reorder",
        summary: "Reorder sliders (Admin only)",
        tags: ["Sliders"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["sliders"],
                properties: [
                    new OA\Property(
                        property: "sliders",
                        type: "array",
                        items: new OA\Items(
                            properties: [
                                new OA\Property(property: "id", type: "integer"),
                                new OA\Property(property: "order", type: "integer"),
                            ]
                        )
                    ),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Sliders reordered"),
        ]
    )]
    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sliders' => 'required|array',
            'sliders.*.id' => 'required|integer|exists:sliders,id',
            'sliders.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['sliders'] as $item) {
            Slider::find($item['id'])->update(['order' => $item['order']]);
        }

        return $this->successResponse(null, 'Sliders reordered successfully');
    }

    /**
     * Upload slider image
     */
    #[OA\Post(
        path: "/api/v1/admin/sliders/upload-image",
        summary: "Upload slider image (Admin only)",
        tags: ["Sliders"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["image"],
                    properties: [
                        new OA\Property(property: "image", type: "string", format: "binary"),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Image uploaded successfully"),
            new OA\Response(response: 403, description: "Forbidden"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function uploadImage(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ]);

            $file = $request->file('image');
            
            // Verify file is actually an image
            if (!getimagesize($file)) {
                return $this->errorResponse('Uploaded file is not a valid image', 422);
            }

            $path = $file->store('sliders', 'public');

            if (!$path) {
                return $this->errorResponse('Failed to store image', 500);
            }

            $imageUrl = asset('storage/' . $path);

            return $this->successResponse([
                'image_url' => $imageUrl,
                'path' => $path,
            ], 'Image uploaded successfully', 200);
        } catch (\Exception $e) {
            return $this->errorResponse('Image upload failed: ' . $e->getMessage(), 500);
        }
    }
}
