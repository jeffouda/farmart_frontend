import React from "react";
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

const FarmerOverview = () => {
  const navigate = useNavigate();

  const handleGenerateTestCow = async () => {
    try {
      const response = await api.post('/livestock/seed_test', {});
      toast.success('Test cow generated successfully!');
      navigate('/farmer-dashboard/inventory');
    } catch (error) {
      console.error('Failed to generate test cow:', error);
      toast.error(error.response?.data?.error || 'Failed to generate test cow');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
      <p className="text-slate-400 text-sm mb-8 font-medium">
        welcome back! Here's your farm performance.
      </p>

      <div className="flex gap-6 mb-10">
        <StatCard
          title="Active Listings"
          value="12"
          subtext="+2 this week"
          color="bg-indigo-600"
        />
        <StatCard
          title="Pending Orders"
          value="5"
          subtext="3 need action"
          color="bg-amber-400"
        />
        <StatCard
          title="Total Sale"
          value="KES 450K"
          subtext="+2 this week"
          color="bg-green-500"
        />
        <StatCard
          title="Ratings"
          value="4.8/5"
          subtext="+2 this week"
          color="bg-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
          <h3 className="font-black text-slate-900 mb-8 text-lg underline decoration-cyan-400 decoration-4 underline-offset-8">
            Recent Activity
          </h3>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <div>
                <p className="font-black text-slate-900">New order received</p>
                <p className="text-sm text-slate-500 font-bold italic">
                  Friesian Cow - KES 85,000
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-bold">
                  2 hours ago
                </p>
              </div>
            </div>
            {/* Add more items following this pattern */}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-50">
          <h3 className="font-black text-slate-900 mb-8 text-lg underline decoration-slate-200 decoration-4 underline-offset-8">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 p-5 bg-slate-100/50 hover:bg-slate-200/50 rounded-2xl transition-all text-slate-700 font-bold">
              <Plus size={22} className="text-slate-400" /> Add New Livestock
            </button>
            <button
              onClick={handleGenerateTestCow}
              className="w-full flex items-center gap-4 p-5 bg-amber-50 hover:bg-amber-100 rounded-2xl transition-all text-amber-700 font-bold"
            >
              <FlaskConical size={22} className="text-amber-500" /> Generate Test Cow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerOverview;
