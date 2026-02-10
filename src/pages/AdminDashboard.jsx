import React from "react";
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
  ArrowDownRight
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
const StatCard = ({ title, value, change, positive, icon: Icon, color }) => (
  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
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
  </div>
);

// Activity Item Component
const ActivityItem = ({ activity }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
    <div className={`w-9 h-9 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      <activity.icon size={18} className={activity.color} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-slate-200 text-sm font-medium truncate">{activity.message}</p>
      <p className="text-slate-500 text-xs mt-0.5">{activity.time}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back! Here's what's happening on Farmart.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Generate Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <StatCard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signup Trend Chart */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">New User Signups</h3>
              <p className="text-slate-400 text-sm">Last 30 days</p>
            </div>
            <select className="bg-slate-700 border-none text-slate-300 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupTrendData}>
                <defs>
                  <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(value) => [value, "Signups"]}
                />
                <Area
                  type="monotone"
                  dataKey="signups"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#signupGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-1">
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Commission Stats */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Platform Commission</p>
              <p className="text-xl font-bold text-white">KES 240,500</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">This Month</span>
              <span className="text-white font-medium">KES 48,200</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pending Payouts</span>
              <span className="text-amber-500 font-medium">KES 12,300</span>
            </div>
          </div>
        </div>

        {/* Dispute Stats */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Dispute Resolution</p>
              <p className="text-xl font-bold text-white">87% Rate</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Resolved (30d)</span>
              <span className="text-green-500 font-medium">13</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Avg. Resolution Time</span>
              <span className="text-white font-medium">2.4 days</span>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">User Growth</p>
              <p className="text-xl font-bold text-white">+24.5%</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">New Farmers (30d)</span>
              <span className="text-white font-medium">+89</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">New Buyers (30d)</span>
              <span className="text-white font-medium">+156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
