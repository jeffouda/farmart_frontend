import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Calendar, CheckCircle, Download, AlertCircle } from 'lucide-react';
import { generateInvoice } from '../utils/generateInvoice';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Orders = () => {
  // Redux state - with safety check
  const reduxOrders = useSelector(state => state.orders?.history || []);
  
  // Check if we're in dashboard context
  const location = useLocation();
  const isInDashboard = location.pathname.startsWith('/dashboard');
  
  // Local state for API-fetched orders
  const [apiOrders, setApiOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useApiData, setUseApiData] = useState(false);

  useEffect(() => {
    // Fetch orders from API when component mounts
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/orders/');
        console.log("Orders API Response:", response.data);
        
        // Handle different API response formats
        const ordersData = Array.isArray(response.data) ? response.data : (response.data.orders || []);
        setApiOrders(ordersData);
        setUseApiData(true);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.response?.data?.message || 'Failed to load orders');
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Use API orders if available, fallback to Redux
  const orders = useApiData ? apiOrders : reduxOrders;

  const formatPrice = (price) => {
    return `KSh ${price?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Failed to load orders</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No past orders found</h2>
          <p className="text-slate-500 mb-6">
            {isInDashboard 
              ? "You haven't placed any orders yet."
              : "Start shopping to see your order history here."
            }
          </p>
          <Link
            to={isInDashboard ? '/dashboard' : '/marketplace'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
            <ArrowLeft size={20} />
            {isInDashboard ? 'Back to Dashboard' : 'Browse Marketplace'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="font-mono font-bold text-slate-900">#{order.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{formatDate(order.created_at || order.date)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'paid' || order.status === 'Paid' || order.status === 'Paid'
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {(order.status === 'paid' || order.status === 'Paid') && (
                    <CheckCircle size={12} className="inline mr-1" />
                  )}
                  {order.status === 'paid' ? 'Paid' : order.status || 'Pending'}
                </span>
                <button
                  onClick={() => generateInvoice(order)}
                  className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                  title="Download Receipt">
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {(order.items || []).map((item, index) => (
                  <div key={item.id || index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {(item.image || item.image_url) ? (
                        <img 
                          src={item.image || item.image_url} 
                          alt={item.name || 'Item'} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23cbd5e1"><path d="M5 5v14h14V5H5zm0 2h14v14H5V7z"/></svg>';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ShoppingCart size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{item.name || 'Unknown Item'}</p>
                      <p className="text-sm text-slate-500">
                        Qty: {item.quantity || 1} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                  <p>Payment: {order.payment_method === 'mpesa' ? 'M-Pesa' : order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}</p>
                  {(order.customer || order.billing_address) && (
                    <p className="mt-1">
                      Ship to: {order.customer?.county || order.billing_address?.county || 'N/A'}, 
                      {order.customer?.town || order.billing_address?.town || ''}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(order.total_amount || order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
