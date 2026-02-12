import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Finance = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    escrowBalance: 0,
    completedTransactions: 0,
    pendingPayouts: 0,
    totalDisputes: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      // Fetch orders for revenue calculation
      const ordersResponse = await api.get("/orders/");
      const orders = ordersResponse.data.orders || [];

      // Calculate stats
      const completedOrders = orders.filter(o => o.status === "completed");
      const pendingOrders = orders.filter(o => o.status === "processing");
      const disputedOrders = orders.filter(o => o.status === "disputed");

      const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
      const pendingPayouts = pendingOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

      setStats({
        totalRevenue,
        escrowBalance: pendingPayouts,
        completedTransactions: completedOrders.length,
        pendingPayouts: pendingOrders.length,
        totalDisputes: disputedOrders.length
      });

      // Transform orders into transactions
      const allTransactions = orders.map(order => ({
        id: order.id,
        type: order.status === "completed" ? "payout" : 
              order.status === "disputed" ? "dispute" : "escrow",
        amount: order.total_amount,
        status: order.status,
        date: order.created_at,
        description: `Order #${order.id.slice(0, 8)}`,
        items: order.items
      }));

      setTransactions(allTransactions);
    } catch (error) {
      console.error("Error fetching finance data:", error);
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `KES ${(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "processing":
      case "accepted":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "payout":
        return <ArrowUpRight size={16} className="text-green-400" />;
      case "escrow":
        return <CreditCard size={16} className="text-blue-400" />;
      case "dispute":
        return <ArrowDownRight size={16} className="text-red-400" />;
      default:
        return <DollarSign size={16} className="text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track platform revenue, escrow balances, and transactions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button
            onClick={fetchFinanceData}
            className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 text-sm transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-green-400" />
            </div>
            <span className="flex items-center gap-1 text-green-400 text-xs font-medium">
              <TrendingUp size={14} />
              +12.5%
            </span>
          </div>
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        {/* Escrow Balance */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <CreditCard size={20} className="text-blue-400" />
            </div>
            <span className="flex items-center gap-1 text-amber-400 text-xs font-medium">
              <Filter size={14} />
              Pending
            </span>
          </div>
          <p className="text-slate-400 text-sm">Escrow Balance</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatCurrency(stats.escrowBalance)}
          </p>
        </div>

        {/* Completed Transactions */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <ArrowUpRight size={20} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Completed Transactions</p>
          <p className="text-2xl font-bold text-white mt-1">
            {stats.completedTransactions}
          </p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-amber-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm">Pending Payouts</p>
          <p className="text-2xl font-bold text-white mt-1">
            {stats.pendingPayouts}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-left px-5 py-3 text-slate-400 font-medium text-sm">Type</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium text-sm">Description</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium text-sm">Amount</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium text-sm">Status</th>
                <th className="text-left px-5 py-3 text-slate-400 font-medium text-sm">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <DollarSign size={48} className="text-slate-600 mb-4" />
                      <p className="text-slate-400">No transactions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 20).map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span className="text-white text-sm capitalize">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-300 text-sm">
                        {transaction.description}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-medium ${
                        transaction.type === "payout" ? "text-green-400" :
                        transaction.type === "dispute" ? "text-red-400" : "text-white"
                      }`}>
                        {transaction.type === "payout" ? "+" : transaction.type === "dispute" ? "-" : ""}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-slate-400 text-sm">
                        {formatDate(transaction.date)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Platform Revenue (5% fee)</span>
              <span className="text-green-400 font-medium">
                {formatCurrency(stats.totalRevenue * 0.05)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Farmer Payouts</span>
              <span className="text-white font-medium">
                {formatCurrency(stats.totalRevenue * 0.95)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <span className="text-slate-400 text-sm">Total Volume</span>
              <span className="text-white font-bold text-lg">
                {formatCurrency(stats.totalRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Dispute Summary */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Dispute Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Total Disputes</span>
              <span className="text-white font-medium">{stats.totalDisputes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Pending Resolution</span>
              <span className="text-amber-400 font-medium">
                {transactions.filter(t => t.status === "disputed").length}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <span className="text-slate-400 text-sm">Disputed Amount</span>
              <span className="text-red-400 font-bold text-lg">
                {formatCurrency(
                  transactions
                    .filter(t => t.status === "disputed")
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
