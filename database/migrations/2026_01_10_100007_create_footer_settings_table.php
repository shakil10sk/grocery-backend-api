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
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->text('company_description')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('copyright_text')->nullable();
            $table->json('quick_links')->nullable(); // Array of {title, url}
            $table->json('company_links')->nullable(); // Array of {title, url}
            $table->json('support_links')->nullable(); // Array of {title, url}
            $table->json('legal_links')->nullable(); // Array of {title, url}
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->text('payment_methods')->nullable(); // JSON format
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};
