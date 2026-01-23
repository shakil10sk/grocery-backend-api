# Grosarry - Laravel + Vite + React SPA Architecture

## ✅ Project Structure (FINALIZED)

This is a **production-ready monolith SPA** with Laravel backend and dual React SPAs (Marketplace + Admin) served from a single domain.

```
grocery/
├── app/                           # Laravel app core
├── Modules/                       # nwidart modular structure
│   ├── Auth/
│   ├── Users/
│   ├── Products/
│   ├── Orders/
│   ├── Payments/
│   └── Delivery/
│
├── resources/
│   ├── views/
│   │   ├── welcome.blade.php      # Marketplace entry point (mounts to #app)
│   │   └── admin.blade.php         # Admin entry point (mounts to #admin)
│   │
│   ├── css/
│   │   └── app.css                # Shared styles
│   │
│   └── js/
│       ├── marketplace/            # CUSTOMER MARKETPLACE SPA
│       │   ├── main.jsx           # Entry point
│       │   ├── App.jsx            # Root component with React Router
│       │   ├── pages/
│       │   │   ├── Home.jsx
│       │   │   ├── Products.jsx
│       │   │   ├── ProductDetail.jsx
│       │   │   ├── Cart.jsx
│       │   │   ├── Checkout.jsx
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── Profile.jsx
│       │   │   └── Orders.jsx
│       │   ├── components/        # Reusable UI components
│       │   ├── hooks/             # Custom React hooks
│       │   ├── services/          # API services for marketplace
│       │   └── utils/             # Utility functions
│       │
│       ├── admin/                  # ADMIN PANEL SPA
│       │   ├── main.jsx           # Entry point
│       │   ├── App.jsx            # Root component with React Router + basename="/admin"
│       │   ├── pages/
│       │   │   ├── Login.jsx
│       │   │   ├── Dashboard.jsx
│       │   │   ├── Products.jsx
│       │   │   ├── Orders.jsx
│       │   │   ├── Users.jsx
│       │   │   └── Settings.jsx
│       │   ├── components/        # Admin UI components
│       │   ├── contexts/          # Auth context, etc
│       │   ├── hooks/             # Custom hooks
│       │   ├── services/          # Admin API services
│       │   └── utils/             # Utility functions
│       │
│       └── shared/                 # SHARED CODE
│           ├── api.js             # Axios instance with interceptors
│           ├── auth.js            # Authentication service
│           ├── queryClient.js      # React Query configuration
│           ├── constants.js        # App-wide constants
│           └── utils.js           # Shared utilities
│
├── routes/
│   ├── web.php                    # Web routes (Laravel serve SPA entries)
│   └── api.php                    # API routes (v1 namespace)
│
├── vite.config.js                 # Multiple entry points configuration
├── package.json                   # React dependencies + dev deps
├── composer.json                  # Laravel dependencies
├── tailwind.config.js             # Tailwind CSS
├── postcss.config.js              # PostCSS config
└── public/                        # Static files
```

## 🧭 Routing Architecture

### Laravel Routes (routes/web.php)
```php
// Marketplace - serves welcome.blade.php
Route::view('/', 'welcome')->name('marketplace');

// Admin - catch-all for admin paths, serves admin.blade.php
Route::prefix('admin')->group(function () {
    Route::view('/{any?}', 'admin')->where('any', '.*')->name('admin');
});
```

**Flow:**
1. User visits `http://localhost:8001/` → Laravel serves `welcome.blade.php`
2. Blade loads `@vite('resources/js/marketplace/main.jsx')`
3. Vite injects the marketplace React SPA
4. React Router takes over within React

Similarly for admin:
1. User visits `http://localhost:8001/admin` → Laravel serves `admin.blade.php`
2. Blade loads `@vite('resources/js/admin/main.jsx')`
3. React Router with `basename="/admin"` handles admin routes

### API Routes (routes/api.php)
All API calls go to `/api/v1/*` namespace:
```
/api/v1/products
/api/v1/orders
/api/v1/login
/api/v1/register
... etc
```

## ⚡ Vite Configuration

Multiple entry points in `vite.config.js`:
```javascript
input: [
    'resources/css/app.css',
    'resources/js/marketplace/main.jsx',    // Marketplace SPA
    'resources/js/admin/main.jsx',           // Admin SPA
]
```

Each entry point generates its own bundle at build time.

## 🖼️ Blade Entry Files

### welcome.blade.php (Marketplace)
```html
<!DOCTYPE html>
<html>
<head>
    @vite('resources/js/marketplace/main.jsx')
</head>
<body>
    <div id="app"></div>  <!-- React mounts here -->
</body>
</html>
```

### admin.blade.php (Admin Panel)
```html
<!DOCTYPE html>
<html>
<head>
    @vite('resources/js/admin/main.jsx')
</head>
<body>
    <div id="admin"></div>  <!-- React mounts here -->
</body>
</html>
```

## 🔑 Key Features

✅ **One Domain**: `grocery.com`
- Marketplace: `grocery.com/`
- Admin: `grocery.com/admin`

✅ **One Server**: Single Laravel server handles both

✅ **Two Independent SPAs**: 
- Marketplace (customer-facing)
- Admin (admin-facing)

✅ **Shared Code**:
- API service (axios)
- Auth service
- React Query configuration
- Constants

✅ **Modular Backend**: nwidart Laravel modules for clean separation

✅ **Sanctum Authentication**: CSRF-protected, same-domain, no CORS issues

## 🚀 Development Commands

```bash
# Start Vite dev server (HMR enabled)
npm run dev

# Start Laravel
php artisan serve --port=8001

# Build for production
npm run build

# Build individual SPAs
npm run build:marketplace
npm run build:admin
```

## 📦 Production Deployment

1. Run `npm run build` - generates bundles in `public/build`
2. Laravel serves everything from single instance
3. No CORS needed - same domain
4. All API requests go to `/api/v1/*`

## 🔐 Security

- **CSRF Protection**: Via Laravel middleware
- **Authentication**: Sanctum tokens stored in localStorage
- **Authorization**: Role-based admin middleware
- **API Security**: All API routes protected by `auth:sanctum` middleware

## 📝 API Example

From either SPA:
```javascript
import api from '@/shared/api'

// Login
const response = await api.post('/login', credentials)

// Get products
const products = await api.get('/products?limit=20')

// Admin only route
const dashboard = await api.get('/admin/stats')
```

All requests automatically include CSRF token and auth token.

## ✨ Next Steps

1. ✅ Implement remaining marketplace pages
2. ✅ Implement remaining admin pages
3. ✅ Build out services layer for each domain
4. ✅ Add proper styling (Tailwind CSS)
5. ✅ Implement auth flows
6. ✅ Add state management (Zustand/Redux if needed)
7. ✅ Deploy to production server

---

**Status**: ✅ Architecture Complete & Running
**Servers**: Vite on 5174, Laravel on 8001
**Ready for**: Feature development
