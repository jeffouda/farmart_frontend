import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  History,
  Eye,
  Phone,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

// Status badge colors
const getStatusColors = (status) => {
  switch (status) {
    case "pending":
      return { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" };
    case "processing":
      return { bg: "bg-blue-100", text: "text-blue-700", label: "Processing" };
    case "shipped":
      return { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" };
    case "in_transit":
      return { bg: "bg-indigo-100", text: "text-indigo-700", label: "In Transit" };
    case "delivered":
      return { bg: "bg-green-100", text: "text-green-700", label: "Delivered" };
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-700", label: status };
  }
};

// Details Modal Component
const DetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const buyer = order.buyer || {};
  const firstItem = order.items?.[0] || {};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Order Details</h3>
          <p className="text-sm text-slate-500">Order #{order.id?.slice(0, 8)}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Animal Info */}
          <div className="flex gap-4">
            <img
              src={firstItem.image_url || "https://placehold.co/100x100?text=No+Image"}
              alt={firstItem.name || "Animal"}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <p className="font-bold text-slate-900">{firstItem.name || "Livestock"}</p>
              <p className="text-sm text-slate-500">{firstItem.species || "Unknown"}</p>
              <p className="text-green-600 font-bold mt-1">
                KES {parseFloat(order.total_amount || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Buyer Contact */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Buyer Contact
            </p>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-slate-400" />
              <a
                href={tel:${buyer.phone_number || ""}}
                className="text-slate-700 hover:text-green-600 transition-colors"
              >
                {buyer.phone_number || "N/A"}
              </a>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Delivery Address
            </p>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-slate-400 mt-0.5" />
              <p className="text-slate-700">
                {order.delivery_address || buyer.delivery_address || "N/A"}
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Special Instructions
            </p>
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-slate-400 mt-0.5" />
              <p className="text-slate-700">
                {order.special_instructions || buyer.preferred_contact || "None provided"}
              </p>
            </div>
          </div>

          {/* Order Date */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Order Date
            </p>
            <p className="text-slate-700">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Order Card Component
const OrderCard = ({ order, onViewDetails, onUpdateStatus }) => {
  const statusColors = getStatusColors(order.status);
  const buyer = order.buyer || {};
  const firstItem = order.items?.[0] || {};
  const buyerName = buyer.full_name || "Unknown Buyer";

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Top: Image + Info + Price */}
      <div className="flex flex-col sm:flex-row">
        {/* Left: Animal Image */}
        <div className="w-full sm:w-32 h-32 sm:h-auto flex-shrink-0">
          <img
            src={firstItem.image_url || "https://placehold.co/400x400?text=No+Image"}
            alt={firstItem.name || "Animal"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Middle: Info */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                {firstItem.name || "Livestock"}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                Buyer: <span className="font-medium text-slate-700">{buyerName}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600 text-lg">
                KES {parseFloat(order.total_amount || 0).toLocaleString()}
              </p>
              <span className={inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}}>
                {statusColors.label}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Bottom: Action Bar */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
        {/* View Details */}
        <button
          onClick={() => onViewDetails(order)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Eye size={16} />
          View Details
        </button>

        {/* Mark as Shipped (only if pending/processing) */}
        {(order.status === "pending" || order.status === "processing") && (
          <button
            onClick={() => onUpdateStatus(order.id, "shipped")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Truck size={16} />
            Mark as Shipped
          </button>
        )}

        {/* Mark Delivered (only if in_transit) */}
        {order.status === "in_transit" && (
          <button
            onClick={() => onUpdateStatus(order.id, "delivered")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <CheckCircle size={16} />
            Mark Delivered
          </button>
        )}
      </div>
    </div>
  );
};

// Tab Component
const TabButton = ({ label, icon: Icon, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      active
        ? "bg-green-600 text-white"
        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
    }`}
  >
    <Icon size={18} />
    {label}
    {count > 0 && (
      <span className={ml-1 px-2 py-0.5 rounded-full text-xs ${active ? "bg-green-500" : "bg-slate-100"}}>
        {count}
      </span>
    )}
  </button>
);

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [stats, setStats] = useState({ active: 0, shipped: 0, history: 0 });

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/my-sales");
      const ordersData = response.data || [];
      setOrders(ordersData);

      // Calculate stats
      setStats({
        active: ordersData.filter((o) => ["pending", "processing"].includes(o.status)).length,
        shipped: ordersData.filter((o) => o.status === "in_transit").length,
        history: ordersData.filter((o) => ["delivered", "cancelled"].includes(o.status)).length,
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

