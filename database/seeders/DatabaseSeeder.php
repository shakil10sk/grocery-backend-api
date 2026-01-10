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
    }
}
