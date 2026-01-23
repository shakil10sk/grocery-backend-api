import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const productService = {
  /**
   * Get all products
   */
  getProducts: async (params = {}) => {
    return await apiService.get(API_ENDPOINTS.PRODUCTS, { params });
  },

  /**
   * Get single product
   */
  getProduct: async (id) => {
    return await apiService.get(API_ENDPOINTS.PRODUCT(id));
  },

  /**
   * Create product
   */
  createProduct: async (data) => {
    return await apiService.post(API_ENDPOINTS.PRODUCTS, data);
  },

  /**
   * Update product
   */
  updateProduct: async (id, data) => {
    return await apiService.put(API_ENDPOINTS.PRODUCT(id), data);
  },

  /**
   * Delete product
   */
  deleteProduct: async (id) => {
    return await apiService.delete(API_ENDPOINTS.PRODUCT(id));
  },

  /**
   * Approve product (Admin only)
   */
  approveProduct: async (id) => {
    return await apiService.post(API_ENDPOINTS.PRODUCT_APPROVE(id));
  },

  /**
   * Reject product (Admin only)
   */
  rejectProduct: async (id, rejectionReason) => {
    return await apiService.post(API_ENDPOINTS.PRODUCT_REJECT(id), {
      rejection_reason: rejectionReason,
    });
  },

  /**
   * Update stock
   */
  updateStock: async (id, stockQuantity) => {
    return await apiService.post(API_ENDPOINTS.PRODUCT_STOCK(id), {
      stock_quantity: stockQuantity,
    });
  },

  /**
   * Create product variation
   */
  createVariation: async (productId, data) => {
    return await apiService.post(API_ENDPOINTS.PRODUCT_VARIATIONS(productId), data);
  },

  /**
   * Update product variation
   */
  updateVariation: async (productId, variationId, data) => {
    return await apiService.put(
      `${API_ENDPOINTS.PRODUCT_VARIATIONS(productId)}/${variationId}`,
      data
    );
  },

  /**
   * Delete product variation
   */
  deleteVariation: async (productId, variationId) => {
    return await apiService.delete(
      `${API_ENDPOINTS.PRODUCT_VARIATIONS(productId)}/${variationId}`
    );
  },

  /**
   * Upload product image
   */
  uploadImage: async (productId, imageFile, isPrimary = false) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('is_primary', isPrimary);

    return await apiService.postFormData(
      API_ENDPOINTS.PRODUCT_IMAGES(productId),
      formData
    );
  },

  /**
   * Set primary image
   */
  setPrimaryImage: async (productId, imageId) => {
    return await apiService.post(
      `${API_ENDPOINTS.PRODUCT_IMAGES(productId)}/${imageId}/set-primary`
    );
  },

  /**
   * Delete product image
   */
  deleteImage: async (productId, imageId) => {
    return await apiService.delete(
      `${API_ENDPOINTS.PRODUCT_IMAGES(productId)}/${imageId}`
    );
  },
};

export default productService;

