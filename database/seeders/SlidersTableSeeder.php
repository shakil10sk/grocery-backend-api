<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SlidersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if sliders table is empty
        if (DB::table('sliders')->count() > 0) {
            return;
        }

        $sliders = [
            [
                'title' => 'Fresh Organic Groceries',
                'description' => 'Get the best quality fresh and organic vegetables delivered to your doorstep.',
                'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920',
                'link_url' => '/shop',
                'link_text' => 'Shop Now',
                'order' => 1,
                'is_active' => true,
                'button_color' => '#10b981',
                'text_overlay_color' => '#ffffff',
                'overlay_opacity' => '40',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Weekly Mega Sale',
                'description' => 'Up to 50% off on all imported fruits. Limited time offer!',
                'image_url' => 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1920',
                'link_url' => '/shop?category=fruits',
                'link_text' => 'View Offers',
                'order' => 2,
                'is_active' => true,
                'button_color' => '#f59e0b',
                'text_overlay_color' => '#ffffff',
                'overlay_opacity' => '30',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'title' => 'Artisanal Bakery',
                'description' => 'Freshly baked breads, pastries and cakes from top local bakers.',
                'image_url' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1920',
                'link_url' => '/shop?category=bakery',
                'link_text' => 'Order Now',
                'order' => 3,
                'is_active' => true,
                'button_color' => '#ec4899',
                'text_overlay_color' => '#ffffff',
                'overlay_opacity' => '35',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('sliders')->insert($sliders);
    }
}
