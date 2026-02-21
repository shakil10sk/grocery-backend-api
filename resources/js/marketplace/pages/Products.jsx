import React, { useEffect, useState } from 'react';
import api from '@/shared/api';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import ProductCard from '../components/ProductCard';
import ProductFilter from '../components/ProductFilter';
import PromotionalCards from '../components/PromotionalCards';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams);
      const response = await api.get(`/products?${params.toString()}`);

      const data = response.data.data || response.data;
      const pagination = response.data.pagination || {};

      setProducts(Array.isArray(data) ? data : []);
      setTotalProducts(pagination.total || (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', e.target.value);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  return (
    <MarketplaceLayout>
      <div className="bg-[#fefffe] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Promotional Section */}
          <div className="mb-16">
            <PromotionalCards />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <ProductFilter />
            </aside>

            {/* Product Listing */}
            <div className="lg:col-span-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">All Products</h1>
                  <p className="text-gray-400 font-bold text-sm">
                    Showing <span className="text-gray-900">{totalProducts.toLocaleString()}</span> products
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sort by:</span>
                  <select
                    value={searchParams.get('sort') || 'latest'}
                    onChange={handleSortChange}
                    className="bg-transparent border-none text-gray-900 text-sm font-extrabold focus:ring-0 cursor-pointer p-0"
                  >
                    <option value="latest">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popularity">Popularity</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-[2.5rem] aspect-[4/5] animate-pulse"></div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 mb-16">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200/50">
                    <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">No products found</h3>
                  <p className="text-gray-400 font-bold mb-10 max-w-sm mx-auto">We couldn't find any products matching your current filters. Try adjusting them!</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl shadow-gray-900/10 active:scale-95"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Pagination Placeholder */}
              {!loading && products.length > 0 && totalProducts > products.length && (
                <div className="flex justify-center mt-20">
                  <button className="px-12 py-4 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm active:scale-95">
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default Products;
