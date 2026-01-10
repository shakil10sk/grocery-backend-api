# Database Schema Documentation

Complete database schema reference for the Grocery Multi-Vendor Platform.

## 📊 Overview

The database consists of **16+ core tables** plus Spatie permissions tables, designed for scalability and performance.

## 🗄 Core Tables

### users

Main user table supporting multiple roles.

**Columns:**
- `id` (bigint, primary key)
- `name` (string)
- `email` (string, unique, nullable)
- `phone` (string, unique, nullable)
- `email_verified_at` (timestamp, nullable)
- `phone_verified_at` (timestamp, nullable)
- `password` (string, hashed)
- `avatar` (string, nullable)
- `language` (string, default: 'en')
- `status` (enum: 'active', 'inactive', 'suspended', default: 'active')
- `fcm_token` (string, nullable) - For push notifications
- `remember_token` (string, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable) - Soft delete

**Indexes:**
- `email` (unique)
- `phone` (unique)

**Relationships:**
- Has many `addresses`
- Has one `vendorProfile`
- Has one `deliveryProfile`
- Has many `orders` (as customer)
- Has many `vendorOrders` (as vendor)
- Has many `deliveryOrders` (as delivery boy)
- Has many `cartItems`

---

### addresses

User delivery addresses.

**Columns:**
- `id` (bigint, primary key)
- `user_id` (bigint, foreign key → users.id)
- `type` (string, default: 'home') - home, work, other
- `label` (string, nullable) - Home, Office, etc.
- `first_name` (string)
- `last_name` (string)
- `phone` (string)
- `address_line_1` (text)
- `address_line_2` (text, nullable)
- `city` (string)
- `state` (string, nullable)
- `postal_code` (string)
- `country` (string, default: 'US')
- `latitude` (decimal(10,8), nullable)
- `longitude` (decimal(11,8), nullable)
- `is_default` (boolean, default: false)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

**Indexes:**
- `user_id`

**Relationships:**
- Belongs to `user`

---

### categories

Product categories with hierarchical support.

**Columns:**
- `id` (bigint, primary key)
- `parent_id` (bigint, nullable, foreign key → categories.id)
- `name` (string)
- `slug` (string, unique)
- `description` (text, nullable)
- `image` (string, nullable)
- `sort_order` (integer, default: 0)
- `is_active` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

**Indexes:**
- `slug` (unique)
- `parent_id`

**Relationships:**
- Belongs to `parent` (self-referential)
- Has many `children`
- Has many `products`

---

### products

Vendor products with approval workflow.

**Columns:**
- `id` (bigint, primary key)
- `vendor_id` (bigint, foreign key → users.id)
- `category_id` (bigint, foreign key → categories.id)
- `name` (string)
- `slug` (string, unique)
- `description` (text, nullable)
- `short_description` (text, nullable)
- `sku` (string, unique, nullable)
- `price` (decimal(10,2))
- `compare_at_price` (decimal(10,2), nullable)
- `stock_quantity` (integer, default: 0)
- `track_stock` (boolean, default: true)
- `is_active` (boolean, default: false) - Requires admin approval
- `is_featured` (boolean, default: false)
- `status` (enum: 'pending', 'approved', 'rejected', default: 'pending')
- `rejection_reason` (text, nullable)
- `weight` (decimal(8,2), nullable)
- `unit` (string, default: 'kg') - kg, g, lb, oz, piece
- `meta` (json, nullable) - SEO, custom fields
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

**Indexes:**
- `vendor_id`, `is_active`
- `category_id`, `is_active`
- `slug` (unique)
- `sku` (unique)

**Relationships:**
- Belongs to `vendor` (user)
- Belongs to `category`
- Has many `variations`
- Has many `images`
- Has many `orderItems`

---

### product_variations

Product size/weight variations.

**Columns:**
- `id` (bigint, primary key)
- `product_id` (bigint, foreign key → products.id)
- `name` (string) - e.g., "1kg", "500g", "Red", "Large"
- `sku` (string, unique, nullable)
- `price` (decimal(10,2))
- `compare_at_price` (decimal(10,2), nullable)
- `stock_quantity` (integer, default: 0)
- `is_default` (boolean, default: false)
- `sort_order` (integer, default: 0)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `product_id`
- `sku` (unique)

