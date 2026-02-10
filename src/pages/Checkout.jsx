import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { ShoppingCart, MapPin, Phone, CreditCard, Truck, ArrowLeft, Check, Loader2 } from 'lucide-react';

const KENYAN_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City"
];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { items: cartItems, totalAmount } = useSelector(state => state.cart);

  const [bargainOrder, setBargainOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const items = bargainOrder?.items || cartItems;
  const total = bargainOrder?.total_amount || totalAmount;

    useEffect(() => {
    if (orderId) {
      fetchBargainOrder();
    }
  }, [orderId]);

  const fetchBargainOrder = async () => {
    setLoadingOrder(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      console.log("🏷️ Fetched bargain order:", response.data);

      if (response.data.status === 'paid' || response.data.status === 'completed') {
        toast.error('This order has already been paid!');
        navigate('/dashboard/orders');
        return;
      }

      setBargainOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error('Failed to load order details');
    } finally {
      setLoadingOrder(false);
    }
  };

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const shippingCost = total > 50000 ? 0 : 1500;
  const grandTotal = total + shippingCost;

  useEffect(() => {
    if (!orderId && cartItems.length === 0 && !loadingOrder) {
      toast.error('Your cart is empty');
      navigate('/marketplace');
    }
  }, [cartItems, orderId, loadingOrder, navigate]);

    if (loadingOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {bargainOrder ? 'No items in order' : 'Your cart is empty'}
          </h2>
          <p className="text-slate-500 mb-6">
            {bargainOrder
              ? 'The order has no items.'
              : 'Add some livestock to your cart before checking out.'}
          </p>
          <Link
            to={bargainOrder ? '/dashboard/orders' : '/marketplace'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            <ArrowLeft size={20} />
            {bargainOrder ? 'Back to Orders' : 'Browse Marketplace'}
          </Link>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    county: '',
    town: '',
    instructions: '',
    paymentMethod: 'mpesa'
  });

  const [errors, setErrors] = useState({});