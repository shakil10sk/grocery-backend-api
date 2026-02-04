import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
const WishlistPage = lazy(() => import('./pages/Wishlist'))

const VendorsPage = lazy(() => import('./pages/Vendors'))
const VendorDetailsPage = lazy(() => import('./pages/VendorDetails'))
const VendorAuthPage = lazy(() => import('./pages/VendorAuth'))
const VendorDashboardPage = lazy(() => import('./pages/VendorDashboard'))
const VendorProductsPage = lazy(() => import('./pages/VendorProducts'))
const VendorProductFormPage = lazy(() => import('./pages/VendorProductForm'))
const VendorLayout = lazy(() => import('./components/layouts/VendorLayout'))

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
)

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/vendors" element={<VendorsPage />} />
                  <Route path="/vendors/:id" element={<VendorDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/login" element={<RegisterPage />} /> {/* Using Register for now as Login/Signup usually same page or similar */}
                  <Route path="/auth/vendor" element={<VendorAuthPage />} />
                  <Route path="/become-vendor" element={<VendorAuthPage />} />

                  {/* Vendor Routes with Layout */}
                  <Route path="/vendor" element={<VendorLayout />}>
                    <Route path="dashboard" element={<VendorDashboardPage />} />
                    <Route path="products" element={<VendorProductsPage />} />
                    <Route path="products/new" element={<VendorProductFormPage />} />
                    <Route path="products/:id/edit" element={<VendorProductFormPage />} />
                    <Route path="orders" element={<OrdersPage />} /> {/* Reuse Order page or create new? */}
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
