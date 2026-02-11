import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  User,
  Sprout,
  Image,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  ChevronRight,
  Search,
  Filter,
  X,
  Loader2
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

// Mock Data
const mockDisputes = [
  {
    id: 1,
    orderId: "ORD-1234",
    orderAmount: 45000,
    orderDate: "2024-01-15",
    itemDetails: "2 Cows - Friesian Breed",
    buyer: {
      id: 101,
      name: "Alice Johnson",
      complaint: "The cows arrived in poor health condition. One cow has visible signs of disease and cannot be used for breeding as promised.",
      evidenceImage: null,
    },
    farmer: {
      id: 201,
      name: "John Kamau",
      defense: "The cows were healthy when they left my farm. The stress of transportation can cause temporary symptoms. I have veterinary certificates proving their health at departure.",
    },
    reason: "Quality Issue",
    status: "open",
    createdAt: "2024-01-16",
  },
  {
    id: 2,
    orderId: "ORD-1235",
    orderAmount: 28000,
    orderDate: "2024-01-18",
    itemDetails: "5 Goats - Boer Breed",
    buyer: {
      id: 102,
      name: "Bob Smith",
      complaint: "The goats are much smaller than described in the listing. The photos showed adult goats but I received young kids.",
      evidenceImage: "https://via.placeholder.com/400x300?text=Goat+Photo",
    },
    farmer: {
      id: 202,
      name: "Sarah Wanjiku",
      defense: "The size difference is normal for goats. All goats are within the expected weight range for their age. The listing clearly states the age of each goat.",
    },
    reason: "Misrepresentation",
    status: "open",
    createdAt: "2024-01-19",
  },
  {
    id: 3,
    orderId: "ORD-1236",
    orderAmount: 120000,
    orderDate: "2024-01-10",
    itemDetails: "1 Bull - Aberdeen Angus",
    buyer: {
      id: 103,
      name: "Carol Williams",
      complaint: "The bull has aggressive behavior issues. It attacked one of my workers on the first day. I want a full refund.",
      evidenceImage: null,
    },
    farmer: {
      id: 203,
      name: "Mike Ochieng",
      defense: "The bull was calm during my ownership. Any behavioral issues could be due to the new environment and need for proper handling.",
    },
    reason: "Behavioral Issue",
    status: "resolved",
    resolution: "refund_buyer",
    createdAt: "2024-01-12",
  },
];

// Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    open: "bg-red-500/20 text-red-400 border-red-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    resolved: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.open}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Evidence Image Modal
const EvidenceModal = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative max-w-2xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-slate-300"
        >
          <X size={24} />
        </button>
        <img
          src={image}
          alt="Evidence"
          className="w-full rounded-lg border border-slate-700"
        />
      </div>
    </div>
  );
};

