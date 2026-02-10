import React, { useState, useEffect } from 'react';
import { Scale, ShieldCheck, AlertCircle, Upload, X, Clock, User, FileText, HelpCircle, CheckCircle, XCircle, Plus, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

// Mock data for fallback when API is unavailable
const mockIncomingDisputes = [
  {
    id: 'DSP-001',
    orderId: 402,
    buyerName: 'John Kamau',
    buyerEmail: 'john.kamau@email.com',
    reason: 'Quality Issue',
    description: 'The milk delivered was spoiled. When I opened the container, it had a sour smell and was curdled.',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 2500,
  },
  {
    id: 'DSP-002',
    orderId: 405,
    buyerName: 'Sarah Wanjiku',
    buyerEmail: 'sarah.w@email.com',
    reason: 'Delivery Delay',
    description: 'The cattle were delivered 3 days late, which caused issues with my schedule.',
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 45000,
  },
];

const mockOutgoingDisputes = [
  {
    id: 'DSP-003',
    orderId: 398,
    buyerName: 'Michael Ochieng',
    reason: 'Payment Not Received',
    description: 'Buyer claims they paid via M-Pesa but I never received the confirmation. They refused to pay again.',
    status: 'pending_admin_review',
    resolution: 'refund',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 8500,
  },
  {
    id: 'DSP-004',
    orderId: 399,
    buyerName: 'Emily Njoroge',
    reason: 'Wrong Item Received',
    description: 'Buyer received a different breed of goat than what was ordered.',
    status: 'resolved_won',
    resolution: 'replacement',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 12000,
  },
];

const FarmerDisputes = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [incomingDisputes, setIncomingDisputes] = useState([]);
  const [outgoingDisputes, setOutgoingDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch disputes from API
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        setError(null);
        const response = await api.get('/disputes/my');
        
        // Verification logging
        console.group("🏛️ FARMER DISPUTES API VERIFICATION");
        console.log("Source URL:", '/disputes/my');
        console.log("HTTP Status:", response.status);
        console.log("Raw Data:", response.data);
        console.groupEnd();

        setIncomingDisputes(response.data.incoming || []);
        setOutgoingDisputes(response.data.outgoing || []);
      } catch (error) {
        console.warn("Failed to fetch disputes from API, using mock data:", error.message);
        // Fallback to mock data for demonstration
        setIncomingDisputes(mockIncomingDisputes);
        setOutgoingDisputes(mockOutgoingDisputes);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  // Calculate time remaining
  const getTimeRemaining = (deadline) => {
    if (!deadline) return { text: 'No deadline', urgent: false };
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return { text: 'Expired', urgent: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 2) return { text: `${days}d ${hours}h remaining`, urgent: false };
    if (days > 0) return { text: `${days}d ${hours}h remaining`, urgent: true };
    return { text: `${hours}h remaining`, urgent: true };
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      pending_admin_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      resolved_won: 'bg-green-100 text-green-700 border-green-200',
      resolved_lost: 'bg-gray-100 text-gray-700 border-gray-200',
      closed: 'bg-gray-100 text-gray-600 border-gray-200',
    };

    const labels = {
      open: 'Open',
      pending: 'Pending',
      pending_admin_review: 'Pending Admin Review',
      resolved_won: 'Resolved - Won',
      resolved_lost: 'Resolved - Lost',
      closed: 'Closed',
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badges[status] || badges.closed}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Handle response submission
  const handleSubmitResponse = async () => {
    if (!responseText.trim() || responseText.length < 20) {
      toast.error('Please provide a detailed explanation (at least 20 characters)');
      return;
    }

    setSubmitting(true);
    try {
      // Try API call first with FormData
      if (selectedDispute?.id) {
        const formData = new FormData();
        formData.append('response', responseText);
        if (evidence) {
          formData.append('evidence', evidence);
        }
        await api.post(`/disputes/${selectedDispute.id}/respond`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      toast.success('Response submitted successfully! An admin will review your case.');
      setShowModal(false);
      setSelectedDispute(null);
      setResponseText('');
      setEvidence(null);
      
      // Refresh disputes
      const response = await api.get('/disputes/my');
      setIncomingDisputes(response.data.incoming || []);
      setOutgoingDisputes(response.data.outgoing || []);
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error(error.response?.data?.error || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setEvidence(file);
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-slate-700" />
              </div>
              Dispute Management
            </h1>
            <p className="text-slate-500 mt-1">Manage disputes filed against you and disputes you have raised.</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading disputes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-slate-700" />
              </div>
              Dispute Management
            </h1>
            <p className="text-slate-500 mt-1">Manage disputes filed against you and disputes you have raised.</p>
          </div>
          <Link
            to="/farmer-dashboard/disputes/new"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            File New Report
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Disputes</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentDisputes = activeTab === 'incoming' ? incomingDisputes : outgoingDisputes;

  return (
    <div className="py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-slate-700" />
            </div>
            Dispute Management
          </h1>
          <p className="text-slate-500 mt-1">Manage disputes filed against you and disputes you have raised.</p>
        </div>
        <Link
          to="/farmer-dashboard/disputes/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          File New Report
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'incoming'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Action Required
            {incomingDisputes.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {incomingDisputes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'outgoing'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            My Reports
          </button>
        </div>
      </div>

      {/* Disputes List */}
      {currentDisputes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
          <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {activeTab === 'incoming' ? 'No pending disputes!' : 'No reports yet'}
          </h3>
          <p className="text-slate-500">
            {activeTab === 'incoming' 
              ? 'You have no disputes that require your response.' 
              : "You haven't filed any disputes against buyers."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentDisputes.map((dispute) => {
            const { text: timeText, urgent } = getTimeRemaining(dispute.deadline);

            return (
              <div
                key={dispute.id || dispute.ticket_id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                  urgent ? 'border-red-300 shadow-md' : 'border-slate-200 shadow-sm'
                }`}
              >
                {/* Header with urgency indicator */}
                <div className={`px-6 py-4 flex items-center justify-between ${
                  urgent ? 'bg-red-50' : 'bg-slate-50'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${urgent ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <div>
                      <h3 className="font-semibold text-slate-800">Order #{dispute.orderId || dispute.order_id}</h3>
                      <p className="text-sm text-slate-500">Dispute #{dispute.id || dispute.ticket_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(dispute.status)}
                    {dispute.deadline && (
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${
                        urgent ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <Clock className="w-4 h-4" />
                        {timeText}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          {activeTab === 'incoming' ? 'Buyer' : 'Against'}
                        </p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-medium text-slate-800">{dispute.buyerName || dispute.target_name || 'Unknown'}</span>
                          {dispute.buyerEmail && (
                            <span className="text-sm text-slate-500">({dispute.buyerEmail})</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dispute Reason</p>
                        <p className="font-medium text-slate-800">{dispute.reason || dispute.dispute_type}</p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          {activeTab === 'incoming' ? "Buyer's Claim" : 'Your Description'}
                        </p>
                        <p className="text-slate-600 bg-slate-50 rounded-lg p-3 text-sm border border-slate-200">
                          "{dispute.description}"
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount in Dispute</p>
                        <p className="font-bold text-green-600">KSh {(dispute.amount || 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-3">
                      {activeTab === 'incoming' && (
                        <>
                          {dispute.status === 'resolved' ? (
                            <div className="w-full py-3 px-4 bg-gray-100 text-gray-500 font-medium rounded-lg flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Resolved - No Response Needed
                            </div>
                          ) : dispute.farmer_response ? (
                            <div className="w-full py-3 px-4 bg-green-100 text-green-700 font-medium rounded-lg flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Response Submitted
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedDispute(dispute);
                                setResponseText('');
                                setEvidence(null);
                                setShowModal(true);
                              }}
                              className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              Respond / Upload Proof
                            </button>
                          )}
                        </>
                      )}
                      <button className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" />
                        View Order Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Tip */}
      {activeTab === 'incoming' && incomingDisputes.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">Tip for responding to disputes</p>
            <p className="text-sm text-blue-600 mt-1">
              Providing clear evidence (photos, receipts, delivery confirmations) significantly increases your chances of winning a dispute.
            </p>
          </div>
        </div>
      )}

      {/* Data Source Indicator */}
      <div className="text-center py-4 text-xs text-slate-400">
        Data Source: {error ? 'Mock Data (API unavailable)' : 'Live API'} {error ? '⚠️' : '✅'}
      </div>

      {/* Response Modal */}
      {showModal && selectedDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Respond to Dispute</h2>
                <p className="text-sm text-slate-500">Order #{selectedDispute.orderId} • {selectedDispute.id}</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDispute(null);
                  setResponseText('');
                  setEvidence(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Already Responded Warning */}
              {selectedDispute.farmer_response && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">You have already responded to this dispute.</p>
                  <p className="text-green-600 text-sm mt-1">
                    Response submitted on: {new Date(selectedDispute.farmer_response_at).toLocaleString()}
                  </p>
                </div>
              )}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {selectedDispute.buyerName || 'Buyer'}'s Claim
                </h3>
                <p className="text-slate-600 text-sm">{selectedDispute.description}</p>
              </div>

              {/* Response Textarea */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Explanation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Provide your side of the story. Include any relevant details, communications, or context that supports your case..."
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  {responseText.length}/1000 characters (minimum 20)
                </p>
              </div>

              {/* Evidence Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Upload Evidence
                  <span className="text-slate-400 font-normal ml-2">(Photos, receipts, screenshots)</span>
                </label>
                {!evidence ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">Click or drag to upload</p>
                    <p className="text-slate-400 text-sm mt-1">PNG, JPG, PDF up to 10MB</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <FileText className="w-8 h-8 text-slate-500" />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{evidence.name}</p>
                      <p className="text-sm text-slate-500">{(evidence.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button
                      onClick={() => setEvidence(null)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                )}
              </div>

              {/* Help Tip */}
              <div className="bg-yellow-50 rounded-lg p-4 flex items-start gap-3 border border-yellow-200">
                <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">Evidence tips</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Upload delivery receipts, photos of the item in good condition, timestamps, or any communication with the buyer that supports your case.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedDispute(null);
                  setResponseText('');
                  setEvidence(null);
                }}
                className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
              {!selectedDispute.farmer_response && selectedDispute.status !== 'resolved' && (
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || responseText.length < 20}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Response
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDisputes;
