# Grosarry - Unified Backend API Project

This project consolidates the Admin Panel and Marketplace into a single Laravel backend API with Vite for bundling, React for the UI, and React Router for client-side routing.

## Project Structure

```
backend-api/
├── resources/js/
│   ├── admin/                 # Admin panel application
│   │   ├── pages/            # Admin pages (Dashboard, Products, etc.)
│   │   ├── components/       # Admin components
│   │   ├── contexts/         # React contexts (AuthContext)
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   └── main.jsx          # Admin entry point (referenced in App.jsx)
│   │
│   ├── marketplace/          # Marketplace application
│   │   ├── app/             # App pages (Home, Products, etc.)
│   │   ├── components/      # Marketplace components
│   │   ├── context/         # React contexts (Cart, Wishlist, Auth)
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions (converted)
│   │   └── utils/           # Utility functions
│   │
│   ├── App.jsx              # Root router component
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles
│   └── app.js               # Laravel Vite bootstrap
│
├── resources/views/
│   └── app.blade.php        # Main Blade template (serves React SPA)
│
├── routes/
│   ├── api.php              # API routes
│   └── web.php              # Web routes (serves SPA)
│
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies
└── README.md
```

## Key Features

### 1. **Unified SPA Structure**
- Single entry point serving both admin and marketplace
- Client-side routing with React Router
- Seamless navigation between admin and marketplace

### 2. **Admin Panel** (`/admin`)
- Dashboard with statistics
- Product management
- Category management
- Order management
- User management
- Blog management
- Settings
- Authentication

### 3. **Marketplace** (`/`)
- Product browsing and search
- Product details with images
- Shopping cart
- Wishlist
- Checkout
- User profile
- Blog

### 4. **Technology Stack**
- **Backend:** Laravel 11
- **Frontend:** React 19
- **Routing:** React Router 7
- **Bundling:** Vite 6
- **Styling:** Tailwind CSS 3
- **State Management:** React Context + React Query
- **API Client:** Axios

## Development Setup

### Prerequisites
- Node.js 18+
- PHP 8.2+
- Composer
- MySQL/PostgreSQL

### Installation

1. **Install Node dependencies:**
```bash
cd backend-api
npm install
```

2. **Install PHP dependencies:**
```bash
composer install
```

3. **Setup Environment:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure Database:**
Update your `.env` file with database credentials, then run:
```bash
php artisan migrate
php artisan db:seed
```

5. **Start Development Servers:**

Terminal 1 (Vite Dev Server):
```bash
npm run dev
```

Terminal 2 (Laravel Backend - Optional, if you need custom API routes):
```bash
php artisan serve
```

The application will be available at `http://localhost:5173` or `http://localhost:5174` (if port 5173 is in use).

## Building for Production

```bash
npm run build
```

This generates optimized assets in `public/build/`.

## Routing

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/settings` - Settings

### Marketplace Routes
- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/categories` - Categories
- `/cart` - Shopping cart
- `/wishlist` - Wishlist
- `/checkout` - Checkout
- `/blog` - Blog posts
- `/profile` - User profile
- `/auth/login` - User login
- `/auth/signup` - User signup

## API Integration

All API requests go through `axios` configured in `resources/js/admin/utils/axios.js` and `resources/js/marketplace/utils/api.js`.

Base URL is automatically set from the Laravel environment.

## Type Safety

While the marketplace was originally written in TypeScript, files have been transpiled to JavaScript to maintain Vite bundling compatibility. Type information is preserved in comments where useful.

## Next Steps for SEO

To improve SEO for the marketplace:

1. Add Meta tags in page components using libraries like `react-helmet`
2. Implement Server-Side Rendering (SSR) using Laravel with Inertia.js (optional)
3. Add structured data (Schema.org) for products
4. Create a sitemap route in Laravel
5. Setup robots.txt in public directory

Example:
```bash
npm install react-helmet
```

Then use in components:
```jsx
import { Helmet } from 'react-helmet';

export default function ProductDetail() {
  return (
    <>
      <Helmet>
        <title>Product Name - Grosarry</title>
        <meta name="description" content="Product description" />
      </Helmet>
      {/* Component JSX */}
    </>
  );
}
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try port 5174.

### Module Not Found Errors
Ensure all import paths use relative paths from the file location.

### API Connection Issues
Check that your Laravel backend is running and the API routes are properly defined.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test the build with `npm run build`
4. Commit and push

## Support

For issues or questions, check the Laravel and Vite documentation:
- [Laravel Docs](https://laravel.com/docs)
- [Vite Docs](https://vitejs.dev)
- [React Router Docs](https://reactrouter.com)
