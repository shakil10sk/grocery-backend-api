import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '@/shared/api'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products?limit=8')
      setProducts(response.data.data || response.data || [])
    } catch (err) {
      setError(err.message)
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Grosarry</h1>
          <div className="flex gap-4">
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <Link to="/cart" className="hover:text-blue-600">Cart</Link>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="aspect-square bg-gray-200 rounded-t-lg">
                {product.thumbnail_url && (
                  <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                <p className="text-lg font-bold text-green-600 mt-2">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
