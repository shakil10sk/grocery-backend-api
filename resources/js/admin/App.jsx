import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Products from './pages/products/Products';
import ProductForm from './pages/products/ProductForm';
import ProductDetail from './pages/products/ProductDetail';
import ProductDetailEnhanced from './pages/products/ProductDetailEnhanced';
import Categories from './pages/categories/Categories';
import Orders from './pages/orders/Orders';
import Users from './pages/users/Users';
import Settings from './pages/settings/Settings';
import BlogPosts from './pages/blog/BlogPosts';
import BlogCategories from './pages/blog/BlogCategories';
import ReviewsList from './pages/reviews/ReviewsList';
import SettingsManagement from './pages/settings/SettingsManagement';
import VendorReports from './pages/reports/VendorReports';
import SlidersManagement from './pages/sliders/Sliders';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename="/admin">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Navigate to="/dashboard" replace />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProductForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProductForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProductDetailEnhanced />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Products />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Categories />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Orders />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/manage"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <SettingsManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/posts"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <BlogPosts />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog/categories"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <BlogCategories />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <ReviewsList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <VendorReports />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sliders"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout>
                    <SlidersManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
