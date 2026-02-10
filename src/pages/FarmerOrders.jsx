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
