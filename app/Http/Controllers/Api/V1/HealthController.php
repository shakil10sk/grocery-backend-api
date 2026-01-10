<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\JsonResponse;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Health", description: "API health check endpoints")]
class HealthController extends BaseController
{
    /**
     * Health check endpoint
     *
     * @return JsonResponse
     */
    #[OA\Get(
        path: "/api/health",
        summary: "API health check",
        tags: ["Health"],
        responses: [
            new OA\Response(
                response: 200,
                description: "API is running",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "status", type: "string", example: "ok"),
                        new OA\Property(property: "message", type: "string", example: "API is running"),
                        new OA\Property(property: "timestamp", type: "string", format: "date-time", example: "2026-01-02T19:00:00+00:00"),
                    ]
                )
            ),
        ]
    )]
    public function check(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'API is running',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}

