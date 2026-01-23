<?php

use Illuminate\Support\Facades\Route;

// Admin SPA - catch all routes under /admin prefix
Route::prefix('admin')->group(function () {
    Route::view('/{any?}', 'admin')->where('any', '.*')->name('admin');
});

// Marketplace SPA - catch all routes (must be last)
Route::view('/{any?}', 'welcome')->where('any', '.*')->name('marketplace');
