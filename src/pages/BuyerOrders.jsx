import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

// High-contrast status labels for Escrow workflow
const StatusBadge = ({ status }) => {
  const styles = {
    paid: "bg-blue-600 text-white border-2 border-blue-800", // Funds held by platform
    completed: "bg-green-600 text-white border-2 border-green-800", // Transaction fully closed
    payment_pending: "bg-yellow-400 text-black border-2 border-yellow-600",
    delivered: "bg-slate-200 text-slate-500 border-2 border-slate-300",
    failed: "bg-red-600 text-white border-2 border-red-800",
  };

  const labels = {
    paid: "💰 IN ESCROW",
    completed: "✅ RELEASED",
    payment_pending: "⏳ UNPAID",
    delivered: "🚚 DELIVERED",
    failed: "❌ FAILED",
  };

  return (
    <span
      className={`px-4 py-1.5 rounded-sm text-[11px] font-black uppercase tracking-tighter ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
};

function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [releasingId, setReleasingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/");
      setOrders(response.data || []);
    } catch (err) {
      toast.error("Sync failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmDelivery = async (orderId) => {
    const isConfirmed = window.confirm(
      "CONFIRM DELIVERY: Have you received the livestock in good condition? This will release the funds from Escrow to the seller immediately.",
    );

    if (!isConfirmed) return;

    setReleasingId(orderId);
    const loadToast = toast.loading("Releasing Escrow Funds...");

    try {
      // UPDATED: Points to the correct route in app/orders/routes.py
      await api.post(`/orders/confirm-receipt/${orderId}`);

      toast.success("PAYMENT RELEASED: Farmer has been credited.", {
        id: loadToast,
      });
      fetchOrders(); // Refresh status to 'completed'
    } catch (err) {
      const msg =
        err.response?.data?.message || "Release failed. Contact support.";
      toast.error(msg, { id: loadToast });
    } finally {
      setReleasingId(null);
    }
  };

  const formatCurrency = (amount) => `KES ${Number(amount).toLocaleString()}`;

  const getAnimalName = (items) => {
    if (!items || items.length === 0) return "LIVESTOCK ITEM";
    const firstItem = items[0];
    return typeof firstItem === "object"
      ? (firstItem.name || firstItem.species || "LIVESTOCK").toUpperCase()
      : firstItem.toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Brutalist Header Section */}
      <div className="border-l-[12px] border-green-600 pl-8 py-4 bg-slate-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
        <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          LIVESTOCK <span className="text-green-600 underline">LEDGER</span>
        </h1>
        <p className="text-slate-500 font-bold mt-3 uppercase text-sm tracking-widest">
          Secure M-Pesa Escrow Interface • 2026 Edition
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900 rounded-lg border-4 border-slate-800">
          <Loader2 className="w-12 h-12 animate-spin text-green-500 mb-4" />
          <p className="font-black text-green-500 uppercase tracking-[0.2em] text-lg">
            SYNCING WITH BLOCKCHAIN...
          </p>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group bg-white border-4 border-black p-8 hover:bg-slate-50 transition-all duration-200 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Animal & Order ID */}
                <div className="flex items-start gap-6">
                  <div className="p-5 bg-black rounded-none">
                    <Package className="text-green-500" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                      {getAnimalName(order.items)}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-black bg-green-100 px-3 py-1 text-green-800 uppercase">
                        ID: {order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount & Status Badge */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-6 lg:gap-2">
                  <span className="text-3xl font-black text-slate-900 italic tracking-tighter">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>

                {/* The Escrow Action Trigger */}
                <div className="border-t-2 lg:border-t-0 lg:border-l-4 border-slate-100 pt-6 lg:pt-0 lg:pl-10">
                  {order.status === "paid" ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => handleConfirmDelivery(order.id)}
                        disabled={releasingId === order.id}
                        className="w-full lg:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-green-600 text-white font-black uppercase italic tracking-tighter hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                        {releasingId === order.id ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={24} />
                        )}
                        RELEASE FUNDS
                      </button>
                      <p className="flex items-center gap-2 text-[11px] text-blue-700 font-black uppercase tracking-widest">
                        <ShieldCheck size={16} /> SECURED IN ESCROW
                      </p>
                    </div>
                  ) : order.status === "completed" ? (
                    <div className="flex items-center gap-3 py-4 px-6 bg-slate-100 border-2 border-slate-300">
                      <CheckCircle2 size={24} className="text-green-600" />
                      <span className="text-sm font-black uppercase text-slate-600 tracking-tighter">
                        TRANSACTION COMPLETED
                      </span>
                    </div>
                  ) : (
                    <Link
                      to={`/checkout/${order.id}`}
                      className="text-sm font-black text-green-600 hover:text-black uppercase tracking-[0.2em]">
                      VIEW DETAILS →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border-4 border-dashed border-slate-300 p-24 text-center shadow-inner">
          <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-300 uppercase italic tracking-widest">
            No Active Contracts
          </h2>
          <Link
            to="/market"
            className="mt-8 inline-block px-12 py-5 bg-black text-white font-black uppercase italic tracking-tighter hover:bg-green-600 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            GO TO MARKET
          </Link>
        </div>
      )}

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-green-600 transition-colors">
        <ArrowLeft size={18} /> BACK TO BASE
      </Link>
    </div>
  );
}

export default BuyerOrders;
