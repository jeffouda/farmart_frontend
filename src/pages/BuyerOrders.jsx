import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Loader2, Flag, CheckCircle, Truck } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/');
        setOrders(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Cleanup on unmount/logout
    return () => {
      setOrders([]);
      setLoading(false);
    };
  }, []);

  // Extract animal name from order items
  const getAnimalName = (items) => {
    if (!items || items.length === 0) return 'Unknown Animal';
    if (typeof items[0] === 'object') {
      return items[0].name || items[0].species || 'Animal';
    }
    return items[0] || 'Animal';
  };

  // Confirm delivery
  const confirmDelivery = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/confirm-receipt`);
      toast.success('Delivery confirmed! Order completed.');
      // Refresh orders
      const response = await api.get('/orders/');
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      toast.error('Failed to confirm delivery');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            My Orders
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your livestock purchases</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-slate-500">Loading orders...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && orders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Animal
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-green-600">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package size={18} className="text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-900">
                          {getAnimalName(order.items)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Confirm Delivery Button - Show for in_transit orders */}
                        {order.status === 'in_transit' && (
                          <button
                            onClick={() => confirmDelivery(order.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                            title="Confirm that you received the order"
                          >
                            <CheckCircle size={12} />
                            Confirm Delivery
                          </button>
                        )}
                        {/* Report Issue Button - Show for all non-pending orders */}
                        {order.status && !['pending', 'payment_pending', 'payment_failed'].includes(order.status.toLowerCase()) && order.status !== 'in_transit' && (
                          <Link
                            to={'/dashboard/dispute/' + order.id}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            title="Report an issue with this order"
                          >
                            <Flag size={12} />
                            Report Issue
                          </Link>
                        )}
                        {/* Completed Badge */}
                        {(order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed') && (
                          <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle size={12} />
                            Completed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State (if no orders) */}
      {!loading && !error && orders.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 mb-2">No orders yet</p>
          <p className="text-sm text-slate-400 mb-4">Start shopping to see your orders here</p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Browse Marketplace
          </Link>
        </div>
      )}

      {/* Back Link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}

export default BuyerOrders;
