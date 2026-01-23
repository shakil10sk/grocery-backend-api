# ⚡ QUICK REFERENCE CARD

## 🚀 Start Project
```bash
# Terminal 1
npm run dev

# Terminal 2  
php artisan serve --port=8001

# Then open browser
http://localhost:8001           # Marketplace
http://localhost:8001/admin     # Admin
```

## 📍 URLs
```
Marketplace: http://localhost:8001/
Admin:       http://localhost:8001/admin
Vite:        http://localhost:5174/
API Base:    http://localhost:8001/api/v1
```

## 📁 Key Directories
```
resources/js/
  ├─ marketplace/     # Customer SPA
  ├─ admin/           # Admin SPA
  └─ shared/          # Shared code (USE THIS!)
```

## 💻 Essential Files
```
Welcome.blade.php          # Marketplace entry (@vite directive)
Admin.blade.php            # Admin entry (@vite directive)
vite.config.js             # Vite multi-entry configuration
routes/web.php             # Laravel routing (/ and /admin/{any})
shared/api.js              # Axios with CSRF + auth
shared/auth.js             # Authentication service
shared/queryClient.js      # React Query config
```

## 🔥 Common Imports
```javascript
import api from '@/shared/api'              // API calls
import authService from '@/shared/auth'     // Authentication
import { useQuery } from '@tanstack/react-query'  // Data fetching
import { useNavigate, Link } from 'react-router-dom'  // Navigation
```

## 📝 Add Marketplace Page
```javascript
// 1. Create file
// resources/js/marketplace/pages/NewPage.jsx
export default function NewPage() { return <div>Content</div> }

// 2. Import in App.jsx
import NewPage from './pages/NewPage'

// 3. Add route
<Route path="/path" element={<NewPage />} />

// 4. Link to it
<Link to="/path">Link</Link>
```

## 🔗 API Example
```javascript
import api from '@/shared/api'

// GET
const res = await api.get('/products?limit=20')
const products = res.data.data

// POST
const res = await api.post('/login', credentials)
const token = res.data.token

// PUT
await api.put(`/products/${id}`, updateData)

// DELETE
await api.delete(`/products/${id}`)
```

## 🔐 Auth Example
```javascript
import authService from '@/shared/auth'

// Login
await authService.login({ email, password })

// Check if authenticated
if (authService.isAuthenticated()) { ... }

// Get current user
const user = await authService.getCurrentUser()

// Logout
await authService.logout()
```

## 🎣 React Query Example
```javascript
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/shared/api'

const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: async () => {
    const res = await api.get('/products')
    return res.data.data
  }
})

const mutation = useMutation({
  mutationFn: (data) => api.post('/products', data),
  onSuccess: () => console.log('Created!')
})
```

## 🎨 Tailwind Example
```jsx
<div className="p-4 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <p className="text-gray-600 mt-2">Description</p>
  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
    Click me
  </button>
</div>
```

## 🔀 Navigation
```javascript
import { useNavigate, Link } from 'react-router-dom'

// Programmatic
const navigate = useNavigate()
navigate('/products')

// Link component
<Link to="/products">Products</Link>

// Admin router has basename="/admin"
// So in admin, use relative paths:
<Link to="/dashboard">Dashboard</Link>  // NOT /admin/dashboard
```

## 📊 React Query Hooks
```javascript
// Fetch data
useQuery({ queryKey: ['key'], queryFn: fn })

// Mutate data
useMutation({ mutationFn: fn, onSuccess: fn })

// Infinite scroll
useInfiniteQuery({ queryKey: ['key'], queryFn: fn })

// Invalidate cache
const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: ['products'] })
```

## 🔧 Useful Dev Tools
```bash
# Check dependencies
npm list

# Build check
npm run build

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Kill port
lsof -i :8001   # Find process
kill -9 <PID>   # Kill it
```

## ⚠️ Common Mistakes
```javascript
// ❌ WRONG
fetch('/api/products')  // Don't use fetch
import api from './shared/api'  // Wrong path

// ✅ CORRECT
import api from '@/shared/api'
api.get('/products')

// ❌ WRONG  
<Link to="/admin/dashboard">  // Don't use /admin in admin SPA

// ✅ CORRECT
<Link to="/dashboard">  // Router has basename="/admin"

// ❌ WRONG
axios.create(...)  // Don't create new instances

// ✅ CORRECT
import api from '@/shared/api'  // Use the shared one
```

## 📚 Documentation Files
```
COMPLETION_SUMMARY.md     # What was done (read first!)
IMPLEMENTATION_GUIDE.md   # How to extend the project
ARCHITECTURE.md           # Technical architecture
PROJECT_VERIFICATION.md   # Checklist & features
QUICK_REFERENCE.md        # This file!
```

## 🚨 Troubleshooting
```
No API data? 
→ Check /api/v1/{endpoint} exists
→ Check CSRF token in <meta name="csrf-token">

Styles not showing?
→ Restart Vite: npm run dev
→ Check tailwind classes are correct

Admin routes not working?
→ Check Router has basename="/admin"
→ Use relative paths: /dashboard NOT /admin/dashboard

Module not found?
→ Use @ alias: @/shared/api
→ Check file extension: .jsx for React
→ Restart Vite server
```

## 🎯 Development Workflow

1. **Write Code** - Edit files in resources/js/
2. **See Changes** - Vite HMR auto-refreshes
3. **Test API** - Use shared api service
4. **Commit** - Git commit changes
5. **Build** - npm run build
6. **Deploy** - Push to production

## 📦 Production Build
```bash
npm run build
# Generates: public/build/
# Deploy with: vendor/bin/artisan serve
```

## 🎓 Learning Path
1. Read IMPLEMENTATION_GUIDE.md
2. Try adding a new page
3. Try making an API call
4. Try using React Query
5. Try styling a component
6. Read ARCHITECTURE.md for deeper understanding

## 💡 Tips
- Use React DevTools browser extension
- Use Redux DevTools for debugging
- Check Network tab for API calls
- Use Console for errors
- Use Lighthouse for performance
- Use Chrome DevTools for responsive design

## 🔐 Security Reminders
- Never commit .env files
- Never put tokens in code
- Always use shared API service
- Always validate on backend
- Always use HTTPS in production
- Keep dependencies updated

---

**Keep this file handy for quick reference!**

**Print or bookmark the links:**
- IMPLEMENTATION_GUIDE.md - Step by step
- ARCHITECTURE.md - How it works
- PROJECT_VERIFICATION.md - Features list

**Happy coding!** 🚀
