# API Testing Guide

This document provides cURL commands to test all the new API endpoints.

## Public Endpoints (No Authentication Required)

### Get Settings
```bash
# Get all settings
curl -X GET http://localhost:8000/api/v1/settings

# Get contact settings
curl -X GET http://localhost:8000/api/v1/settings/contact

# Get footer settings
curl -X GET http://localhost:8000/api/v1/settings/footer

# Get header settings
curl -X GET http://localhost:8000/api/v1/settings/header
```

### Blog - Public Access
```bash
# List blog posts
curl -X GET "http://localhost:8000/api/v1/blog/posts?page=1"

# Get single blog post
curl -X GET http://localhost:8000/api/v1/blog/posts/1

# Get blog post comments
curl -X GET "http://localhost:8000/api/v1/blog/posts/1/comments?page=1"

# List blog categories
curl -X GET http://localhost:8000/api/v1/blog/categories
```

## Protected Endpoints (Requires JWT Token)

### Authentication First
```bash
# Login to get token
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Product Reviews
```bash
# Get product reviews
curl -X GET http://localhost:8000/api/v1/products/1/reviews \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create a review
curl -X POST http://localhost:8000/api/v1/products/1/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"title":"Great product!","comment":"This is excellent!"}'

# Update a review
curl -X PUT http://localhost:8000/api/v1/reviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rating":4,"comment":"Updated review"}'

# Delete a review
curl -X DELETE http://localhost:8000/api/v1/reviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Admin: Approve a review
curl -X POST http://localhost:8000/api/v1/reviews/1/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Blog Management (Admin Only)
```bash
# Create blog post
curl -X POST http://localhost:8000/api/v1/blog/posts \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -F "blog_category_id=1" \
  -F "title=My First Blog Post" \
  -F "content=This is the blog post content" \
  -F "excerpt=Short excerpt" \
  -F "status=published" \
  -F "featured_image=@/path/to/image.jpg"

# Update blog post
curl -X PUT http://localhost:8000/api/v1/blog/posts/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"Updated content","status":"published"}'

# Delete blog post
curl -X DELETE http://localhost:8000/api/v1/blog/posts/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Add comment to blog post
curl -X POST http://localhost:8000/api/v1/blog/posts/1/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"Great post!"}'

# Delete blog comment
curl -X DELETE http://localhost:8000/api/v1/blog/comments/1 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Admin: Approve blog comment
curl -X POST http://localhost:8000/api/v1/blog/comments/1/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Create blog category
curl -X POST http://localhost:8000/api/v1/blog/categories \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Food Tips","description":"Tips about food","image":"https://example.com/image.jpg"}'

# Update blog category
curl -X PUT http://localhost:8000/api/v1/blog/categories/1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Category","is_active":true}'

# Delete blog category
curl -X DELETE http://localhost:8000/api/v1/blog/categories/1 \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Settings Management (Admin Only)
```bash
# Create contact settings
curl -X POST http://localhost:8000/api/v1/settings/contact \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name":"Grosarry",
    "company_description":"Online grocery store",
    "email":"contact@grosarry.com",
    "phone":"+1-800-123-4567",
    "address":"123 Main St",
    "city":"New York",
    "state":"NY",
    "postal_code":"10001",
    "country":"USA",
    "latitude":40.7128,
    "longitude":-74.0060,
    "facebook_url":"https://facebook.com/grosarry",
    "twitter_url":"https://twitter.com/grosarry",
    "instagram_url":"https://instagram.com/grosarry",
    "office_hours":{"monday":"9AM-6PM","tuesday":"9AM-6PM"}
  }'

# Update contact settings
curl -X PUT http://localhost:8000/api/v1/settings/contact \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1-800-987-6543","city":"Boston"}'

# Update footer settings
curl -X PUT http://localhost:8000/api/v1/settings/footer \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name":"Grosarry",
    "company_description":"Online grocery marketplace",
    "logo_url":"https://example.com/logo.png",
    "copyright_text":"© 2026 Grosarry",
    "contact_email":"support@grosarry.com",
    "quick_links":[
      {"title":"Home","url":"/"},
      {"title":"Shop","url":"/shop"}
    ],
    "social_links":{
      "facebook":"https://facebook.com/grosarry",
      "instagram":"https://instagram.com/grosarry"
    }
  }'

# Update header settings
curl -X PUT http://localhost:8000/api/v1/settings/header \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "logo_url":"https://example.com/logo.png",
    "logo_alt_text":"Grosarry Logo",
    "logo_height":50,
    "logo_width":150,
    "announcement_text":"Free shipping on orders over $50!",
    "show_announcement":true,
    "show_search":true,
    "show_cart":true,
    "show_account":true,
    "primary_color":"#007bff",
    "menu_items":[
      {"label":"Home","url":"/"},
      {"label":"Shop","url":"/shop"}
    ]
  }'
```

### Products with Video and Reviews
```bash
# Create product with video
curl -X POST http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id":1,
    "name":"Fresh Organic Apples",
    "description":"Delicious fresh apples",
    "short_description":"Fresh apples",
    "video_url":"https://example.com/video.mp4",
    "price":29.99,
    "stock_quantity":100,
    "track_stock":true
  }'

# Update product with video
curl -X PUT http://localhost:8000/api/v1/products/1 \
  -H "Authorization: Bearer VENDOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "video_url":"https://example.com/new-video.mp4",
    "price":24.99
  }'

# Get product details (includes images, videos, reviews, average rating)
curl -X GET http://localhost:8000/api/v1/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Expected Response Format

### Product Details with Images and Reviews
```json
{
  "data": {
    "id": 1,
    "name": "Fresh Organic Apples",
    "description": "Delicious fresh apples",
    "video_url": "https://example.com/video.mp4",
    "price": 29.99,
    "images": [
      {
        "id": 1,
        "image_path": "http://localhost:8000/storage/products/image1.jpg",
        "is_primary": true,
        "sort_order": 0
      },
      {
        "id": 2,
        "image_path": "http://localhost:8000/storage/products/image2.jpg",
        "is_primary": false,
        "sort_order": 1
      }
    ],
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Excellent product!",
        "comment": "Very fresh and tasty",
        "user": {
          "id": 1,
          "name": "John Doe"
        }
      }
    ],
    "reviews_count": 1,
    "average_rating": 5.0
  }
}
```

### Blog Post with Comments
```json
{
  "data": {
    "id": 1,
    "title": "Fresh Organic Tips",
    "content": "How to store fresh vegetables...",
    "excerpt": "Tips on storing vegetables",
    "featured_image": "http://localhost:8000/storage/blog/image.jpg",
    "status": "published",
    "published_at": "2026-01-10T10:00:00Z",
    "views_count": 42,
    "comments_count": 5,
    "category": {
      "id": 1,
      "name": "Food Tips"
    },
    "author": {
      "id": 1,
      "name": "Admin User"
    }
  }
}
```

### Contact Settings
```json
{
  "data": {
    "id": 1,
    "company_name": "Grosarry",
    "email": "contact@grosarry.com",
    "phone": "+1-800-123-4567",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postal_code": "10001",
    "country": "USA",
    "facebook_url": "https://facebook.com/grosarry",
    "twitter_url": "https://twitter.com/grosarry",
    "instagram_url": "https://instagram.com/grosarry",
    "office_hours": {
      "monday": "9:00 AM - 6:00 PM",
      "tuesday": "9:00 AM - 6:00 PM"
    }
  }
}
```
