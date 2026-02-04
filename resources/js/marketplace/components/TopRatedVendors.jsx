import React from 'react';
import { Link } from 'react-router-dom';

const TopRatedVendors = ({ vendors, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center gap-2 overflow-x-auto">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-40 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-8 w-36 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
        );
    }

    if (!vendors || vendors.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-600 mr-2 flex-shrink-0">
                Top Rated Vendors:
            </span>
            {vendors.map((vendor) => {
                const vendorProfile = vendor.vendor_profile || vendor.vendorProfile;
                const storeName = vendorProfile?.store_name || vendor.name || 'Unknown Vendor';

                return (
                    <Link
                        key={vendor.id}
                        to={`/vendors/${vendor.id}`}
                        className="flex items-center gap-1 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm hover:border-emerald-700 hover:text-emerald-700 transition-colors flex-shrink-0"
                    >
                        {storeName}
                        <svg
                            className="w-3.5 h-3.5 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                );
            })}
        </div>
    );
};

export default TopRatedVendors;
