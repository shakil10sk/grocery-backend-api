import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@/shared/queryClient'
import { lazy, Suspense } from 'react'

// Lazy load pages
const HomePage = lazy(() => import('./pages/Home'))
const ProductsPage = lazy(() => import('./pages/Products'))
const ProductDetailPage = lazy(() => import('./pages/ProductDetail'))
const CartPage = lazy(() => import('./pages/Cart'))
const CheckoutPage = lazy(() => import('./pages/Checkout'))
const RegisterPage = lazy(() => import('./pages/Register'))
const ProfilePage = lazy(() => import('./pages/Profile'))
const OrdersPage = lazy(() => import('./pages/Orders'))

// New Pages
const VendorsPage = lazy(() => import('./pages/Vendors'))
const VendorDetailsPage = lazy(() => import('./pages/VendorDetails'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/vendors/:id" element={<VendorDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
            <Route path="/register" element={<RegisterPage />} />
            {/* <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} /> */}
          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
  )
}

export default App
