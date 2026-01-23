import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviews';

export default function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending'); // pending, approved, all
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [filter, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { filter, page: currentPage };
      const response = await reviewService.getAllReviews(params);
      setReviews(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await reviewService.approveReview(reviewId);
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, is_approved: true } : r
      ));
    } catch (err) {
      setError('Failed to approve review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await reviewService.deleteReview(reviewId);
        setReviews(reviews.filter(r => r.id !== reviewId));
      } catch (err) {
        setError('Failed to delete review');
      }
    }
  };

  if (loading) return <div className="p-4">Loading reviews...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-4">
        {['pending', 'approved', 'all'].map(status => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded ${
              filter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Product</th>
              <th className="border p-3 text-left">User</th>
              <th className="border p-3 text-left">Rating</th>
              <th className="border p-3 text-left">Comment</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id} className="border hover:bg-gray-50">
                <td className="border p-3">{review.product?.name}</td>
                <td className="border p-3">{review.user?.name}</td>
                <td className="border p-3">
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                </td>
                <td className="border p-3 max-w-xs truncate">{review.comment}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-sm ${
                    review.is_approved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="border p-3">
                  {!review.is_approved && (
                    <button
                      onClick={() => handleApprove(review.id)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No reviews found
        </div>
      )}
    </div>
  );
}
