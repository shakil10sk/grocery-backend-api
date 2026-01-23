<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', [App\Http\Controllers\Api\V1\HealthController::class, 'check']);

// Public routes (authentication, etc.)
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/register', [App\Http\Controllers\Api\V1\AuthController::class, 'register']);
    Route::post('/login', [App\Http\Controllers\Api\V1\AuthController::class, 'login']);
    
    // Public blog routes
    Route::get('/blog/posts', [App\Http\Controllers\Api\V1\BlogController::class, 'indexPosts']);
    Route::get('/blog/posts/{post}', [App\Http\Controllers\Api\V1\BlogController::class, 'showBlogPost']);
    Route::get('/blog/posts/{post}/comments', [App\Http\Controllers\Api\V1\BlogController::class, 'indexComments']);
    Route::get('/blog/categories', [App\Http\Controllers\Api\V1\BlogCategoryController::class, 'index']);
    
    // Public settings routes
    Route::get('/settings', [App\Http\Controllers\Api\V1\SettingsController::class, 'getAllSettings']);
    Route::get('/settings/contact', [App\Http\Controllers\Api\V1\SettingsController::class, 'getContact']);
    Route::get('/settings/footer', [App\Http\Controllers\Api\V1\SettingsController::class, 'getFooter']);
    Route::get('/settings/header', [App\Http\Controllers\Api\V1\SettingsController::class, 'getHeader']);
    
    // Public slider routes
    Route::get('/sliders', [App\Http\Controllers\Api\V1\SliderController::class, 'index']);
    Route::get('/sliders/{slider}', [App\Http\Controllers\Api\V1\SliderController::class, 'show']);
    
    // Public products and categories routes
    Route::get('/products', [App\Http\Controllers\Api\V1\ProductController::class, 'index']);
    Route::get('/products/{product}', [App\Http\Controllers\Api\V1\ProductController::class, 'show']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:api')->group(function () {
    // Authentication routes
    Route::post('/logout', [App\Http\Controllers\Api\V1\AuthController::class, 'logout']);
    Route::post('/refresh', [App\Http\Controllers\Api\V1\AuthController::class, 'refresh']);
    Route::get('/me', [App\Http\Controllers\Api\V1\AuthController::class, 'me']);
    
    // Profile routes
    Route::prefix('profile')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\V1\ProfileController::class, 'show']);
        Route::put('/', [App\Http\Controllers\Api\V1\ProfileController::class, 'update']);
        Route::post('/avatar', [App\Http\Controllers\Api\V1\ProfileController::class, 'uploadAvatar']);
        Route::post('/fcm-token', [App\Http\Controllers\Api\V1\ProfileController::class, 'updateFcmToken']);
    });
    
    // Category routes
    Route::get('categories', [App\Http\Controllers\Api\V1\CategoryController::class, 'index']);
    Route::get('categories/{category}', [App\Http\Controllers\Api\V1\CategoryController::class, 'show']);
    Route::post('categories', [App\Http\Controllers\Api\V1\CategoryController::class, 'store'])->middleware('role:admin');
    Route::put('categories/{category}', [App\Http\Controllers\Api\V1\CategoryController::class, 'update'])->middleware('role:admin');
    Route::delete('categories/{category}', [App\Http\Controllers\Api\V1\CategoryController::class, 'destroy'])->middleware('role:admin');
    Route::post('categories/{category}/toggle-status', [App\Http\Controllers\Api\V1\CategoryController::class, 'toggleStatus'])->middleware('role:admin');
    
    // Product routes
    Route::apiResource('products', App\Http\Controllers\Api\V1\ProductController::class);
    Route::post('products/{product}/approve', [App\Http\Controllers\Api\V1\ProductController::class, 'approve'])->middleware('role:admin');
    Route::post('products/{product}/reject', [App\Http\Controllers\Api\V1\ProductController::class, 'reject'])->middleware('role:admin');
    Route::post('products/{product}/stock', [App\Http\Controllers\Api\V1\ProductController::class, 'updateStock']);
    
    // Product reviews
    // Admin/vendor: list all reviews
    Route::get('reviews', [App\Http\Controllers\Api\V1\ReviewController::class, 'indexAll'])->middleware('role:admin,vendor');

    Route::get('products/{product}/reviews', [App\Http\Controllers\Api\V1\ReviewController::class, 'index']);
    Route::post('products/{product}/reviews', [App\Http\Controllers\Api\V1\ReviewController::class, 'store']);
    Route::get('reviews/{review}', [App\Http\Controllers\Api\V1\ReviewController::class, 'show']);
    Route::put('reviews/{review}', [App\Http\Controllers\Api\V1\ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [App\Http\Controllers\Api\V1\ReviewController::class, 'destroy']);
    Route::post('reviews/{review}/approve', [App\Http\Controllers\Api\V1\ReviewController::class, 'approve'])->middleware('role:admin');
    
    // Product variations
    Route::post('products/{product}/variations', [App\Http\Controllers\Api\V1\ProductVariationController::class, 'store']);
    Route::put('products/{product}/variations/{variation}', [App\Http\Controllers\Api\V1\ProductVariationController::class, 'update']);
    Route::delete('products/{product}/variations/{variation}', [App\Http\Controllers\Api\V1\ProductVariationController::class, 'destroy']);
    
    // Product images
    Route::post('products/{product}/images', [App\Http\Controllers\Api\V1\ProductImageController::class, 'store']);
    Route::post('products/{product}/images/{image}/set-primary', [App\Http\Controllers\Api\V1\ProductImageController::class, 'setPrimary']);
    Route::delete('products/{product}/images/{image}', [App\Http\Controllers\Api\V1\ProductImageController::class, 'destroy']);
    
    // Blog routes (protected)
    Route::post('blog/posts', [App\Http\Controllers\Api\V1\BlogController::class, 'storeBlogPost'])->middleware('role:admin');
    Route::put('blog/posts/{post}', [App\Http\Controllers\Api\V1\BlogController::class, 'updateBlogPost'])->middleware('role:admin');
    Route::delete('blog/posts/{post}', [App\Http\Controllers\Api\V1\BlogController::class, 'deleteBlogPost'])->middleware('role:admin');
    Route::post('blog/posts/{post}/comments', [App\Http\Controllers\Api\V1\BlogController::class, 'storeComment']);
    Route::delete('blog/comments/{comment}', [App\Http\Controllers\Api\V1\BlogController::class, 'deleteComment']);
    Route::post('blog/comments/{comment}/approve', [App\Http\Controllers\Api\V1\BlogController::class, 'approveComment'])->middleware('role:admin');
    
    // Blog categories (protected)
    Route::post('blog/categories', [App\Http\Controllers\Api\V1\BlogCategoryController::class, 'store'])->middleware('role:admin');
    Route::put('blog/categories/{category}', [App\Http\Controllers\Api\V1\BlogCategoryController::class, 'update'])->middleware('role:admin');
    Route::delete('blog/categories/{category}', [App\Http\Controllers\Api\V1\BlogCategoryController::class, 'destroy'])->middleware('role:admin');
    
    // Settings routes (protected)
    Route::post('settings/contact', [App\Http\Controllers\Api\V1\SettingsController::class, 'storeContact'])->middleware('role:admin');
    Route::put('settings/contact', [App\Http\Controllers\Api\V1\SettingsController::class, 'updateContact'])->middleware('role:admin');
    Route::put('settings/footer', [App\Http\Controllers\Api\V1\SettingsController::class, 'updateFooter'])->middleware('role:admin');
    Route::put('settings/header', [App\Http\Controllers\Api\V1\SettingsController::class, 'updateHeader'])->middleware('role:admin');
    
    // Slider routes (admin only)
    Route::get('sliders/all', [App\Http\Controllers\Api\V1\SliderController::class, 'indexAll'])->middleware('role:admin');
    Route::post('sliders', [App\Http\Controllers\Api\V1\SliderController::class, 'store'])->middleware('role:admin');
    Route::put('sliders/{slider}', [App\Http\Controllers\Api\V1\SliderController::class, 'update'])->middleware('role:admin');
    Route::delete('sliders/{slider}', [App\Http\Controllers\Api\V1\SliderController::class, 'destroy'])->middleware('role:admin');
    Route::post('sliders/{slider}/toggle', [App\Http\Controllers\Api\V1\SliderController::class, 'toggle'])->middleware('role:admin');
    Route::post('sliders/reorder', [App\Http\Controllers\Api\V1\SliderController::class, 'reorder'])->middleware('role:admin');
    
    // Cart routes
    Route::get('cart', [App\Http\Controllers\Api\V1\CartController::class, 'index']);
    Route::post('cart', [App\Http\Controllers\Api\V1\CartController::class, 'store']);
    Route::put('cart/{cart}', [App\Http\Controllers\Api\V1\CartController::class, 'update']);
    Route::delete('cart/{cart}', [App\Http\Controllers\Api\V1\CartController::class, 'destroy']);
    Route::delete('cart', [App\Http\Controllers\Api\V1\CartController::class, 'clear']);
    Route::post('cart/merge', [App\Http\Controllers\Api\V1\CartController::class, 'merge']);
    
    // Order routes
    Route::apiResource('orders', App\Http\Controllers\Api\V1\OrderController::class);
    Route::post('orders/{order}/status', [App\Http\Controllers\Api\V1\OrderController::class, 'updateStatus']);
    Route::post('orders/{order}/cancel', [App\Http\Controllers\Api\V1\OrderController::class, 'cancel']);
    
    // Vendor Reports routes (vendor & admin only)
    Route::prefix('reports')->middleware('role:vendor,admin')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\V1\VendorReportController::class, 'index']);
        Route::get('/show/{date}', [App\Http\Controllers\Api\V1\VendorReportController::class, 'show']);
        Route::post('/generate', [App\Http\Controllers\Api\V1\VendorReportController::class, 'generate']);
    });
});

