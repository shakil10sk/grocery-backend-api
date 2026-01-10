# Installation Guide

Complete step-by-step installation guide for the Grocery Multi-Vendor Platform.

## 📋 Prerequisites

Before installing, ensure you have the following installed:

- **PHP** >= 8.2 with extensions:
  - OpenSSL
  - PDO
  - Mbstring
  - Tokenizer
  - XML
  - Ctype
  - JSON
  - BCMath
- **Composer** >= 2.0
- **MySQL** >= 8.0 or **MariaDB** >= 10.3
- **Node.js** >= 18 (for frontend development)
- **Git**

## 🚀 Installation Steps

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Grosarry/backend-api
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

This will install all required PHP packages including:
- Laravel 11
- JWT Auth
- Spatie Permissions
- Swagger/OpenAPI

### Step 3: Environment Configuration

#### 3.1 Copy Environment File

```bash
cp .env.example .env
```

#### 3.2 Generate Application Key

```bash
php artisan key:generate
```

#### 3.3 Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Application
APP_NAME="Grocery Multi-Vendor API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=UTC

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=grocery_api
DB_USERNAME=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_TTL=60

# Mail (for notifications)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@grocery.com"
MAIL_FROM_NAME="${APP_NAME}"

# Filesystem
FILESYSTEM_DISK=local
```

### Step 4: Create Database

Create a MySQL database:

```sql
CREATE DATABASE grocery_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or via command line:

```bash
mysql -u root -p -e "CREATE DATABASE grocery_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Step 5: Run Migrations

```bash
php artisan migrate
```

This will create all necessary tables:
- Users and authentication tables
- Product and category tables
- Order and payment tables
- Vendor and delivery profiles
- Settings and notifications
- Spatie permissions tables

### Step 6: Seed Database

```bash
php artisan db:seed
```

This will create:
- Default roles (admin, vendor, delivery_boy, customer)
- Permissions for each role
- Demo users for testing

### Step 7: Generate JWT Secret

```bash
php artisan jwt:secret
```

This generates a secure JWT secret key for token signing.

### Step 8: Generate Swagger Documentation

```bash
php artisan l5-swagger:generate
```

This generates the OpenAPI documentation for Swagger UI.

### Step 9: Set Permissions (Linux/Mac)

```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### Step 10: Start Development Server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

## ✅ Verification

### Test Health Endpoint

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2026-01-02T19:00:00+00:00"
}
```

### Test Login

```bash
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@grocery.com",
    "password": "password"
  }'
```

### Access Swagger UI

Open in browser: `http://localhost:8000/api/documentation`

## 🔧 Configuration Options

### JWT Configuration

Edit `config/jwt.php` to customize:
- Token expiration time
- Refresh token settings
- Algorithm

### Swagger Configuration

Edit `config/l5-swagger.php` to customize:
- API title and description
- Server URLs
- Documentation path

### Permissions

Edit `config/permission.php` to customize:
- Cache settings
- Model names

## 🐛 Troubleshooting

### Common Issues

#### 1. Migration Errors

**Problem:** Foreign key constraint errors

**Solution:**
```bash
php artisan migrate:fresh
php artisan db:seed
```

#### 2. JWT Secret Missing

**Problem:** JWT authentication fails

**Solution:**
```bash
php artisan jwt:secret
```

#### 3. Permission Denied

**Problem:** Storage or cache permission errors

**Solution:**
```bash
chmod -R 775 storage bootstrap/cache
```

#### 4. Swagger Not Loading

**Problem:** Swagger UI shows errors

**Solution:**
```bash
php artisan l5-swagger:generate
php artisan config:clear
php artisan cache:clear
```

#### 5. Database Connection Failed

**Problem:** Cannot connect to database

**Solution:**
- Verify database credentials in `.env`
- Ensure MySQL service is running
- Check database exists

## 📦 Production Installation

### 1. Update Environment

Set production values in `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

### 2. Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 3. Set Up Web Server

#### Apache

Enable mod_rewrite and point document root to `public/`

#### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/backend-api/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 4. Set Up Queue Worker

For background jobs:

```bash
php artisan queue:work
```

Or use supervisor for production.

### 5. Set Up Cron Jobs

Add to crontab:

```bash
* * * * * cd /path/to/backend-api && php artisan schedule:run >> /dev/null 2>&1
```

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Set `APP_DEBUG=false` in production
- [ ] Use strong database passwords
- [ ] Enable HTTPS
- [ ] Set secure JWT secret
- [ ] Configure CORS properly
- [ ] Set proper file permissions
- [ ] Enable rate limiting
- [ ] Regular backups

## 📚 Next Steps

After installation:

1. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
2. Check [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)
3. Read [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
4. Test all endpoints via Swagger UI

---

**Installation Status:** ✅ Complete  
**Ready for:** Development

