<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RoleSeeder::class,
        ]);

        // Create demo admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@grocery.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'status' => 'active',
            ]
        );
        $admin->assignRole('admin');

        // Create demo vendor
        $vendor = User::firstOrCreate(
            ['email' => 'vendor@grocery.com'],
            [
                'name' => 'Demo Vendor',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'status' => 'active',
            ]
        );
        $vendor->assignRole('vendor');

        // Create Vendor Profile (CRITICAL for visibility)
        \App\Models\VendorProfile::firstOrCreate(
            ['user_id' => $vendor->id],
            [
                'store_name' => 'Fresh Grocery Store',
                'store_slug' => 'fresh-grocery-store',
                'description' => 'Best fresh groceries in town',
                'phone' => '+1234567890',
                'email' => 'vendor@grocery.com',
                'address' => '123 Market Street',
                'city' => 'New York',
                'state' => 'NY',
                'country' => 'USA',
                'postal_code' => '10001',
                'status' => 'approved',
                'is_verified' => true,
                'commission_rate' => 10.00,
            ]
        );

        // Create demo customer
        $customer = User::firstOrCreate(
            ['email' => 'customer@grocery.com'],
            [
                'name' => 'Demo Customer',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'status' => 'active',
            ]
        );
        $customer->assignRole('customer');

        // Create demo delivery boy
        $deliveryBoy = User::firstOrCreate(
            ['email' => 'delivery@grocery.com'],
            [
                'name' => 'Demo Delivery Boy',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'status' => 'active',
            ]
        );
        $deliveryBoy->assignRole('delivery_boy');

        // Create Categories
        $fruits = \App\Models\Category::firstOrCreate(
            ['slug' => 'fruits'],
            ['name' => 'Fruits', 'description' => 'Fresh Fruits', 'is_active' => true, 'sort_order' => 1]
        );
        $vegetables = \App\Models\Category::firstOrCreate(
            ['slug' => 'vegetables'],
            ['name' => 'Vegetables', 'description' => 'Fresh Vegetables', 'is_active' => true, 'sort_order' => 2]
        );

        // Create Products
        \App\Models\Product::firstOrCreate(
            ['slug' => 'fresh-apple'],
            [
                'vendor_id' => $vendor->id,
                'category_id' => $fruits->id,
                'name' => 'Fresh Apple',
                'description' => 'Sweet and crunchy apples',
                'price' => 2.99,
                'stock_quantity' => 100,
                'track_stock' => true,
                'is_active' => true,
                'status' => 'approved',
                'sku' => 'APPLE-001',
            ]
        );

        \App\Models\Product::firstOrCreate(
            ['slug' => 'fresh-carrot'],
            [
                'vendor_id' => $vendor->id,
                'category_id' => $vegetables->id,
                'name' => 'Fresh Carrot',
                'description' => 'Organic carrots',
                'price' => 1.50,
                'stock_quantity' => 50,
                'track_stock' => true,
                'is_active' => true,
                'status' => 'approved',
                'sku' => 'CARROT-001',
            ]
        );
    }
}
