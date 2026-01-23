# 🚀 IMPLEMENTATION GUIDE - What You Need to Know

## Quick Start (For Immediate Use)

### Currently Running
```
✅ Vite Dev Server: http://localhost:5174 (HMR enabled)
✅ Laravel Server:  http://localhost:8001
✅ Marketplace:     http://localhost:8001/ 
✅ Admin:          http://localhost:8001/admin
```

### Stop Servers
```bash
# Stop Vite (Ctrl+C in terminal)
# Stop Laravel (Ctrl+C in terminal)
```

### Start Servers (Next Time)
```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start Laravel
php artisan serve --port=8001
```

## File Changes Made

### 1. React Entry Points
```
✅ resources/js/marketplace/main.jsx - Created
✅ resources/js/marketplace/App.jsx - Created  
✅ resources/js/admin/main.jsx - Modified (fixed mount target)
✅ resources/js/admin/App.jsx - Already existed (kept as is)
```

### 2. Blade Templates
```
✅ resources/views/welcome.blade.php - Replaced (clean marketplace entry)
✅ resources/views/admin.blade.php - Created (new admin entry)
✅ resources/views/app.blade.php - No longer used
```

### 3. Configuration
```
✅ vite.config.js - Updated (multiple entry points)
✅ routes/web.php - Replaced (proper routing)
✅ package.json - Already had dependencies (verified)
✅ composer.json - No changes needed
```

### 4. Shared Utilities (NEW)
```
✅ resources/js/shared/api.js - Axios with interceptors
✅ resources/js/shared/auth.js - Auth service
✅ resources/js/shared/queryClient.js - React Query config
✅ resources/js/shared/constants.js - App constants
```

### 5. Placeholder Pages
```
Marketplace (resources/js/marketplace/pages/):
✅ Home.jsx - Fetches products from API
✅ Products.jsx
✅ ProductDetail.jsx
✅ Cart.jsx
✅ Checkout.jsx
✅ Login.jsx
✅ Register.jsx
✅ Profile.jsx
✅ Orders.jsx

Admin (resources/js/admin/pages/):
✅ Dashboard.jsx
✅ Products.jsx
✅ Orders.jsx
✅ Users.jsx
✅ Settings.jsx
✅ Login.jsx
```

## Architecture Explained

### 1. Single Domain, Two SPAs

```
http://localhost:8001/          → Marketplace SPA (welcome.blade.php)
                                   ├── /
                                   ├── /products
                                   ├── /products/:id
                                   ├── /cart
                                   ├── /checkout
                                   ├── /login
                                   └── ...

http://localhost:8001/admin     → Admin SPA (admin.blade.php)
                                   ├── /admin
                                   ├── /admin/dashboard
                                   ├── /admin/products
                                   ├── /admin/orders
                                   └── ...
```

### 2. How It Works

**Request to Marketplace:**
1. User visits `http://localhost:8001/`
2. Laravel routes to `Route::view('/', 'welcome')`
3. Blade template `welcome.blade.php` is served
4. Vite injects `resources/js/marketplace/main.jsx`
5. React mounts to `<div id="app"></div>`
6. React Router takes over for client-side navigation

**Request to Admin:**
1. User visits `http://localhost:8001/admin`
2. Laravel routes to `Route::view('/{any?}', 'admin')`
3. Blade template `admin.blade.php` is served
4. Vite injects `resources/js/admin/main.jsx`
5. React mounts to `<div id="admin"></div>`
6. React Router with `basename="/admin"` handles routes

**API Requests:**
```javascript
// Both SPAs use same API service
import api from '@/shared/api'

api.get('/products')  // → http://localhost:8001/api/v1/products
```

### 3. Why This Structure?

✅ **CodeCanyon Ready**: One domain, one server deployment
✅ **Performance**: Two separate bundles, no bloat
✅ **Maintainability**: Clear separation between marketplace and admin
✅ **Scalability**: Easy to split into microservices later
✅ **Security**: CSRF protection, same-domain auth, no CORS issues

## Common Tasks

### Task 1: Add a New Marketplace Page

**Step 1:** Create the page component
```javascript
// resources/js/marketplace/pages/MyNewPage.jsx
export default function MyNewPage() {
  return <div>My New Page</div>
}
```

**Step 2:** Import and add route
```javascript
// resources/js/marketplace/App.jsx
import MyNewPage from './pages/MyNewPage'

// Inside Routes:
<Route path="/my-page" element={<MyNewPage />} />
```

**Step 3:** Link to it
```javascript
// In any component:
import { Link } from 'react-router-dom'

<Link to="/my-page">Go to My Page</Link>
```

### Task 2: Call API from a Page

```javascript
// resources/js/marketplace/pages/Products.jsx
import { useEffect, useState } from 'react'
import api from '@/shared/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?limit=20')
      .then(res => setProducts(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

### Task 3: Implement Authentication

```javascript
// resources/js/marketplace/pages/Login.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '@/shared/auth'

