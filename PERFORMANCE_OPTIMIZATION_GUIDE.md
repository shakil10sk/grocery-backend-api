# Performance & Traffic Optimization Guide

## Database Optimization

### 1. Query Optimization (N+1 Prevention)

**Before (SLOW - Makes multiple queries):**
```php
// ProductController - BAD
public function index()
{
    $products = Product::all(); // 1 query
    // In view, accessing $product->category triggers 50 more queries
    foreach($products as $product) {
        echo $product->category->name; // +1 query per product
    }
}
```

**After (FAST - Single optimized query):**
```php
// ProductController - GOOD
public function index()
{
    $products = Product::with('category', 'vendor', 'images')
        ->select('id', 'name', 'slug', 'price', 'category_id', 'vendor_id')
        ->paginate(15);
    
    return ProductResource::collection($products);
}
```

**Apply to all controllers:**

**app/Http/Controllers/Api/V1/ProductController.php**
```php
public function index(Request $request)
{
    $query = Product::query()
        ->with('category', 'vendor', 'images', 'reviews')
        ->select('id', 'name', 'slug', 'description', 'price', 'stock', 'rating', 'category_id', 'vendor_id')
        ->where('status', 'active');
    
    if ($request->has('category_id')) {
        $query->where('category_id', $request->category_id);
    }
    
    if ($request->has('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
    }
    
    return ProductResource::collection(
        $query->paginate(15)
    );
}

public function show(Product $product)
{
    return new ProductResource(
        $product->load('category', 'vendor', 'images', 'variations', 'reviews')
    );
}
```

### 2. Database Indexing

**Add to migrations for faster queries:**

```php
// database/migrations/xxxx_create_products_table.php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name')->index();
    $table->string('slug')->unique()->index();
    $table->foreignId('category_id')->index();
    $table->foreignId('vendor_id')->index();
    $table->unsignedBigInteger('rating')->index();
    $table->enum('status', ['pending', 'active', 'rejected'])->index();
    $table->timestamps();
    $table->softDeletes()->index();
    
    // Compound index for common queries
    $table->index(['vendor_id', 'status']);
    $table->index(['category_id', 'status']);
});

Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->index();
    $table->foreignId('vendor_id')->index();
    $table->enum('status')->index();
    $table->timestamp('created_at')->index();
    $table->timestamps();
    
    // Compound indexes for common queries
    $table->index(['user_id', 'created_at']);
    $table->index(['vendor_id', 'status']);
});
```

---

## Caching Strategy

### 1. Redis Installation

```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis-server

# Docker
docker run -d -p 6379:6379 redis:latest
```

### 2. Environment Configuration

**.env**
```env
CACHE_DRIVER=redis
CACHE_PREFIX=grosarry_
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 3. Cache Frequently Accessed Data

**Cache Categories:**
```php
// In CategoryController or Service
public function index()
{
    $categories = Cache::remember('categories:list', 3600, function () {
        return Category::with('children')
            ->where('status', 'active')
            ->select('id', 'name', 'slug', 'icon')
            ->orderBy('order')
            ->get();
    });
    
    return CategoryResource::collection($categories);
}

// Clear cache when category is updated
public function update(Request $request, Category $category)
{
    $category->update($request->validated());
    Cache::forget('categories:list'); // Clear cache
    return new CategoryResource($category);
}
```

**Cache Settings:**
```php
// In SettingsController
public function getSettings()
{
    $settings = Cache::remember('app:settings', 86400, function () {
        return Setting::all()->pluck('value', 'key');
    });
    
    return response()->json($settings);
}
```

**Cache Product Listings:**
```php
public function index(Request $request)
{
    $cacheKey = 'products:' . md5(json_encode($request->all()));
    
    $products = Cache::remember($cacheKey, 1800, function () use ($request) {
        return Product::with('category', 'vendor', 'images')
            ->where('status', 'active')
            ->filter($request)
            ->paginate(15);
    });
    
    return ProductResource::collection($products);
}
```

### 4. Cache User Data

```php
// In ProfileController
public function show()
{
    $user = Cache::remember('user:' . auth()->id(), 3600, function () {
        return auth()->user()->load('profile', 'roles');
    });
    
    return new UserResource($user);
}

// Clear on update
public function update(Request $request)
{
    auth()->user()->update($request->validated());
    Cache::forget('user:' . auth()->id()); // Clear cache
    return new UserResource(auth()->user());
}
```

---

## Queue Jobs (Async Processing)

### 1. Configure Queue

**.env**
```env
QUEUE_CONNECTION=database  # Start with database, upgrade to Redis later
QUEUE_FAILED_TABLE=failed_jobs
```

Create database table:
```bash
php artisan queue:table
php artisan migrate
```

### 2. Create Jobs

**Send Order Notification:**
```php
// php artisan make:job SendOrderNotification
namespace App\Jobs;

