import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useAuth } from '../context/AuthContext';

const VendorAuth = () => {
    const [isLogin, setIsLogin] = useState(false); // Default to register for "Become a vendor" link
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/vendor/dashboard'; // Redirect to vendor dashboard

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: ''
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const user = await login(formData.email, formData.password);
                // Check if user is actually a vendor (optional client-side check)
                // if (!user.roles.some(r => r.name === 'vendor')) { ... }
            } else {
                await register({ ...formData, role: 'vendor' });
            }
            navigate(redirect);
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MarketplaceLayout>
            <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">{isLogin ? 'Vendor Login' : 'Become a Vendor'}</h1>
                        <p className="text-gray-500 mt-2">{isLogin ? 'Manage your shop and orders' : 'Start selling your products today'}</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Store/Owner Name</label>
                                    <input
                                        type="text" name="name" required value={formData.name} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="My Grocery Store"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="+1234567890"
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="vendor@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password" name="password" required value={formData.password} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password" name="password_confirmation" required value={formData.password_confirmation} onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400 mt-6 flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                isLogin ? 'Vendor Login' : 'Register Shop'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-green-600 font-bold hover:underline"
                        >
                            {isLogin ? "Want to start selling? Register here" : "Already a vendor? Login"}
                        </button>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default VendorAuth;
