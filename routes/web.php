<?php

use Illuminate\Support\Facades\Route;

// Removed default Laravel web login route

// Route::get('/', function () {
//     return 'start';
// });
// Admin SPA - catch all routes under /admin prefix
// Route::prefix('admin')->group(function () {
//     Route::view('/{any?}', 'admin')->where('any', '.*')->name('admin');
// });
Route::view('/', 'app');

// Marketplace SPA - catch all routes (must be last)
// Route::view('/{any?}', 'welcome')->where('any', '.*')->name('marketplace');

Route::view('/admin/{any?}', 'app')->where('any', '.*');
Route::view('/marketplace/{any?}', 'app')->where('any', '.*');
