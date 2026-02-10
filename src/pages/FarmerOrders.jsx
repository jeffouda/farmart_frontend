import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Package,
  MessageSquare,
  XCircle,
  Truck,
  DollarSign,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const OrderStatusCard = ({ label, count, icon: Icon, active }) => (
  <div
    className={`flex items-center gap-3 p-3 bg-white border ${active ? "border-green-500 shadow-sm" : "border-slate-100"} rounded-lg cursor-pointer transition-all hover:shadow-md`}>
    <div
      className={`${active ? "bg-green-100 text-green-600" : "bg-slate-50 text-slate-400"} p-2 rounded-md`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-900">{count}</p>
    </div>
  </div>
);

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" };
    case "paid":
      return { bg: "bg-blue-100", text: "text-blue-700", label: "Paid" };
    case "shipped":
      return { bg: "bg-purple-100", text: "text-purple-700", label: "Shipped" };
    case "delivered":
      return { bg: "bg-green-100", text: "text-green-700", label: "Delivered" };
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-700", label: status };
  }
};

const getStepStatus = (currentStatus, stepName) => {
  const order = ["pending", "paid", "shipped", "delivered"];
  const currentIndex = order.indexOf(currentStatus);
  const stepIndex = order.indexOf(stepName);

  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "active";
  return "locked";
};

