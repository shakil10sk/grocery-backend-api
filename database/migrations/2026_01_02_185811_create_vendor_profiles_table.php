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
        Schema::create('vendor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('store_name');
            $table->string('store_slug')->unique();
            $table->text('description')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->text('address');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('postal_code');
            $table->string('country')->default('US');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->decimal('commission_rate', 5, 2)->default(0); // Percentage
            $table->decimal('total_earnings', 12, 2)->default(0);
            $table->decimal('pending_earnings', 12, 2)->default(0);
            $table->decimal('available_balance', 12, 2)->default(0);
            $table->enum('status', ['pending', 'approved', 'suspended', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_profiles');
    }
};
