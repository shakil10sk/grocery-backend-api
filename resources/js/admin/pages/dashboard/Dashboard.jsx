import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/products';
import orderService from '../../services/orders';
import categoryService from '../../services/categories';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'dashboard'],
    queryFn: () => productService.getProducts({ per_page: 100 }),
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', 'dashboard'],
    queryFn: () => orderService.getOrders({ per_page: 100 }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'dashboard'],
    queryFn: () => categoryService.getCategories(),
  });

  const isLoading = productsLoading || ordersLoading || categoriesLoading;

  const products = productsData?.data || [];
  const orders = ordersData?.data || [];
  const categories = categoriesData?.data || [];

  const stats = [
    {
      title: 'Total Products',
      value: productsData?.pagination?.total || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Orders',
      value: ordersData?.pagination?.total || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Categories',
      value: categories?.length || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      change: '+3',
      changeType: 'positive',
    },
    {
      title: 'Pending Products',
      value: products.filter((p) => p.status === 'pending').length || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      change: 'Review needed',
      changeType: 'neutral',
    },
  ];

  const recentOrders = orders.slice(0, 5);
  const pendingProducts = products.filter((p) => p.status === 'pending').slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
              {stat.changeType === 'positive' && (
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              )}
              {stat.changeType === 'neutral' && (
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/products?status=pending')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Approve Products</p>
              <p className="text-xs text-gray-500">Review pending items</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group"
          >
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-xs text-gray-500">Manage all orders</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/categories')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
          >
            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Categories</p>
              <p className="text-xs text-gray-500">Organize products</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">All Products</p>
              <p className="text-xs text-gray-500">Browse products</p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <button
              onClick={() => navigate('/orders')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.user?.name || 'Customer'} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ${parseFloat(order.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent orders</p>
            </div>
          )}
        </div>

        {/* Pending Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Pending Products</h2>
            <button
              onClick={() => navigate('/products?status=pending')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>
          {pendingProducts.length > 0 ? (
            <div className="space-y-4">
              {pendingProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                >
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images.find(img => img.is_primary)?.image_path || product.images[0]?.image_path}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.category?.name || 'Uncategorized'} • ${parseFloat(product.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No pending products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;