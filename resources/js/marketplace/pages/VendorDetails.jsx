import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { vendorService } from '../services/product';
import ProductCard from '../components/ProductCard';

const VendorDetailsPage = () => {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                // Fetch vendor info and products
                // Depending on backend, might need separate calls or one
                const [vendorRes, productRes] = await Promise.all([
                    vendorService.getVendor(id),
                    vendorService.getVendorProducts(id)
                ]);

                setVendor(vendorRes.data.data || vendorRes.data);
                setProducts(productRes.data.data || productRes.data || []);
            } catch (error) {
                console.error('Failed to load vendor details', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchVendorData();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading Vendor Store...</div>;
    if (!vendor) return <div className="p-8 text-center">Vendor not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Vendor Header Banner */}
            <div className="bg-white shadow">
                <div className="h-48 bg-green-600 relative overflow-hidden">
                    {/* Cover image if available */}
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-6">
                    <div className="-mt-16 flex flex-col md:flex-row items-start md:items-end gap-6">
                        <div className="w-32 h-32 rounded-xl bg-white p-1 shadow-lg overflow-hidden">
                            {vendor.logo_url ? (
                                <img src={vendor.logo_url} alt={vendor.shop_name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                                    {(vendor.shop_name || vendor.name).charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-grow mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{vendor.shop_name || vendor.name}</h1>
                            <p className="text-gray-600">{vendor.address}</p>
                        </div>
                        <div className="flex gap-4 mb-3">
                            {/* Stats or contact buttons */}
                            <div className="text-center">
                                <span className="block font-bold text-xl">{products.length}</span>
                                <span className="text-xs text-gray-500 uppercase">Products</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vendor Products */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-xl font-bold mb-6">Store Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No products available from this vendor yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorDetailsPage;
