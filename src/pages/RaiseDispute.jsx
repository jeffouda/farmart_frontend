import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, UploadCloud, CheckCircle, 
  ArrowLeft, X, FileText, AlertCircle, Loader2
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const RaiseDispute = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query params for general dispute (user reports, livestock reports)
  const queryTargetId = searchParams.get('targetId') || '';
  const queryType = searchParams.get('type') || 'order'; // 'order' | 'user' | 'livestock'
  const queryContext = searchParams.get('context') || '';
  const queryRef = searchParams.get('ref') || '';

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Form state
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);

  // Constants
  const DISPUTE_REASONS = [
    { value: 'order_not_received', label: 'Order Not Received' },
    { value: 'poor_quality', label: 'Poor Quality/Damaged' },
    { value: 'wrong_item', label: 'Wrong Item Sent' },
    { value: 'unprofessional', label: 'Unprofessional Behavior' },
    { value: 'other', label: 'Other' }
  ];

  const RESOLUTION_OPTIONS = [
    { value: 'refund', label: 'I want a refund', description: 'Get my money back' },
    { value: 'replacement', label: 'I want a replacement', description: 'Get a new item instead' },
    { value: 'report', label: 'I just want to report this', description: 'No compensation needed' }
  ];

  // Fetch order details if orderId exists
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId && orderId !== 'new') {
        try {
          setLoading(true);
          const res = await api.get('/orders/' + orderId);
          setOrderDetails(res.data);
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
    if (!reason) {
      toast.error('Please select a reason for the dispute');
      return;
    }

    if (description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    if (!resolution) {
      toast.error('Please select what you want');
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('order_id', orderId || '');
      formData.append('reason', reason);
      formData.append('description', description);
      formData.append('resolution', resolution);
      
      // Include query params for non-order disputes
      if (queryType && queryType !== 'order') {
        formData.append('dispute_type', queryType);
        formData.append('target_id', queryTargetId);
        formData.append('context', queryContext);
        formData.append('reference_id', queryRef);
      }
      
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
      toast.success('Dispute submitted successfully');

    } catch (err) {
      console.error('Failed to submit dispute:', err);
      toast.error(err.response?.data?.message || 'Failed to submit dispute');
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
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dispute Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your dispute has been received. Our team will review it within 24-48 hours.
          </p>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ticket ID</p>
            <p className="text-xl font-mono font-bold text-gray-800">{ticketId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/orders')}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/dashboard')}
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
              <h1 className="text-2xl font-bold text-gray-800">Raise a Dispute</h1>
              <p className="text-gray-600">We're sorry you're having issues. Let us help resolve this.</p>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        {orderDetails ? (
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Reporting Issue With</p>
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
        ) : queryTargetId ? (
          // Display query-based dispute info (user reports, livestock reports)
          <div className="bg-white rounded-xl p-4 mb-6 border border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800 uppercase tracking-wider">
                {queryType === 'user' ? 'Reporting a User' : 'Reporting Content'}
              </span>
            </div>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">Target:</span> {queryTargetId}</p>
              {queryContext && <p><span className="font-medium">Context:</span> {queryContext}</p>}
              {queryRef && <p><span className="font-medium">Reference ID:</span> {queryRef}</p>}
            </div>
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-8">
          
          {/* Step 1: The "Why" */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Why are you reporting this issue? <span className="text-red-500">*</span>
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

          {/* Step 2: The "What" */}
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
                placeholder="Please provide as much detail as possible about the issue..."
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

          {/* Step 3: The "Proof" */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Evidence (Optional)
              <span className="text-gray-400 font-normal ml-2">Upload photos or screenshots</span>
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

          {/* Step 4: The "Ask" */}
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
              disabled={submitting || !reason || description.length < 20 || !resolution}
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
                  Submit Dispute
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

export default RaiseDispute;
