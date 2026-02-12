import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  DollarSign,
  Users,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
};

// Mock KPI Data
const kpiData = [
  {
    title: "Total Revenue",
    value: "KES 2.4M",
    change: "+12.5%",
    positive: true,
    icon: DollarSign,
    color: "bg-green-600",
  },
  {
    title: "Active Farmers",
    value: "1,248",
    change: "+8.2%",
    positive: true,
    icon: Users,
    color: "bg-blue-600",
  },
  {
    title: "Pending Approvals",
    value: "23",
    change: "-15.3%",
    positive: true,
    icon: Clock,
    color: "bg-amber-500",
  },
  {
    title: "Open Disputes",
    value: "7",
    change: "+2",
    positive: false,
    icon: AlertTriangle,
    color: "bg-red-600",
  },
];

// Mock Activity Feed
const recentActivity = [
  {
    id: 1,
    type: "signup",
    message: "Farmer John added 5 Cows",
    time: "2 min ago",
    icon: UserPlus,
    color: "text-green-500",
    bg: "bg-green-100",
  },
  {
    id: 2,
    type: "order",
    message: "New order #1234 - KES 45,000",
    time: "15 min ago",
    icon: ShoppingCart,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    id: 3,
    type: "dispute",
    message: "Buyer Jane raised a dispute",
    time: "1 hour ago",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-100",
  },
  {
    id: 4,
    type: "approval",
    message: "Farmer Smith approved",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-100",
  },
  {
    id: 5,
    type: "rejection",
    message: "Livestock rejected for review",
    time: "3 hours ago",
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-100",
  },
];

// Mock Signup Trend Data (Last 30 days)
const signupTrendData = [
  { date: "Jan 1", signups: 12 },
  { date: "Jan 5", signups: 18 },
  { date: "Jan 10", signups: 24 },
  { date: "Jan 15", signups: 19 },
  { date: "Jan 20", signups: 32 },
  { date: "Jan 25", signups: 28 },
  { date: "Jan 30", signups: 35 },
];

// Stat Card Component
const StatCard = ({ title, value, change, positive, icon: Icon, color, delay = 0 }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -4 }}
    className="bg-slate-800 rounded-xl p-6 border border-slate-700 cursor-pointer"
    initial="hidden"
    animate="visible"
    transition={{ delay }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-3">
      {positive ? (
        <ArrowUpRight size={16} className="text-green-500" />
      ) : (
        <ArrowDownRight size={16} className="text-red-500" />
      )}
      <span className={`text-sm font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
        {change}
      </span>
      <span className="text-slate-500 text-sm">vs last month</span>
    </div>
  </motion.div>
);

// Activity Item Component
const ActivityItem = ({ activity, index }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.01, backgroundColor: "rgba(51, 65, 85, 0.5)" }}
    className="flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer"
    initial="hidden"
    animate="visible"
    transition={{ delay: index * 0.1 }}
  >
    <div className={`w-9 h-9 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <activity.icon size={18} className={activity.color} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-slate-200 text-sm font-medium truncate">{activity.message}</p>
      <p className="text-slate-500 text-xs mt-0.5">{activity.time}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load statistics");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const kpiData = [
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      change: "+12.5%",
      positive: true,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Active Farmers",
      value: stats?.total_farmers || 0,
      change: "+8.2%",
      positive: true,
      icon: Users,
      color: "bg-green-600",
    },
    {
      title: "Total Buyers",
      value: stats?.total_buyers || 0,
      change: "+15.3%",
      positive: true,
      icon: UserPlus,
      color: "bg-purple-600",
    },
    {
      title: "Open Disputes",
      value: stats?.open_disputes || 0,
      change: stats?.open_disputes > 0 ? `${stats.open_disputes}` : "0",
      positive: stats?.open_disputes === 0,
      icon: AlertTriangle,
      color: "bg-red-600",
    },
  ];

  const orderStats = [
    {
      title: "Total Orders",
      value: stats?.total_orders || 0,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Pending Orders",
      value: stats?.pending_orders || 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-100",
    },
    {
      title: "Completed Orders",
      value: stats?.completed_orders || 0,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-100",
    },
  ];
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back! Here's what's happening on Farmart.
          </p>
        </div>
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Generate Report
        </motion.button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <StatCard key={index} {...kpi} delay={index * 0.1} />
        ))}
      </div>

      {/* Livestock & Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Livestock Stats */}
        <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Livestock Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Livestock</span>
              <span className="text-2xl font-bold text-white">{stats?.total_livestock || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Available</span>
              <span className="text-xl font-semibold text-green-500">{stats?.available_livestock || 0}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats?.total_livestock > 0 ? (stats?.available_livestock / stats?.total_livestock * 100) : 0}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* Order Stats */}
        <motion.div variants={itemVariants} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Order Statistics</h3>
          <div className="space-y-3">
            {orderStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    <stat.icon size={18} className={stat.color} />
                  </div>
                  <span className="text-slate-300">{stat.title}</span>
                </div>
                <span className="text-xl font-bold text-white">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
