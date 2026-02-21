import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryService, vendorService } from '../services/product';

const ProductFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isVendorOpen, setIsVendorOpen] = useState(true);
    const [vendorSearch, setVendorSearch] = useState('');

    const currentCategory = searchParams.get('category');
    const currentVendor = searchParams.get('vendor_id');

    useEffect(() => {
        const loadFilterData = async () => {
            try {
                setLoading(true);
                const [catRes, venRes] = await Promise.all([
                    categoryService.getAllCategories(),
                    vendorService.getAllVendors({ limit: 10 })
                ]);
                setCategories(catRes.data.data || catRes.data || []);
                setVendors(venRes.data.data || venRes.data || []);
            } catch (err) {
                console.error('Failed to load filter data', err);
            } finally {
                setLoading(false);
            }
        };
        loadFilterData();
    }, []);

    const handleCategoryToggle = (slug) => {
        const newParams = new URLSearchParams(searchParams);
        if (currentCategory === slug) {
            newParams.delete('category');
        } else {
            newParams.set('category', slug);
        }
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const handleVendorToggle = (vendorId) => {
        const newParams = new URLSearchParams(searchParams);
        const id = vendorId.toString();
        if (currentVendor === id) {
            newParams.delete('vendor_id');
        } else {
            newParams.set('vendor_id', id);
        }
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const clearAll = () => {
        setSearchParams({});
    };

    const filteredVendors = vendors.filter(v =>
        (v.vendor_profile?.store_name || v.name).toLowerCase().includes(vendorSearch.toLowerCase())
    );

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sticky top-24 shadow-sm">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-gray-900">Filters</h2>
                <button
                    onClick={clearAll}
                    className="text-emerald-600 text-sm font-bold hover:text-emerald-700 transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-10 pb-10 border-b border-gray-50">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex justify-between items-center w-full group mb-6"
                >
                    <span className="font-bold text-gray-900 text-lg">Category</span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className={`space-y-4 transition-all duration-300 overflow-hidden ${isCategoryOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-50 rounded-lg animate-pulse w-full"></div>
                        ))
                    ) : (
                        categories.map((cat) => (
                            <label key={cat.id} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={currentCategory === (cat.slug || cat.id.toString())}
                                        onChange={() => handleCategoryToggle(cat.slug || cat.id.toString())}
                                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                                    />
                                </div>
                                <span className={`ml-3 text-sm transition-colors ${currentCategory === (cat.slug || cat.id.toString()) ? 'text-emerald-600 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>
                                    {cat.name}
                                </span>
                                <span className="ml-auto text-xs text-gray-400 font-bold">
                                    ({cat.products_count || 0})
                                </span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            {/* Vendor Filter */}
            <div className="mb-10 pb-10 border-b border-gray-50">
                <button
                    onClick={() => setIsVendorOpen(!isVendorOpen)}
                    className="flex justify-between items-center w-full group mb-6"
                >
                    <span className="font-bold text-gray-900 text-lg">Vendors</span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isVendorOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className={`transition-all duration-300 overflow-hidden ${isVendorOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={vendorSearch}
                            onChange={(e) => setVendorSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 placeholder-gray-400 transition-all font-medium"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-60 pr-2 custom-scrollbar">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-6 bg-gray-50 rounded-lg animate-pulse w-full"></div>
                            ))
                        ) : filteredVendors.length > 0 ? (
                            filteredVendors.map((vendor) => (
                                <label key={vendor.id} className="flex items-center group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={currentVendor === vendor.id.toString()}
                                        onChange={() => handleVendorToggle(vendor.id)}
                                        className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                                    />
                                    <div className="ml-3 flex items-center gap-1.5 flex-grow min-w-0">
                                        <span className={`text-sm transition-colors truncate ${currentVendor === vendor.id.toString() ? 'text-emerald-600 font-bold' : 'text-gray-600 font-medium group-hover:text-gray-900'}`}>
                                            {vendor.vendor_profile?.store_name || vendor.name}
                                        </span>
                                        {vendor.vendor_profile?.is_verified && (
                                            <svg className="w-3 h-3 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="ml-auto text-xs text-gray-400 font-bold">
                                        ({vendor.products_count || 0})
                                    </span>
                                </label>
                            ))
                        ) : (
                            <p className="text-xs text-gray-400 py-2">No vendors found</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Distance Filter */}
            <div className="mb-10 pb-10 border-b border-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-gray-900 text-lg">Distance from you</span>
                </div>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="20"
                        defaultValue="10"
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between mt-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span>5km</span>
                        <span>20km</span>
                    </div>
                </div>
            </div>

            {/* Fulfilment Filter */}
            <div>
                <span className="font-bold text-gray-900 text-lg block mb-6">Fulfilment</span>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center py-3 bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-700/20">
                        Delivery
                    </button>
                    <button className="flex items-center justify-center py-3 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-xl text-xs font-black transition-colors">
                        Pickup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;

