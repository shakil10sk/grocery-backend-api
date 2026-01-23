import { apiService } from './api';

// baseURL already contains /api/v1
const SETTINGS_API = 'settings';

export const settingsService = {
  /**
   * Get all settings
   */
  getAllSettings: async () => {
    return apiService.get(SETTINGS_API);
  },

  /**
   * Get contact settings
   */
  getContact: async () => {
    return apiService.get(`${SETTINGS_API}/contact`);
  },

  /**
   * Update contact settings
   */
  updateContact: async (data) => {
    return apiService.put(`${SETTINGS_API}/contact`, data);
  },

  /**
   * Get footer settings
   */
  getFooter: async () => {
    return apiService.get(`${SETTINGS_API}/footer`);
  },

  /**
   * Update footer settings
   */
  updateFooter: async (data) => {
    return apiService.put(`${SETTINGS_API}/footer`, data);
  },

  /**
   * Get header settings
   */
  getHeader: async () => {
    return apiService.get(`${SETTINGS_API}/header`);
  },

  /**
   * Update header settings
   */
  updateHeader: async (data) => {
    return apiService.put(`${SETTINGS_API}/header`, data);
  },
};
