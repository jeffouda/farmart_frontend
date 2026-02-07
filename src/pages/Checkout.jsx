import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import { addOrder } from '../redux/ordersSlice';
import toast from 'react-hot-toast';
import { ShoppingCart, MapPin, Phone, CreditCard, Truck, ArrowLeft, Check } from 'lucide-react';

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
  const { items, totalAmount } = useSelector(state => state.cart);

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

  const shippingCost = totalAmount > 50000 ? 0 : 1500;
  const grandTotal = totalAmount + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Add some livestock to your cart before checking out.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
            <ArrowLeft size={20} />
            Browse Marketplace
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

  const handlePlaceOrder = () => {
    if (!validateForm()) {
      return;
    }

    const { paymentMethod } = formData;
    const delay = paymentMethod === 'mpesa' ? 3000 : 1000;
    const loadingMessage = paymentMethod === 'mpesa' 
      ? "Simulating M-Pesa STK Push... Check your phone"
      : "Placing Cash on Delivery Order...";
    const successMessage = paymentMethod === 'mpesa'
      ? "Payment Received! Order Placed."
      : "Order Placed! Pay on delivery.";
    const orderStatus = paymentMethod === 'mpesa' ? "Paid" : "Pending Payment";

    // Phase 1: Show loading toast
    const loadingToast = toast.loading(loadingMessage);

    // Phase 2: Process order after delay
    setTimeout(() => {
      // Create order data
      const orderData = {
        id: `ORD-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        items: items,
        total: grandTotal,
        status: orderStatus,
        customer: {
          name: formData.fullName,
          phone: formData.phone,
          county: formData.county,
          town: formData.town,
          instructions: formData.instructions
        },
        paymentMethod: paymentMethod
      };

      // Dispatch actions
      dispatch(addOrder(orderData));
      dispatch(clearCart());

      // Show success message
      toast.dismiss(loadingToast);
      toast.success(successMessage);

      // Redirect to orders page
      navigate('/dashboard/orders');
    }, delay);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Cart</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.fullName ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="John Kamau"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={13}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="07X or +254"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-slate-900">Delivery Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">County</label>
                    <select
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.county ? 'border-red-500' : 'border-slate-300'}`}>
                      <option value="">Select County</option>
                      {KENYAN_COUNTIES.map(county => (
                        <option key={county} value={county}>{county}</option>
                      ))}
                    </select>
                    {errors.county && <p className="text-red-500 text-xs mt-1">{errors.county}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Town/Location</label>
                    <input
                      type="text"
                      name="town"
                      value={formData.town}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.town ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="e.g., Nakuru Town"
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
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Any specific instructions for delivery..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-primary" />
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

                {/* Items List */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
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
                    <span>{formatPrice(totalAmount)}</span>
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
                  className="w-full mt-6 py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-600/20 flex items-center justify-center gap-2">
                  <Check size={20} />
                  Place Order
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
