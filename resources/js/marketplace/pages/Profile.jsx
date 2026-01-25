import React, { useState, useEffect } from 'react';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useAuth } from '../context/AuthContext';
import api from '@/shared/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/addresses');
      setAddresses(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete address');
    }
  };

  return (
    <MarketplaceLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Info */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium">Edit Profile</button>
                <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium">Change Password</button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 transition font-medium"
                >
                  Logout
                </button>
              </div>
            </section>
          </div>

          {/* Addresses management */}
          <div className="lg:col-span-2">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                <button className="text-green-600 font-bold hover:underline">+ Add New</button>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-24 bg-gray-100 rounded-xl"></div>
                  <div className="h-24 bg-gray-100 rounded-xl"></div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-gray-500">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition relative group">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-gray-900">{addr.first_name} {addr.last_name}</span>
                        {addr.is_default && <span className="text-[10px] bg-green-200 text-green-800 px-2 py-0.5 rounded-full font-bold">DEFAULT</span>}
                      </div>
                      <p className="text-sm text-gray-600">{addr.address_line_1}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.postal_code}</p>
                      <p className="text-sm text-gray-600 mt-2 font-medium">{addr.phone}</p>

                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-2">
                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default Profile;
