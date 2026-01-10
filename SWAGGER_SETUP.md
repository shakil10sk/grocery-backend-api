# Swagger/OpenAPI Documentation Setup

## ✅ Swagger Integration Complete

Swagger/OpenAPI documentation has been successfully integrated into the Grocery Multi-Vendor API.

## 📦 Package Installed

- **darkaonline/l5-swagger** (v9.0.1)
  - Provides Swagger UI interface
  - Generates OpenAPI documentation from annotations
  - Supports JWT authentication in Swagger UI

## 🔗 Access Swagger UI

**URL:** http://127.0.0.1:8000/api/documentation

The Swagger UI provides:
- Interactive API documentation
- Try-it-out functionality
- JWT token authentication support
- Request/response examples

## 📝 Documented Endpoints

### Authentication Endpoints
- ✅ `POST /api/v1/register` - Register new user
- ✅ `POST /api/v1/login` - User login
- ✅ `GET /api/v1/me` - Get authenticated user (protected)
- ✅ `POST /api/v1/logout` - Logout user (protected)
- ✅ `POST /api/v1/refresh` - Refresh JWT token (protected)

### Health Check
- ✅ `GET /api/health` - API health check

## 🔐 Using JWT in Swagger UI

1. Open Swagger UI: http://127.0.0.1:8000/api/documentation
2. Click the **"Authorize"** button (top right)
3. Login using `/api/v1/login` endpoint to get a token
4. Copy the token from the response
5. Click **"Authorize"** again and paste the token
6. Click **"Authorize"** to save
7. Now all protected endpoints will include the token automatically

## 📋 Swagger Annotations

All endpoints are documented using OpenAPI 3.0 attributes:

```php
#[OA\Post(
    path: "/api/v1/login",
    summary: "Login user",
    tags: ["Authentication"],
    // ... more attributes
)]
```

## 🔄 Regenerating Documentation

After adding new endpoints or updating annotations, regenerate the docs:

```bash
php artisan l5-swagger:generate
```

## 📁 Configuration Files

- **Config:** `config/l5-swagger.php`
- **Base Info:** `app/Http/Controllers/Controller.php`
- **Documentation:** `storage/api-docs/api-docs.json`

## 🎯 Features

- ✅ OpenAPI 3.0 specification
- ✅ JWT Bearer authentication support
- ✅ Request/response schemas
- ✅ Validation rules documentation
- ✅ Error responses documented
- ✅ Interactive testing interface
- ✅ Code examples

## 📚 Adding New Endpoints

To document a new endpoint:

1. Add OpenAPI attributes to your controller method:

```php
#[OA\Post(
    path: "/api/v1/your-endpoint",
    summary: "Your endpoint description",
    tags: ["YourTag"],
    security: [["bearerAuth" => []]], // If protected
    requestBody: new OA\RequestBody(...),
    responses: [
        new OA\Response(response: 200, description: "Success"),
        new OA\Response(response: 401, description: "Unauthorized"),
    ]
)]
public function yourMethod(Request $request) {
    // Your code
}
```

2. Regenerate documentation:
```bash
php artisan l5-swagger:generate
```

## 🚀 Next Steps

As you add more endpoints (Products, Orders, Categories, etc.), document them using the same pattern. The Swagger UI will automatically update with all documented endpoints.

---

**Status:** ✅ Swagger is fully configured and operational!

