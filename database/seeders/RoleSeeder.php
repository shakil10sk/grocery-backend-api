<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * Role Seeder
 * 
 * Creates default roles and permissions for the application
 */
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Product permissions
            'products.create',
            'products.view',
            'products.update',
            'products.delete',
            'products.approve',
            
            // Order permissions
            'orders.view',
            'orders.update',
            'orders.cancel',
            'orders.assign_delivery',
            
            // Category permissions
            'categories.create',
            'categories.view',
            'categories.update',
            'categories.delete',
            
            // User permissions
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            
            // Vendor permissions
            'vendors.view',
            'vendors.approve',
            'vendors.suspend',
            
            // Delivery permissions
            'delivery.view',
            'delivery.assign',
            
            // Payment permissions
            'payments.view',
            'payments.process',
            
            // Settings permissions
            'settings.view',
            'settings.update',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $vendorRole = Role::firstOrCreate(['name' => 'vendor']);
        $deliveryBoyRole = Role::firstOrCreate(['name' => 'delivery_boy']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);

        // Assign all permissions to admin
        $adminRole->givePermissionTo(Permission::all());

        // Assign permissions to vendor
        $vendorRole->givePermissionTo([
            'products.create',
            'products.view',
            'products.update',
            'products.delete',
            'orders.view',
            'orders.update',
        ]);

        // Assign permissions to delivery boy
        $deliveryBoyRole->givePermissionTo([
            'orders.view',
            'orders.update',
        ]);

        // Customer has no special permissions (default access)
    }
}
