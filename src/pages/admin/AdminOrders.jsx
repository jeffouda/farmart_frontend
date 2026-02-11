import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Flag,
  X,
  Calendar,
  User,
  MapPin,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

// Status badge colors
const statusStyles = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  disputed: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const statusLabels = {
  pending: "Pending",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

// Order Details Modal
const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
            <p className="text-slate-400 text-sm">
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusStyles[order.status?.toLowerCase()] || statusStyles.pending
              }`}
            >
              {statusLabels[order.status?.toLowerCase()] || order.status}
            </span>
          </div>

          {/* Buyer Info */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-slate-400" />
              <span className="text-slate-400 text-sm font-medium">Buyer</span>
            </div>
            <p className="text-white font-medium">{order.buyer_name || "Unknown"}</p>
            {order.buyer_email && (
              <p className="text-slate-400 text-sm">{order.buyer_email}</p>
            )}
          </div>

          {/* Farmer Info */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Package size={16} className="text-slate-400" />
              <span className="text-slate-400 text-sm font-medium">Farmer</span>
            </div>
            <p className="text-white font-medium">{order.farmer_name || "Unknown"}</p>
            {order.farmer_location && (
              <p className="text-slate-400 text-sm flex items-center gap-1 mt-1">
                <MapPin size={12} />
                {order.farmer_location}
              </p>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-slate-400 text-sm font-medium mb-2">Items</h4>
            <div className="bg-slate-700/50 rounded-lg divide-y divide-slate-600">
              {order.items?.map((item, index) => (
                <div key={index} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{item.name || "Unknown Item"}</p>
                    <p className="text-slate-400 text-sm">
                      Qty: {item.quantity || 1} × KES {(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-green-400 font-medium">
                    KES {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <span className="text-slate-400 font-medium">Total Amount</span>
            <span className="text-xl font-bold text-green-400">
              KES {(order.total_amount || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Menu Component
const ActionMenu = ({ order, onViewDetails, onFlag }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-40 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-20 overflow-hidden">
            <button
              onClick={() => {
                onViewDetails(order);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700"
            >
              <Eye size={16} />
              View Details
            </button>
            <button
              onClick={() => {
                onFlag(order);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-slate-700"
            >
              <Flag size={16} />
              Flag Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log("Fetching admin orders from /orders/admin/all...");
        const response = await api.get("/orders/admin/all");
        console.log("Orders fetched successfully:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "all" && order.status?.toLowerCase() !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = order.id?.toString().includes(query);
        const matchesBuyer = order.buyer_name?.toLowerCase().includes(query);
        const matchesFarmer = order.farmer_name?.toLowerCase().includes(query);
        const matchesEmail = order.buyer_email?.toLowerCase().includes(query);

        return matchesId || matchesBuyer || matchesFarmer || matchesEmail;
      }

      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Handle actions
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleFlag = (order) => {
    toast.success(`Order #${order.id} has been flagged for review`);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `KES ${(amount || 0).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage and monitor all platform orders
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{filteredOrders.length} total orders</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by Order ID, Buyer Name, or Farmer Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Buyer
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Farmer
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Amount
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package size={48} className="text-slate-600 mb-4" />
                      <p className="text-slate-400">No orders found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">#{order.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{order.buyer_name || "Unknown"}</div>
                      {order.buyer_email && (
                        <div className="text-slate-400 text-xs">{order.buyer_email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{order.farmer_name || "Unknown"}</div>
                      {order.farmer_location && (
                        <div className="text-slate-400 text-xs flex items-center gap-1">
                          <MapPin size={10} />
                          {order.farmer_location}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-400 font-medium">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          statusStyles[order.status?.toLowerCase()] || statusStyles.pending
                        }`}
                      >
                        {statusLabels[order.status?.toLowerCase()] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ActionMenu
                        order={order}
                        onViewDetails={handleViewDetails}
                        onFlag={handleFlag}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <p>
            Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
            {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default AdminOrders;
