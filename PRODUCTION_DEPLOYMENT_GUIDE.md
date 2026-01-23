# Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All code committed to git
- [ ] .env.example updated
- [ ] Database migrations tested
- [ ] API endpoints tested
- [ ] Swagger documentation complete
- [ ] Environment variables documented
- [ ] SSL certificate ready
- [ ] Database backups configured
- [ ] Email service configured
- [ ] File storage configured

---

## Server Requirements

### Minimum Requirements
- PHP 8.2 with extensions:
  - OpenSSL
  - PDO (MySQL)
  - Mbstring
  - Tokenizer
  - XML
  - Ctype
  - JSON
  - BCMath
  - GD (image processing)

- MySQL 8.0+ or MariaDB 10.3+
- Composer 2.0+
- Node.js 18+ (for frontend builds)

### Recommended Requirements
- PHP 8.3
- MySQL 8.0.40+
- Redis 7.0+ (for caching & queue)
- Nginx 1.24+
- 2GB+ RAM
- 10GB+ Disk space

---

## Deployment on Shared Hosting

### Using cPanel

1. **Upload Project**
```bash
# Via cPanel File Manager or SFTP
Upload all files to public_html/ (or subdirectory)
```

2. **Create .env File**
```bash
cp .env.example .env
# Edit with database credentials
```

3. **Install Dependencies**
```bash
cd /home/username/public_html
composer install --no-dev
npm install --production
```

4. **Generate Key & Build**
```bash
php artisan key:generate
npm run build
```

5. **Run Migrations**
```bash
php artisan migrate --force
php artisan db:seed
```

6. **Configure Public Directory**
In cPanel, set public root to `/public` directory

---

## Deployment on Linux VPS

### 1. SSH Access & Update Server

```bash
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install dependencies
apt install -y curl wget git zip unzip
apt install -y php8.3-fpm php8.3-mysql php8.3-gd php8.3-curl \
              php8.3-bcmath php8.3-xml php8.3-mbstring
apt install -y nginx mysql-server redis-server
apt install -y nodejs npm
```

### 2. Create Application User

```bash
useradd -m -s /bin/bash appuser
usermod -aG sudo appuser
su - appuser
```

### 3. Clone Repository

```bash
cd /home/appuser
git clone https://github.com/yourusername/grosarry.git
cd grosarry
```

### 4. Setup Laravel

```bash
# Copy env file
cp .env.example .env

# Edit .env with production values
nano .env
```

**.env Production Configuration:**
```env
APP_NAME="Grosarry"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=grosarry_prod
DB_USERNAME=grosarry_user
DB_PASSWORD=strong_password_here

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

JWT_SECRET=your-super-secret-key-here
JWT_TTL=60

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=noreply@grosarry.com
MAIL_FROM_NAME=Grosarry

FILESYSTEMS_DISK=s3  # or local
```

### 5. Install Dependencies

```bash
composer install --no-dev --optimize-autoloader
npm install --production
npm run build
```

### 6. Generate Keys

```bash
php artisan key:generate
php artisan storage:link
```

### 7. Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE grosarry_prod;"
mysql -u root -p -e "CREATE USER 'grosarry_user'@'localhost' IDENTIFIED BY 'strong_password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON grosarry_prod.* TO 'grosarry_user'@'localhost';"

# Run migrations
php artisan migrate --force
php artisan db:seed --force
```

### 8. Configure Nginx

Create `/etc/nginx/sites-available/grosarry`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Certificate (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    root /home/appuser/grosarry/public;
    index index.php;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript 
               application/javascript application/json;
    gzip_min_length 1000;
    gzip_comp_level 6;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Block access to hidden files
    location ~ /\. {
        deny all;
    }
    
    # Route all requests through index.php
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        
        # Prevent .htaccess files from being served
        location ~ /\.(?!well-known).* {
            deny all;
        }
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/grosarry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 9. Setup SSL Certificate (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### 10. Configure PHP-FPM

Edit `/etc/php/8.3/fpm/php.ini`:
```ini
post_max_size = 100M
upload_max_filesize = 100M
memory_limit = 256M
max_execution_time = 300
```

Restart:
```bash
sudo systemctl restart php8.3-fpm
```

### 11. Setup Queue Worker

Create systemd service `/etc/systemd/system/grosarry-queue.service`:

```ini
[Unit]
Description=Grosarry Queue Worker
After=network.target

