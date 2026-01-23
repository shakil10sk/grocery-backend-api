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
        Schema::create('vendor_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            $table->date('report_date')->index();
            
            // Product metrics
            $table->integer('total_products_created')->default(0);
            $table->integer('total_products_updated')->default(0);
            
            // Sales metrics
            $table->integer('total_orders')->default(0);
            $table->decimal('total_revenue', 12, 2)->default(0);
            $table->integer('total_items_sold')->default(0);
            
            // Cart metrics
            $table->integer('total_cart_additions')->default(0);
            $table->integer('total_cart_removals')->default(0);
            
            // Interest metrics
            $table->integer('total_product_views')->default(0);
            $table->integer('total_product_wishlists')->default(0);
            
            // Best performers
            $table->string('best_selling_product_id')->nullable();
            $table->integer('best_selling_product_quantity')->default(0);
            $table->string('most_viewed_product_id')->nullable();
            $table->integer('most_viewed_product_count')->default(0);
            $table->string('most_added_to_cart_product_id')->nullable();
            $table->integer('most_added_to_cart_count')->default(0);
            
            // Customer metrics
            $table->integer('total_unique_buyers')->default(0);
            $table->integer('new_customers')->default(0);
            $table->integer('returning_customers')->default(0);
            
            // Average metrics
            $table->decimal('average_order_value', 12, 2)->default(0);
            $table->decimal('average_rating', 3, 2)->nullable();
            $table->integer('total_reviews_received')->default(0);
            
            // Additional data (stored as JSON for flexibility)
            $table->json('product_breakdown')->nullable();
            $table->json('category_breakdown')->nullable();
            $table->json('hourly_sales')->nullable();
            
            $table->timestamps();
            $table->index(['vendor_id', 'report_date']);
            $table->unique(['vendor_id', 'report_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_reports');
    }
};
