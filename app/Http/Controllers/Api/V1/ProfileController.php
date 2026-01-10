<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Profile", description: "User profile management endpoints")]
class ProfileController extends BaseController
{
    /**
     * Get authenticated user profile
     *
     * @return JsonResponse
     */
    #[OA\Get(
        path: "/api/v1/profile",
        summary: "Get user profile",
        tags: ["Profile"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Profile retrieved successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Profile retrieved successfully"),
                        new OA\Property(property: "data", type: "object"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function show(): JsonResponse
    {
        $user = auth()->user()->load('roles');
        return $this->successResponse(
            new UserResource($user),
            'Profile retrieved successfully'
        );
    }

    /**
     * Update user profile
     *
     * @param UpdateProfileRequest $request
     * @return JsonResponse
     */
    #[OA\Put(
        path: "/api/v1/profile",
        summary: "Update user profile",
        tags: ["Profile"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "John Doe"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "john@example.com"),
                    new OA\Property(property: "phone", type: "string", nullable: true, example: "+1234567890"),
                    new OA\Property(property: "language", type: "string", enum: ["en", "es", "fr", "de", "ar", "hi", "zh"], example: "en"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Profile updated successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Profile updated successfully"),
                        new OA\Property(property: "data", type: "object"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = auth()->user();
        
        $user->update($request->only([
            'name',
            'email',
            'phone',
            'language',
        ]));

        $user->load('roles');

        return $this->successResponse(
            new UserResource($user),
            'Profile updated successfully'
        );
    }

    /**
     * Upload user avatar
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[OA\Post(
        path: "/api/v1/profile/avatar",
        summary: "Upload user avatar",
        tags: ["Profile"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(property: "avatar", type: "string", format: "binary"),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Avatar uploaded successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Avatar uploaded successfully"),
                        new OA\Property(property: "data", type: "object",
                            properties: [
                                new OA\Property(property: "avatar_url", type: "string", example: "http://localhost:8000/storage/avatars/avatar.jpg"),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        // Delete old avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // Store new avatar
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return $this->successResponse([
            'avatar_url' => asset('storage/' . $path),
        ], 'Avatar uploaded successfully');
    }

    /**
     * Update FCM token for push notifications
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[OA\Post(
        path: "/api/v1/profile/fcm-token",
        summary: "Update FCM token",
        tags: ["Profile"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["fcm_token"],
                properties: [
                    new OA\Property(property: "fcm_token", type: "string", example: "fcm_token_here"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "FCM token updated successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "FCM token updated successfully"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function updateFcmToken(Request $request): JsonResponse
    {
        $request->validate([
            'fcm_token' => 'required|string',
        ]);

        auth()->user()->update([
            'fcm_token' => $request->fcm_token,
        ]);

        return $this->successResponse(null, 'FCM token updated successfully');
    }
}
