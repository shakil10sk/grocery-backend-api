import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import reportService from '../services/reports';

const ReportsOverview = ({ vendorId = null }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState(null);

  // Fetch report for selected date
  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['report', selectedDate, vendorId],
    queryFn: () => reportService.getReportByDate(selectedDate),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // Generate report mutation
  const generateMutation = useMutation({
    mutationFn: () => reportService.generateReport(selectedDate, vendorId),
    onSuccess: () => {
      refetch();
      setError(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to generate report');
    },
  });

  const report = reportData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Reports</h2>
            <p className="text-gray-600 mt-1">View your daily sales metrics and insights</p>
          </div>
          <div className="flex gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {generateMutation.isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* No Report Message */}
      {!report && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 mx-auto text-amber-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-amber-900 font-medium">No report available for {selectedDate}</p>
          <p className="text-amber-700 text-sm mt-1">Click "Generate" to create a report for this date</p>
        </div>
      )}

      {/* Stats Grid */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{report.total_orders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{report.total_revenue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Items Sold */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Items Sold</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{report.total_items_sold}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">₹{report.average_order_value.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Cart Additions */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cart Additions</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{report.total_cart_additions}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Unique Buyers */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Unique Buyers</p>
                <p className="text-3xl font-bold text-cyan-600 mt-2">{report.total_unique_buyers}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3.914a.5.5 0 01-.5-.5V5.414a.5.5 0 01.5-.5H21a.5.5 0 01.5.5v15.086a.5.5 0 01-.5.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{report.average_rating.toFixed(1)}/5</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Reviews Received</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{report.total_reviews_received}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Best Performers */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Selling Product */}
          {report.best_selling_product_id && (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">🏆</span> Best Selling Product
              </h3>
              <p className="text-gray-600 text-sm">Product ID: {report.best_selling_product_id}</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{report.best_selling_product_quantity} units</p>
            </div>
          )}

          {/* Most Added to Cart */}
          {report.most_added_to_cart_product_id && (
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">🛒</span> Most Added to Cart
              </h3>
              <p className="text-gray-600 text-sm">Product ID: {report.most_added_to_cart_product_id}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{report.most_added_to_cart_count} times</p>
            </div>
          )}

          {/* Customer Summary */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">👥</span> Customers
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">New:</span>
                <span className="font-semibold text-purple-600">{report.new_customers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Returning:</span>
                <span className="font-semibold text-orange-600">{report.returning_customers}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsOverview;
