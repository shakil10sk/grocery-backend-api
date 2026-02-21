import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import api from '@/shared/api';

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📋', desc: 'Your order has been received.' },
    { key: 'processing', label: 'Processing', icon: '⚙️', desc: 'Vendor is preparing your items.' },
    { key: 'on_the_way', label: 'On the Way', icon: '🚚', desc: 'Your order is out for delivery.' },
    { key: 'delivered', label: 'Delivered', icon: '✅', desc: 'Order delivered successfully!' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'on_the_way': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getStatusIndex = (status) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.key === status);
};

const TrackOrder = () => {
    const [query, setQuery] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        try {
            setLoading(true);
            setError(null);
            setOrder(null);
            setSearched(false);

            // Try looking up by order number — fetch user's orders list first
            const res = await api.get(`/orders`);
            const items = res.data.data || [];
            const found = items.find(o =>
                o.order_number?.toLowerCase() === trimmed.toLowerCase() ||
                String(o.id) === trimmed
            );

            if (found) {
                // Fetch full detail
                const detRes = await api.get(`/orders/${found.id}`);
                setOrder(detRes.data.data);
            } else {
                setError('No order found with that number. Make sure you are logged in with the account used to place the order.');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('You must be logged in to track orders.');
            } else {
                setError(err.response?.data?.message || 'Failed to search orders.');
            }
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const currentStepIdx = order ? getStatusIndex(order.status) : -1;
    const isCancelled = order?.status === 'cancelled';

    return (
        <MarketplaceLayout>
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
                <div className="max-w-2xl mx-auto px-4">

                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                            🚚
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-3">Track Your Order</h1>
                        <p className="text-gray-500 text-lg">Enter your order number to see real-time delivery status.</p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Order Number</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g. ORD-2024-001"
                                className="flex-grow px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-medium"
                            />
                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Track
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">You must be signed in to track your orders.</p>
                    </form>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6 flex items-start gap-3">
                            <span className="text-red-500 text-lg mt-0.5">⚠️</span>
                            <div>
                                <p className="font-bold text-red-700 text-sm">{error}</p>
                                <p className="text-xs text-red-400 mt-1">
                                    <Link to="/orders" className="underline">View all your orders →</Link>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {order && (
                        <div className="space-y-5 animate-fade-in">
                            {/* Order Header */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order Number</p>
                                        <p className="text-xl font-black text-gray-900 mt-1">{order.order_number}</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Placed</p>
                                        <p className="text-gray-900 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Total</p>
                                        <p className="font-black text-green-600">${parseFloat(order.total).toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Payment</p>
                                        <p className="text-gray-900 font-medium capitalize">{order.payment_method?.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            {!isCancelled ? (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Delivery Timeline</h2>
                                    <div className="space-y-6">
                                        {statusSteps.map((step, idx) => {
                                            const done = idx <= currentStepIdx;
                                            const active = idx === currentStepIdx;
                                            return (
                                                <div key={step.key} className="flex gap-4 items-start">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 flex-shrink-0 transition-all ${done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300'} ${active ? 'ring-4 ring-green-500/20 scale-110' : ''}`}>
                                                        {done ? '✓' : step.icon}
                                                    </div>
                                                    <div className="pt-1.5">
                                                        <p className={`font-bold text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                                        <p className={`text-xs mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                                                    </div>
                                                    {idx < statusSteps.length - 1 && (
                                                        <div className="absolute ml-5 mt-10 w-0.5 h-6 bg-gray-100" style={{ display: 'none' }} />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                                    <p className="text-4xl mb-3">❌</p>
                                    <p className="font-black text-red-700 text-lg">Order Cancelled</p>
                                    <p className="text-red-500 text-sm mt-1">This order has been cancelled.</p>
                                </div>
                            )}

                            {/* Items */}
                            {order.items?.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Items</h2>
                                    <div className="divide-y divide-gray-50">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="py-3 flex justify-between gap-4 first:pt-0 last:pb-0">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{item.product_name}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-black text-gray-900 text-sm">${parseFloat(item.total_price).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Shipping */}
                            {order.address && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Shipping To</h2>
                                    <div className="flex gap-3 items-start">
                                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                            📍
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p className="font-bold text-gray-900">{order.address.address_line_1}</p>
                                            <p>{order.address.city}, {order.address.postal_code}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-center pt-2">
                                <Link to={`/orders/${order.id}`} className="text-green-600 font-bold hover:underline text-sm">
                                    View Full Order Details →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Helper links */}
                    {!order && !loading && (
                        <div className="text-center mt-6 space-y-3">
                            <p className="text-gray-400 text-sm">
                                Signed in? <Link to="/orders" className="text-green-600 font-bold hover:underline">View all your orders →</Link>
                            </p>
                            <p className="text-gray-400 text-sm">
                                Not signed in? <Link to="/register" className="text-green-600 font-bold hover:underline">Login to track →</Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default TrackOrder;
