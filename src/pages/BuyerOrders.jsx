import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Package, Loader2, CheckCircle2, ShieldCheck, Zap, Flag, ArrowLeft } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const styles = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    payment_pending: "bg-yellow-400 text-black border-2 border-yellow-600",
    delivered: "bg-slate-200 text-slate-500",
    failed: "bg-red-600 text-white",
    in_transit: "bg-blue-100 text-blue-700",
  };

  const displayStatus = status === 'paid' ? 'Paid' : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {displayStatus}
    </span>
  );
};

function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [releasingId, setReleasingId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAnimalName = (items) => {
    if (!items || items.length === 0) return "LIVESTOCK ITEM";
    const firstItem = items[0];
    return typeof firstItem === "object"
      ? (firstItem.name || firstItem.species || "LIVESTOCK").toUpperCase()
      : firstItem.toUpperCase();
  };

  const fetchOrders = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) {
        setLoading(true);
        setError(null);
      } else {
        setIsSyncing(true);
      }

      const response = await api.get("/orders/");

      // Correctly extract orders array from response
      const ordersData = response.data?.orders || response.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      setOrders(response.data.orders || []);

    } catch (err) {
      console.error('Error fetching orders:', err);
      if (!isSilent) {
        setError('Failed to load orders');
        toast.error("Failed to load orders. Check your connection.");
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
    
    // Cleanup on unmount
    return () => {
      setOrders([]);
      setLoading(false);
    };
  }, [fetchOrders]);

  // Poll for order updates (M-Pesa callback sync)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Confirm delivery and release funds
  const handleConfirmDelivery = async (orderId) => {
    const isConfirmed = window.confirm(
      "CONFIRM DELIVERY: Have you received the livestock? This releases Escrow funds to the farmer.",
    );

    if (!isConfirmed) return;

    setReleasingId(orderId);
    const loadToast = toast.loading("Processing B2C Payout...");

    try {
      await api.post(`/orders/confirm-receipt/${orderId}`);
      toast.success("FUNDS RELEASED: Farmer has been paid.", { id: loadToast });
      fetchOrders();
    } catch (err) {
      const msg = err.response?.data?.message || "Release failed. Contact support.";
      toast.error(msg, { id: loadToast });
    } finally {
      setReleasingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 p-4">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end border-l-[12px] border-green-600 pl-8 py-4 bg-slate-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            LIVESTOCK <span className="text-green-600 underline">LEDGER</span>
          </h1>
          <p className="text-slate-500 font-bold mt-3 uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-600" /> Secure M-Pesa Escrow Interface
          </p>
        </div>

        {isSyncing && (
          <div className="flex items-center gap-2 text-green-600 font-black text-[10px] pr-4">
            <Zap size={14} className="animate-pulse" /> SYNCING...
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white border-4 border-black">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
          <p className="font-black text-slate-900 uppercase tracking-widest">Fetching Transactions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-32 border-4 border-dashed border-slate-300">
          <Package className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 font-black uppercase">No active orders found.</p>
          <Link to="/browse" className="inline-block mt-4 px-6 py-3 bg-green-600 text-white font-bold uppercase tracking-widest hover:bg-green-700 transition-colors">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="group bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* INFO SECTION */}
                <div className="flex items-start gap-6">
                  <div className="p-5 bg-black">
                    <Package className="text-green-500" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                      {getAnimalName(order.items)}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-black bg-slate-100 border border-slate-300 px-3 py-1 text-slate-600 uppercase">
                        REF: {order.id.slice(0, 8).toUpperCase()}
                      </span>
                      {order.mpesa_receipt && (
                        <span className="text-[10px] font-black bg-blue-50 border border-blue-200 px-3 py-1 text-blue-600 uppercase">
                          RECEIPT: {order.mpesa_receipt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRICE & STATUS */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-6">
                  <span className="text-3xl font-black text-slate-900 italic tracking-tighter">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>

                {/* ACTION SECTION */}
                <div className="border-t-2 lg:border-t-0 lg:border-l-4 border-slate-100 pt-6 lg:pt-0 lg:pl-10">
                  {/* Release Funds Button - for paid orders */}
                  {order.status === "paid" && (
                    <button
                      onClick={() => handleConfirmDelivery(order.id)}
                      disabled={releasingId === order.id}
                      className="flex items-center justify-center min-w-[200px] gap-3 px-8 py-5 bg-green-600 text-white font-black uppercase italic border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 hover:bg-green-700 transition-all">
                      {releasingId === order.id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <CheckCircle2 />
                      )}
                      RELEASE FUNDS
                    </button>
                  )}

                  {/* Report Issue Button - for completed orders */}
                  {(order.status === "completed" || order.status === "delivered") && (
                    <Link
                      to={'/dashboard/dispute/' + order.id}
                      className="flex items-center gap-2 px-4 py-3 text-red-600 bg-red-50 border-2 border-red-200 font-bold uppercase text-xs hover:bg-red-100 transition-colors">
                      <Flag size={16} />
                      Report Issue
                    </Link>
                  )}

                  {/* Completed Badge */}
                  {(order.status === "completed" || order.status === "delivered") && (
                    <div className="flex items-center gap-2 py-3 px-5 bg-green-50 border-2 border-green-500 text-green-700">
                      <CheckCircle2 size={18} />
                      <span className="text-xs font-black uppercase">Transaction Finalized</span>
                    </div>
                  )}

                  {/* Complete Payment Link - for pending orders */}
                  {order.status === "pending" && (
                    <Link
                      to={`/checkout/${order.id}`}
                      className="inline-block px-6 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-colors">
                      Complete Payment →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back Link */}
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}

export default BuyerOrders;
