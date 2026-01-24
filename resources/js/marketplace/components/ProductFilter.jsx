import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categoryService, vendorService } from '../services/product';

const ProductFilter = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [categories, setCategories] = useState([]);
    const [vendors, setVendors] = useState([]);

    // Current logic for filter state comes from URL params
    const currentCategory = searchParams.get('category');
    const currentVendor = searchParams.get('vendor_id');
    const currentSort = searchParams.get('sort') || 'newest';

    useEffect(() => {
        // Fetch filter options
        const loadOptions = async () => {
            try {
                const [catRes, venRes] = await Promise.all([
                    categoryService.getAllCategories(),
                    vendorService.getAllVendors({ limit: 10 }) // Limit sidebar vendors
                ]);
                setCategories(catRes.data.data || catRes.data || []);
                // Assuming vendor response structure
                setVendors(venRes.data.data || venRes.data || []);
            } catch (err) {
                console.error('Failed to load filters', err);
            }
        };
        loadOptions();
    }, []);

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        // Reset page on filter change
        newParams.delete('page');
        setSearchParams(newParams);
    };

    return (
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="category"
                            checked={!currentCategory}
                            onChange={() => handleFilterChange('category', null)}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <span className={!currentCategory ? 'text-green-600 font-medium' : 'text-gray-600'}>All Categories</span>
                    </label>
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value={cat.id}
                                checked={String(currentCategory) === String(cat.slug || cat.id)}
                                onChange={() => handleFilterChange('category', cat.slug || cat.id)}
                                className="text-green-600 focus:ring-green-500"
                            />
                            <span className={String(currentCategory) === String(cat.slug || cat.id) ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                {cat.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Vendors */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Vendors</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="vendor"
                            checked={!currentVendor}
                            onChange={() => handleFilterChange('vendor_id', null)}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <span className={!currentVendor ? 'text-green-600 font-medium' : 'text-gray-600'}>All Vendors</span>
                    </label>
                    {vendors.map(vendor => (
                        <label key={vendor.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="vendor"
                                value={vendor.id}
                                checked={String(currentVendor) === String(vendor.id)}
                                onChange={() => handleFilterChange('vendor_id', vendor.id)}
                                className="text-green-600 focus:ring-green-500"
                            />
                            <span className={String(currentVendor) === String(vendor.id) ? 'text-green-600 font-medium' : 'text-gray-600'}>
                                {vendor.shop_name || vendor.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Sort */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Sort By</h3>
                <select
                    value={currentSort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
                >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A-Z</option>
                </select>
            </div>
        </div>
    );
};

export default ProductFilter;
