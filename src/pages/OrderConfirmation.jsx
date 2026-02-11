import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CheckCircle, ArrowLeft, ShoppingCart, Truck, Phone, MapPin } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const authState = useSelector(state => state.auth || {});
  const { currentUser } = authState;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      console.log("Fetched order for confirmation:", response.data);
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error('Failed to load order details');
      navigate('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Order not found</h2>
          <Link to="/dashboard/orders" className="text-green-600 hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-green-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <CheckCircle className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-bold">Payment Successful!</h1>
              <p className="text-green-100 mt-1">Thank you for your order</p>
            </div>
          </div>
          <div className="bg-green-700 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Order Number</p>
              <p className="text-xl font-bold">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Status</p>
              <p className="text-xl font-bold capitalize">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
          
          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items?.map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {(item.image || item.image_url) ? (
                    <img 
                      src={item.image || item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingCart size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold text-slate-900">
              <span>Total Paid</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Payment Method</p>
              <p className="font-medium text-slate-900 capitalize">{order.payment_method}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium text-slate-900">
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-blue-700 space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} />
              You'll receive an order confirmation via email
            </li>
            <li className="flex items-center gap-2">
              <Truck size={16} />
              We'll contact you to schedule delivery
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} />
              Our team will call you for pickup/delivery arrangements
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            to="/dashboard/orders"
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            View All Orders
          </Link>
          <Link
            to="/browse"
            className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
