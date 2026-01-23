import { apiService } from './api';

// Use endpoints without version prefix — baseURL already includes /api/v1
const REVIEWS_API = 'reviews';

export const reviewService = {
  /**
   * Get reviews for a product
   */
  getProductReviews: async (productId, params = {}) => {
    return apiService.get(`products/${productId}/reviews`, { params });
  },

  /**
   * Get single review
   */
  getReview: async (reviewId) => {
    return apiService.get(`${REVIEWS_API}/${reviewId}`);
  },

  /**
   * Update review
   */
  updateReview: async (reviewId, data) => {
    return apiService.put(`${REVIEWS_API}/${reviewId}`, data);
  },

  /**
   * Delete review
   */
  deleteReview: async (reviewId) => {
    return apiService.delete(`${REVIEWS_API}/${reviewId}`);
  },

  /**
   * Approve review (admin only)
   */
  approveReview: async (reviewId) => {
    return apiService.post(`${REVIEWS_API}/${reviewId}/approve`);
  },
  
  /**
   * Get all reviews (admin)
   */
  getAllReviews: async (params = {}) => {
    return apiService.get(REVIEWS_API, { params });
  },
};
