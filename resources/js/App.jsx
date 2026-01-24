// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// // Admin Pages
// import AdminLogin from './admin/pages/auth/Login';
// import AdminDashboard from './admin/pages/dashboard/Dashboard';
// import AdminProducts from './admin/pages/products/Products';
// import AdminProductForm from './admin/pages/products/ProductForm';
// import AdminProductDetail from './admin/pages/products/ProductDetail';
// import AdminCategories from './admin/pages/categories/Categories';
// import AdminOrders from './admin/pages/orders/Orders';
// import AdminUsers from './admin/pages/users/Users';
// import AdminSettings from './admin/pages/settings/Settings';
// import AdminBlogPosts from './admin/pages/blog/BlogPosts';
// import AdminBlogCategories from './admin/pages/blog/BlogCategories';
// import AdminReviews from './admin/pages/reviews/ReviewsList';
// import AdminReports from './admin/pages/reports/VendorReports';
// import AdminSliders from './admin/pages/sliders/Sliders';
// import DashboardLayout from './admin/components/layout/DashboardLayout';
// import ProtectedRoute from './admin/components/common/ProtectedRoute';
// import { AuthProvider as AdminAuthProvider } from './admin/contexts/AuthContext';

// // Marketplace Pages
// import MarketplaceHome from './marketplace/app/page';
// import MarketplaceProducts from './marketplace/app/products/page';
// import MarketplaceProductDetail from './marketplace/app/products/detail/page';
// import MarketplaceCart from './marketplace/app/cart/page';
// import MarketplaceWishlist from './marketplace/app/wishlist/page';
// import MarketplaceCategories from './marketplace/app/categories/page';
// import MarketplaceCheckout from './marketplace/app/checkout/page';
// import MarketplaceBlog from './marketplace/app/blog/page';
// import MarketplaceContact from './marketplace/app/contact/page';
// import MarketplaceProfile from './marketplace/app/profile/page';
// import MarketplaceLogin from './marketplace/app/auth/login/page';
// import MarketplaceSignup from './marketplace/app/auth/signup/page';
// import { CartProvider } from './marketplace/context/CartContext';
// import { WishlistProvider } from './marketplace/context/WishlistContext';
// import { AuthProvider as MarketplaceAuthProvider } from './marketplace/context/AuthContext';

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Router>
//         <Routes>
//           {/* Admin Routes */}
//           <Route
//             path="/admin/*"
//             element={
//               <AdminAuthProvider>
//                 <Routes>
//                   <Route path="login" element={<AdminLogin />} />
//                   <Route
//                     path="/*"
//                     element={
//                       <ProtectedRoute>
//                         <DashboardLayout>
//                           <Routes>
//                             <Route path="dashboard" element={<AdminDashboard />} />
//                             <Route path="products" element={<AdminProducts />} />
//                             <Route path="products/new" element={<AdminProductForm />} />
//                             <Route path="products/:id" element={<AdminProductDetail />} />
//                             <Route path="products/:id/edit" element={<AdminProductForm />} />
//                             <Route path="categories" element={<AdminCategories />} />
//                             <Route path="orders" element={<AdminOrders />} />
//                             <Route path="users" element={<AdminUsers />} />
//                             <Route path="settings" element={<AdminSettings />} />
//                             <Route path="blog/posts" element={<AdminBlogPosts />} />
//                             <Route path="blog/categories" element={<AdminBlogCategories />} />
//                             <Route path="reviews" element={<AdminReviews />} />
//                             <Route path="reports" element={<AdminReports />} />
//                             <Route path="sliders" element={<AdminSliders />} />
//                             <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
//                           </Routes>
//                         </DashboardLayout>
//                       </ProtectedRoute>
//                     }
//                   />
//                 </Routes>
//               </AdminAuthProvider>
//             }
//           />

//           {/* Marketplace Routes */}
//           <Route
//             path="/*"
//             element={
//               <MarketplaceAuthProvider>
//                 <CartProvider>
//                   <WishlistProvider>
//                     <Routes>
//                       <Route path="/" element={<MarketplaceHome />} />
//                       <Route path="/products" element={<MarketplaceProducts />} />
//                       <Route path="/products/:id" element={<MarketplaceProductDetail />} />
//                       <Route path="/cart" element={<MarketplaceCart />} />
//                       <Route path="/wishlist" element={<MarketplaceWishlist />} />
//                       <Route path="/categories" element={<MarketplaceCategories />} />
//                       <Route path="/checkout" element={<MarketplaceCheckout />} />
//                       <Route path="/blog" element={<MarketplaceBlog />} />
//                       <Route path="/contact" element={<MarketplaceContact />} />
//                       <Route path="/profile" element={<MarketplaceProfile />} />
//                       <Route path="/auth/login" element={<MarketplaceLogin />} />
//                       <Route path="/auth/signup" element={<MarketplaceSignup />} />
//                       <Route path="*" element={<Navigate to="/" replace />} />
//                     </Routes>
//                   </WishlistProvider>
//                 </CartProvider>
//               </MarketplaceAuthProvider>
//             }
//           />
//         </Routes>
//       </Router>
//     </QueryClientProvider>
//   );
// }

// export default App;


import { createRoot } from "react-dom/client";
import '../css/app.css';
import AdminApp from "./admin/AdminApp";
// import MarketplaceApp from "./marketplace/MarketplaceApp";
import MarketplaceApp from "./marketplace/MarketplaceApp";

const path = window.location.pathname;

if (path.startsWith("/admin")) {
    createRoot(document.getElementById("app")).render(<AdminApp />);
} else {
    createRoot(document.getElementById("app")).render(<MarketplaceApp />);
}