[Service]
User=appuser
Group=www-data
WorkingDirectory=/home/appuser/grosarry
ExecStart=/usr/bin/php artisan queue:work redis --tries=3

Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable grosarry-queue
sudo systemctl start grosarry-queue
```

### 12. Setup Cron Jobs

Edit crontab:
```bash
crontab -e
```

Add:
```bash
* * * * * cd /home/appuser/grosarry && php artisan schedule:run >> /dev/null 2>&1
```

### 13. Setup Monitoring

Monitor logs:
```bash
tail -f storage/logs/laravel.log
```

Monitor queue:
```bash
php artisan queue:monitor
```

---

## Post-Deployment Tasks

### 1. Verify Everything Works

```bash
# Health check
curl https://yourdomain.com/api/health

# Test API endpoint
curl https://yourdomain.com/api/v1/settings

# Check Swagger
https://yourdomain.com/api/documentation
```

### 2. Setup Backups

```bash
# Daily database backups
0 2 * * * /usr/bin/mysqldump -u grosarry_user -ppassword grosarry_prod | gzip > /backups/grosarry-$(date +\%Y\%m\%d).sql.gz
```

### 3. Enable Application Monitoring

```bash
# Install server monitoring
apt install -y netdata
systemctl start netdata
```

### 4. Configure Error Notifications

In `.env`:
```env
LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

MAIL_MAILER=smtp
# Email error logs to admin
```

### 5. Setup Log Rotation

Create `/etc/logrotate.d/grosarry`:

```
/home/appuser/grosarry/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 appuser www-data
    sharedscripts
    postrotate
        /usr/lib/php/sessionclean >/dev/null 2>&1 || true
    endscript
}
```

---

## Deployment using Docker (Recommended)

### 1. Create Dockerfile

```dockerfile
FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    mysql-client \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libzip-dev \
    zip \
    unzip

RUN docker-php-ext-install pdo_mysql gd bcmath mbstring zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

EXPOSE 9000
CMD ["php-fpm"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: grosarry-app
    working_dir: /app
    volumes:
      - ./:/app
    depends_on:
      - db
      - redis
    networks:
      - grosarry

  nginx:
    image: nginx:latest
    container_name: grosarry-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/app
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - grosarry

  db:
    image: mysql:8.0
    container_name: grosarry-db
    environment:
      MYSQL_DATABASE: grosarry_prod
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_PASSWORD: password
      MYSQL_USER: grosarry_user
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - grosarry

  redis:
    image: redis:7-alpine
    container_name: grosarry-redis
    networks:
      - grosarry

volumes:
  db_data:

networks:
  grosarry:
    driver: bridge
```

Deploy:
```bash
docker-compose up -d
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan db:seed
```

---

## Troubleshooting

### Issue: 500 Internal Server Error
```bash
# Check logs
tail -f storage/logs/laravel.log

# Check file permissions
chmod -R 755 storage/ bootstrap/cache/
chown -R appuser:www-data storage/ bootstrap/cache/
```

### Issue: Database Connection Error
```bash
# Test database connection
php artisan tinker
DB::connection()->getPdo();
```

### Issue: Queue Not Processing
```bash
# Check if queue worker is running
ps aux | grep "queue:work"

# Restart queue worker
sudo systemctl restart grosarry-queue

# Monitor queue
php artisan queue:monitor
```

### Issue: Slow Performance
```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Optimize
php artisan optimize:clear
php artisan config:cache
```

---

## Performance Monitoring

### Tools to Use

1. **Application Performance Monitoring (APM)**
   - New Relic
   - DataDog
   - Sentry (error tracking)

2. **Server Monitoring**
   - Netdata
   - Prometheus + Grafana
   - htop

3. **Database Monitoring**
   - MySQL Workbench
   - DBeaver

---

## Security Hardening

### 1. Update Dependencies Regularly

```bash
composer update
npm update
```

### 2. Security Headers

Already configured in Nginx config above.

### 3. Firewall Configuration

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3306/tcp  # MySQL (internal only)
sudo ufw enable
```

### 4. Automatic Updates

```bash
apt install unattended-upgrades
dpkg-reconfigure unattended-upgrades
```

---

## Maintenance

### Daily Tasks
- Monitor error logs
- Check backup status
- Verify queue processing

### Weekly Tasks
- Review performance metrics
- Check for security updates
- Test database backups

### Monthly Tasks
- Update dependencies
- Review and optimize queries
- Update SSL certificates (auto with certbot)
- Archive old logs

---

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git checkout previous-commit-hash

# Revert database
php artisan migrate:rollback

# Clear caches
php artisan cache:clear

# Restart services
sudo systemctl restart nginx php8.3-fpm
```

---

## Estimated Deployment Time
- **First time:** 2-4 hours
- **Updates:** 15-30 minutes

**Difficulty:** Medium
**Priority:** 🔴 CRITICAL for production release
