<?php
use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Support\Str;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$cat = BlogCategory::first() ?? BlogCategory::create(['name' => 'General', 'slug' => 'general']);
$admin = User::role('admin')->first();

if (!$admin) {
    echo "No admin user found\n";
    exit(1);
}

// Clean up previous test posts
BlogPost::where('slug', 'test-published-post')->delete();
BlogPost::where('slug', 'test-draft-post')->delete();
BlogPost::where('slug', 'test-scheduled-post')->delete();

BlogPost::create([
    'blog_category_id' => $cat->id,
    'user_id' => $admin->id,
    'title' => 'Test Published Post',
    'slug' => 'test-published-post',
    'content' => 'Content',
    'status' => 'published',
    'published_at' => now()->subDay()
]);

BlogPost::create([
    'blog_category_id' => $cat->id,
    'user_id' => $admin->id,
    'title' => 'Test Draft Post',
    'slug' => 'test-draft-post',
    'content' => 'Content',
    'status' => 'draft',
    'published_at' => null
]);

BlogPost::create([
    'blog_category_id' => $cat->id,
    'user_id' => $admin->id,
    'title' => 'Test Scheduled Post',
    'slug' => 'test-scheduled-post',
    'content' => 'Content',
    'status' => 'published',
    'published_at' => now()->addDay()
]);

echo "Test posts created successfully.\n";
