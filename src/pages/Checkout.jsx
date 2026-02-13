import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useParams } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

import {
  MapPin,
  Phone,
  CreditCard,
  ArrowLeft,
  Check,
  Loader2,
  Smartphone,
  ShieldCheck,
  Package,
} from "lucide-react";

const KENYAN_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta", "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City",
];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { currentUser } = useAuth();

  const { items: cartItems, totalAmount: cartTotal } = useSelector(
    (state) => state.cart,
  );

  const [bargainOrder, setBargainOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isWaitingForMpesa, setIsWaitingForMpesa] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    county: "",
    town: "",
    instructions: "",
    paymentMethod: "mpesa",
  });

  const [errors, setErrors] = useState({});

  const items = useMemo(
    () => bargainOrder?.items || cartItems,
    [bargainOrder, cartItems],
  );
  const baseTotal = useMemo(
    () => Number(bargainOrder?.total_amount || cartTotal || 0),
    [bargainOrder, cartTotal],
  );

  const formatPrice = (price) => `KSh ${Number(price).toLocaleString()}`;
  const shippingCost = baseTotal > 50000 ? 0 : 1500;
  const grandTotal = baseTotal + shippingCost;

  useEffect(() => {
    if (orderId) fetchBargainOrder();
  }, [orderId]);

  const fetchBargainOrder = async () => {
    setLoadingOrder(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (["paid", "completed", "delivered"].includes(response.data.status)) {
        toast.error("This order has already been processed!");
        navigate("/dashboard/orders");
        return;
      }
      setBargainOrder(response.data);
    } catch (error) {
      toast.error("Failed to load order details");
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (!orderId && cartItems.length === 0 && !loadingOrder) {
      toast.error("Your cart is empty");
      navigate("/marketplace");
    }
  }, [cartItems, orderId, loadingOrder, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    const phone = formData.phone.trim();
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid M-Pesa number";
    }
    if (!formData.county) newErrors.county = "County is required";
    if (!formData.town.trim()) newErrors.town = "Town/Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pollPaymentStatus = async (id, toastId) => {
    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(async () => {
      try {
        attempts++;
        const response = await api.get(`/orders/poll-status/${id}`);
        const { status, payment_status } = response.data;

        if (
          status === "paid" ||
          payment_status === "paid" ||
          ["completed", "delivered"].includes(status)
        ) {
          clearInterval(interval);
          setIsWaitingForMpesa(false);
          setSubmitting(false);
          toast.success("Payment confirmed successfully!", { id: toastId });
          if (!bargainOrder) dispatch(clearCart());
          navigate(`/order-confirmation/${id}`);
        } else if (
          status === "failed" ||
          payment_status === "failed" ||
          attempts >= maxAttempts
        ) {
          clearInterval(interval);
          setIsWaitingForMpesa(false);
          setSubmitting(false);
          toast.error(
            status === "failed" || payment_status === "failed"
              ? "Payment failed. Please try again."
              : "Wait time exceeded. Checking status...",
            { id: toastId },
          );
          navigate("/dashboard/orders");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const loadingToastId = toast.loading("Creating order...");

    try {
      const orderPayload = {
        items: items.map((item) => ({
          animal_id: item.animal_id || item.id,
          quantity: item.quantity || 1,
          price: item.price,
        })),
        total_amount: grandTotal,
        payment_method: formData.paymentMethod,
        phone_number: formData.phone,
        shipping_address: `${formData.town}, ${formData.county}. ${formData.instructions}`,
      };

      let currentOrderId;
      if (bargainOrder) {
        await api.put(`/orders/${bargainOrder.id}`, orderPayload);
        currentOrderId = bargainOrder.id;
      } else {
        const response = await api.post("/orders/", orderPayload);
        currentOrderId = response.data.order_id || response.data.id;
      }

      if (formData.paymentMethod === "mpesa") {
        setIsWaitingForMpesa(true);
        toast.loading("Sending M-Pesa prompt...", { id: loadingToastId });

        try {
          await api.post("/payments/stk-push", {
            phone_number: formData.phone,
            total_amount: grandTotal,
            items: orderPayload.items,
            order_id: currentOrderId,
          });
        } catch (stkError) {
          console.error("STK Push failed:", stkError);
        }
        await pollPaymentStatus(currentOrderId, loadingToastId);
      } else {
        toast.success("Order placed successfully!", { id: loadingToastId });
        if (!bargainOrder) dispatch(clearCart());
        setSubmitting(false);
        navigate(`/order-confirmation/${currentOrderId}`);
      }
    } catch (error) {
      setSubmitting(false);
      toast.error(error.response?.data?.message || "Failed to place order.", {
        id: loadingToastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 py-12 px-4 sm:px-6 transition-all duration-300">
      {/* M-PESA OVERLAY */}
      {isWaitingForMpesa && (
        <div className="fixed inset-0 z-50 bg-green-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-green-100">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-green-600 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-2">Check Your Phone</h3>
            <p className="text-slate-500 mb-8">
              Enter M-Pesa PIN for the prompt sent to <span className="font-bold text-green-700">{formData.phone}</span>
            </p>
            <div className="flex items-center justify-center gap-2 py-3 px-6 bg-green-600 rounded-xl text-white font-bold text-sm">
              <Loader2 className="animate-spin" size={18} />
              <span>Verifying Transaction...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 border-b border-slate-100 pb-8">
          <Link
            to={bargainOrder ? "/dashboard/orders" : "/cart"}
            className="p-2 rounded-full hover:bg-green-50 text-green-700 transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-green-900 uppercase tracking-tight">Checkout</h1>
            <p className="text-slate-400 text-sm font-medium">Safe & Secure Livestock Procurement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FORM AREA */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-green-600 rounded-lg text-white">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Delivery Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-green-700 uppercase tracking-widest mb-2">M-Pesa Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="07XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full bg-slate-50 border-2 px-4 py-4 rounded-2xl text-slate-900 focus:ring-4 focus:ring-green-500/10 outline-none transition-all ${errors.phone ? "border-red-300" : "border-slate-100 focus:border-green-600"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-bold mt-2">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Recipient Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-green-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-green-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">County</label>
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-green-600 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select County</option>
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Town / Village</label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-green-600 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-600 rounded-lg text-white">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Payment Selection</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: "mpesa" })}
                  className={`p-6 border-2 rounded-2xl text-left transition-all ${formData.paymentMethod === "mpesa" ? "border-green-600 bg-green-50" : "border-slate-100 bg-white hover:border-slate-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-green-900">M-PESA</span>
                    {formData.paymentMethod === "mpesa" && <Check className="text-green-600" size={18} />}
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Immediate Mobile Payment</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                  className={`p-6 border-2 rounded-2xl text-left transition-all ${formData.paymentMethod === "cod" ? "border-green-600 bg-green-50" : "border-slate-100 bg-white hover:border-slate-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-slate-700">C.O.D</span>
                    {formData.paymentMethod === "cod" && <Check className="text-green-600" size={18} />}
                  </div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">Pay at Delivery point</p>
                </button>
              </div>
            </section>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-green-900 rounded-[2.5rem] p-8 sticky top-24 text-white shadow-2xl overflow-hidden relative">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-800 rounded-full opacity-50"></div>
              
              <h2 className="text-xs font-black text-green-400 uppercase tracking-[0.2em] mb-8 relative z-10">Purchase Summary</h2>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-green-200 font-medium">Subtotal</span>
                  <span className="font-bold text-lg tracking-tight">{formatPrice(baseTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200 font-medium">Shipping</span>
                  <span className="font-bold text-lg tracking-tight">
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <div className="border-t border-green-800 pt-6 mb-10 relative z-10">
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest block mb-1">Grand Total</span>
                <span className="text-4xl font-black tracking-tighter">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full py-5 bg-white text-green-900 rounded-2xl font-black uppercase tracking-widest hover:bg-green-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50 relative z-10 shadow-lg"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>{formData.paymentMethod === "mpesa" ? "Pay Now" : "Confirm Order"}</span>
                  </>
                )}
              </button>

              <div className="mt-8 flex items-center gap-3 text-green-300 relative z-10">
                <Package size={16} />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  Verified Animal Health & Logistics Included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;