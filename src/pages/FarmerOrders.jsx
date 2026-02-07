import React from "react";
import {
  CheckCircle,
  Clock,
  Package,
  MessageSquare,
  XCircle,
} from "lucide-react";

const OrderStatusCard = ({ label, count, icon: Icon, active }) => (
  <div
    className={`flex items-center gap-3 p-3 bg-white border ${active ? "border-green-500 shadow-sm" : "border-slate-100"} rounded-lg`}>
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

const FarmerOrders = () => {
  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      {/* Top Status Bar */}
      <div className="flex gap-4 mb-8">
        <OrderStatusCard
          label="Active Orders"
          count="2"
          icon={CheckCircle}
          active
        />
        <OrderStatusCard label="Pending Requests" count="3" icon={Clock} />
        <OrderStatusCard label="Completed" count="4" icon={Package} />
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">
        🐄 Your Active Order (1)
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        This order is currently in progress.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Animal Card (Matching your image) */}
        <div className="lg:col-span-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80&w=800"
              alt="Boran Bull"
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-green-900/80 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
              <CheckCircle size={14} /> Active Order
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-slate-900">
                Boran Bull - Premium
              </h3>
              <p className="text-green-700 font-bold text-lg">KSh 185,000</p>
            </div>
            <p className="text-slate-500 text-sm flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> In
              progress
            </p>
            <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                JK
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">James Kimani</p>
                <p className="text-[10px] text-slate-500">
                  ⭐ 4.8 (47 reviews)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Progress Tracker (Matching your image) */}
        <div className="lg:col-span-2 bg-[#eef7ff] border-2 border-blue-400 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-1">
            Your Purchase Progress
          </h3>
          <p className="text-slate-600 mb-8">
            Track what's happening with your order.
          </p>

          <div className="space-y-8">
            {/* Step 1: Active */}
            <div className="relative pl-8 border-l-2 border-green-500">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                <CheckCircle size={12} />
              </div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800 text-lg">
                  Reserve Animal
                </h4>
                <span className="bg-[#4a8a5e] text-white text-xs px-4 py-1 rounded-md font-bold uppercase">
                  Current Step
                </span>
              </div>
              <div className="bg-white/50 p-4 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-800 text-sm">
                  Request sent to seller
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  Seller James Kimani has received your request.
                </p>
                <span className="inline-block mt-3 bg-slate-200 text-slate-700 text-[10px] px-2 py-1 rounded font-bold">
                  • Waiting for seller approval
                </span>
              </div>
            </div>

            {/* Step 2: Locked */}
            <div className="relative pl-8 border-l-2 border-slate-300">
              <div className="absolute -left-[11px] top-0 w-5 h-5 bg-slate-100 border-2 border-slate-300 rounded-full flex items-center justify-center text-slate-400">
                <Clock size={12} />
              </div>
              <h4 className="font-bold text-slate-400 text-lg">
                Payment Confirmation
              </h4>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-blue-200">
            <h4 className="font-bold text-slate-900 text-lg mb-2">
              What happens next?
            </h4>
            <p className="text-slate-600 italic">
              we are waiting for the seller to approve reservation
            </p>
            <div className="flex gap-4 mt-6">
              <button className="flex items-center gap-2 bg-slate-200 text-slate-600 px-6 py-2 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors">
                <MessageSquare size={14} /> Message Seller
              </button>
              <button className="flex items-center gap-2 bg-slate-200 text-slate-600 px-6 py-2 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-colors">
                <XCircle size={14} /> Cancel Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerOrders;
