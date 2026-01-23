import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import productService from '../services/products';

const ProductImageUpload = ({ productId, onImagesUpdated }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const queryClient = useQueryClient();

  // Fetch existing images
  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProduct(productId),
    enabled: !!productId,
  });

  const images = productData?.data?.images || [];

  // Upload image mutation
  const uploadMutation = useMutation({
    mutationFn: (formData) => productService.uploadImage(productId, formData.image, formData.isPrimary),
    onSuccess: (response) => {
      setUploadSuccess('Image uploaded successfully!');
      setUploadError(null);
      queryClient.invalidateQueries(['product', productId]);
      if (onImagesUpdated) {
        onImagesUpdated();
      }
      setTimeout(() => setUploadSuccess(null), 3000);
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'Failed to upload image';
      setUploadError(errorMsg);
      setUploadSuccess(null);
    },
  });

  // Set primary image mutation
  const setPrimaryMutation = useMutation({
    mutationFn: (imageId) => productService.setPrimaryImage(productId, imageId),
    onSuccess: () => {
      setUploadSuccess('Primary image updated!');
      setUploadError(null);
      queryClient.invalidateQueries(['product', productId]);
      if (onImagesUpdated) {
        onImagesUpdated();
      }
      setTimeout(() => setUploadSuccess(null), 3000);
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'Failed to set primary image';
      setUploadError(errorMsg);
      setUploadSuccess(null);
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: (imageId) => productService.deleteImage(productId, imageId),
    onSuccess: () => {
      setUploadSuccess('Image deleted successfully!');
      setUploadError(null);
      queryClient.invalidateQueries(['product', productId]);
      if (onImagesUpdated) {
        onImagesUpdated();
      }
      setTimeout(() => setUploadSuccess(null), 3000);
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'Failed to delete image';
      setUploadError(errorMsg);
      setUploadSuccess(null);
    },
  });

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Handle file selection from input
  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Process files
  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select only image files');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image size must be less than 5MB');
        return;
      }

      // Upload file
      uploadMutation.mutate({ image: file, isPrimary: false });
    }
  };

  if (productLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-green-800">{uploadSuccess}</p>
        </div>
      )}

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-800">{uploadError}</p>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          id="image-input"
          disabled={uploadMutation.isLoading}
        />
        <label htmlFor="image-input" className="cursor-pointer">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-gray-900 font-medium">Drag and drop images here or click to select</p>
          <p className="text-gray-500 text-sm mt-1">Supported formats: JPEG, PNG, GIF (Max 5MB per image)</p>
        </label>
      </div>

      {/* Existing Images */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images ({images.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                {/* Image */}
                <img
                  src={image.image_path}
                  alt="Product"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {/* Set Primary Button */}
                  <button
                    onClick={() => setPrimaryMutation.mutate(image.id)}
                    disabled={image.is_primary || setPrimaryMutation.isLoading || deleteImageMutation.isLoading}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      image.is_primary
                        ? 'bg-green-500 text-white cursor-default'
                        : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                    }`}
                    title={image.is_primary ? 'This is the primary image' : 'Set as primary image'}
                  >
                    {image.is_primary ? '✓ Primary' : 'Set Primary'}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteImageMutation.mutate(image.id)}
                    disabled={deleteImageMutation.isLoading || setPrimaryMutation.isLoading}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                    title="Delete image"
                  >
                    Delete
                  </button>
                </div>

                {/* Primary Badge */}
                {image.is_primary && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    PRIMARY
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Images Message */}
      {images.length === 0 && !productLoading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">No images yet. Upload images to get started.</p>
        </div>
      )}

      {/* Upload Status */}
      {uploadMutation.isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <p className="text-blue-800">Uploading image...</p>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
