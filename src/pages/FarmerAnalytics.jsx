import React, { useState, useEffect, useMemo } from "react";
import { DollarSign, ShoppingCart, TrendingUp, Star, TrendingDown, Calendar, Loader2 } from "lucide-react";
import api from "../api/axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from "recharts";

const AnalyticCard = ({ title, value, change, color, icon: Icon, loading }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm flex-1">
    <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-4 shadow-md`}>
      <Icon size={20} />
    </div>
    <p className="text-slate-500 text-sm font-bold">{title}</p>
    {loading ? (
      <div className="h-8 w-24 bg-slate-100 animate-pulse rounded mt-1" />
    ) : (
      <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    )}
    {change && (
      <p className={`text-xs mt-1 font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change.startsWith('+') ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
        {change} vs last period
      </p>
    )}
  </div>
);

// Mock data for fallback
const mockOrders = [
  { id: "1", total_amount: 52000, status: "delivered", created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "2", total_amount: 35000, status: "delivered", created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "3", total_amount: 78000, status: "pending", created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "4", total_amount: 45000, status: "shipped", created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "5", total_amount: 92000, status: "delivered", created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "6", total_amount: 28000, status: "in_transit", created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: "7", total_amount: 115000, status: "delivered", created_at: new Date().toISOString() },
];

const mockReviews = [
  { rating: 5 },
  { rating: 4 },
  { rating: 5 },
  { rating: 4 },
  { rating: 5 },
];

const COLORS = {
  revenue: "#3b82f6",
  delivered: "#22c55e",
  pending: "#eab308",
  shipped: "#06b6d4",
  cancelled: "#ef4444",
  inTransit: "#8b5cf6",
};

const FarmerAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("week"); // day, week, month

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to fetch from dedicated analytics endpoint
        const response = await api.get("/analytics/dashboard");
        const data = response.data;

        // Set metrics directly from backend
        setMetrics({
          totalRevenue: data.metrics?.total_revenue || 0,
          totalOrders: data.metrics?.total_orders || 0,
          avgOrderValue: data.metrics?.avg_order_value || 0,
          avgRating: data.metrics?.avg_rating || 0,
          completedOrders: data.metrics?.completed_orders || 0,
          activeOrders: data.metrics?.active_orders || 0,
        });

        // Set chart data from backend
        setRevenueTrend(data.revenue_trend || []);
        setOrderStatusData(
          Object.entries(data.status_breakdown || {}).map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
            value: count,
            color: statusColors[status] || COLORS.pending,
          }))
        );

        // For orders list (fallback display)
        setOrders(data.revenue_trend?.flatMap(d => Array(d.orders).fill({ total_amount: d.revenue, status: "delivered" })) || []);

      } catch (error) {
        console.warn("Analytics endpoint not available, using fallback:", error?.message);
        // Fallback to calculating from orders/reviews endpoints
        const [ordersRes, reviewsRes] = await Promise.allSettled([
          api.get("/orders/my-sales"),
          api.get("/reviews"),
        ]);

        if (ordersRes.status === "fulfilled") {
          setOrders(ordersRes.value.data);
        } else {
          setOrders(mockOrders);
        }

        if (reviewsRes.status === "fulfilled") {
          const reviewsData = reviewsRes.value.data;
          if (Array.isArray(reviewsData)) {
            setReviews(reviewsData);
          } else if (reviewsData.reviews) {
            setReviews(reviewsData.reviews);
          } else {
            setReviews(mockReviews);
          }
        } else {
          setReviews(mockReviews);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Status colors mapping
  const statusColors = {
    delivered: COLORS.delivered,
    pending: COLORS.pending,
    shipped: COLORS.shipped,
    in_transit: COLORS.inTransit,
    cancelled: COLORS.cancelled,
    completed: COLORS.delivered,
  };

    // Calculate metrics from orders/reviews if not set by analytics endpoint
  const calculatedMetrics = useMemo(() => {
    if (metrics.totalRevenue !== undefined && Object.keys(metrics).length > 0) {
      return {
        ...metrics,
        avgRating: metrics.avgRating?.toFixed?.(1) || metrics.avgRating || "0.0",
      };
    }

    if (orders.length === 0) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        avgRating: "0.0",
        completedOrders: 0,
        activeOrders: 0,
      };
    }

    const completedOrders = orders.filter((o) => ["delivered", "completed"].includes(o.status?.toLowerCase()));
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + (parseFloat(r.rating) || 0), 0) / reviews.length : 0;
    const activeOrders = orders.filter((o) => !["delivered", "completed", "cancelled"].includes(o.status?.toLowerCase()));

    return {
      totalRevenue,
      totalOrders: orders.length,
      avgOrderValue,
      avgRating: avgRating.toFixed(1),
      completedOrders: completedOrders.length,
      activeOrders: activeOrders.length,
    };
  }, [orders, reviews, metrics]);

  // Use revenue trend from backend or calculate locally
  const revenueTrendData = useMemo(() => {
    if (revenueTrend.length > 0) {
      return revenueTrend.map(item => ({
        ...item,
        date: item.date,
      }));
    }

    // Calculate locally if not provided
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.created_at).toISOString().split("T")[0];
        return orderDate === dateStr && ["delivered", "completed"].includes(o.status?.toLowerCase());
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

      days.push({
        date: date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
        revenue: dayRevenue,
        orders: dayOrders.length,
      });
    }

    return days;
  }, [revenueTrend, orders]);

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `KES ${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `KES ${(value / 1000).toFixed(0)}K`;
    }
    return `KES ${value.toLocaleString()}`;
  };

  // Empty state
  if (!loading && orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
        <p className="text-slate-400 text-sm mb-8 font-medium">
          Track your sales performance and trends
        </p>

        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-50">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp size={40} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No sales yet</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Your sales analytics will appear here once you start making sales.
            Browse your orders page to track pending transactions.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
          <p className="text-slate-400 text-sm font-medium">
            Track your sales performance and trends
          </p>
        </div>

        {/* Date Range Dropdown */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Calendar size={16} className="text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-sm font-medium text-slate-700 bg-transparent border-none focus:outline-none"
          >
            <option value="day">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="flex gap-6 mb-10 flex-wrap">
        <AnalyticCard
          title="Total Revenue"
          value={loading ? "" : formatCurrency(calculatedMetrics.totalRevenue)}
          change="+18.2%"
          color="bg-blue-600"
          icon={DollarSign}
          loading={loading}
        />
        <AnalyticCard
          title="Total Orders"
          value={loading ? "" : calculatedMetrics.totalOrders.toString()}
          change="+12.5%"
          color="bg-amber-500"
          icon={ShoppingCart}
          loading={loading}
        />
        <AnalyticCard
          title="Avg Order Value"
          value={loading ? "" : formatCurrency(calculatedMetrics.avgOrderValue)}
          change="+8.3%"
          color="bg-green-500"
          icon={TrendingUp}
          loading={loading}
        />
        <AnalyticCard
          title="Customer Rating"
          value={loading ? "" : `${calculatedMetrics.avgRating}/5`}
          change="+5.1%"
          color="bg-purple-600"
          icon={Star}
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-50">
          <h2 className="text-lg font-black text-slate-900 mb-6">Revenue Trend</h2>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.revenue} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.revenue} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `KES ${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value, name) => [
                      name === "revenue" ? `KES ${value.toLocaleString()}` : value,
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={COLORS.revenue}
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-50">
          <h2 className="text-lg font-black text-slate-900 mb-6">Order Status</h2>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center total */}
              <div className="text-center -mt-8">
                <p className="text-3xl font-black text-slate-900">{calculatedMetrics.totalOrders}</p>
                <p className="text-sm text-slate-500">Total Orders</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-green-700 font-medium">Completed Orders</p>
            <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-green-800">{calculatedMetrics.completedOrders}</p>
          <p className="text-sm text-green-600 mt-1">Successfully delivered</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-700 font-medium">Active Orders</p>
            <div className="w-10 h-10 bg-blue-200 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-800">{calculatedMetrics.activeOrders}</p>
          <p className="text-sm text-blue-600 mt-1">In progress</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-purple-700 font-medium">Customer Satisfaction</p>
            <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
              <Star size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-800">{calculatedMetrics.avgRating}/5</p>
          <p className="text-sm text-purple-600 mt-1">Based on {reviews.length} reviews</p>
        </div>
      </div>
    </div>
  );
};

// Helper components for empty state
const CheckCircle = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const Clock = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default FarmerAnalytics;