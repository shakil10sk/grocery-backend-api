import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settings';

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [contactSettings, setContactSettings] = useState({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_city: '',
    company_state: '',
    company_zip: '',
    company_country: '',
    latitude: '',
    longitude: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    office_hours: {},
  });

  const [footerSettings, setFooterSettings] = useState({
    company_description: '',
    company_logo: '',
    footer_text: '',
    quick_links: [],
    company_links: [],
    support_links: [],
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    payment_methods: [],
  });

  const [headerSettings, setHeaderSettings] = useState({
    logo: '',
    tagline: '',
    announcement_text: '',
    show_announcement: false,
    menu_items: [],
    primary_color: '#0000ff',
    secondary_color: '#ffffff',
    text_color: '#000000',
    search_enabled: true,
    cart_enabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await settingsService.getAllSettings();
      
      if (data.contact) setContactSettings(data.contact);
      if (data.footer) setFooterSettings(data.footer);
      if (data.header) setHeaderSettings(data.header);
    } catch (err) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFooterChange = (e) => {
    const { name, value } = e.target;
    setFooterSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHeaderChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHeaderSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveContact = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await settingsService.updateContact(contactSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save contact settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFooter = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await settingsService.updateFooter(footerSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save footer settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHeader = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await settingsService.updateHeader(headerSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save header settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !contactSettings.company_name) {
    return <div className="p-4">Loading settings...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Settings Management</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b">
        {['contact', 'footer', 'header'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Contact Settings Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={contactSettings.company_name}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="company_email"
                value={contactSettings.company_email}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="company_phone"
                value={contactSettings.company_phone}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="company_address"
                value={contactSettings.company_address}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="company_city"
                value={contactSettings.company_city}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                name="company_state"
                value={contactSettings.company_state}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <input
                type="text"
                name="company_zip"
                value={contactSettings.company_zip}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="company_country"
                value={contactSettings.company_country}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={contactSettings.latitude}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={contactSettings.longitude}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <input
                type="url"
                name="facebook"
                value={contactSettings.facebook}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input
                type="url"
                name="twitter"
                value={contactSettings.twitter}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <input
                type="url"
                name="instagram"
                value={contactSettings.instagram}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={contactSettings.linkedin}
                onChange={handleContactChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveContact}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Contact Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Footer Settings Tab */}
      {activeTab === 'footer' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Description</label>
            <textarea
              name="company_description"
              value={footerSettings.company_description}
              onChange={handleFooterChange}
              rows="3"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                type="url"
                name="company_logo"
                value={footerSettings.company_logo}
                onChange={handleFooterChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Footer Text</label>
              <input
                type="text"
                name="footer_text"
                value={footerSettings.footer_text}
                onChange={handleFooterChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <input
                type="url"
                name="facebook"
                value={footerSettings.facebook}
                onChange={handleFooterChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input
                type="url"
                name="twitter"
                value={footerSettings.twitter}
                onChange={handleFooterChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <input
                type="url"
                name="instagram"
                value={footerSettings.instagram}
                onChange={handleFooterChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">YouTube</label>
              <input
                type="url"
                name="youtube"
                value={footerSettings.youtube}
                onChange={handleFooterChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveFooter}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Footer Settings'}
            </button>
          </div>
        </div>
      )}

      {/* Header Settings Tab */}
      {activeTab === 'header' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Logo URL</label>
              <input
                type="url"
                name="logo"
                value={headerSettings.logo}
                onChange={handleHeaderChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={headerSettings.tagline}
                onChange={handleHeaderChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Announcement Text</label>
              <input
                type="text"
                name="announcement_text"
                value={headerSettings.announcement_text}
                onChange={handleHeaderChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="show_announcement"
                  checked={headerSettings.show_announcement}
                  onChange={handleHeaderChange}
                  className="mr-2"
                />
                <span className="text-sm">Show Announcement</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <input
                type="color"
                name="primary_color"
                value={headerSettings.primary_color}
                onChange={handleHeaderChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Secondary Color</label>
              <input
                type="color"
                name="secondary_color"
                value={headerSettings.secondary_color}
                onChange={handleHeaderChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <input
                type="color"
                name="text_color"
                value={headerSettings.text_color}
                onChange={handleHeaderChange}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="search_enabled"
                checked={headerSettings.search_enabled}
                onChange={handleHeaderChange}
                className="mr-2"
              />
              <span>Enable Search</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="cart_enabled"
                checked={headerSettings.cart_enabled}
                onChange={handleHeaderChange}
                className="mr-2"
              />
              <span>Enable Cart</span>
            </label>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSaveHeader}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Header Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
