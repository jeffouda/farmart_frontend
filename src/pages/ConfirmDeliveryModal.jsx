import React, { useState, useEffect } from 'react';
import { PackageCheck, Star, X, CheckCircle, ThumbsUp, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const ConfirmDeliveryModal = ({ order, onClose, onConfirmed }) => {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [completed, setCompleted] = useState(false);

  const QUICK_TAGS = [
    'Fresh',
    'Good Packaging',
    'On Time',
    'Value for Money',
    'Healthy Livestock',
    'Quality Product',
  ];

  // Handle tag toggle
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleConfirmDelivery = async () => {
    if (confirming) return;
    setConfirming(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCompleted(true);
      toast.success('Delivery confirmed successfully!');
      
      if (onConfirmed) onConfirmed();
      setStep(2);
    } catch (error) {
      toast.error('Failed to confirm delivery. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const handleSubmitReview = async () => {
    if (submitting || rating === 0) return;
    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Thank you for your review!');
      onClose();
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <PackageCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {completed ? 'Review Your Order' : 'Confirm Delivery'}
              </h2>
              <p className="text-sm text-gray-500">
                {completed ? 'Share your feedback' : 'Step 1 of 2'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Confirmation */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Only confirm if you have received the goods in good condition. 
                  This action cannot be undone and will release payment to the farmer.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Order Summary:</p>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {(order?.items || []).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.name} × {item.quantity}</span>
                      <span className="font-medium">KSh {(item.price * item.quantity)?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Tip</p>
                  <p className="text-sm text-blue-600 mt-1">
                    After confirming, you'll be able to leave a review to help other buyers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-3">Tap to rate</p>
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
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-100 text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {rating === 0 && 'Not rated'}
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
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

              {/* Feedback */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Leave a note (optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us more about your experience..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                disabled={confirming}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelivery}
                disabled={confirming}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {confirming ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Yes, I Received It
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSkip}
                disabled={submitting}
                className="px-4 py-2 text-gray-500 font-medium hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submitting || rating === 0}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeliveryModal;