use App\Models\Order;
use App\Notifications\OrderPlaced;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendOrderNotification implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(public Order $order)
    {
    }
    
    public function handle()
    {
        // Send email notification
        $this->order->user->notify(new OrderPlaced($this->order));
        
        // Notify vendor
        $this->order->vendor->notify(new NewOrderForVendor($this->order));
    }
}
```

**Process Product Images:**
```php
// php artisan make:job ProcessProductImage
namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Intervention\Image\Facades\Image;

class ProcessProductImage implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(public Product $product)
    {
    }
    
    public function handle()
    {
        foreach ($this->product->images as $image) {
            // Create thumbnails
            Image::make($image->path)
                ->fit(200, 200)
                ->save(storage_path('app/public/thumbs/' . $image->id . '.jpg'));
        }
    }
}
```

### 3. Dispatch Jobs

**In OrderController:**
```php
public function store(StoreOrderRequest $request)
{
    $order = Order::create($request->validated());
    
    // Dispatch async jobs
    dispatch(new SendOrderNotification($order));
    dispatch(new UpdateInventory($order));
    dispatch(new GenerateInvoice($order));
    
    return new OrderResource($order);
}
```

---

## Rate Limiting

### 1. Configure Rate Limiting

**In RouteServiceProvider:**
```php
protected function configureRateLimiting()
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)
            ->by($request->user()?->id ?: $request->ip());
    });
    
    RateLimiter::for('auth', function (Request $request) {
        return Limit::perMinute(5)
            ->by($request->ip());
    });
    
    RateLimiter::for('upload', function (Request $request) {
        return Limit::perHour(20)
            ->by($request->user()?->id ?: $request->ip());
    });
}
```

### 2. Apply to Routes

**routes/api.php:**
```php
Route::middleware('throttle:60,1')->prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
});

Route::middleware('throttle:auth')->prefix('v1')->group(function () {
    Route::post('/register', 'AuthController@register');
    Route::post('/login', 'AuthController@login');
});

Route::middleware(['auth:api', 'throttle:upload'])->group(function () {
    Route::post('/products/{product}/images', 'ProductImageController@store');
});
```

---

## API Response Optimization

### 1. Sparse Fieldsets

Allow clients to request only needed fields:

```php
// Request: GET /api/v1/products?fields=id,name,price

public function index(Request $request)
{
    $query = Product::query();
    
    // Apply sparse fieldsets
    if ($request->has('fields')) {
        $fields = explode(',', $request->fields);
        $query->select($fields);
    } else {
        $query->select('id', 'name', 'price', 'slug', 'category_id', 'vendor_id');
    }
    
    return ProductResource::collection($query->paginate());
}
```

### 2. Compression

**Enable in web server (Nginx):**
```nginx
gzip on;
gzip_types text/plain text/css text/javascript 
           application/javascript application/json;
gzip_min_length 1000;
gzip_comp_level 6;
```

### 3. Pagination

Already implemented but ensure defaults:
```php
// In controllers
$products->paginate(15); // Default 15 items per page
```

---

## Database Connection Pooling

For high traffic, configure connection pooling:

**.env**
```env
DB_POOL_MIN=2
DB_POOL_MAX=20
DB_POOL_TIMEOUT=30
```

---

## Monitoring & Debugging

### 1. Laravel Debugbar (Development Only)

```bash
composer require --dev barryvdh/laravel-debugbar
```

### 2. Query Monitoring

```php
// In AppServiceProvider
public function boot()
{
    if ($this->app->isLocal()) {
        DB::listen(function ($query) {
            if ($query->time > 1000) { // More than 1 second
                Log::warning('Slow Query: ' . $query->sql, ['time' => $query->time]);
            }
        });
    }
}
```

### 3. Performance Monitoring

Track API response times:
```php
// Middleware to log response times
public function handle($request, Closure $next)
{
    $start = microtime(true);
    $response = $next($request);
    $duration = round((microtime(true) - $start) * 1000);
    
    Log::info("API Request", [
        'path' => $request->path(),
        'method' => $request->method(),
        'duration_ms' => $duration,
        'status' => $response->status()
    ]);
    
    return $response;
}
```

---

## Traffic Capacity Estimates

### Current Setup (Without Optimizations)
- ✅ Can handle: 500-1000 concurrent users
- ⚠️ Response time: 500-1000ms

### With Optimizations
- ✅ Can handle: 5000-10000 concurrent users
- ✅ Response time: 100-300ms

### With All Recommendations
- ✅ Can handle: 50,000+ concurrent users
- ✅ Response time: 50-100ms
- ⚠️ Requires: Redis, Queue server, CDN, Database replication

---

## Quick Optimization Checklist

- [ ] Add eager loading to all queries
- [ ] Create database indexes
- [ ] Setup Redis caching
- [ ] Implement queue jobs
- [ ] Add rate limiting
- [ ] Configure response compression
- [ ] Add query monitoring
- [ ] Test with load testing tool (Apache Bench, wrk)
- [ ] Setup CDN for static assets
- [ ] Enable HTTP caching headers

**Estimated Time:** 3-5 days
**Priority:** 🟠 HIGH (before CodeCanyon if traffic expected)
