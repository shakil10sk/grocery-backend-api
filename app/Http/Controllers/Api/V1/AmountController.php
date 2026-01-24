<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Amounts", description: "Product amount/unit endpoints")]
class AmountController extends BaseController
{
    /**
     * Display a listing of available product amounts/units
     */
    #[OA\Get(
        path: "/api/v1/amounts",
        summary: "List available product amounts/units (Public)",
        tags: ["Amounts"],
        responses: [
            new OA\Response(response: 200, description: "Amounts retrieved successfully"),
        ]
    )]
    public function index(Request $request): JsonResponse
    {
        // Common product units/amounts for grocery marketplace
        $amounts = [
            ['value' => 'kg', 'label' => 'Kilogram (kg)', 'type' => 'weight'],
            ['value' => 'g', 'label' => 'Gram (g)', 'type' => 'weight'],
            ['value' => 'lb', 'label' => 'Pound (lb)', 'type' => 'weight'],
            ['value' => 'oz', 'label' => 'Ounce (oz)', 'type' => 'weight'],
            ['value' => 'l', 'label' => 'Liter (l)', 'type' => 'volume'],
            ['value' => 'ml', 'label' => 'Milliliter (ml)', 'type' => 'volume'],
            ['value' => 'gal', 'label' => 'Gallon (gal)', 'type' => 'volume'],
            ['value' => 'piece', 'label' => 'Piece', 'type' => 'count'],
            ['value' => 'pack', 'label' => 'Pack', 'type' => 'count'],
            ['value' => 'box', 'label' => 'Box', 'type' => 'count'],
            ['value' => 'dozen', 'label' => 'Dozen', 'type' => 'count'],
            ['value' => 'bundle', 'label' => 'Bundle', 'type' => 'count'],
        ];

        return $this->successResponse(
            $amounts,
            'Amounts retrieved successfully'
        );
    }
}
