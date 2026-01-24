import React from 'react';
import { Link } from 'react-router-dom';

const VendorList = ({ vendors, loading }) => {
    if (loading) return null; // Or skeleton
    if (!vendors || vendors.length === 0) return null;

    return (
        <div className="py-8 border-t border-gray-100">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Vendors</h2>
                <Link to="/vendors" className="text-green-600 hover:text-green-700 font-medium text-sm">All Vendors &rarr;</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vendors.map((vendor) => (
                    <Link
                        key={vendor.id}
                        to={`/vendors/${vendor.id}`}
                        className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            {vendor.logo_url ? (
                                <img src={vendor.logo_url} alt={vendor.shop_name || vendor.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 font-bold text-xl">
                                    {(vendor.shop_name || vendor.name).charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{vendor.shop_name || vendor.name}</h3>
                            <p className="text-xs text-gray-500">{vendor.products_count ? `${vendor.products_count} Products` : 'View Shop'}</p>
                            {/* Optional: Add rating stars */}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default VendorList;