**Relationships:**
- Belongs to `product`

---

### product_images

Product images.

**Columns:**
- `id` (bigint, primary key)
- `product_id` (bigint, foreign key → products.id)
- `image_path` (string)
- `sort_order` (integer, default: 0)
- `is_primary` (boolean, default: false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `product_id`

**Relationships:**
- Belongs to `product`

---

### carts

Shopping carts with guest support.

**Columns:**
- `id` (bigint, primary key)
- `user_id` (bigint, nullable, foreign key → users.id)
- `session_id` (string, nullable) - For guest carts
- `product_id` (bigint, foreign key → products.id)
- `product_variation_id` (bigint, nullable, foreign key → product_variations.id)
- `quantity` (integer)
- `price` (decimal(10,2)) - Snapshot price at add time
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `user_id`, `product_id`
- `session_id`, `product_id`

**Relationships:**
- Belongs to `user` (nullable)
- Belongs to `product`
- Belongs to `productVariation` (nullable)

---

### orders

Customer orders with vendor splitting.

**Columns:**
- `id` (bigint, primary key)
- `order_number` (string, unique)
- `customer_id` (bigint, foreign key → users.id)
- `vendor_id` (bigint, foreign key → users.id)
- `delivery_boy_id` (bigint, nullable, foreign key → users.id)
- `address_id` (bigint, foreign key → addresses.id)
- `status` (enum: 'pending', 'processing', 'on_the_way', 'delivered', 'cancelled', default: 'pending')
- `subtotal` (decimal(10,2))
- `tax` (decimal(10,2), default: 0)
- `delivery_fee` (decimal(10,2), default: 0)
- `discount` (decimal(10,2), default: 0)
- `total` (decimal(10,2))
- `payment_method` (string, nullable)
- `payment_status` (enum: 'pending', 'paid', 'failed', 'refunded', default: 'pending')
- `notes` (text, nullable)
- `delivered_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

**Indexes:**
- `order_number` (unique)
- `customer_id`, `status`
- `vendor_id`, `status`

**Relationships:**
- Belongs to `customer` (user)
- Belongs to `vendor` (user)
- Belongs to `deliveryBoy` (user, nullable)
- Belongs to `address`
- Has many `items`
- Has many `payments`

---

### order_items

Order line items with price snapshots.

**Columns:**
- `id` (bigint, primary key)
- `order_id` (bigint, foreign key → orders.id)
- `product_id` (bigint, foreign key → products.id)
- `product_variation_id` (bigint, nullable, foreign key → product_variations.id)
- `product_name` (string) - Snapshot
- `product_sku` (string, nullable) - Snapshot
- `quantity` (integer)
- `unit_price` (decimal(10,2)) - Snapshot price
- `total_price` (decimal(10,2))
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `order_id`

**Relationships:**
- Belongs to `order`
- Belongs to `product`
- Belongs to `productVariation` (nullable)

---

### payments

Payment transactions with gateway support.

**Columns:**
- `id` (bigint, primary key)
- `order_id` (bigint, foreign key → orders.id)
- `payment_gateway` (string) - stripe, paypal, razorpay
- `transaction_id` (string, unique)
- `status` (enum: 'pending', 'completed', 'failed', 'refunded', default: 'pending')
- `amount` (decimal(10,2))
- `currency` (string, default: 'USD')
- `gateway_response` (json, nullable) - Gateway-specific data
- `paid_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `order_id`, `status`
- `transaction_id` (unique)

**Relationships:**
- Belongs to `order`

---

### vendor_profiles

Vendor store information and earnings.

**Columns:**
- `id` (bigint, primary key)
- `user_id` (bigint, unique, foreign key → users.id)
- `store_name` (string)
- `store_slug` (string, unique)
- `description` (text, nullable)
- `logo` (string, nullable)
- `cover_image` (string, nullable)
- `phone` (string)
- `email` (string)
- `address` (text)
- `city` (string)
- `state` (string, nullable)
- `postal_code` (string)
- `country` (string, default: 'US')
- `latitude` (decimal(10,8), nullable)
- `longitude` (decimal(11,8), nullable)
- `commission_rate` (decimal(5,2), default: 0) - Percentage
- `total_earnings` (decimal(12,2), default: 0)
- `pending_earnings` (decimal(12,2), default: 0)
- `available_balance` (decimal(12,2), default: 0)
- `status` (enum: 'pending', 'approved', 'suspended', 'rejected', default: 'pending')
- `rejection_reason` (text, nullable)
- `is_verified` (boolean, default: false)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

**Indexes:**
- `user_id` (unique)
- `store_slug` (unique)

**Relationships:**
- Belongs to `user`

---

### delivery_profiles

Delivery boy profiles and location tracking.

**Columns:**
- `id` (bigint, primary key)
- `user_id` (bigint, unique, foreign key → users.id)
- `license_number` (string, nullable)
- `vehicle_type` (string, nullable) - bike, car, motorcycle
- `vehicle_number` (string, nullable)
- `phone` (string)
- `address` (text, nullable)
- `status` (enum: 'active', 'inactive', 'suspended', default: 'active')
- `total_earnings` (decimal(12,2), default: 0)
- `pending_earnings` (decimal(12,2), default: 0)
- `available_balance` (decimal(12,2), default: 0)
- `is_available` (boolean, default: true)
- `current_latitude` (decimal(10,8), nullable)
- `current_longitude` (decimal(11,8), nullable)
- `last_location_update` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, nullable)

