// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/login',
  LOGOUT: '/logout',
  ME: '/me',
  REFRESH: '/refresh',
  
  // Profile
  PROFILE: '/profile',
  PROFILE_AVATAR: '/profile/avatar',
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY: (id) => `/categories/${id}`,
  CATEGORY_TOGGLE_STATUS: (id) => `/categories/${id}/toggle-status`,
  
  // Products
  PRODUCTS: '/products',
  PRODUCT: (id) => `/products/${id}`,
  PRODUCT_APPROVE: (id) => `/products/${id}/approve`,
  PRODUCT_REJECT: (id) => `/products/${id}/reject`,
  PRODUCT_STOCK: (id) => `/products/${id}/stock`,
  PRODUCT_VARIATIONS: (productId) => `/products/${productId}/variations`,
  PRODUCT_IMAGES: (productId) => `/products/${productId}/images`,
  
  // Orders
  ORDERS: '/orders',
  ORDER: (id) => `/orders/${id}`,
  ORDER_STATUS: (id) => `/orders/${id}/status`,
  ORDER_CANCEL: (id) => `/orders/${id}/cancel`,
  
  // Users
  USERS: '/users',
  USER: (id) => `/users/${id}`,
  
  // Cart
  CART: '/cart',
  CART_MERGE: '/cart/merge',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
};

// User Roles
export const ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  DELIVERY_BOY: 'delivery_boy',
  CUSTOMER: 'customer',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Product Status
export const PRODUCT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

