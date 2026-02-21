import { apiService } from './api';

const SLIDERS_API = 'admin/sliders';

export const sliderService = {
  /**
   * Get all sliders (including inactive)
   */
  getAllSliders: async () => {
    return apiService.get(SLIDERS_API);
  },

  /**
   * Get a specific slider
   */
  getSlider: async (sliderId) => {
    return apiService.get(`${SLIDERS_API}/${sliderId}`);
  },

  /**
   * Create a slider
   */
  createSlider: async (data) => {
    return apiService.post(SLIDERS_API, data);
  },

  /**
   * Update a slider
   */
  updateSlider: async (sliderId, data) => {
    return apiService.put(`${SLIDERS_API}/${sliderId}`, data);
  },

  /**
   * Delete a slider
   */
  deleteSlider: async (sliderId) => {
    return apiService.delete(`${SLIDERS_API}/${sliderId}`);
  },

  /**
   * Toggle slider status
   */
  toggleSlider: async (sliderId) => {
    return apiService.post(`${SLIDERS_API}/${sliderId}/toggle`);
  },

  /**
   * Reorder sliders
   */
  reorderSliders: async (sliders) => {
    return apiService.post(`${SLIDERS_API}/reorder`, { sliders });
  },

  /**
   * Upload slider image
   */
  uploadImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiService.postFormData(`${SLIDERS_API}/upload-image`, formData);
  },
};
