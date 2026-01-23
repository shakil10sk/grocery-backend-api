import apiService from './api';

// baseURL already contains /api/v1
export const reportService = {
  /**
   * Get vendor reports
   */
  getReports: async (params = {}) => {
    return await apiService.get('reports', { params });
  },

  /**
   * Get report by date (YYYY-MM-DD)
   */
  getReportByDate: async (date) => {
    return await apiService.get(`reports/show/${date}`);
  },

  /**
   * Generate report for date
   */
  generateReport: async (date = null, vendorId = null) => {
    const data = { date: date || new Date().toISOString().split('T')[0] };
    if (vendorId) data.vendor_id = vendorId;
    return await apiService.post('reports/generate', data);
  },

  /**
   * Get reports for date range
   */
  getReportsInRange: async (startDate, endDate, vendorId = null) => {
    const params = { start_date: startDate, end_date: endDate };
    if (vendorId) params.vendor_id = vendorId;
    return await apiService.get('reports', { params });
  },
};

export default reportService;
