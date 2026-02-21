<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "User Management", description: "Admin-only endpoints for managing system users")]
class UserController extends BaseController
{
    /**
     * Display a listing of users
     */
    #[OA\Get(
        path: "/api/v1/users",
        summary: "List all users (Admin only)",
        tags: ["User Management"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "role", in: "query", description: "Filter by role", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "status", in: "query", description: "Filter by status", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "search", in: "query", description: "Search by name or email", required: false, schema: new OA\Schema(type: "string")),
            new OA\Parameter(name: "page", in: "query", description: "Page number", required: false, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "Users retrieved successfully"),
            new OA\Response(response: 403, description: "Forbidden - Admin only"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        $query = User::with('roles');

        if ($request->has('role')) {
            $query->role($request->role);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate($request->input('per_page', 15));

        return $this->paginatedResponse(
            $users->through(fn($user) => new UserResource($user)),
            'Users retrieved successfully'
        );
    }

    /**
     * Store a new user
     */
    #[OA\Post(
        path: "/api/v1/users",
        summary: "Create a new user (Admin only)",
        tags: ["User Management"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "email", "password", "role"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "John Doe"),
                    new OA\Property(property: "email", type: "string", example: "john@example.com"),
                    new OA\Property(property: "password", type: "string", example: "password123"),
                    new OA\Property(property: "phone", type: "string", example: "1234567890"),
                    new OA\Property(property: "role", type: "string", example: "vendor"),
                    new OA\Property(property: "status", type: "string", example: "active"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "User created successfully"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'status' => 'nullable|string|in:active,inactive,pending',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'status' => $request->status ?? 'active',
        ]);

        $user->assignRole($request->role);

        return $this->successResponse(
            new UserResource($user->load('roles')),
            'User created successfully',
            201
        );
    }

    /**
     * Display the specified user
     */
    #[OA\Get(
        path: "/api/v1/users/{id}",
        summary: "Get user details (Admin only)",
        tags: ["User Management"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "User retrieved successfully"),
            new OA\Response(response: 404, description: "User not found"),
        ]
    )]
    public function show(User $user): JsonResponse
    {
        return $this->successResponse(
            new UserResource($user->load('roles')),
            'User retrieved successfully'
        );
    }

    /**
     * Update the specified user
     */
    #[OA\Put(
        path: "/api/v1/users/{id}",
        summary: "Update user (Admin only)",
        tags: ["User Management"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "User updated successfully"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function update(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|string|exists:roles,name',
            'status' => 'sometimes|string|in:active,inactive,pending',
        ]);

        $data = $request->only(['name', 'email', 'phone', 'status']);
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return $this->successResponse(
            new UserResource($user->load('roles')),
            'User updated successfully'
        );
    }

    /**
     * Remove the specified user
     */
    #[OA\Delete(
        path: "/api/v1/users/{id}",
        summary: "Delete user (Admin only)",
        tags: ["User Management"],
        security: [["bearerAuth" => []]],
        parameters: [
            new OA\Parameter(name: "id", in: "path", required: true, schema: new OA\Schema(type: "integer")),
        ],
        responses: [
            new OA\Response(response: 200, description: "User deleted successfully"),
            new OA\Response(response: 404, description: "User not found"),
        ]
    )]
    public function destroy(User $user): JsonResponse
    {
        // Prevent self-deletion
        if (auth()->id() === $user->id) {
            return $this->errorResponse('You cannot delete your own account', 403);
        }

        $user->delete();

        return $this->successResponse(null, 'User deleted successfully');
    }
}
