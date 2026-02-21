import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useAuth } from '../context/AuthContext';
import api from '@/shared/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses'
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/addresses');
      setAddresses(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await api.get('/orders');
      const raw = response.data;
      const items = raw.data ?? raw;
      setOrders(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    try {
      setLoggingOut(true);
      // Call backend logout to invalidate JWT token
      await api.post('/logout').catch(() => { });
    } finally {
      // Always clear local state and redirect
      logout();
      navigate('/');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
      case 'processing': return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
      case 'on_the_way': return { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' };
      case 'delivered': return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const runningOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const previousOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  return (
    <MarketplaceLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Avatar card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-3 shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">{user?.name || 'Guest'}</h2>
              <p className="text-sm text-gray-500 mt-1 truncate">{user?.email}</p>
              {user?.phone && <p className="text-sm text-gray-400 mt-0.5">{user.phone}</p>}
            </div>

            {/* Nav items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all border-l-4 ${activeTab === 'orders'
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                My Orders
                {orders.length > 0 && (
                  <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all border-l-4 ${activeTab === 'addresses'
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Saved Addresses
                {addresses.length > 0 && (
                  <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {addresses.length}
                  </span>
                )}
              </button>

              <div className="border-t border-gray-100" />

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-all border-l-4 border-transparent text-red-500 hover:bg-red-50 hover:border-red-400 disabled:opacity-60"
              >
                {loggingOut ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                )}
                {loggingOut ? 'Logging out…' : 'Logout'}
              </button>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-6">

            {/* ── MY ORDERS TAB ── */}
            {activeTab === 'orders' && (
              <>
                {ordersLoading ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="animate-pulse space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-6">You haven't placed any orders. Start shopping!</p>
                    <Link to="/products" className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition">
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Running Orders */}
                    {runningOrders.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse inline-block" />
                            <h2 className="text-lg font-bold text-gray-900">Running Orders</h2>
                          </span>
                          <span className="text-sm text-gray-400">({runningOrders.length})</span>
                        </div>
                        <div className="space-y-4">
                          {runningOrders.map(order => <OrderCard key={order.id} order={order} getStatusColor={getStatusColor} />)}
                        </div>
                      </div>
                    )}

                    {/* Previous Orders */}
                    {previousOrders.length > 0 && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-lg font-bold text-gray-900">Order History</h2>
                          <span className="text-sm text-gray-400">({previousOrders.length})</span>
                        </div>
                        <div className="space-y-4">
                          {previousOrders.map(order => <OrderCard key={order.id} order={order} getStatusColor={getStatusColor} />)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── ADDRESSES TAB ── */}
            {activeTab === 'addresses' && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                  <button className="bg-green-600 text-white text-sm px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New
                  </button>
                </div>

                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-24 bg-gray-100 rounded-xl" />
                    <div className="h-24 bg-gray-100 rounded-xl" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                    <div className="text-4xl mb-3">📍</div>
                    <p className="text-gray-500">No saved addresses yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <div key={addr.id} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition relative group">
                        <div className="flex justify-between mb-2">
                          <span className="font-bold text-gray-900">{addr.first_name} {addr.last_name}</span>
                          {addr.is_default && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">DEFAULT</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{addr.address_line_1}</p>
                        <p className="text-sm text-gray-600">{addr.city}, {addr.postal_code}</p>
                        <p className="text-sm text-gray-600 mt-2 font-medium">{addr.phone}</p>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-2">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

/* ─── Order Card Sub-component ─── */
const OrderCard = ({ order, getStatusColor }) => {
  const sc = getStatusColor(order.status);
  const label = (order.status || '').replace(/_/g, ' ');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Order #</p>
            <p className="text-sm font-semibold text-gray-900">{order.order_number || `#${order.id}`}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Placed</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Total</p>
            <p className="text-sm font-bold text-green-600">${parseFloat(order.total || 0).toFixed(2)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {label}
          </span>
          <Link to={`/orders/${order.id}`} className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline">
            View Details →
          </Link>
        </div>
      </div>

      {/* Items */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-4">
          {(order.items || []).slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                <img
                  src={item.product?.thumbnail_url || '/placeholder.png'}
                  alt={item.product_name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product_name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} · <span className="text-green-600 font-semibold">${item.unit_price}</span></p>
              </div>
            </div>
          ))}
          {(order.items || []).length > 3 && (
            <div className="flex items-center">
              <span className="text-xs text-gray-400 font-medium">+{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
