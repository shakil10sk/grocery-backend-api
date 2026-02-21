import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '@/shared/api';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',
    is_default: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/register?redirect=/checkout');
      return;
    }

    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, cart.items.length]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/addresses');
      const data = response.data.data || [];
      setAddresses(data);
      if (data.length > 0) {
        const defaultAddr = data.find(a => a.is_default) || data[0];
        setSelectedAddressId(defaultAddr.id);
      } else {
        setShowAddressForm(true);
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
      setShowAddressForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    let addressId = selectedAddressId;

    try {
      setSubmitting(true);

      // If new address form is shown and we need to save it first
      if (showAddressForm) {
        const addrRes = await api.post('/addresses', newAddress);
        addressId = addrRes.data.data.id;
      }

      if (!addressId) {
        alert('Please select or add a shipping address');
        setSubmitting(false);
        return;
      }

      // Sync cart with backend first (assuming OrderController::store uses DB Cart)
      // In a real app, you'd sync on every change or here
      await Promise.all(cart.items.map(item =>
        api.post('/cart', {
          product_id: item.productId,
          quantity: item.quantity
        })
      ));

      const orderRes = await api.post('/orders', {
        address_id: addressId,
        payment_method: paymentMethod,
        notes: ''
      });

      clearCart();
      navigate('/orders', { state: { message: 'Order placed successfully!' } });
    } catch (err) {
      console.error('Order failed:', err);
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
                  Shipping Address
                </h2>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-green-600 font-bold hover:underline text-sm"
                  >
                    {showAddressForm ? 'Select Existing' : '+ Add New'}
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text" name="first_name" required value={newAddress.first_name} onChange={handleNewAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text" name="last_name" required value={newAddress.last_name} onChange={handleNewAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel" name="phone" required value={newAddress.phone} onChange={handleNewAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                    <input
                      type="text" name="address_line_1" required value={newAddress.address_line_1} onChange={handleNewAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="House / Flat / Street"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text" name="city" required value={newAddress.city} onChange={handleNewAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      type="text" name="postal_code" required value={newAddress.postal_code} onChange={handleNewAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-green-600 bg-green-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-gray-900">{addr.first_name} {addr.last_name}</span>
                        {addr.is_default && <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">DEFAULT</span>}
                      </div>
                      <p className="text-sm text-gray-600">{addr.address_line_1}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.postal_code}</p>
                      <p className="text-sm text-gray-600 mt-2 font-medium">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Payment Method Section */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
                Payment Method
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cash_on_delivery' ? 'border-green-600 bg-green-50' : 'border-gray-100'}`}>
                  <input
                    type="radio" name="payment" value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when your order arrives at your door</p>
                  </div>
                </label>
                <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'stripe' ? 'border-green-600 bg-green-50' : 'border-gray-100'}`}>
                  <input
                    type="radio" name="payment" value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <p className="font-bold text-gray-900">Online Payment (Stripe)</p>
                    <p className="text-sm text-gray-500">Secure payment via credit/debit card</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Order Summary Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6 font-display">Review Order</h3>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map(item => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded flex-shrink-0">
                      <img src={item.product?.thumbnail_url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 mb-6">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span>${cart.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping</span>
                  <span>${cart.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Tax</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-green-600">${cart.total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Place Order'
                )}
              </button>

              <p className="text-[10px] text-gray-400 mt-4 text-center">
                By placing your order, you agree to our Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </MarketplaceLayout>
  );
};

export default Checkout;
