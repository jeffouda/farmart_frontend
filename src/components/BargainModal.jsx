import React, { useState } from 'react';
import { X, MessageCircle, DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const BargainModal = ({ animal, isOpen, onClose }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form', 'success', 'error'
  const [errors, setErrors] = useState({});

  if (!isOpen || !animal) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!isAuthenticated) {
      newErrors.auth = 'Please log in to make an offer';
    } else if (currentUser?.role !== 'buyer') {
      newErrors.role = 'Only buyers can make offers';
    }

    const amount = parseFloat(offerAmount);
    if (!amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid offer amount greater than 0';
    } else if (amount > animal.price * 1.2) {
      newErrors.amount = `Offer cannot exceed 120% of asking price (KES ${Math.round(animal.price * 1.2).toLocaleString()})`;
    } else if (amount < animal.price * 0.5) {
      newErrors.amount = 'Offer is too low. Minimum allowed is 50% of asking price';
    }

    if (message.length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const amount = parseFloat(offerAmount);

    setIsLoading(true);

    try {
      const response = await api.post('/bargain/sessions', {
        animal_id: animal.id,
        offer_amount: amount,
        message: message || `I'm interested in buying this ${animal.species} for KES ${amount.toLocaleString()}`
      });

      setStep('success');
      toast.success('Offer submitted successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to submit offer';
      toast.error(errorMsg);
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOfferAmount('');
    setMessage('');
    setStep('form');
    setIsLoading(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-green-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Make an Offer</h3>
              <p className="text-green-100 text-sm">Negotiate the price</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit}>
              {/* Animal Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  {animal.image_url && (
                    <img 
                      src={animal.image_url} 
                      alt={animal.species}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {animal.species} - {animal.breed}
                    </h4>
                    <p className="text-sm text-slate-600">Asking: KES {animal.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Offer Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Offer (KES)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={offerAmount}
                    onChange={(e) => {
                      setOfferAmount(e.target.value);
                      if (errors.amount) setErrors(prev => ({ ...prev, amount: null }));
                    }}
                    placeholder="Enter your offer"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                      errors.amount ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    min="1"
                    max={animal.price * 1.2}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.amount}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Suggested: KES {Math.round(animal.price * 0.85).toLocaleString()} - KES {Math.round(animal.price * 0.95).toLocaleString()}
                </p>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message to Farmer (Optional)
                  <span className="text-slate-400 font-normal ml-2">
                    ({message.length}/500)
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors(prev => ({ ...prev, message: null }));
                  }}
                  placeholder="Tell the farmer why you're interested..."
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                    errors.message ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  rows={3}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !offerAmount}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Submit Offer
                  </>
                )}
              </button>

              {/* Tips */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 <strong>Tip:</strong> Farmers are more likely to accept offers within 85-95% of the asking price.
                </p>
              </div>
            </form>
          ) : step === 'success' ? (
            <div className="text-center py-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Offer Submitted!
              </h3>
              <p className="text-slate-600 mb-6">
                The farmer will be notified of your offer. You can continue negotiating through your dashboard.
              </p>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-slate-600 mb-6">
                Please try again or contact support.
              </p>
              <button
                onClick={() => setStep('form')}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BargainModal;
