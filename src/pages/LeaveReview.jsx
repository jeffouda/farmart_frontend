/**
 * LeaveReview Component
 * 
 * A modal component that allows users to leave reviews for their orders.
 * Includes star rating, quick tags, feedback text area, and farmer rating.
 * 
 * @component
 * @param {Object} order - The order object to review
 * @param {Function} onClose - Callback function to close the modal
 * @param {Function} onSubmit - Callback function to submit the review
 */
import React, { useState } from 'react';
import { Star, X, CheckCircle, ThumbsUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LeaveReview = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [farmerRating, setFarmerRating] = useState(0);
  const [hoverFarmerRating, setHoverFarmerRating] = useState(0);

  const QUICK_TAGS = [
    'Fresh',
    'Good Packaging',
    'On Time',
    'Value for Money',
    'Healthy Livestock',
    'Quality Product',
    'Friendly Service',
    'Would Recommend',
  ];

  /**
   * Get the label for a given rating value
   * @param {number} rate - Rating value from 0-5
   * @returns {string} Label text
   */
  const getRatingLabel = (rate) => {
    const labels = {
      0: 'Tap to rate',
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return labels[rate] || 'Tap to rate';
  };

  /**
   * Toggle a tag in the selected tags array
   * @param {string} tag - Tag to toggle
   */
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  /**
   * Handle the review submission
   * Validates input and calls the onSubmit callback
   */
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (feedback.length < 10) {
      toast.error('Please provide feedback (at least 10 characters)');
      return;
    }

    setSubmitting(true);
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call onSubmit callback with review data
      onSubmit({
        orderId: order.id,
        rating,
        feedback,
        tags: selectedTags,
        farmerRating: farmerRating || null,
      });

      setSubmitted(true);
      toast.success('Thanks for your feedback!');
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle modal close
   * Prevents closing while submitting
   */
  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  // Success State
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Thanks for your feedback!</h2>
          <p className="text-gray-600 mb-6">You're helping other buyers make informed decisions.</p>
          <button
            onClick={handleClose}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Leave a Review</h2>
            <p className="text-sm text-gray-500">Order #{order?.id}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close review modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 mb-3">How was your experience?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                  disabled={submitting}
                  aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-100 text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {getRatingLabel(hoverRating || rating)}
            </p>
          </div>

          {/* Quick Tags */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">What went well?</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  disabled={submitting}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              How was the produce quality? <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-2">
                ({feedback.length}/500, min 10)
              </span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience with this order..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={submitting}
              aria-describedby="feedback-hint"
            />
            <span id="feedback-hint" className="sr-only">
              Enter your detailed feedback about the product quality. Minimum 10 characters.
            </span>
          </div>

          {/* Farmer Rating (Optional) */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Rate the Farmer (Optional)</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">{order?.farmer_name || 'Farmer'}</p>
              </div>
              <div className="flex items-center gap-2" role="radiogroup" aria-label="Farmer rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFarmerRating(star === farmerRating ? 0 : star)}
                    onMouseEnter={() => setHoverFarmerRating(star)}
                    onMouseLeave={() => setHoverFarmerRating(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                    disabled={submitting}
                    aria-label={`Rate farmer ${star} star${star > 1 ? 's' : ''}`}
                    role="radio"
                    aria-checked={farmerRating === star}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverFarmerRating || farmerRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-100 text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            {farmerRating > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {getRatingLabel(farmerRating)}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0 || feedback.length < 10}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <ThumbsUp className="w-4 h-4" />
                Submit Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveReview;

