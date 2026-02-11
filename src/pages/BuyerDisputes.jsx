import React, { useState, useEffect } from 'react';
import { Scale, ShieldCheck, AlertCircle, Clock, User, FileText, HelpCircle, CheckCircle, XCircle, Package, MessageSquare, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

// Modal component for responding to disputes
const ResponseModal = ({ dispute, isOpen, onClose, onSubmit }) => {
  const [response, setResponse] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !dispute) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('response', response);
    if (evidence) {
      formData.append('evidence', evidence);
    }

    await onSubmit(dispute.id || dispute.ticket_id, formData);
    setSubmitting(false);
    setResponse('');
    setEvidence(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Respond to Dispute</h2>
          <p className="text-slate-500 text-sm mt-1">
            Dispute #{dispute.id || dispute.ticket_id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Dispute Details */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Farmer's Claim</h3>
            <p className="text-sm text-slate-600 mb-2"><strong>Reason:</strong> {dispute.reason}</p>
            <p className="text-sm text-slate-600"><strong>Description:</strong></p>
            <p className="text-sm text-slate-700 bg-white rounded p-3 mt-1 border border-slate-200">
              "{dispute.description}"
            </p>
          </div>

          {/* Response Text */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Response *
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="4"
              placeholder="Explain your side of the story..."
              required
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Evidence (optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <input
                type="file"
                onChange={(e) => setEvidence(e.target.files[0])}
                className="hidden"
                id="evidence-upload"
                accept="image/*,.pdf,.doc,.docx"
              />
              <label htmlFor="evidence-upload" className="cursor-pointer text-green-600 hover:text-green-700 font-medium">
                Upload Evidence
              </label>
              <p className="text-xs text-slate-500 mt-1">
                {evidence ? evidence.name : 'Supports: Images, PDF, DOC (max 5MB)'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !response.trim()}
              className="flex-1 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BuyerDisputes = () => {
  const [activeTab, setActiveTab] = useState('incoming'); // Default to incoming (need to respond)
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
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

        console.group("🏛️ BUYER DISPUTES API VERIFICATION");
        console.log("Source URL:", '/disputes/my');
        console.log("HTTP Status:", response.status);
        console.log("Raw Data:", response.data);
        console.groupEnd();

        // Handle different response formats
        if (response.data.incoming && response.data.outgoing) {
          setIncomingDisputes(response.data.incoming);
          setOutgoingDisputes(response.data.outgoing);
        } else if (Array.isArray(response.data)) {
          setOutgoingDisputes(response.data);
          setIncomingDisputes([]);
        } else {
          setIncomingDisputes(response.data.incoming || []);
          setOutgoingDisputes(response.data.outgoing || []);
        }
      } catch (err) {
        console.warn("Failed to fetch disputes from API:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  // Submit response to a dispute
  const handleRespond = async (disputeId, formData) => {
    try {
      const response = await api.post(`/disputes/${disputeId}/respond`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Response submitted successfully!');

      // Update the local state
      setIncomingDisputes(prev =>
        prev.map(d =>
          (d.id === disputeId || d.ticket_id === disputeId)
            ? { ...d, status: 'pending', buyer_response: formData.get('response') }
            : d
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit response');
    }
  };

  // Check if user can respond to a dispute
  const canRespond = (dispute) => {
    return dispute.status === 'open' && !dispute.buyer_response;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      pending_admin_review: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      resolved: 'bg-green-100 text-green-700 border-green-200',
      resolved_won: 'bg-green-100 text-green-700 border-green-200',
      resolved_lost: 'bg-gray-100 text-gray-700 border-gray-200',
      closed: 'bg-gray-100 text-gray-600 border-gray-200',
    };

    const labels = {
      open: '🔴 Open - Needs Response',
      pending: '⏳ Pending Review',
      pending_admin_review: '⏳ Pending Admin Review',
      resolved: '✅ Resolved',
      resolved_won: '✅ Resolved - Favorable',
      resolved_lost: '❌ Resolved - Unfavorable',
      closed: '📁 Closed',
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badges[status] || badges.closed}`}>
        {labels[status] || status}
      </span>
    );
  };

  // Get resolution badge
  const getResolutionBadge = (resolution) => {
    const badges = {
      refund: 'bg-green-100 text-green-700 border-green-200',
      replacement: 'bg-blue-100 text-blue-700 border-blue-200',
      apology: 'bg-purple-100 text-purple-700 border-purple-200',
      report: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const labels = {
      refund: '💰 Refund Requested',
      replacement: '🔄 Replacement Requested',
      apology: '🙏 Apology Requested',
      report: '📋 Just Reporting',
    };

    if (!resolution) return null;

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badges[resolution] || badges.report}`}>
        {labels[resolution] || resolution}
      </span>
    );
  };

  // Render dispute card
  const renderDisputeCard = (dispute, isIncoming) => {
    const hasResponse = dispute.buyer_response || dispute.farmer_response;
    const responseNeeded = isIncoming && canRespond(dispute);

    return (
      <div
        key={dispute.id || dispute.ticket_id}
        className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
          responseNeeded ? 'border-red-300 shadow-md' : 'border-slate-200 shadow-sm'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${
          responseNeeded ? 'bg-red-50' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${responseNeeded ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            <div>
              <h3 className="font-semibold text-slate-800">Order #{dispute.order_id || dispute.orderId}</h3>
              <p className="text-sm text-slate-500">Dispute #{dispute.id || dispute.ticket_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(dispute.status)}
            {responseNeeded && (
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                ⚠️ Action Required
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {/* Filer Info */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {isIncoming ? 'Filed By (Farmer)' : 'Filed Against'}
                </p>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {dispute.filer_name || dispute.farmer_name || dispute.target_name || 'Unknown'}
                  </span>
                </div>
              </div>

              {/* Reason */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dispute Reason</p>
                <p className="font-medium text-slate-800">
                  {dispute.reason || dispute.dispute_type?.replace(/_/g, ' ')}
                </p>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  {isIncoming ? 'Farmer\'s Description' : 'Your Description'}
                </p>
                <p className="text-slate-600 bg-slate-50 rounded-lg p-3 text-sm border border-slate-200">
                  "{dispute.description}"
                </p>
              </div>

              {/* Your Response (if submitted) */}
              {hasResponse && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                    ✅ Your Response
                  </p>
                  <p className="text-sm text-green-800">
                    "{dispute.buyer_response || dispute.farmer_response}"
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Submitted: {dispute.buyer_response_at || dispute.farmer_response_at}
                  </p>
                </div>
              )}

              {/* Resolution Requested */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Resolution Requested</p>
                {getResolutionBadge(dispute.resolution)}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3">
              {/* Amount */}
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Amount in Dispute</p>
                <p className="text-2xl font-bold text-green-700">KSh {(dispute.amount || dispute.order_amount || 0).toLocaleString()}</p>
              </div>

              {/* Respond Button (for incoming disputes) */}
              {responseNeeded && (
                <button
                  onClick={() => {
                    setSelectedDispute(dispute);
                    setResponseModalOpen(true);
                  }}
                  className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Respond to Dispute
                </button>
              )}

              {/* View Order */}
              <Link
                to="/orders"
                className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                View Order Details
              </Link>

              {/* Contact Support */}
              <button
                onClick={() => toast('Support: support@farmart.co.ke', { icon: '📧' })}
                className="w-full py-3 px-4 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-slate-700" />
            </div>
            Disputes
          </h1>
          <p className="text-slate-500 mt-1">Manage disputes filed by and against you.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading disputes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-slate-700" />
            </div>
            Disputes
          </h1>
          <p className="text-slate-500 mt-1">Manage disputes filed by and against you.</p>
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

  const totalIncoming = incomingDisputes.filter(d => d.status === 'open').length;

  return (
    <div className="py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-slate-700" />
            </div>
            Disputes
          </h1>
          <p className="text-slate-500 mt-1">Manage disputes filed by and against you.</p>
        </div>
        {totalIncoming > 0 && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
            ⚠️ {totalIncoming} dispute{totalIncoming > 1 ? 's' : ''} need{totalIncoming === 1 ? 's' : ''} your response
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'incoming'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Need Response
            {totalIncoming > 0 && (
              <span className="ml-2 bg-red-200 text-red-800 text-xs px-2 py-0.5 rounded-full">
                {totalIncoming}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'outgoing'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Filed by You
            {outgoingDisputes.length > 0 && (
              <span className="ml-2 bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full">
                {outgoingDisputes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Incoming Disputes */}
      {activeTab === 'incoming' && (
        incomingDisputes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <ShieldCheck className="w-12 h-12 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No disputes against you! 🎉
            </h3>
            <p className="text-slate-500 mb-6">
              No farmers have filed disputes against your orders.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {incomingDisputes.map(d => renderDisputeCard(d, true))}
          </div>
        )
      )}

      {/* Outgoing Disputes */}
      {activeTab === 'outgoing' && (
        outgoingDisputes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No disputes filed by you
            </h3>
            <p className="text-slate-500 mb-6">
              You haven't filed any disputes against farmers.
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              View My Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {outgoingDisputes.map(d => renderDisputeCard(d, false))}
          </div>
        )
      )}

      {/* Response Modal */}
      <ResponseModal
        dispute={selectedDispute}
        isOpen={responseModalOpen}
        onClose={() => {
          setResponseModalOpen(false);
          setSelectedDispute(null);
        }}
        onSubmit={handleRespond}
      />

      {/* Help Tip */}
      {incomingDisputes.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">Responding to disputes</p>
            <p className="text-sm text-blue-600 mt-1">
              Please respond within 48 hours. Include any evidence like payment confirmations,
              delivery photos, or communication with the farmer.
            </p>
          </div>
        </div>
      )}

      {/* Data Source Indicator */}
      <div className="text-center py-4 text-xs text-slate-400">
        Data Source: {error ? 'Unable to load' : 'Live API'} {error ? '⚠️' : '✅'}
      </div>
    </div>
  );
};

export default BuyerDisputes;
