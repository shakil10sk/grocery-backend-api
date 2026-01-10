# API Documentation

Complete API reference for the Grocery Multi-Vendor Platform.

## 🌐 Base URL

```
http://localhost:8000/api/v1
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

Login to receive a JWT token:

```bash
POST /api/v1/login
```

### Using the Token

Include the token in the Authorization header:

```
Authorization: Bearer {your-jwt-token}
```

### Token Expiration

- Default expiration: 60 minutes
- Refresh token: Use `/api/v1/refresh` endpoint

## 📡 Endpoints

### Health Check

#### GET /api/health

Check API status.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2026-01-02T19:00:00+00:00"
}
```

---

### Authentication

#### POST /api/v1/register

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "customer"
}
```

**Parameters:**
- `name` (required, string): User's full name
- `email` (required, email): User's email address
- `phone` (optional, string): User's phone number
- `password` (required, string, min:8): User's password
- `password_confirmation` (required, string): Password confirmation
- `role` (required, enum): User role - `customer`, `vendor`, or `delivery_boy`

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "roles": [{"name": "customer"}]
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

---

#### POST /api/v1/login

Login user with email or phone.

**Request Body:**
```json
{
  "email": "admin@grocery.com",
  "password": "password"
}
```

OR

```json
{
  "phone": "+1234567890",
  "password": "password"
}
```

**Parameters:**
- `email` (required_without:phone, email): User's email
- `phone` (required_without:email, string): User's phone
- `password` (required, string): User's password

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@grocery.com",
      "roles": [{"name": "admin"}]
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Account is not active
- `422`: Validation error

---

#### GET /api/v1/me

Get authenticated user information.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@grocery.com",
    "phone": null,
    "avatar": null,
    "language": "en",
    "status": "active",
    "roles": [{"name": "admin"}]
  }
}
```

---

#### POST /api/v1/logout

Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

#### POST /api/v1/refresh

Refresh JWT token.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "token_type": "bearer",
    "expires_in": 3600
  }
}
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Error message"]
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 100,
    "last_page": 7,
    "from": 1,
    "to": 15
  }
}
```

## 🔢 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## 🚧 Upcoming Endpoints

### User Management
- `GET /api/v1/profile` - Get user profile
- `PUT /api/v1/profile` - Update profile
- `POST /api/v1/profile/avatar` - Upload avatar

### Addresses
- `GET /api/v1/addresses` - List addresses
- `POST /api/v1/addresses` - Create address
- `PUT /api/v1/addresses/{id}` - Update address
- `DELETE /api/v1/addresses/{id}` - Delete address

### Categories
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/{id}` - Get category
- `POST /api/v1/categories` - Create category (Admin)
- `PUT /api/v1/categories/{id}` - Update category (Admin)
- `DELETE /api/v1/categories/{id}` - Delete category (Admin)

### Products
- `GET /api/v1/products` - List products
- `GET /api/v1/products/{id}` - Get product
- `POST /api/v1/products` - Create product (Vendor)
- `PUT /api/v1/products/{id}` - Update product (Vendor)
- `DELETE /api/v1/products/{id}` - Delete product (Vendor)

### Cart
- `GET /api/v1/cart` - Get cart
- `POST /api/v1/cart` - Add to cart
- `PUT /api/v1/cart/{id}` - Update cart item
- `DELETE /api/v1/cart/{id}` - Remove from cart

### Orders
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/{id}` - Get order
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/{id}/status` - Update order status

## 🔍 Interactive Documentation

For interactive API testing, use Swagger UI:

**URL:** http://localhost:8000/api/documentation

Features:
- Try all endpoints directly
- See request/response examples
- Test authentication
- View schemas

## 📝 Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Default: 60 requests per minute per IP
- Authenticated: 120 requests per minute per user

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens expire after 60 minutes
- HTTPS recommended in production
- CORS configured for allowed origins
- Input validation on all endpoints

---

**Last Updated:** 2026-01-02  
**API Version:** 1.0.0

