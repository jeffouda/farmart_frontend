import React from "react";
import { DollarSign, ShoppingCart, TrendingUp, Star } from "lucide-react";

const AnalyticCard = ({ title, value, change, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm flex-1">
    <div
      className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-4 shadow-md`}>
      <Icon size={20} />
    </div>
    <p className="text-slate-500 text-sm font-bold">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    <p className="text-slate-400 text-xs mt-1 font-bold">{change}</p>
  </div>
);

const FarmerAnalytics = () => {
  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
      <p className="text-slate-400 text-sm mb-8 font-medium">
        Track your sales performance and trends
      </p>

      <div className="flex gap-6 mb-10">
        <AnalyticCard
          title="Total Revenue"
          value="KES 2.13 M"
          change="+18.2%"
          color="bg-blue-600"
          icon={DollarSign}
        />
        <AnalyticCard
          title="Total Orders"
          value="62"
          change="+12.5%"
          color="bg-amber-500"
          icon={ShoppingCart}
        />
        <AnalyticCard
          title="Avg Order Value"
          value="KES 450K"
          change="+12.5%"
          color="bg-green-500"
          icon={TrendingUp}
        />
        <AnalyticCard
          title="Customer Rating"
          value="4.8/5"
          change="+5.1%"
          color="bg-purple-600"
          icon={Star}
        />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-50 h-[400px]">
        <h2 className="text-lg font-black text-slate-900 mb-6">
          Monthly Revenue & Orders
        </h2>
        <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-slate-300 font-bold">
            Chart Interface Placeholder
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerAnalytics;
