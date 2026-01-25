import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/shared/api'
import { categoryService, vendorService } from '../services/product'
import HomeSlider from '../components/Slider'
import CategoryList from '../components/CategoryList'
import VendorList from '../components/VendorList'
import ProductCard from '../components/ProductCard'
import MarketplaceLayout from '../components/layouts/MarketplaceLayout'

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
          api.get('/products?limit=8'),
          categoryService.getAllCategories(),
          vendorService.getTopVendors()
        ])

        const extractData = (res) => {
          if (!res || !res.data) return [];
          return Array.isArray(res.data.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        };

        setProducts(extractData(prodRes));
        setCategories(extractData(catRes));
        setVendors(extractData(venRes));
      } catch (err) {
        console.error('Failed to load home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <MarketplaceLayout>
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
    </MarketplaceLayout>
  )
}
