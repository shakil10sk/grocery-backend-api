<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\StoreContactSettingsRequest;
use App\Http\Requests\UpdateContactSettingsRequest;
use App\Models\ContactSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Settings", description: "Dynamic settings management")]
class SettingsController extends BaseController
{
    /**
     * Get contact settings
     */
    #[OA\Get(
        path: "/api/v1/settings/contact",
        summary: "Get contact settings",
        tags: ["Settings"],
        responses: [
            new OA\Response(response: 200, description: "Contact settings retrieved"),
        ]
    )]
    public function getContact(): JsonResponse
    {
        $contact = ContactSettings::first();

        if (!$contact) {
            return $this->errorResponse('Contact settings not configured', 404);
        }

        return $this->successResponse($contact, 'Contact settings retrieved successfully');
    }

    /**
     * Create contact settings (Admin only)
     */
    #[OA\Post(
        path: "/api/v1/settings/contact",
        summary: "Create contact settings (Admin only)",
        tags: ["Settings"],
        security: [["bearerAuth" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["company_name", "email"],
                properties: [
                    new OA\Property(property: "company_name", type: "string"),
                    new OA\Property(property: "email", type: "string"),
                    new OA\Property(property: "phone", type: "string", nullable: true),
                    new OA\Property(property: "address", type: "string", nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Settings created"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function storeContact(StoreContactSettingsRequest $request): JsonResponse
    {
        $contact = ContactSettings::create($request->validated());

        return $this->successResponse($contact, 'Contact settings created successfully', 201);
    }

    /**
     * Update contact settings (Admin only)
     */
    #[OA\Put(
        path: "/api/v1/settings/contact",
        summary: "Update contact settings (Admin only)",
        tags: ["Settings"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Settings updated"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function updateContact(UpdateContactSettingsRequest $request): JsonResponse
    {
        $contact = ContactSettings::first();

        if (!$contact) {
            return $this->errorResponse('Contact settings not found', 404);
        }

        $contact->update($request->validated());

        return $this->successResponse($contact, 'Contact settings updated successfully');
    }

    /**
     * Get footer settings
     */
    #[OA\Get(
        path: "/api/v1/settings/footer",
        summary: "Get footer settings",
        tags: ["Settings"],
        responses: [
            new OA\Response(response: 200, description: "Footer settings retrieved"),
        ]
    )]
    public function getFooter(): JsonResponse
    {
        $footer = \App\Models\FooterSettings::first();

        if (!$footer) {
            return $this->errorResponse('Footer settings not configured', 404);
        }

        return $this->successResponse($footer, 'Footer settings retrieved successfully');
    }

    /**
     * Update footer settings (Admin only)
     */
    #[OA\Put(
        path: "/api/v1/settings/footer",
        summary: "Update footer settings (Admin only)",
        tags: ["Settings"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Settings updated"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function updateFooter(\App\Http\Requests\UpdateFooterSettingsRequest $request): JsonResponse
    {
        $footer = \App\Models\FooterSettings::first();

        if (!$footer) {
            // Create if doesn't exist
            $footer = \App\Models\FooterSettings::create($request->validated());
        } else {
            $footer->update($request->validated());
        }

        return $this->successResponse($footer, 'Footer settings updated successfully');
    }

    /**
     * Get header settings
     */
    #[OA\Get(
        path: "/api/v1/settings/header",
        summary: "Get header settings",
        tags: ["Settings"],
        responses: [
            new OA\Response(response: 200, description: "Header settings retrieved"),
        ]
    )]
    public function getHeader(): JsonResponse
    {
        $header = \App\Models\HeaderSettings::first();

        if (!$header) {
            return $this->errorResponse('Header settings not configured', 404);
        }

        return $this->successResponse($header, 'Header settings retrieved successfully');
    }

    /**
     * Update header settings (Admin only)
     */
    #[OA\Put(
        path: "/api/v1/settings/header",
        summary: "Update header settings (Admin only)",
        tags: ["Settings"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Settings updated"),
            new OA\Response(response: 403, description: "Forbidden"),
        ]
    )]
    public function updateHeader(\App\Http\Requests\UpdateHeaderSettingsRequest $request): JsonResponse
    {
        $header = \App\Models\HeaderSettings::first();

        if (!$header) {
            // Create if doesn't exist
            $header = \App\Models\HeaderSettings::create($request->validated());
        } else {
            $header->update($request->validated());
        }

        return $this->successResponse($header, 'Header settings updated successfully');
    }

    /**
     * Get all settings (public)
     */
    #[OA\Get(
        path: "/api/v1/settings",
        summary: "Get all public settings",
        tags: ["Settings"],
        responses: [
            new OA\Response(response: 200, description: "Settings retrieved"),
        ]
    )]
    public function getAllSettings(): JsonResponse
    {
        $settings = [
            'contact' => ContactSettings::first(),
            'footer' => \App\Models\FooterSettings::first(),
            'header' => \App\Models\HeaderSettings::first(),
        ];

        return $this->successResponse($settings, 'All settings retrieved successfully');
    }
}