// Resolution Modal
const ResolutionModal = ({ dispute, onResolve, onClose, resolving }) => {
  const [decision, setDecision] = useState(null);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!decision) {
      toast.error("Please select a resolution");
      return;
    }
    onResolve(dispute.id, { decision, notes });
  };

  if (dispute.status === "resolved") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Already Resolved</h3>
            <p className="text-slate-400">
              This dispute was resolved on {dispute.resolvedAt || dispute.createdAt}
            </p>
            <div className="mt-4 p-3 bg-slate-700 rounded-lg">
              <p className="text-sm text-slate-400">Decision</p>
              <p className="text-white font-medium">
                {dispute.resolution === "refund_buyer"
                  ? "Refund Buyer"
                  : dispute.resolution === "release_farmer"
                  ? "Release to Farmer"
                  : "Dismissed"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl w-full max-w-4xl border border-slate-700 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Case #{dispute.orderId} - Resolve Dispute
            </h3>
            <p className="text-slate-400 text-sm">
              Review evidence and make a decision
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Order Info */}
          <div className="bg-slate-700/50 rounded-lg p-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-xs">Order Amount</p>
              <p className="text-white font-bold text-lg">
                KES {dispute.orderAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Order Date</p>
              <p className="text-white font-medium">{dispute.orderDate}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Item</p>
              <p className="text-white font-medium">{dispute.itemDetails}</p>
            </div>
          </div>

          {/* Dispute Details */}
          <div className="grid grid-cols-2 gap-6">
            {/* Buyer Side */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <User size={18} className="text-red-400" />
                <h4 className="font-semibold text-white">Buyer's Claim</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-xs">Complainant</p>
                  <p className="text-white">{dispute.buyer.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Complaint</p>
                  <p className="text-slate-200 text-sm">{dispute.buyer.complaint}</p>
                </div>
                {dispute.buyer.evidenceImage && (
                  <div>
                    <p className="text-slate-400 text-xs mb-2">Evidence</p>
                    <img
                      src={dispute.buyer.evidenceImage}
                      alt="Buyer evidence"
                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90"
                      onClick={() => window.open(dispute.buyer.evidenceImage, "_blank")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Farmer Side */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sprout size={18} className="text-green-400" />
                <h4 className="font-semibold text-white">Farmer's Defense</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-xs">Respondent</p>
                  <p className="text-white">{dispute.farmer.name}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Defense</p>
                  <p className="text-slate-200 text-sm">{dispute.farmer.defense}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Resolution Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your decision..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-slate-700">
          <button
            onClick={() => setDecision("dismiss")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              decision === "dismiss"
                ? "bg-slate-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Dismiss
          </button>
          <button
            onClick={() => setDecision("release_farmer")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              decision === "release_farmer"
                ? "bg-green-600 text-white"
                : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
            }`}
          >
            Release to Farmer
          </button>
          <button
            onClick={() => setDecision("refund_buyer")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              decision === "refund_buyer"
                ? "bg-red-600 text-white"
                : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            }`}
          >
            Refund Buyer
          </button>
        </div>

        {/* Submit */}
        <div className="p-4 border-t border-slate-700 bg-slate-800/50 rounded-b-xl">
          <button
            onClick={handleSubmit}
            disabled={!decision || resolving}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {resolving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Resolving...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Confirm Resolution
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Dispute Card
const DisputeCard = ({ dispute, onClick }) => (
  <div
    onClick={() => onClick(dispute)}
    className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 cursor-pointer transition-all hover:shadow-lg"
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">Case #{dispute.orderId}</span>
          <StatusBadge status={dispute.status} />
        </div>
        <p className="text-slate-400 text-sm">{dispute.reason}</p>
      </div>
      <ChevronRight size={20} className="text-slate-500" />
    </div>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-slate-500">Buyer</p>
        <p className="text-white">{dispute.buyer.name}</p>
      </div>
      <div>
        <p className="text-slate-500">Farmer</p>
        <p className="text-white">{dispute.farmer.name}</p>
      </div>
      <div>
        <p className="text-slate-500">Amount</p>
        <p className="text-white font-medium">
          KES {dispute.orderAmount.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-slate-500">Filed</p>
        <p className="text-white">{dispute.createdAt}</p>
      </div>
    </div>
  </div>
);

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolving, setResolving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Fetch disputes
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        // For now, use mock data
        setDisputes(mockDisputes);
        // In production: const response = await api.get("/admin/disputes");
      } catch (error) {
        console.error("Failed to fetch disputes:", error);
        toast.error("Failed to load disputes");
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, []);

  // Handle resolution
  const handleResolve = async (disputeId, data) => {
    setResolving(true);
    try {
      // In production:
      // await api.post(`/admin/disputes/${disputeId}/resolve`, data);

      // Update local state
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === disputeId
            ? { ...d, status: "resolved", resolution: data.decision, resolvedAt: new Date().toISOString() }
            : d
        )
      );
      toast.success("Dispute resolved successfully");
      setSelectedDispute(null);
    } catch (error) {
      toast.error("Failed to resolve dispute");
    } finally {
      setResolving(false);
    }
  };

  // Filter disputes
  const filteredDisputes = disputes.filter((dispute) => {
    const matchesFilter = filter === "all" || dispute.status === filter;
    const matchesSearch =
      dispute.orderId.toLowerCase().includes(search.toLowerCase()) ||
      dispute.buyer.name.toLowerCase().includes(search.toLowerCase()) ||
      dispute.farmer.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openCount = disputes.filter((d) => d.status === "open").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dispute Resolution</h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and resolve conflicts between buyers and farmers
          </p>
        </div>
        {openCount > 0 && (
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-lg">
            <AlertTriangle size={16} className="text-red-400" />
            <span className="text-red-400 font-medium">{openCount} Open Cases</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by case ID, buyer, or farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {["all", "open", "resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Dispute Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={40} className="animate-spin text-blue-500" />
        </div>
      ) : filteredDisputes.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
          <CheckCircle size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400">No disputes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDisputes.map((dispute) => (
            <DisputeCard
              key={dispute.id}
              dispute={dispute}
              onClick={setSelectedDispute}
            />
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      {selectedDispute && (
        <ResolutionModal
          dispute={selectedDispute}
          onResolve={handleResolve}
          onClose={() => setSelectedDispute(null)}
          resolving={resolving}
        />
      )}
    </div>
  );
};

export default AdminDisputes;
