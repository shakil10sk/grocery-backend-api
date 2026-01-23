<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class VendorReport extends Model
{
    protected $fillable = [
        'vendor_id',
        'report_date',
        'total_products_created',
        'total_products_updated',
        'total_orders',
        'total_revenue',
        'total_items_sold',
        'total_cart_additions',
        'total_cart_removals',
        'total_product_views',
        'total_product_wishlists',
        'best_selling_product_id',
        'best_selling_product_quantity',
        'most_viewed_product_id',
        'most_viewed_product_count',
        'most_added_to_cart_product_id',
        'most_added_to_cart_count',
        'total_unique_buyers',
        'new_customers',
        'returning_customers',
        'average_order_value',
        'average_rating',
        'total_reviews_received',
        'product_breakdown',
        'category_breakdown',
        'hourly_sales',
    ];

    protected $casts = [
        'report_date' => 'date',
        'total_products_created' => 'integer',
        'total_products_updated' => 'integer',
        'total_orders' => 'integer',
        'total_revenue' => 'decimal:2',
        'total_items_sold' => 'integer',
        'total_cart_additions' => 'integer',
        'total_cart_removals' => 'integer',
        'total_product_views' => 'integer',
        'total_product_wishlists' => 'integer',
        'best_selling_product_quantity' => 'integer',
        'most_viewed_product_count' => 'integer',
        'most_added_to_cart_count' => 'integer',
        'total_unique_buyers' => 'integer',
        'new_customers' => 'integer',
        'returning_customers' => 'integer',
        'average_order_value' => 'decimal:2',
        'average_rating' => 'decimal:2',
        'total_reviews_received' => 'integer',
        'product_breakdown' => 'array',
        'category_breakdown' => 'array',
        'hourly_sales' => 'array',
    ];

    /**
     * Get the vendor that owns the report
     */
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    /**
     * Get the best selling product
     */
    public function bestSellingProduct()
    {
        return $this->belongsTo(Product::class, 'best_selling_product_id');
    }

    /**
     * Get the most viewed product
     */
    public function mostViewedProduct()
    {
        return $this->belongsTo(Product::class, 'most_viewed_product_id');
    }

    /**
     * Get the most added to cart product
     */
    public function mostAddedToCartProduct()
    {
        return $this->belongsTo(Product::class, 'most_added_to_cart_product_id');
    }

    /**
     * Scope to get reports for a specific vendor
     */
    public function scopeForVendor($query, $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    /**
     * Scope to get reports for a date range
     */
    public function scopeDateRange($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('report_date', [$startDate, $endDate]);
    }

    /**
     * Scope to get today's report
     */
    public function scopeForToday($query)
    {
        return $query->whereDate('report_date', today());
    }

    /**
     * Scope to get this month's reports
     */
    public function scopeForMonth($query, $month = null, $year = null)
    {
        $month = $month ?? now()->month;
        $year = $year ?? now()->year;
        
        return $query->whereYear('report_date', $year)
                     ->whereMonth('report_date', $month);
    }

    /**
     * Get the cart conversion rate
     */
    public function getCartConversionRate()
    {
        if ($this->total_cart_additions == 0) {
            return 0;
        }
        return round(($this->total_orders / $this->total_cart_additions) * 100, 2);
    }

    /**
     * Get the wishlist to sale conversion
     */
    public function getWishlistConversion()
    {
        if ($this->total_product_wishlists == 0) {
            return 0;
        }
        return round(($this->total_orders / $this->total_product_wishlists) * 100, 2);
    }

    /**
     * Get the view to sale conversion
     */
    public function getViewConversion()
    {
        if ($this->total_product_views == 0) {
            return 0;
        }
        return round(($this->total_orders / $this->total_product_views) * 100, 2);
    }
}
