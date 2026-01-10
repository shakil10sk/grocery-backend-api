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
        Schema::create('delivery_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('license_number')->nullable();
            $table->string('vehicle_type')->nullable(); // bike, car, motorcycle
            $table->string('vehicle_number')->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->decimal('total_earnings', 12, 2)->default(0);
            $table->decimal('pending_earnings', 12, 2)->default(0);
            $table->decimal('available_balance', 12, 2)->default(0);
            $table->boolean('is_available')->default(true);
            $table->decimal('current_latitude', 10, 8)->nullable();
            $table->decimal('current_longitude', 11, 8)->nullable();
            $table->timestamp('last_location_update')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_profiles');
    }
};
