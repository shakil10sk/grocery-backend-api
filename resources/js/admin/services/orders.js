import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const orderService = {
  /**
   * Get all orders
   */
  getOrders: async (params = {}) => {
    return await apiService.get(API_ENDPOINTS.ORDERS, { params });
  },

  /**
   * Get single order
   */
  getOrder: async (id) => {
    return await apiService.get(API_ENDPOINTS.ORDER(id));
  },

  /**
   * Update order status
   */
  updateStatus: async (id, status, deliveryBoyId = null) => {
    const data = { status };
    if (deliveryBoyId) {
      data.delivery_boy_id = deliveryBoyId;
    }
    return await apiService.post(API_ENDPOINTS.ORDER_STATUS(id), data);
  },

  /**
   * Cancel order
   */
  cancelOrder: async (id) => {
    return await apiService.post(API_ENDPOINTS.ORDER_CANCEL(id));
  },
};

export default orderService;

