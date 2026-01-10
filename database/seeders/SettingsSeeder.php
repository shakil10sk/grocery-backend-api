<?php

namespace Database\Seeders;

use App\Models\ContactSettings;
use App\Models\FooterSettings;
use App\Models\HeaderSettings;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default contact settings
        ContactSettings::firstOrCreate(
            ['company_name' => 'Grosarry'],
            [
                'company_description' => 'Your trusted online grocery marketplace',
                'email' => 'info@grosarry.com',
                'phone' => '+1-800-123-4567',
                'address' => '123 Business Street',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'USA',
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'facebook_url' => 'https://facebook.com/grosarry',
                'twitter_url' => 'https://twitter.com/grosarry',
                'instagram_url' => 'https://instagram.com/grosarry',
                'linkedin_url' => 'https://linkedin.com/company/grosarry',
                'youtube_url' => 'https://youtube.com/@grosarry',
                'office_hours' => [
                    'monday' => '9:00 AM - 6:00 PM',
                    'tuesday' => '9:00 AM - 6:00 PM',
                    'wednesday' => '9:00 AM - 6:00 PM',
                    'thursday' => '9:00 AM - 6:00 PM',
                    'friday' => '9:00 AM - 6:00 PM',
                    'saturday' => '10:00 AM - 4:00 PM',
                    'sunday' => 'Closed',
                ],
            ]
        );

        // Create default footer settings
        FooterSettings::firstOrCreate(
            ['id' => 1],
            [
                'company_name' => 'Grosarry',
                'company_description' => 'Your trusted online grocery marketplace for fresh, quality produce delivered to your doorstep.',
                'logo_url' => 'https://via.placeholder.com/150x50?text=Grosarry',
                'copyright_text' => '© 2026 Grosarry. All rights reserved.',
                'quick_links' => [
                    ['title' => 'Home', 'url' => '/'],
                    ['title' => 'Shop', 'url' => '/shop'],
                    ['title' => 'Blog', 'url' => '/blog'],
                    ['title' => 'Contact', 'url' => '/contact'],
                ],
                'company_links' => [
                    ['title' => 'About Us', 'url' => '/about'],
                    ['title' => 'Careers', 'url' => '/careers'],
                    ['title' => 'Press', 'url' => '/press'],
                ],
                'support_links' => [
                    ['title' => 'Help Center', 'url' => '/help'],
                    ['title' => 'Track Order', 'url' => '/track'],
                    ['title' => 'Returns', 'url' => '/returns'],
                ],
                'legal_links' => [
                    ['title' => 'Privacy Policy', 'url' => '/privacy'],
                    ['title' => 'Terms of Service', 'url' => '/terms'],
                    ['title' => 'Cookie Policy', 'url' => '/cookies'],
                ],
                'contact_email' => 'support@grosarry.com',
                'contact_phone' => '+1-800-123-4567',
                'facebook_url' => 'https://facebook.com/grosarry',
                'twitter_url' => 'https://twitter.com/grosarry',
                'instagram_url' => 'https://instagram.com/grosarry',
                'linkedin_url' => 'https://linkedin.com/company/grosarry',
                'youtube_url' => 'https://youtube.com/@grosarry',
                'payment_methods' => ['credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay'],
            ]
        );

        // Create default header settings
        HeaderSettings::firstOrCreate(
            ['id' => 1],
            [
                'logo_url' => 'https://via.placeholder.com/150x50?text=Grosarry',
                'logo_alt_text' => 'Grosarry - Fresh Groceries Online',
                'logo_height' => 50,
                'logo_width' => 150,
                'menu_items' => [
                    ['label' => 'Home', 'url' => '/'],
                    ['label' => 'Shop', 'url' => '/shop'],
                    ['label' => 'Categories', 'url' => '/categories'],
                    ['label' => 'Blog', 'url' => '/blog'],
                    ['label' => 'Contact', 'url' => '/contact'],
                ],
                'announcement_text' => 'Free shipping on orders over $50!',
                'announcement_background_color' => '#28a745',
                'announcement_text_color' => '#ffffff',
                'show_announcement' => true,
                'show_search' => true,
                'show_cart' => true,
                'show_account' => true,
                'primary_color' => '#007bff',
                'secondary_color' => '#6c757d',
            ]
        );
    }
}
