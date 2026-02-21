import React from 'react';
import { Link } from 'react-router-dom';

const TopRatedVendors = ({ vendors, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
                <div className="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                <div className="h-4 w-28 bg-gray-100 animate-pulse rounded"></div>
            </div>
        );
    }

    if (!vendors || vendors.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                Top Rated Vendors:
            </span>
            <div className="flex items-center gap-6">
                {vendors.map((vendor) => {
                    const vendorProfile = vendor.vendor_profile || vendor.vendorProfile;
                    const storeName = vendorProfile?.store_name || vendor.name || 'Unknown Vendor';

                    return (
                        <Link
                            key={vendor.id}
                            to={`/vendors/${vendor.id}`}
                            className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 hover:text-emerald-500 transition-colors whitespace-nowrap group"
                        >
                            {storeName}
                            <svg
                                className="w-3.5 h-3.5 text-blue-500 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};


export default TopRatedVendors;
