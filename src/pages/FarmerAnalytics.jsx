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