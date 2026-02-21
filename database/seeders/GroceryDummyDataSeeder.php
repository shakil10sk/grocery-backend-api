<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Slider;
use App\Models\Review;
use Modules\Products\Models\Category;
use Modules\Products\Models\Product;
use Modules\Products\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GroceryDummyDataSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

        // 0. Clean up existing data
        Product::truncate();
        Category::truncate();
        ProductImage::truncate();
        Review::truncate();
        // We don't truncate users because of roles/permissions, but we'll manage vendors specifically

        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 1. Ensure Demo Vendors exist
        $vendors = [];
        $vendorData = [
            ['name' => 'Green Valley Organics', 'email' => 'green@vendor.com'],
            ['name' => 'Dairy Fresh', 'email' => 'dairy@vendor.com'],
            ['name' => 'Baker\'s Delight', 'email' => 'bakers@vendor.com'],
            ['name' => 'Fisherman\'s Wharf', 'email' => 'fish@vendor.com'],
            ['name' => 'Meat Masters', 'email' => 'meat@vendor.com'],
        ];

        foreach ($vendorData as $data) {
            $vendor = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'phone_verified_at' => now(),
                    'status' => 'active',
                ]
            );
            $vendor->syncRoles(['vendor']);

            \App\Models\VendorProfile::firstOrCreate(
                ['user_id' => $vendor->id],
                [
                    'store_name' => $data['name'],
                    'store_slug' => Str::slug($data['name']),
                    'description' => 'Best ' . strtolower($data['name']) . ' products in the city.',
                    'phone' => '+1' . rand(1000000000, 9999999999),
                    'email' => $data['email'],
                    'address' => rand(100, 999) . ' Market Street',
                    'city' => 'New York',
                    'state' => 'NY',
                    'country' => 'USA',
                    'postal_code' => '10001',
                    'status' => 'approved',
                    'is_verified' => true,
                    'commission_rate' => 10.00,
                    'logo' => 'https://api.dicebear.com/7.x/initials/svg?seed=' . urlencode($data['name']),
                    'cover_image' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
                ]
            );
            $vendors[] = $vendor;
        }

        // 2. Categories
        $categories = [
            [
                'name' => 'Vegetables',
                'slug' => 'vegetables',
                'image' => 'https://images.unsplash.com/photo-1566385101042-1a000c1268c4?auto=format&fit=crop&q=80&w=400',
                'sub' => ['Leafy Greens', 'Root Vegetables', 'Cruciferous', 'Nightshade']
            ],
            [
                'name' => 'Fruits',
                'slug' => 'fruits',
                'image' => 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=400',
                'sub' => ['Tropical', 'Berries', 'Citrus', 'Melons']
            ],
            [
                'name' => 'Meat & Fish',
                'slug' => 'meat-fish',
                'image' => 'https://images.unsplash.com/photo-1607623198457-7acd076af7ed?auto=format&fit=crop&q=80&w=400',
                'sub' => ['Beef', 'Chicken', 'Fish', 'Seafood']
            ],
            [
                'name' => 'Dairy & Bakery',
                'slug' => 'dairy-bakery',
                'image' => 'https://images.unsplash.com/photo-1528498033973-3c071744fe91?auto=format&fit=crop&q=80&w=400',
                'sub' => ['Milk', 'Cheese', 'Bread', 'Cakes']
            ],
            [
                'name' => 'Beverages',
                'slug' => 'beverages',
                'image' => 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
                'sub' => ['Soft Drinks', 'Coffee & Tea', 'Juices', 'Water']
            ],
        ];

        foreach ($categories as $index => $catData) {
            $parent = Category::firstOrCreate(
                ['slug' => $catData['slug']],
                [
                    'name' => $catData['name'],
                    'description' => 'Best ' . $catData['name'] . ' collection.',
                    'image' => $catData['image'],
                    'is_active' => true,
                    'sort_order' => $index + 1
                ]
            );

            foreach ($catData['sub'] as $subIndex => $subName) {
                Category::firstOrCreate(
                    ['slug' => Str::slug($subName)],
                    [
                        'parent_id' => $parent->id,
                        'name' => $subName,
                        'description' => $subName . ' subcategory.',
                        'is_active' => true,
                        'sort_order' => $subIndex + 1
                    ]
                );
            }
        }

        // 3. Products
        $productSamples = [
            'vegetables' => [
                ['name' => 'Organic Spinach', 'price' => 2.50, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Carrots', 'price' => 1.20, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Red Bell Pepper', 'price' => 0.80, 'unit' => 'piece', 'image' => 'https://images.unsplash.com/photo-1563513307168-a400c4382790?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Broccoli', 'price' => 1.50, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1452948491233-ad8a1ed01085?auto=format&fit=crop&q=80&w=400'],
            ],
            'fruits' => [
                ['name' => 'Honeycrisp Apples', 'price' => 3.99, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Bananas', 'price' => 0.99, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1571771894821-ad9b588647d6?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Organic Strawberries', 'price' => 4.50, 'unit' => 'box', 'image' => 'https://images.unsplash.com/photo-1464960320293-d001b239ef0e?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Avocado', 'price' => 1.99, 'unit' => 'piece', 'image' => 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400'],
            ],
            'meat-fish' => [
                ['name' => 'Chicken Breast', 'price' => 6.99, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Salmon Fillet', 'price' => 12.50, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Ground Beef', 'price' => 8.99, 'unit' => 'kg', 'image' => 'https://images.unsplash.com/photo-1588168333986-50d8184b2288?auto=format&fit=crop&q=80&w=400'],
            ],
            'dairy-bakery' => [
                ['name' => 'Whole Milk', 'price' => 1.50, 'unit' => 'liter', 'image' => 'https://images.unsplash.com/photo-1563636619-e910f01ff1a5?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Fresh Sourdough Bread', 'price' => 3.50, 'unit' => 'piece', 'image' => 'https://images.unsplash.com/photo-1585478259715-876a6a84fc08?auto=format&fit=crop&q=80&w=400'],
                ['name' => 'Organic Eggs', 'price' => 2.99, 'unit' => 'dozen', 'image' => 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?auto=format&fit=crop&q=80&w=400'],
            ],
        ];

        foreach ($productSamples as $catSlug => $items) {
            $cat = Category::where('slug', $catSlug)->first();
            if (!$cat) continue;

            foreach ($items as $item) {
                $vendor = $vendors[array_rand($vendors)];
                $product = Product::firstOrCreate(
                    ['slug' => Str::slug($item['name'])],
                    [
                        'vendor_id' => $vendor->id,
                        'category_id' => $cat->id,
                        'name' => $item['name'],
                        'description' => 'Premium quality ' . $item['name'] . ' for your daily needs.',
                        'short_description' => 'Fresh and organic ' . $item['name'],
                        'sku' => strtoupper(Str::random(8)),
                        'price' => $item['price'],
                        'compare_at_price' => $item['price'] * 1.2,
                        'stock_quantity' => rand(20, 200),
                        'track_stock' => true,
                        'is_active' => true,
                        'is_featured' => rand(0, 1),
                        'status' => 'approved',
                        'unit' => $item['unit'],
                        'weight' => rand(1, 10) / 10,
                    ]
                );

                // Add images
                ProductImage::firstOrCreate(
                    ['product_id' => $product->id, 'image_path' => $item['image']],
                    ['is_primary' => true, 'sort_order' => 0]
                );

                // Add dummy reviews
                for($i=0; $i<rand(2, 5); $i++) {
                    Review::create([
                        'product_id' => $product->id,
                        'user_id' => User::where('email', 'customer@grocery.com')->first()->id ?? 1,
                        'rating' => rand(4, 5),
                        'comment' => 'Excellent product, very fresh and high quality!',
                        'is_approved' => true
                    ]);
                }
            }
        }

        // 4. Sliders
        Slider::truncate();
        $sliders = [
            [
                'title' => 'Fresh Organic Vegetables',
                'description' => 'Get up to 30% off on first order of organic greens.',
                'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
                'link_url' => '/products?category=vegetables',
                'link_text' => 'Shop Now',
                'button_color' => '#10b981',
                'overlay_opacity' => 40
            ],
            [
                'title' => 'Premium Meat Selection',
                'description' => 'Quality cuts delivered to your doorstep within 2 hours.',
                'image_url' => 'https://images.unsplash.com/photo-1607623198457-7acd076af7ed?auto=format&fit=crop&q=80&w=1200',
                'link_url' => '/products?category=meat-fish',
                'link_text' => 'Order Now',
                'button_color' => '#ef4444',
                'overlay_opacity' => 30
            ],
            [
                'title' => 'Freshly Baked Goodness',
                'description' => 'Artisanal bread and cakes baked fresh every morning.',
                'image_url' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
                'link_url' => '/products?category=dairy-bakery',
                'link_text' => 'Explore Bakery',
                'button_color' => '#f59e0b',
                'overlay_opacity' => 50
            ],
        ];

        foreach ($sliders as $index => $sliderData) {
            Slider::create(array_merge($sliderData, [
                'order' => $index + 1,
                'is_active' => true,
                'start_date' => now(),
            ]));
        }
    }
}