export default function Login() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const handleLogin = async () => {
    try {
      const user = await authService.login(credentials)
      console.log('Logged in:', user)
      navigate('/profile')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input 
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input 
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Task 4: Create Reusable Component

```javascript
// resources/js/shared/components/ProductCard.jsx
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`}>
      <div className="border rounded-lg p-4">
        <img src={product.thumbnail_url} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="text-lg font-bold">${product.price}</p>
      </div>
    </Link>
  )
}

// Use in marketplace pages:
import ProductCard from '@/shared/components/ProductCard'

<ProductCard product={myProduct} />
```

### Task 5: Use React Query for Server State

```javascript
// resources/js/marketplace/pages/ProductsList.jsx
import { useQuery } from '@tanstack/react-query'
import api from '@/shared/api'

export default function ProductsList() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products?limit=20')
      return res.data.data
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

## Directory Structure Reference

```
resources/js/
├── marketplace/
│   ├── main.jsx              # Entry point (mounts to #app)
│   ├── App.jsx               # Root component with router
│   ├── pages/                # Page components
│   ├── components/           # Reusable components
│   ├── hooks/                # Custom hooks
│   ├── services/             # Business logic
│   ├── utils/                # Helper functions
│   └── types/                # TypeScript types (optional)
│
├── admin/
│   ├── main.jsx              # Entry point (mounts to #admin)
│   ├── App.jsx               # Root component with router
│   ├── pages/                # Admin pages
│   ├── components/           # Admin components
│   ├── contexts/             # React Context (AuthContext)
│   ├── hooks/                # Admin hooks
│   ├── services/             # Admin services
│   └── utils/                # Admin helpers
│
└── shared/
    ├── api.js                # Axios instance (USE THIS!)
    ├── auth.js               # Auth service
    ├── queryClient.js        # React Query setup
    ├── constants.js          # App constants
    └── components/           # Shared UI components (optional)
```

## Important Notes

### 🔒 Authentication Flow
1. User logs in → `authService.login(credentials)`
2. Token saved to localStorage
3. `api.js` automatically adds token to all requests
4. 401 errors trigger redirect to login
5. Admin routes protected by ProtectedRoute component

### 🌐 API Calls
- **ALWAYS** use `import api from '@/shared/api'`
- DO NOT use fetch or create new axios instances
- CSRF token automatically injected
- Auth token automatically added

### ⚡ Imports
- Use `@/` alias for clean imports: `import api from '@/shared/api'`
- `@` = `resources/js`
- No relative imports needed

### 🎨 Styling
- Tailwind CSS available
- Use class names: `className="p-4 rounded-lg"`
- No CSS files needed for basic styling
- Custom CSS in `resources/css/app.css` if needed

### 🔄 Hot Reloading
- Changes to React code auto-refresh
- Changes to route definitions require manual refresh
- Vite dev server must be running

## Troubleshooting

### Issue: "Module not found"
- Check file path
- Verify `@` alias is used correctly
- Restart Vite server: `npm run dev`

### Issue: "Cannot import component"
- Ensure default export: `export default function MyComponent()`
- Check file extension: `.jsx` for React, `.js` for others

### Issue: API calls failing
- Check `/api/v1/` route exists in Laravel
- Verify CSRF token in meta tag
- Check browser console for errors
- Try: `curl http://localhost:8001/api/health`

### Issue: Admin routes not working
- Admin React Router has `basename="/admin"`
- Links should be relative: `<Link to="/dashboard">`
- NOT absolute: `<Link to="/admin/dashboard">`

### Issue: Styles not applying
- Ensure Tailwind CSS is imported in main.jsx
- Check class names are spelled correctly
- Rebuild CSS: `npm run dev`

## Performance Tips

1. **Lazy load pages:**
   ```javascript
   const HomePage = lazy(() => import('./pages/Home'))
   ```

2. **Use React Query for API:**
   - Automatic caching
   - Background refetching
   - Optimistic updates

3. **Optimize images:**
   - Use appropriate sizes
   - Consider lazy loading

4. **Code splitting:**
   - Automatic with lazy routes
   - Manual with `lazy()`

5. **Monitor bundle size:**
   ```bash
   npm run build
   # Check build output size
   ```

## Production Deployment Checklist

- [ ] Run `npm run build`
- [ ] Verify `public/build` generated correctly
- [ ] Set production `.env` variables
- [ ] Ensure API base URL correct
- [ ] Test CSRF protection
- [ ] Test authentication flow
- [ ] Set proper CORS headers (if multi-domain)
- [ ] Enable minification (automatic)
- [ ] Test on production server
- [ ] Monitor error logs

---

**Quick Links:**
- 📚 [React Docs](https://react.dev)
- 🛣️ [React Router Docs](https://reactrouter.com)
- ⚡ [Vite Docs](https://vitejs.dev)
- 📡 [Axios Docs](https://axios-http.com)
- 🔄 [React Query Docs](https://tanstack.com/query)

**Created**: 2026-01-23
**Status**: ✅ Complete & Tested
