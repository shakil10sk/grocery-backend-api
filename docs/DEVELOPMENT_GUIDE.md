# Development Guide

Complete guide for developers working on the Grocery Multi-Vendor Platform.

## 📁 Project Structure

```
backend-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   └── V1/          # API version 1 controllers
│   │   │   └── Controller.php   # Base controller with Swagger info
│   │   ├── Middleware/          # Custom middleware
│   │   ├── Requests/            # Form request validation
│   │   └── Resources/           # API resources (transformers)
│   ├── Models/                  # Eloquent models
│   └── Services/                # Business logic services
├── database/
│   ├── migrations/              # Database migrations
│   └── seeders/                # Database seeders
├── routes/
│   └── api.php                 # API routes
├── config/                     # Configuration files
└── storage/
    └── api-docs/               # Generated Swagger docs
```

## 🏗 Architecture Patterns

### API Versioning
- All API routes are versioned: `/api/v1/`
- Controllers organized by version: `App\Http\Controllers\Api\V1\`

### Controller Structure
- Extend `BaseController` for common response methods
- Use form requests for validation
- Use API resources for response transformation
- Keep controllers thin, move logic to services

### Service Layer
- Business logic in `app/Services/`
- Reusable across controllers
- Testable in isolation

## 📝 Adding New Features

### Step 1: Create Migration

```bash
php artisan make:migration create_example_table
```

### Step 2: Create Model

```bash
php artisan make:model Example
```

Add relationships, fillable fields, casts.

### Step 3: Create Controller

```bash
php artisan make:controller Api/V1/ExampleController
```

### Step 4: Create Form Request (Optional)

```bash
php artisan make:request StoreExampleRequest
php artisan make:request UpdateExampleRequest
```

### Step 5: Create API Resource (Optional)

```bash
php artisan make:resource ExampleResource
```

### Step 6: Add Routes

In `routes/api.php`:

```php
Route::prefix('v1')->middleware('auth:api')->group(function () {
    Route::apiResource('examples', ExampleController::class);
});
```

### Step 7: Add Swagger Annotations

```php
#[OA\Get(
    path: "/api/v1/examples",
    summary: "List examples",
    tags: ["Examples"],
    security: [["bearerAuth" => []]],
    responses: [
        new OA\Response(response: 200, description: "Success"),
    ]
)]
public function index() {
    // ...
}
```

### Step 8: Regenerate Swagger Docs

```bash
php artisan l5-swagger:generate
```

## 🔐 Authentication & Authorization

### Protecting Routes

```php
Route::middleware('auth:api')->group(function () {
    // Protected routes
});
```

### Role-Based Protection

```php
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Admin-only routes
});
```

### Permission-Based Protection

```php
Route::middleware(['auth:api', 'permission:products.create'])->group(function () {
    // Permission-protected routes
});
```

### Checking Roles in Controllers

```php
if ($user->isAdmin()) {
    // Admin logic
}

if ($user->hasRole('vendor')) {
    // Vendor logic
}

if ($user->hasPermissionTo('products.create')) {
    // Permission check
}
```

## 📊 Response Format

### Success Response

```php
return $this->successResponse($data, 'Message', 200);
```

### Error Response

```php
return $this->errorResponse('Error message', 400, $errors);
```

### Paginated Response

```php
return $this->paginatedResponse($paginatedData, 'Message');
```

## ✅ Validation

### Using Form Requests

```php
class StoreProductRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ];
    }
}
```

### In Controller

```php
public function store(StoreProductRequest $request)
{
    // $request is already validated
}
```

## 🔄 Database Operations

### Migrations

```bash
# Create migration
php artisan make:migration create_products_table

# Run migrations
php artisan migrate

# Rollback
php artisan migrate:rollback

# Fresh migration (drops all tables)
php artisan migrate:fresh
```

### Seeders

```bash
# Create seeder
php artisan make:seeder ProductSeeder

# Run seeder
php artisan db:seed
php artisan db:seed --class=ProductSeeder
```

## 🧪 Testing

### Running Tests

```bash
# All tests
php artisan test

# Specific test
php artisan test --filter AuthTest

# With coverage
php artisan test --coverage
```

### Writing Tests

```php
class ProductTest extends TestCase
{
    public function test_can_create_product()
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'api');

        $response = $this->postJson('/api/v1/products', [
            'name' => 'Test Product',
            'price' => 100,
        ]);

        $response->assertStatus(201);
    }
}
```

## 🎨 Code Style

### Laravel Pint

```bash
# Format code
php artisan pint

# Check without fixing
php artisan pint --test
```

### PSR-12 Standards
- Follow PSR-12 coding standards
- Use type hints
- Add docblocks for public methods
- Keep methods focused and small

## 📚 Best Practices

### Controllers
- Keep controllers thin
- Move business logic to services
- Use form requests for validation
- Use API resources for responses

### Models
- Define relationships clearly
- Use accessors/mutators when needed
- Add scopes for common queries
- Use fillable/guarded properly

### Services
- Single responsibility
- Dependency injection
- Testable
- Reusable

### Database
- Use migrations for all schema changes
- Add indexes for frequently queried columns
- Use foreign keys for relationships
- Soft deletes where appropriate

## 🔍 Debugging

### Logging

```php
Log::info('Message', ['data' => $data]);
Log::error('Error', ['exception' => $e]);
```

### Debugging Queries

```php
DB::enableQueryLog();
// Your queries
dd(DB::getQueryLog());
```

### Tinker

```bash
php artisan tinker

# In tinker
$user = User::find(1);
$user->roles;
```

## 🚀 Performance

### Caching

```php
Cache::remember('key', 3600, function () {
    return expensiveOperation();
});
```

### Eager Loading

```php
// Bad
$products = Product::all();
foreach ($products as $product) {
    $product->category; // N+1 problem
}

// Good
$products = Product::with('category')->get();
```

### Database Indexes
- Index foreign keys
- Index frequently filtered columns
- Index search columns

## 🔒 Security

### Input Validation
- Always validate user input
- Use form requests
- Sanitize data

### SQL Injection
- Use Eloquent (parameterized queries)
- Never use raw queries with user input

### XSS Protection
- Laravel escapes by default
- Be careful with `{!! !!}` syntax

### CSRF Protection
- API routes don't need CSRF (stateless)
- Web routes use CSRF tokens

## 📦 Dependencies

### Adding Packages

```bash
composer require vendor/package
```

### Updating Packages

```bash
composer update
```

## 🐛 Common Issues

### Migration Errors
```bash
php artisan migrate:fresh
php artisan db:seed
```

### Cache Issues
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Permission Issues
```bash
chmod -R 775 storage bootstrap/cache
```

## 📖 Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Spatie Permissions](https://spatie.be/docs/laravel-permission)
- [JWT Auth](https://jwt-auth.readthedocs.io/)
- [Swagger/OpenAPI](https://swagger.io/specification/)

---

**Last Updated:** 2026-01-02

