import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/shared/api'
import { categoryService, vendorService } from '../services/product'
import HomeSlider from '../components/Slider'
import CategoryList from '../components/CategoryList'
import VendorList from '../components/VendorList'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [prodRes, catRes, venRes] = await Promise.all([
          api.get('/products?limit=8'), // Featured/Recent products
          categoryService.getAllCategories(),
          vendorService.getTopVendors() // Or getAllVendors({limit: 4})
        ])
        setProducts(prodRes.data.data || prodRes.data || [])
        setCategories(catRes.data.data || catRes.data || [])
        setVendors(venRes.data.data || venRes.data || [])
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-600">Grosarry</Link>
          <div className="flex gap-6 items-center">
            <Link to="/" className="font-medium hover:text-green-600">Home</Link>
            <Link to="/products" className="font-medium hover:text-green-600">Shop</Link>
            <Link to="/vendors" className="font-medium hover:text-green-600">Vendors</Link>
            <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition mobile-hidden">
              Login
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-12">
        {/* Slider Section */}
        <section>
          <HomeSlider />
        </section>

        {/* Categories Section */}
        <section>
          <CategoryList categories={categories} loading={loading} />
        </section>

        {/* Featured Products Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/products" className="text-green-600 hover:text-green-700 font-medium text-sm">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Featured Vendors Section */}
        <section>
          <VendorList vendors={vendors} loading={loading} />
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          &copy; {new Date().getFullYear()} Grosarry. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
