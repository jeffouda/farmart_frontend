import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, UploadCloud, CheckCircle, 
  ArrowLeft, X, FileText, AlertCircle, Loader2, User
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const FarmerRaiseDispute = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Form state
  const [buyerName, setBuyerName] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);

  // Constants
  const DISPUTE_REASONS = [
    { value: 'payment_not_received', label: 'Payment Not Received' },
    { value: 'buyer_no_show', label: 'Buyer No-Show' },
    { value: 'damage_property', label: 'Damage to Property' },
    { value: 'harassment', label: 'Harassment/Abuse' },
    { value: 'contract_violation', label: 'Contract Violation' },
    { value: 'other', label: 'Other' }
  ];

  const RESOLUTION_OPTIONS = [
    { value: 'refund', label: 'Request Payment', description: 'Get the payment you are owed' },
    { value: 'ban', label: 'Ban Buyer', description: 'Prevent this buyer from ordering again' },
    { value: 'apology', label: 'Request Apology', description: 'Get a formal apology from the buyer' },
    { value: 'report', label: 'Just Report', description: 'File a report for record keeping' }
  ];

  // Fetch order details if orderId exists
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId && orderId !== 'new') {
        try {
          setLoading(true);
          const res = await api.get('/orders/' + orderId);
          setOrderDetails(res.data);
          
          // If we have order details, try to get buyer info
          if (res.data.buyer_name) {
            setBuyerName(res.data.buyer_name);
          }
        } catch (err) {
          console.error('Failed to fetch order:', err);
          toast.error('Could not load order details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setEvidence(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEvidencePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeEvidence = () => {
    setEvidence(null);
    setEvidencePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!buyerName.trim()) {
      toast.error('Please enter the buyer name');
      return;
    }

    if (!reason) {
      toast.error('Please select a reason for the dispute');
      return;
    }

    if (description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    if (!resolution) {
      toast.error('Please select what you want as resolution');
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('order_id', orderId || '');
      formData.append('buyer_name', buyerName);
      formData.append('reason', reason);
      formData.append('description', description);
      formData.append('resolution', resolution);
      formData.append('dispute_type', 'farmer_report'); // Mark as farmer report
      
      if (evidence) {
        formData.append('evidence', evidence);
      }

      const res = await api.post('/disputes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setTicketId(res.data.ticket_id || 'DSP-' + Date.now());
      setSubmitted(true);
      toast.success('Report submitted successfully');

    } catch (err) {
      console.error('Failed to submit dispute:', err);
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  // Success State
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your report has been received. Our team will review it and take appropriate action.
          </p>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ticket ID</p>
            <p className="text-xl font-mono font-bold text-gray-800">{ticketId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/farmer-dashboard/disputes')}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View My Reports
            </button>
            <button
              onClick={() => navigate('/farmer-dashboard')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for fetching order details
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Report a Buyer Issue</h1>
              <p className="text-gray-600">File a report against a buyer for unresolved issues.</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        {orderDetails ? (
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Reporting Issue With Order</p>
                <p className="font-semibold text-gray-800">Order #{orderDetails.id}</p>
                {orderDetails.items && orderDetails.items.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {orderDetails.items[0].name || 'Livestock Item'}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-bold text-green-600">KES {orderDetails.total_amount?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
          
          {/* Step 1: Buyer Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Buyer Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Enter the buyer's name"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
              />
            </div>
          </div>

          {/* Step 2: The "Why" */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Why are you reporting this buyer? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DISPUTE_REASONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    reason === option.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={option.value}
                    checked={reason === option.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    reason === option.value ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {reason === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    )}
                  </div>
                  <span className="text-gray-700 font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: The "What" */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Describe what happened <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-2">
                ({description.length}/500, min 20)
              </span>
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide as much detail as possible about the issue with this buyer..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none"
              />
              <FileText className="absolute top-3 right-3 w-5 h-5 text-gray-400" />
            </div>
            {description.length > 0 && description.length < 20 && (
              <p className="text-red-500 text-sm mt-2">
                Please provide at least 20 characters
              </p>
            )}
          </div>

          {/* Step 4: The "Proof" */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Evidence (Optional)
              <span className="text-gray-400 font-normal ml-2">Upload photos, screenshots, or documents</span>
            </label>

            {!evidencePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Click or drag to upload</p>
                <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative inline-block">
                <div className="relative">
                  <img
                    src={evidencePreview}
                    alt="Evidence preview"
                    className="max-h-48 rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeEvidence}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">{evidence?.name}</p>
              </div>
            )}
          </div>

          {/* Step 5: The "Ask" */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              What would you like us to do? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {RESOLUTION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    resolution === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="resolution"
                    value={option.value}
                    checked={resolution === option.value}
                    onChange={(e) => setResolution(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center mt-0.5 ${
                    resolution === option.value ? 'border-green-500' : 'border-gray-300'
                  }`}>
                    {resolution === option.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={submitting || !buyerName || !reason || description.length < 20 || !resolution}
              className="w-full py-4 bg-red-600 text-white rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  Submit Report
                </>
              )}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              By submitting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">Need immediate help?</p>
            <p className="text-sm text-blue-600 mt-1">
              Contact our support team at support@farmart.co.ke or call 0700-FARMART
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerRaiseDispute;