const OrderCard = ({ order, onViewDetails }) => {
  const statusColors = getStatusColor(order.status);
  const buyerName = order.buyer?.full_name || "Unknown Buyer";
  const initials = buyerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Get animal info from items
  const items = order.items || [];
  const firstItem = items[0] || {};
  const animalName = firstItem.name || "Livestock";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Left: Animal Card */}
      <div className="lg:col-span-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="relative">
          <img
            src={
              firstItem.image_url ||
              "https://placehold.co/600x400?text=No+Image"
            }
            alt={animalName}
            className="w-full h-64 object-cover"
          />
          <div
            className={`absolute bottom-4 left-4 ${statusColors.bg} ${statusColors.text} text-xs px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm`}>
            <CheckCircle size={14} /> {statusColors.label}
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900">{animalName}</h3>
            <p className="text-green-700 font-bold text-lg">
              KSh {parseFloat(order.total_amount || 0).toLocaleString()}
            </p>
          </div>
          <p className="text-slate-500 text-sm flex items-center gap-2 mb-4">
            <span
              className={`w-2 h-2 rounded-full ${order.status === "delivered" ? "bg-green-500" : "bg-amber-500"}`}></span>
            {statusColors.label}
          </p>
          <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700">
              {initials}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{buyerName}</p>
              <p className="text-[10px] text-slate-500">Buyer</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400">
              Order ID: {order.id?.slice(0, 8)}...
            </p>
            <p className="text-xs text-slate-400">
              Created:{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Right: Progress Tracker */}
      <div className="lg:col-span-2 bg-[#eef7ff] border-2 border-blue-400 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-1">
          Order Progress
        </h3>
        <p className="text-slate-600 mb-8">
          Track what's happening with this order.
        </p>

        <div className="space-y-8">
          {/* Step 1: Pending */}
          <div
            className={`relative pl-8 border-l-2 ${
              getStepStatus(order.status, "pending") === "completed"
                ? "border-green-500"
                : getStepStatus(order.status, "pending") === "active"
                  ? "border-green-500"
                  : "border-slate-300"
            }`}>
            <div
              className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                getStepStatus(order.status, "pending") === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus(order.status, "pending") === "active"
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 border-2 border-slate-300 text-slate-400"
              }`}>
              {getStepStatus(order.status, "pending") === "completed" ? (
                <CheckCircle size={12} />
              ) : (
                <Clock size={12} />
              )}
            </div>
            <div className="flex justify-between items-start mb-2">
              <h4
                className={`font-bold text-lg ${
                  getStepStatus(order.status, "pending") === "locked"
                    ? "text-slate-400"
                    : "text-slate-800"
                }`}>
                Order Placed
              </h4>
              {getStepStatus(order.status, "pending") === "active" && (
                <span className="bg-[#4a8a5e] text-white text-xs px-4 py-1 rounded-md font-bold uppercase">
                  Current Step
                </span>
              )}
            </div>
            <div className="bg-white/50 p-4 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-800 text-sm">
                {order.status === "pending"
                  ? "Awaiting confirmation"
                  : "Order confirmed"}
              </p>
              <p className="text-slate-600 text-xs mt-1">
                {order.status === "pending"
                  ? "Waiting for your approval"
                  : "Order has been confirmed"}
              </p>
            </div>
          </div>

          {/* Step 2: Paid */}
          <div
            className={`relative pl-8 border-l-2 ${
              getStepStatus(order.status, "paid") === "completed"
                ? "border-green-500"
                : getStepStatus(order.status, "paid") === "active"
                  ? "border-green-500"
                  : "border-slate-300"
            }`}>
            <div
              className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                getStepStatus(order.status, "paid") === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus(order.status, "paid") === "active"
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 border-2 border-slate-300 text-slate-400"
              }`}>
              {getStepStatus(order.status, "paid") === "completed" ? (
                <CheckCircle size={12} />
              ) : (
                <DollarSign size={12} />
              )}
            </div>
            <h4
              className={`font-bold text-lg ${
                getStepStatus(order.status, "paid") === "locked"
                  ? "text-slate-400"
                  : "text-slate-800"
              }`}>
              Payment Received
            </h4>
          </div>

          {/* Step 3: Shipped */}
          <div
            className={`relative pl-8 border-l-2 ${
              getStepStatus(order.status, "shipped") === "completed"
                ? "border-green-500"
                : getStepStatus(order.status, "shipped") === "active"
                  ? "border-green-500"
                  : "border-slate-300"
            }`}>
            <div
              className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                getStepStatus(order.status, "shipped") === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus(order.status, "shipped") === "active"
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 border-2 border-slate-300 text-slate-400"
              }`}>
              {getStepStatus(order.status, "shipped") === "completed" ? (
                <CheckCircle size={12} />
              ) : (
                <Truck size={12} />
              )}
            </div>
            <h4
              className={`font-bold text-lg ${
                getStepStatus(order.status, "shipped") === "locked"
                  ? "text-slate-400"
                  : "text-slate-800"
              }`}>
              Shipped / Ready for Pickup
            </h4>
          </div>

          {/* Step 4: Delivered */}
          <div
            className={`relative pl-8 border-l-2 ${
              getStepStatus(order.status, "delivered") === "completed"
                ? "border-green-500"
                : "border-slate-300"
            }`}>
            <div
              className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center ${
                getStepStatus(order.status, "delivered") === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-slate-100 border-2 border-slate-300 text-slate-400"
              }`}>
              <Package size={12} />
            </div>
            <h4
              className={`font-bold text-lg ${
                getStepStatus(order.status, "delivered") === "locked"
                  ? "text-slate-400"
                  : "text-slate-800"
              }`}>
              Delivered
            </h4>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-200">
          <h4 className="font-bold text-slate-900 text-lg mb-2">
            Quick Actions
          </h4>
          <div className="flex gap-4 mt-6">
            <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors">
              <MessageSquare size={14} /> Message Buyer
            </button>
            {order.status === "pending" && (
              <button
                onClick={() => handleApproveOrder(order.id)}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors">
                <CheckCircle size={14} /> Approve Order
              </button>
            )}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button className="flex items-center gap-2 bg-red-50 text-red-500 px-6 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                <XCircle size={14} /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const handleApproveOrder = async (orderId) => {
  try {
    await api.put(`/orders/${orderId}`, { status: "paid" });
    toast.success("Order approved successfully");
    window.location.reload();
  } catch (error) {
    console.error("Failed to approve order:", error);
    toast.error("Failed to approve order");
  }
};

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my-sales");
      const ordersData = response.data || [];
      setOrders(ordersData);

      // Calculate stats
      const newStats = {
        pending: 0,
        paid: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };

      ordersData.forEach((order) => {
        if (newStats.hasOwnProperty(order.status)) {
          newStats[order.status]++;
        }
      });

      setStats(newStats);
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

  // Filter orders based on active filter
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active")
      return ["pending", "paid", "shipped"].includes(order.status);
    return order.status === activeFilter;
  });

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      {/* Top Status Bar */}
      <div className="flex flex-wrap gap-4 mb-8">
        <OrderStatusCard
          label="All Orders"
          count={orders.length}
          icon={Package}
          active={activeFilter === "all"}
          onClick={() => setActiveFilter("all")}
        />
        <OrderStatusCard
          label="Active"
          count={stats.pending + stats.paid + stats.shipped}
          icon={CheckCircle}
          active={activeFilter === "active"}
          onClick={() => setActiveFilter("active")}
        />
        <OrderStatusCard
          label="Pending"
          count={stats.pending}
          icon={Clock}
          active={activeFilter === "pending"}
          onClick={() => setActiveFilter("pending")}
        />
        <OrderStatusCard
          label="Completed"
          count={stats.delivered}
          icon={Package}
          active={activeFilter === "delivered"}
          onClick={() => setActiveFilter("delivered")}
        />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Your Orders {filteredOrders.length > 0 && `(${filteredOrders.length})`}
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        {activeFilter === "all"
          ? "Manage all your livestock orders"
          : `Showing ${activeFilter} orders`}
      </p>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="w-full h-64 bg-slate-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="lg:col-span-2 bg-slate-100 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-20 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div>
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
          <div className="mb-4">
            <Package size={48} className="mx-auto text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            No orders found
          </h3>
          <p className="text-slate-400">
            {activeFilter !== "all"
              ? `No ${activeFilter} orders at the moment`
              : "You haven't received any orders yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
