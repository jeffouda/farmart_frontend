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