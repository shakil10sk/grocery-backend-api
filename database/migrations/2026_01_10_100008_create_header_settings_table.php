<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('header_settings', function (Blueprint $table) {
            $table->id();
            $table->string('logo_url')->nullable();
            $table->string('logo_alt_text')->nullable();
            $table->integer('logo_height')->nullable();
            $table->integer('logo_width')->nullable();
            $table->json('menu_items')->nullable(); // Array of menu items
            $table->string('announcement_text')->nullable();
            $table->string('announcement_background_color')->nullable();
            $table->string('announcement_text_color')->nullable();
            $table->boolean('show_announcement')->default(false);
            $table->boolean('show_search')->default(true);
            $table->boolean('show_cart')->default(true);
            $table->boolean('show_account')->default(true);
            $table->string('primary_color')->nullable();
            $table->string('secondary_color')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('header_settings');
    }
};
