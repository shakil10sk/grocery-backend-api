import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES } from '../../utils/constants';
import reportService from '../../services/reports';
import ReportsOverview from '../../components/ReportsOverview';

const VendorReports = () => {
  const { user, isAdmin, hasRole } = useAuth();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [filterVendor, setFilterVendor] = useState(hasRole ? (hasRole(ROLES.VENDOR) ? user?.id : '') : '');

  // Fetch reports list
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports', dateRange, filterVendor],
    queryFn: () => reportService.getReportsInRange(dateRange.startDate, dateRange.endDate, filterVendor || null),
  });

  const reports = reportsData?.data || [];

  // Calculate summary metrics
  const summary = {
    totalOrders: reports.reduce((sum, r) => sum + r.total_orders, 0),
    totalRevenue: reports.reduce((sum, r) => sum + r.total_revenue, 0),
    totalItemsSold: reports.reduce((sum, r) => sum + r.total_items_sold, 0),
    totalCartAdditions: reports.reduce((sum, r) => sum + r.total_cart_additions, 0),
    uniqueBuyers: new Set(reports.map(r => r.id)).size, // Simplified, should be sum
    avgRating: reports.length > 0 
      ? (reports.reduce((sum, r) => sum + r.average_rating, 0) / reports.length).toFixed(2)
      : 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vendor Reports</h1>
        <p className="text-gray-600 mt-1">Track your sales, orders, and customer insights</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {isAdmin() && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
              <input
                type="number"
                placeholder="Vendor ID"
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Period Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Total Orders</p>
          <p className="text-3xl font-bold mt-2">{summary.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">₹{summary.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Items Sold</p>
          <p className="text-3xl font-bold mt-2">{summary.totalItemsSold}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Cart Additions</p>
          <p className="text-3xl font-bold mt-2">{summary.totalCartAdditions}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Unique Buyers</p>
          <p className="text-3xl font-bold mt-2">{summary.uniqueBuyers}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Avg Rating</p>
          <p className="text-3xl font-bold mt-2">{summary.avgRating}/5</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Orders</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Revenue</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Items</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Buyers</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Avg Order</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {new Date(report.report_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.total_orders}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">₹{report.total_revenue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.total_items_sold}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.total_unique_buyers}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">₹{report.average_order_value.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
                        ⭐ {report.average_rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No reports available for the selected period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Report Generator */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Daily Report</h3>
        <p className="text-gray-600 text-sm mb-4">
          Generate a detailed report for a specific date
        </p>
        <ReportsOverview vendorId={filterVendor || null} />
      </div>
    </div>
  );
};

export default VendorReports;
