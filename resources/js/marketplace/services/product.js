import api from '../utils/api';
// Base endpoints
const PRODUCTS_API = 'products';
const CATEGORIES_API = 'categories';
const SLIDERS_API = 'sliders';
const REVIEWS_API = 'reviews';
export const productService = {
    /**
   * Get all products (public)
   */ getAllProducts: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        const queryString = params.toString();
        const url = queryString ? `${PRODUCTS_API}?${queryString}` : PRODUCTS_API;
        return api.get(url);
    },
    /**
   * Get a specific product
   */ getProduct: async (productId) => {
        return api.get(`${PRODUCTS_API}/${productId}`);
    },
    /**
   * Create a product (authenticated)
   */ createProduct: async (data) => {
        return api.post(PRODUCTS_API, data);
    },
    /**
   * Update a product
   */ updateProduct: async (productId, data) => {
        return api.put(`${PRODUCTS_API}/${productId}`, data);
    },
    /**
   * Delete a product
   */ deleteProduct: async (productId) => {
        return api.delete(`${PRODUCTS_API}/${productId}`);
    },
    /**
   * Get product reviews
   */ getProductReviews: async (productId) => {
        return api.get(`${PRODUCTS_API}/${productId}/reviews`);
    },
    /**
   * Create a review
   */ createReview: async (productId, data) => {
        return api.post(`${PRODUCTS_API}/${productId}/reviews`, data);
    },
    /**
   * Update product stock
   */ updateStock: async (productId, quantity) => {
        return api.post(`${PRODUCTS_API}/${productId}/stock`, {
            quantity
        });
    }
};
export const categoryService = {
    /**
   * Get all categories
   */ getAllCategories: async () => {
        return api.get(CATEGORIES_API);
    },
    /**
   * Get a specific category
   */ getCategory: async (categoryId) => {
        return api.get(`${CATEGORIES_API}/${categoryId}`);
    },
    /**
   * Get products by category
   */ getProductsByCategory: async (categoryId, filters = {}) => {
        const params = new URLSearchParams({
            category: categoryId
        });
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.page) params.append('page', filters.page);
        return api.get(`${PRODUCTS_API}?${params.toString()}`);
    },
    /**
   * Create a category (admin)
   */ createCategory: async (data) => {
        return api.post(CATEGORIES_API, data);
    },
    /**
   * Update a category (admin)
   */ updateCategory: async (categoryId, data) => {
        return api.put(`${CATEGORIES_API}/${categoryId}`, data);
    },
    /**
   * Delete a category (admin)
   */ deleteCategory: async (categoryId) => {
        return api.delete(`${CATEGORIES_API}/${categoryId}`);
    },
    /**
   * Toggle category status (admin)
   */ toggleStatus: async (categoryId) => {
        return api.post(`${CATEGORIES_API}/${categoryId}/toggle-status`);
    }
};
export const sliderService = {
    /**
   * Get all active sliders (public)
   */ getSliders: async () => {
        return api.get(SLIDERS_API);
    },
    /**
   * Get a specific slider
   */ getSlider: async (sliderId) => {
        return api.get(`${SLIDERS_API}/${sliderId}`);
    },
    /**
   * Get all sliders including inactive (admin)
   */ getAllSliders: async () => {
        return api.get(`${SLIDERS_API}/all`);
    },
    /**
   * Create a slider (admin)
   */ createSlider: async (data) => {
        return api.post(SLIDERS_API, data);
    },
    /**
   * Update a slider (admin)
   */ updateSlider: async (sliderId, data) => {
        return api.put(`${SLIDERS_API}/${sliderId}`, data);
    },
    /**
   * Delete a slider (admin)
   */ deleteSlider: async (sliderId) => {
        return api.delete(`${SLIDERS_API}/${sliderId}`);
    },
    /**
   * Toggle slider status (admin)
   */ toggleSlider: async (sliderId) => {
        return api.post(`${SLIDERS_API}/${sliderId}/toggle`);
    },
    /**
   * Reorder sliders (admin)
   */ reorderSliders: async (sliders) => {
        return api.post(`${SLIDERS_API}/reorder`, {
            sliders
        });
    }
};
export const reviewService = {
    /**
   * Get all reviews (admin/vendor)
   */ getAllReviews: async () => {
        return api.get(REVIEWS_API);
    },
    /**
   * Get a specific review
   */ getReview: async (reviewId) => {
        return api.get(`${REVIEWS_API}/${reviewId}`);
    },
    /**
   * Update a review
   */ updateReview: async (reviewId, data) => {
        return api.put(`${REVIEWS_API}/${reviewId}`, data);
    },
    /**
   * Delete a review
   */ deleteReview: async (reviewId) => {
        return api.delete(`${REVIEWS_API}/${reviewId}`);
    },
    /**
   * Approve a review (admin)
   */ approveReview: async (reviewId) => {
        return api.post(`${REVIEWS_API}/${reviewId}/approve`);
    }
};

export const vendorService = {
    /**
     * Get all vendors (public)
     */
    getAllVendors: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        const queryString = params.toString();
        // Assuming 'vendors' is the endpoint. If not, we might need to adjust.
        const url = queryString ? `vendors?${queryString}` : 'vendors';
        return api.get(url);
    },

    /**
     * Get featured/top vendors
     */
    getTopVendors: async () => {
        return api.get('vendors/top');
    },

    /**
     * Get a specific vendor
     */
    getVendor: async (vendorId) => {
        return api.get(`vendors/${vendorId}`);
    },

    /**
     * Get products by vendor
     */
    getVendorProducts: async (vendorId, filters = {}) => {
        const params = new URLSearchParams({ vendor_id: vendorId });
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.page) params.append('page', filters.page);
        return api.get(`${PRODUCTS_API}?${params.toString()}`);
    }
};
