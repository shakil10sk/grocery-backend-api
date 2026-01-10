<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Grocery Multi-Vendor API",
    description: "API documentation for Grocery Multi-Vendor Platform. This API supports Admin, Vendor, Delivery Boy, and Customer roles.",
    contact: new OA\Contact(
        email: "support@grocery.com"
    ),
    license: new OA\License(
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
    )
)]
#[OA\Server(
    url: "http://localhost:8000/api",
    description: "Local development server"
)]
#[OA\Server(
    url: "http://localhost:8000/api",
    description: "API Server"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    name: "Authorization",
    in: "header",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter JWT token"
)]
abstract class Controller
{
    //
}
