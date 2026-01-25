import React from 'react';
import { Link } from 'react-router-dom';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <MarketplaceLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 divide-y divide-gray-100">
                {cart.items.map((item) => (
                  <div key={item.productId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={item.product?.thumbnail_url || '/placeholder.png'}
                        alt={item.product?.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link to={`/products/${item.productId}`} className="text-lg font-bold text-gray-900 hover:text-green-600 transition">
                            {item.product?.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.product?.category?.name}</p>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition border-r border-gray-300"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition border-l border-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-400">${item.price} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/products" className="text-green-600 font-bold hover:underline flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-gray-500 hover:text-red-500 text-sm font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${cart.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {cart.shipping === 0 ? <span className="text-green-600">Free</span> : `$${cart.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium text-gray-900">${cart.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">${cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-green-600 text-white text-center block py-4 rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-6 flex items-center gap-3 text-sm text-gray-500 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04clan0 10 0 0011.54 6.348 11.845 11.845 0 00-6.158-10.364z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default Cart;
