import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import api from '@/shared/api';

const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📋' },
    { key: 'processing', label: 'Processing', icon: '⚙️' },
    { key: 'on_the_way', label: 'On the Way', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '✅' },
];

const getStatusIndex = (status) => {
    if (status === 'cancelled') return -1;
    return statusSteps.findIndex(s => s.key === status);
};

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

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load order.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            setCancelling(true);
            await api.post(`/orders/${id}/cancel`);
            await fetchOrder();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not cancel this order.');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <MarketplaceLayout>
                <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            </MarketplaceLayout>
        );
    }

    if (error || !order) {
        return (
            <MarketplaceLayout>
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <p className="text-red-500 text-lg font-semibold mb-4">{error || 'Order not found.'}</p>
                    <Link to="/orders" className="text-green-600 font-bold hover:underline">← Back to Orders</Link>
                </div>
            </MarketplaceLayout>
        );
    }

    const currentStepIdx = getStatusIndex(order.status);
    const isCancelled = order.status === 'cancelled';

    return (
        <MarketplaceLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <Link to="/orders" className="text-sm text-green-600 font-bold hover:underline flex items-center gap-1 mb-2">
                            ← Back to Orders
                        </Link>
                        <h1 className="text-2xl font-black text-gray-900">Order #{order.order_number}</h1>
                        <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                        </span>
                        {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="px-4 py-1.5 rounded-full text-sm font-bold border border-red-300 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Timeline */}
                {!isCancelled && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Order Progress</h2>
                        <div className="relative flex items-start justify-between">
                            {/* Progress Bar */}
                            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100" style={{ zIndex: 0 }}>
                                <div
                                    className="h-full bg-green-500 transition-all duration-700"
                                    style={{ width: currentStepIdx >= 0 ? `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` : '0%' }}
                                />
                            </div>
                            {statusSteps.map((step, idx) => {
                                const done = idx <= currentStepIdx;
                                const active = idx === currentStepIdx;
                                return (
                                    <div key={step.key} className="flex flex-col items-center z-10" style={{ width: `${100 / statusSteps.length}%` }}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-200'} ${active ? 'ring-4 ring-green-500/20 scale-110' : ''}`}>
                                            {done ? '✓' : <span className="text-gray-300">{step.icon}</span>}
                                        </div>
                                        <p className={`text-xs font-bold mt-2 text-center ${done ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {isCancelled && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-center">
                        <p className="text-red-700 font-bold text-sm">❌ This order has been cancelled.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Items Ordered</h2>
                            <div className="divide-y divide-gray-50">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            <span className="text-3xl">🛒</span>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-gray-900 text-sm">{item.product_name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">SKU: {item.product_sku}</p>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} × <span className="font-bold text-gray-700">${parseFloat(item.unit_price).toFixed(2)}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900">${parseFloat(item.total_price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Price Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Tax (10%)</span>
                                    <span>${parseFloat(order.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Delivery Fee</span>
                                    <span>${parseFloat(order.delivery_fee).toFixed(2)}</span>
                                </div>
                                {parseFloat(order.discount) > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-${parseFloat(order.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-100 flex justify-between font-black text-gray-900">
                                    <span>Total</span>
                                    <span className="text-green-600 text-lg">${parseFloat(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-4">
                        {/* Shipping Address */}
                        {order.address && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h2>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p className="font-bold text-gray-900">{order.address.address_line_1}</p>
                                        <p>{order.address.city}, {order.address.postal_code}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Payment</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Method</span>
                                    <span className="font-bold text-gray-900 capitalize">{order.payment_method?.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`font-bold capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Info */}
                        {order.vendor && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Vendor</h2>
                                <p className="font-bold text-gray-900 text-sm">{order.vendor.name}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default OrderDetail;
