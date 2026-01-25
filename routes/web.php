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

Route::prefix('admin')->group(function () {
    Route::view('/{any?}', 'app')->where('any', '.*');
});

// Marketplace SPA - catch all other routes EXCEPT api
Route::view('/{any?}', 'app')->where('any', '^(?!api).*$');
