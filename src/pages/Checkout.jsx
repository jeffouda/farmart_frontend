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
  
  // State for bargain orders
  const [bargainOrder, setBargainOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Use bargain order items if available, otherwise use cart items
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
      
      // Security check: Redirect if order is already paid
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

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const shippingCost = total > 50000 ? 0 : 1500;
  const grandTotal = total + shippingCost;

  // Redirect to marketplace if cart is empty (not a bargain order)
  useEffect(() => {
    if (!orderId && cartItems.length === 0 && !loadingOrder) {
      toast.error('Your cart is empty');
      navigate('/browse');
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
            to={bargainOrder ? '/dashboard/orders' : '/browse'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            <ArrowLeft size={20} />
            {bargainOrder ? 'Back to Orders' : 'Browse Marketplace'}
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const phone = formData.phone.trim();
    const startsWith07 = /^07\d{8}$/.test(phone);
    const startsWith01 = /^01\d{8}$/.test(phone);
    const startsWith254 = /^\+254\d{9}$/.test(phone);

    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!startsWith07 && !startsWith01 && !startsWith254) {
      newErrors.phone = 'Must start with 07/01 (10 digits) or +254 (13 digits)';
    }

    if (!formData.county) {
      newErrors.county = 'County is required';
    }

    if (!formData.town.trim()) {
      newErrors.town = 'Town/Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setSubmitting(true);
    const loadingToastId = toast.loading('Processing your order...');

    try {
      // Build shipping address
      const shippingAddress = `${formData.town}, ${formData.county}${formData.instructions ? '. Instructions: ' + formData.instructions : ''}`;
      
      let orderId;

      if (bargainOrder) {
        // For bargain orders, update the existing order's status via API
        await api.put(`/orders/${bargainOrder.id}`, {
          status: 'paid',
          payment_method: formData.paymentMethod
        });
        orderId = bargainOrder.id;
        console.log("🏷️ Bargain order updated:", orderId);
      } else {
        // For cart orders, create a new order on backend
        const response = await api.post('/orders/', {
          items: items.map(item => ({
            animal_id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })),
          total_amount: grandTotal,
          payment_method: formData.paymentMethod,
          phone_number: formData.phone,
          shipping_address: shippingAddress
        });
        
        orderId = response.data.order_id || response.data.order?.id;
        console.log("🆕 New order created:", orderId);
      }

      // Clear cart (only for cart orders)
      if (!bargainOrder) {
        dispatch(clearCart());
        console.log("🛒 Cart cleared");
      }

      // Show success message
      toast.dismiss(loadingToastId);
      toast.success('Order placed successfully! 🎉');

      // Redirect to order confirmation or orders page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("❌ Failed to process order:", error);
      toast.dismiss(loadingToastId);
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={bargainOrder ? '/dashboard/orders' : '/cart'}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">{bargainOrder ? 'Back to Orders' : 'Back to Cart'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {bargainOrder ? 'Complete Payment' : 'Checkout'}
          </h1>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.fullName ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="John Kamau"
                      disabled={submitting}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="john@example.com"
                      disabled={submitting}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={13}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="07X or +254"
                      disabled={submitting}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-slate-900">Delivery Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">County *</label>
                    <select
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.county ? 'border-red-500' : 'border-slate-300'}`}
                      disabled={submitting}>
                      <option value="">Select County</option>
                      {KENYAN_COUNTIES.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                    {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Town/Location *</label>
                    <input
                      type="text"
                      name="town"
                      value={formData.town}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.town ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="e.g., Nakuru Town"
                      disabled={submitting}
                    />
                    {errors.town && <p className="text-red-500 text-xs mt-1">{errors.town}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Instructions (Optional)</label>
                    <textarea
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Any specific instructions for delivery..."
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-slate-900">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'mpesa' ? 'border-green-600 bg-green-50' : 'border-slate-200 hover:border-green-400'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={formData.paymentMethod === 'mpesa'}
                      onChange={handleChange}
                      className="text-green-600 focus:ring-green-500"
                      disabled={submitting}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">M-Pesa</p>
                      <p className="text-sm text-slate-500">Pay via M-Pesa mobile money</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-green-600 bg-green-50' : 'border-slate-200 hover:border-green-400'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="text-green-600 focus:ring-green-500"
                      disabled={submitting}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Cash on Delivery</p>
                      <p className="text-sm text-slate-500">Pay when you receive your livestock</p>
                    </div>
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
                      <Check size={20} />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>
                
                {bargainOrder && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-700 font-medium">🏷️ Bargain Order</p>
                    <p className="text-xs text-green-600">Order #{bargainOrder.id?.slice(0, 8)}</p>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={item.id || index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {(item.image || item.image_url) ? (
                          <img src={item.image || item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ShoppingCart size={16} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-slate-500">Free shipping on orders over KSh 50,000</p>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Place Order
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  By placing an order, you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
