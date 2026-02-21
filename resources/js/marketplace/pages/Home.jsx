import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '@/shared/api'
import { vendorService } from '../services/product'
import HomeSlider from '../components/Slider'
import TopRatedVendors from '../components/TopRatedVendors'
import ProductCard from '../components/ProductCard'
import MarketplaceLayout from '../components/layouts/MarketplaceLayout'
import PromotionalCards from '../components/PromotionalCards'
import ProductFilter from '../components/ProductFilter'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch top vendors once
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const venRes = await vendorService.getTopVendors()
        const data = venRes.data?.data || venRes.data || []
        setVendors(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load vendors:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [])

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true)
        const params = new URLSearchParams(searchParams)
        const response = await api.get(`/products?${params.toString()}`)

        const data = response.data?.data || response.data || []
        const pagination = response.data?.pagination || {}

        setProducts(Array.isArray(data) ? data : [])
        setTotalProducts(pagination.total || (Array.isArray(data) ? data.length : 0))
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setProductsLoading(false)
      }
    }
    fetchProducts()
  }, [searchParams])

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', e.target.value)
    newParams.delete('page')
    setSearchParams(newParams)
  }

  return (
    <MarketplaceLayout>
      <main className="bg-[#fefffe] pb-16">
        {/* Top Rated Vendors - Directly below Header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <TopRatedVendors vendors={vendors} loading={loading} />
          </div>
        </div>

        {/* Hero Slider */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HomeSlider />
        </section>

        {/* Promotional Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PromotionalCards />
        </section>

        {/* Main Workspace: Sidebar + Product Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Left Sidebar: Filters */}
            <aside className="lg:col-span-1">
              <ProductFilter />
            </aside>

            {/* Right: Product Listing */}
            <div className="lg:col-span-3">
              {/* Header & Sort */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 mb-2">All Products</h1>
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
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-[2rem] aspect-[4/5] animate-pulse"></div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                    {products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {totalProducts > products.length && (
                    <div className="flex justify-center mt-12">
                      <button className="px-10 py-3.5 bg-white border-2 border-gray-100 rounded-2xl font-black text-gray-900 hover:border-emerald-600 hover:text-emerald-600 transition-all shadow-sm active:scale-95">
                        Load More Products
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200/50 text-gray-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">No products found</h3>
                  <p className="text-gray-400 font-bold mb-8 max-w-xs mx-auto text-sm">We couldn't find any products matching your current filters.</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 transition-all active:scale-95"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </MarketplaceLayout>
  )
}

