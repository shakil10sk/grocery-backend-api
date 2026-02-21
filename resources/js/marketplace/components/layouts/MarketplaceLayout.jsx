import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const MarketplaceLayout = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('products');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            if (searchType === 'products') {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            } else if (searchType === 'vendors') {
                navigate(`/vendors?search=${encodeURIComponent(searchQuery)}`);
            } else if (searchType === 'categories') {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            }
            setSearchQuery('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar - Premium Minimal */}
            <div className="bg-gray-50 text-gray-600 py-2 text-[11px] font-bold border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Left: Delivery Location */}
                    <div className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer transition-colors">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>Deliver to: <span className="text-gray-900">New York, 10001</span></span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6">
                        <Link to="/track-order" className="hover:text-emerald-600 transition-colors">Track Order</Link>
                        <Link to="/become-vendor" className="hover:text-emerald-600 transition-colors">Become a Vendor</Link>
                        <Link to="/help" className="hover:text-emerald-600 transition-colors">Help</Link>
                    </div>
                </div>
            </div>

            <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-8">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-black text-emerald-600 tracking-tighter flex items-center gap-1">
                            FreshMarket
                        </Link>

                        {/* Search Bar - Premium Style */}
                        <form onSubmit={handleSearch} className="flex-grow max-w-3xl">
                            <div className="relative flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all overflow-hidden">
                                <div className="hidden md:flex items-center px-4 border-r border-gray-200 h-10">
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="bg-transparent border-none text-xs font-black text-gray-500 focus:ring-0 cursor-pointer uppercase tracking-tight"
                                    >
                                        <option value="products">All Products</option>
                                        <option value="vendors">Vendors</option>
                                        <option value="categories">Categories</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products, vendors, or categories..."
                                    className="flex-grow px-5 py-3 bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white p-3 mx-1.5 my-1.5 rounded-md transition-all shadow-sm"
                                    aria-label="Search"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            {/* Account */}
                            {isAuthenticated ? (
                                <Link to="/profile" className="flex items-center gap-2 group">
                                    <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm uppercase ring-2 ring-transparent group-hover:ring-emerald-500/20 transition-all">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-[10px] font-bold text-gray-400 leading-none mb-0.5">Welcome</p>
                                        <p className="text-sm font-black text-gray-900 leading-none">Account</p>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 group">
                                    <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-[10px] font-bold text-gray-400 leading-none mb-0.5">Sign In</p>
                                        <p className="text-sm font-black text-gray-900 leading-none">Account</p>
                                    </div>
                                </Link>
                            )}

                            {/* Cart */}
                            <Link to="/cart" className="flex items-center gap-2 group">
                                <div className="relative w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cart.items.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white">
                                            {cart.items.length}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-[10px] font-bold text-gray-400 leading-none mb-0.5">${cart.total?.toFixed(2) || '0.00'}</p>
                                    <p className="text-sm font-black text-gray-900 leading-none">Cart</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-[#1e293b] text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-gray-800 mb-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm">Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm">Local Vendors</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm">Organic Certified</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <span className="font-bold text-sm">Top Rated</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                        <div className="col-span-2">
                            <Link to="/" className="text-2xl font-black text-white tracking-tighter mb-6 block">FreshMarket</Link>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm mb-8">
                                Connecting you with the best local vendors and artisans for fresh, quality groceries.
                            </p>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 cursor-pointer transition-all">
                                        <div className="w-5 h-5 bg-gray-400"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-black text-sm mb-6 uppercase tracking-widest">Customer Care</h4>
                            <ul className="space-y-4 text-gray-400 text-sm font-bold">
                                <li><Link to="/help" className="hover:text-emerald-500 transition-colors">Help Center</Link></li>
                                <li><Link to="/track" className="hover:text-emerald-500 transition-colors">Track Your Order</Link></li>
                                <li><Link to="/returns" className="hover:text-emerald-500 transition-colors">Returns & Refunds</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-sm mb-6 uppercase tracking-widest">Become a Vendor</h4>
                            <ul className="space-y-4 text-gray-400 text-sm font-bold">
                                <li><Link to="/vendor-registration" className="hover:text-emerald-500 transition-colors">Vendor Registration</Link></li>
                                <li><Link to="/seller-dashboard" className="hover:text-emerald-500 transition-colors">Seller Dashboard</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-sm mb-6 uppercase tracking-widest">Delivery</h4>
                            <ul className="space-y-4 text-gray-400 text-sm font-bold">
                                <li><Link to="/drivers" className="hover:text-emerald-500 transition-colors">Become a Driver</Link></li>
                                <li><Link to="/earnings" className="hover:text-emerald-500 transition-colors">Earnings & Benefits</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-bold">
                        <p>&copy; {new Date().getFullYear()} FreshMarket. All rights reserved.</p>
                        <div className="flex gap-8">
                            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default MarketplaceLayout;
