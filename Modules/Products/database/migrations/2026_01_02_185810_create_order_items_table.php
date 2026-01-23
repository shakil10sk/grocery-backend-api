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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->foreignId('product_id')->constrained()->onDelete('restrict');
            $table->unsignedBigInteger('product_variation_id')->nullable();
            $table->string('product_name'); // Snapshot
            $table->string('product_sku')->nullable(); // Snapshot
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2); // Snapshot price
            $table->decimal('total_price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
