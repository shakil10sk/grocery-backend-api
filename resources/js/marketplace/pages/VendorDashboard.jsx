import React, { useEffect, useState } from 'react';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth/vendor?redirect=/vendor/dashboard');
        }
        // Strict role check could happen here
    }, [user, loading, navigate]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <MarketplaceLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
                    <p className="text-gray-600">
                        This is your vendor dashboard. Manage your products, orders, and settings here.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="font-bold text-blue-800 text-lg">Products</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                            <p className="text-sm text-blue-500 mt-1">Active Products</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                            <h3 className="font-bold text-emerald-800 text-lg">Orders</h3>
                            <p className="text-3xl font-bold text-emerald-600 mt-2">0</p>
                            <p className="text-sm text-emerald-500 mt-1">Pending Orders</p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                            <h3 className="font-bold text-purple-800 text-lg">Earnings</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">$0.00</p>
                            <p className="text-sm text-purple-500 mt-1">Total Earnings</p>
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default VendorDashboard;
