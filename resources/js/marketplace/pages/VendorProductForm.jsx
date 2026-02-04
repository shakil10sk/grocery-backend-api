import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/product';

const VendorProductForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        compare_at_price: '',
        sku: '',
        stock_quantity: '',
        description: '',
        short_description: '',
        is_featured: false,
        track_stock: true,
        unit: 'piece',
        weight: ''
    });

    const [images, setImages] = useState([]); // For existing images
    const [newImages, setNewImages] = useState([]); // For newly uploaded files

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            // Assuming we have a category service or public endpoint
            const response = await fetch('/api/v1/categories');
            const data = await response.json();
            setCategories(data.data || []);
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productService.getProduct(id);
            const product = response.data.data;

            setFormData({
                name: product.name,
                category_id: product.category_id,
                price: product.price,
                compare_at_price: product.compare_at_price || '',
                sku: product.sku || '',
                stock_quantity: product.stock_quantity,
                description: product.description || '',
                short_description: product.short_description || '',
                is_featured: product.is_featured,
                track_stock: product.track_stock,
                unit: product.unit || 'piece',
                weight: product.weight || ''
            });
            setImages(product.images || []);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load product', err);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...filesArray]);
        }
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let productId = id;

            if (isEditMode) {
                await productService.updateProduct(id, formData);
            } else {
                const response = await productService.createProduct(formData);
                console.log("Create response", response);
                productId = response.data?.data?.id || response.data?.id;
            }

            // Upload Images if any
            if (newImages.length > 0 && productId) {
                // We need a loop or bulk upload endpoint. 
                // Check if productService has uploadImage. If not, implement temporary fetch here.
                const token = localStorage.getItem('token');
                for (const file of newImages) {
                    const imageFormData = new FormData();
                    imageFormData.append('image', file);
                    imageFormData.append('product_id', productId); // Some endpoints might need this in body or URL

                    // Assuming endpoint depends on backend. 
                    // If backend uses `products/{id}/images`
                    await fetch(`/api/v1/products/${productId}/images`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: imageFormData
                    });
                }
            }

            navigate('/vendor/products');
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to save product: ' + (err.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Organic Bananas" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                            <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. FRU-001" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price</label>
                                <input type="number" step="0.01" name="compare_at_price" value={formData.compare_at_price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input type="number" name="stock_quantity" required value={formData.stock_quantity} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                <select name="unit" value={formData.unit} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                                    <option value="piece">Piece</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="lb">lb</option>
                                    <option value="oz">oz</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"></textarea>
                </div>

                {/* Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="flex flex-wrap gap-4">
                        {/* Existing Images */}
                        {images.map((img) => (
                            <div key={img.id} className="w-24 h-24 relative border rounded-lg overflow-hidden">
                                <img src={img.image_url} alt="Product" className="w-full h-full object-cover" />
                                {/* Add delete button for existing images if created delete endpoint */}
                            </div>
                        ))}

                        {/* New Images Previews */}
                        {newImages.map((file, idx) => (
                            <div key={idx} className="w-24 h-24 relative border rounded-lg overflow-hidden group">
                                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}

                        {/* Upload Button */}
                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:text-green-500 transition text-gray-400">
                            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            <span className="text-xs">Upload</span>
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                <div className="border-t pt-6 flex justify-end gap-3">
                    <button type="button" onClick={() => navigate('/vendor/products')} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={saving} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                        {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {isEditMode ? 'Update Product' : 'Save Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default VendorProductForm;