**Indexes:**
- `user_id` (unique)

**Relationships:**
- Belongs to `user`

---

### settings

Application settings (key-value store).

**Columns:**
- `id` (bigint, primary key)
- `key` (string, unique)
- `value` (text, nullable)
- `type` (string, default: 'string') - string, number, boolean, json
- `group` (string, default: 'general') - general, payment, email, seo, branding
- `description` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `key` (unique)
- `group`

---

### otp_verifications

OTP verification system.

**Columns:**
- `id` (bigint, primary key)
- `identifier` (string) - email or phone
- `otp` (string, 6 characters)
- `type` (enum: 'email', 'phone', default: 'phone')
- `purpose` (enum: 'login', 'register', 'reset_password', 'verify_account', default: 'login')
- `is_verified` (boolean, default: false)
- `attempts` (integer, default: 0)
- `expires_at` (timestamp)
- `verified_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `identifier`, `type`, `is_verified`

---

### app_notifications

In-app notifications.

**Columns:**
- `id` (bigint, primary key)
- `user_id` (bigint, nullable, foreign key → users.id)
- `type` (string) - order, product, payment, system
- `title` (string)
- `message` (text)
- `data` (json, nullable) - Additional data
- `is_read` (boolean, default: false)
- `read_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `user_id`, `is_read`

**Relationships:**
- Belongs to `user` (nullable)

---

### payout_requests

Vendor payout requests.

**Columns:**
- `id` (bigint, primary key)
- `vendor_id` (bigint, foreign key → users.id)
- `amount` (decimal(12,2))
- `status` (enum: 'pending', 'approved', 'rejected', 'processed', default: 'pending')
- `payment_method` (string) - bank_transfer, paypal, stripe
- `payment_details` (json) - Account details
- `rejection_reason` (text, nullable)
- `processed_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Indexes:**
- `vendor_id`, `status`

**Relationships:**
- Belongs to `vendor` (user)

---

## 🔐 Spatie Permissions Tables

### roles
- `id`, `name`, `guard_name`, `created_at`, `updated_at`

### permissions
- `id`, `name`, `guard_name`, `created_at`, `updated_at`

### model_has_roles
- `role_id`, `model_type`, `model_id`

### model_has_permissions
- `permission_id`, `model_type`, `model_id`

### role_has_permissions
- `permission_id`, `role_id`

---

## 📈 Performance Considerations

### Indexes
- All foreign keys are indexed
- Frequently queried columns are indexed
- Unique constraints on email, phone, slug, SKU

### Soft Deletes
- Used on: users, addresses, categories, products, orders, vendor_profiles, delivery_profiles

### Relationships
- Proper foreign key constraints
- Cascade deletes where appropriate
- Restrict deletes for critical data

---

**Last Updated:** 2026-01-02  
**Database Version:** 1.0.0

