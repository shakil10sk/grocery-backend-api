// App constants
export const APP_NAME = 'Grosarry';

// API Constants
export const API_TIMEOUT = 30000; // 30 seconds

// Route constants
export const ROUTES = {
  // Marketplace routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  // LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',

  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
};

// Status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;

export default {
  APP_NAME,
  API_TIMEOUT,
  ROUTES,
  ORDER_STATUS,
  PRODUCT_STATUS,
  DEFAULT_PAGE_SIZE,
};
