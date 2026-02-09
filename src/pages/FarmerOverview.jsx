import React, { useState, useEffect } from "react";
import { Plus, Upload, Clock, FileDown, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const StatCard = ({ title, value, subtext, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 flex-1">
    <div
      className={`w-10 h-10 ${color} rounded-lg mb-4 flex items-center justify-center text-white shadow-md`}>
      <div className="bg-white/20 p-1.5 rounded-md">
        <Clock size={18} />
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    <p className="text-slate-400 text-xs mt-2 font-bold">{subtext}</p>
  </div>
);

const ActivityItem = ({ item }) => {
  const getActivityColor = (type, status) => {
    if (type === "review") return "bg-purple-400";
    if (status === "delivered") return "bg-green-400";
    if (status === "pending") return "bg-amber-400";
    return "bg-cyan-400";
  };

  const getActivityIcon = (type) => {
    if (type === "review") return "⭐";
    return "🐄";
  };

  return (
    <div className="flex gap-4">
      <div
        className="w-2.5 h-2.5 rounded-full mt-2 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
        style={{ backgroundColor: getActivityColor(item.type, item.status) }}
      />
      <div>
        <p className="font-black text-slate-900">{item.title}</p>
        <p className="text-sm text-slate-500 font-bold italic">
          {item.description}
        </p>
        <p className="text-[11px] text-slate-400 mt-1 font-bold">
          {item.time_ago}
        </p>
      </div>
    </div>
  );
};

const FarmerOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const handleGenerateTestCow = async () => {
    try {
      const response = await api.post("/livestock/seed_test", {});
      toast.success("Test cow generated successfully!");
      navigate("/farmer-dashboard/inventory");
    } catch (error) {
      console.error("Failed to generate test cow:", error);
      toast.error(error.response?.data?.error || "Failed to generate test cow");
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/analytics/farmer");
        setStats(response.data.stats);
        setRecentActivity(response.data.recent_activity || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Set default values on error
        setStats({
          active_listings: 0,
          pending_orders: 0,
          total_revenue: 0,
          avg_rating: 0,
          review_count: 0,
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
      <p className="text-slate-400 text-sm mb-8 font-medium">
        welcome back! Here's your farm performance.
      </p>

      {loading ? (
        <div className="flex gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 flex-1 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6 mb-10">
          <StatCard
            title="Active Listings"
            value={stats?.active_listings || 0}
            subtext="+2 this week"
            color="bg-indigo-600"
          />
          <StatCard
            title="Pending Orders"
            value={stats?.pending_orders || 0}
            subtext="3 need action"
            color="bg-amber-400"
          />
          <StatCard
            title="Total Sale"
            value={formatCurrency(stats?.total_revenue || 0)}
            subtext="+2 this week"
            color="bg-green-500"
          />
          <StatCard
            title="Ratings"
            value={`${stats?.avg_rating || 0}/5`}
            subtext={`+${stats?.review_count || 0} reviews`}
            color="bg-purple-600"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
          <h3 className="font-black text-slate-900 mb-8 text-lg underline decoration-cyan-400 decoration-4 underline-offset-8">
            Recent Activity
          </h3>
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200 mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-48"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-8">
              {recentActivity.slice(0, 5).map((item, index) => (
                <ActivityItem key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 font-bold">No recent activity</p>
              <p className="text-slate-300 text-sm">
                Start by adding your first livestock!
              </p>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
          <h3 className="font-black text-slate-900 mb-8 text-lg underline decoration-slate-200 decoration-4 underline-offset-8">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/farmer-dashboard/add")}
              className="w-full flex items-center gap-4 p-5 bg-slate-100/50 hover:bg-slate-200/50 rounded-2xl transition-all text-slate-700 font-bold">
              <Plus size={22} className="text-slate-400" /> Add New Livestock
            </button>
            <button
              onClick={() => navigate("/farmer-dashboard/inventory")}
              className="w-full flex items-center gap-4 p-5 bg-slate-100/50 hover:bg-slate-200/50 rounded-2xl transition-all text-slate-700 font-bold">
              <Upload size={22} className="text-slate-400" /> Manage Inventory
            </button>
            <button
              onClick={handleGenerateTestCow}
              className="w-full flex items-center gap-4 p-5 bg-amber-50 hover:bg-amber-100 rounded-2xl transition-all text-amber-700 font-bold">
              <FlaskConical size={22} className="text-amber-500" /> Generate
              Test Cow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerOverview;
