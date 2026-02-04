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
            {/* Top Bar - Premium Dark */}
            <div className="bg-emerald-950 text-white py-2 text-xs font-medium relative z-[51]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Left: Delivery Location */}
                    <div className="flex items-center gap-2 opacity-90 hover:opacity-100 cursor-pointer transition-opacity">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Deliver to: <strong>New York, 10001</strong></span>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link to="/track-order" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 group">
                            <svg className="w-3.5 h-3.5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Track Order
                        </Link>
                        <div className="h-3 w-px bg-white/20"></div>
                        <Link to="/become-vendor" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Become a Vendor
                        </Link>
                    </div>
                </div>
            </div>

            <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
                {/* Main Header Content */}
                <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 sm:gap-6">
                        {/* Logo - Left */}
                        <Link to="/" className="text-2xl sm:text-3xl font-bold text-emerald-600 whitespace-nowrap">
                            Grosarry
                        </Link>

                        {/* Search Bar - Center */}
                        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
                            <div className="relative flex items-center">
                                {/* Search Type Selector */}
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="absolute left-3 z-10 bg-transparent border-none text-xs sm:text-sm text-gray-600 font-medium focus:outline-none cursor-pointer pr-1"
                                >
                                    <option value="products">Products</option>
                                    <option value="vendors">Vendors</option>
                                    <option value="categories">Categories</option>
                                </select>

                                {/* Search Input */}
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={`Search ${searchType}...`}
                                    className="w-full pl-24 sm:pl-28 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                                />

                                {/* Search Button */}
                                <button
                                    type="submit"
                                    className="absolute right-2 p-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                                    aria-label="Search"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Right Side Icons - Right */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Cart */}
                            <Link to="/cart" className="relative text-gray-600 hover:text-emerald-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {cart.items.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {cart.items.length}
                                    </span>
                                )}
                            </Link>

                            {/* Account */}
                            {isAuthenticated ? (
                                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors">
                                    <span className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-xs sm:text-sm uppercase">
                                        {user?.name?.charAt(0)}
                                    </span>
                                    <span className="font-medium text-sm hidden md:inline">{user?.name?.split(' ')[0]}</span>
                                </Link>
                            ) : (
                                <Link to="/login" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base font-medium">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-200 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Grosarry. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MarketplaceLayout;
