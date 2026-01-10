# Quick Start Guide

Get up and running with the Grocery Multi-Vendor Platform in 5 minutes.

## ⚡ Quick Installation

### 1. Install Dependencies

```bash
cd backend-api
composer install
```

### 2. Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` and set your database credentials.

### 3. Setup Database

```bash
php artisan migrate
php artisan db:seed
```

### 4. Generate JWT Secret

```bash
php artisan jwt:secret
```

### 5. Generate Swagger Docs

```bash
php artisan l5-swagger:generate
```

### 6. Start Server

```bash
php artisan serve
```

## ✅ Verify Installation

### Test Health Endpoint

```bash
curl http://localhost:8000/api/health
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

Open: http://localhost:8000/api/documentation

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@grocery.com | password |
| Vendor | vendor@grocery.com | password |
| Customer | customer@grocery.com | password |
| Delivery | delivery@grocery.com | password |

## 📚 Next Steps

1. **Explore API**: Use Swagger UI at `/api/documentation`
2. **Read Docs**: Check `docs/` folder for detailed documentation
3. **Start Development**: Follow [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)

## 🆘 Troubleshooting

### Database Connection Error
- Check `.env` database credentials
- Ensure MySQL is running
- Verify database exists

### Migration Errors
```bash
php artisan migrate:fresh
php artisan db:seed
```

### Swagger Not Loading
```bash
php artisan l5-swagger:generate
php artisan config:clear
```

---

**That's it! You're ready to go!** 🚀

