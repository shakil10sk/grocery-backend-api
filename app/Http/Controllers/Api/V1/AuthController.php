<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use OpenApi\Attributes as OA;

/**
 * Authentication Controller
 * 
 * Handles user authentication, registration, and token management
 */
#[OA\Tag(name: "Authentication", description: "User authentication and authorization endpoints")]
class AuthController extends BaseController
{
    /**
     * Register a new user
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[OA\Post(
        path: "/api/v1/register",
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "email", "password", "password_confirmation", "role"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "John Doe"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "user@example.com"),
                    new OA\Property(property: "phone", type: "string", nullable: true, example: "+1234567890"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
                    new OA\Property(property: "password_confirmation", type: "string", format: "password", example: "password123"),
                    new OA\Property(property: "role", type: "string", enum: ["customer", "vendor", "delivery_boy"], example: "customer"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "User registered successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "User registered successfully"),
                        new OA\Property(property: "data", type: "object"),
                    ]
                )
            ),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:customer,vendor,delivery_boy',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors()->toArray());
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        // Assign role
        $user->assignRole($request->role);

        $token = JWTAuth::fromUser($user);

        return $this->successResponse([
            'user' => $user->load('roles'),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60, // in seconds
        ], 'User registered successfully', 201);
    }

    /**
     * Login user
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[OA\Post(
        path: "/api/v1/login",
        summary: "Login user",
        tags: ["Authentication"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["password"],
                properties: [
                    new OA\Property(property: "email", type: "string", format: "email", nullable: true, example: "admin@grocery.com"),
                    new OA\Property(property: "phone", type: "string", nullable: true, example: "+1234567890"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Login successful",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Login successful"),
                        new OA\Property(property: "data", type: "object",
                            properties: [
                                new OA\Property(property: "user", type: "object"),
                                new OA\Property(property: "token", type: "string", example: "eyJ0eXAiOiJKV1QiLCJhbGc..."),
                                new OA\Property(property: "token_type", type: "string", example: "bearer"),
                                new OA\Property(property: "expires_in", type: "integer", example: 3600),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Invalid credentials"),
            new OA\Response(response: 403, description: "Account is not active"),
        ]
    )]
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required_without:phone|email',
            'phone' => 'required_without:email|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed', 422, $validator->errors()->toArray());
        }

        $credentials = $request->only(['email', 'phone', 'password']);

        // Find user by email or phone
        if (isset($credentials['email'])) {
            $user = User::where('email', $credentials['email'])->first();
        } else {
            $user = User::where('phone', $credentials['phone'])->first();
        }

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        if ($user->status !== 'active') {
            return $this->errorResponse('Account is not active', 403);
        }

        $token = JWTAuth::fromUser($user);

        return $this->successResponse([
            'user' => $user->load('roles'),
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60, // in seconds
        ], 'Login successful');
    }

    /**
     * Get authenticated user
     *
     * @return JsonResponse
     */
    #[OA\Get(
        path: "/api/v1/me",
        summary: "Get authenticated user",
        tags: ["Authentication"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "User retrieved successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "User retrieved successfully"),
                        new OA\Property(property: "data", type: "object"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function me()
    {
        $user = auth()->user()->load('roles');
        return $this->successResponse($user, 'User retrieved successfully');
    }

    /**
     * Logout user
     *
     * @return JsonResponse
     */
    #[OA\Post(
        path: "/api/v1/logout",
        summary: "Logout user",
        tags: ["Authentication"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Successfully logged out",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Successfully logged out"),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return $this->successResponse(null, 'Successfully logged out');
    }

    /**
     * Refresh token
     *
     * @return JsonResponse
     */
    #[OA\Post(
        path: "/api/v1/refresh",
        summary: "Refresh JWT token",
        tags: ["Authentication"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Token refreshed successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Token refreshed successfully"),
                        new OA\Property(property: "data", type: "object",
                            properties: [
                                new OA\Property(property: "token", type: "string", example: "eyJ0eXAiOiJKV1QiLCJhbGc..."),
                                new OA\Property(property: "token_type", type: "string", example: "bearer"),
                                new OA\Property(property: "expires_in", type: "integer", example: 3600),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Unauthenticated"),
        ]
    )]
    public function refresh()
    {
        $token = JWTAuth::refresh(JWTAuth::getToken());
        return $this->successResponse([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
        ], 'Token refreshed successfully');
    }
}

