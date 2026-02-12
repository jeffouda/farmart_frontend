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
  ShoppingCart,
} from "lucide-react";

const KENYAN_COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita/Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo/Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi City",
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
    const maxAttempts = 20; // ~1 minute of polling

    const interval = setInterval(async () => {
      try {
        attempts++;
        const response = await api.get(`/orders/poll-status/${id}`);
        const { status } = response.data;

        if (["paid", "completed", "delivered"].includes(status)) {
          clearInterval(interval);
          setIsWaitingForMpesa(false);
          setSubmitting(false);
          toast.success("Payment confirmed successfully!", { id: toastId });
          if (!bargainOrder) dispatch(clearCart());
          navigate(`/order-confirmation/${id}`);
        } else if (status === "failed" || attempts >= maxAttempts) {
          clearInterval(interval);
          setIsWaitingForMpesa(false);
          setSubmitting(false);
          toast.error(
            status === "failed"
              ? "Payment failed. Please try again."
              : "We haven't received the payment confirmation yet. Please check your orders later.",
            { id: toastId },
          );
          // Redirect to orders anyway so they can see the pending status
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

        // This triggers your polling logic to wait for the Ngrok/Render callback
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {isWaitingForMpesa && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <Smartphone className="w-12 h-12 text-green-600 animate-bounce mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 dark:text-white">
              Processing Payment
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please enter your M-Pesa PIN on the prompt sent to{" "}
              <strong>{formData.phone}</strong>
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium">Waiting for confirmation...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={bargainOrder ? "/dashboard/orders" : "/cart"}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 space-y-4 border dark:border-slate-800">
              <div className="flex items-center gap-2 pb-2 border-b dark:border-slate-800">
                <MapPin className="text-green-600" size={20} />
                <h2 className="font-bold dark:text-white">Shipping Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold dark:text-slate-300">
                    M-Pesa Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="07XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-green-500 outline-none ${errors.phone ? "border-red-500" : "border-slate-200 dark:border-slate-700"}`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold dark:text-slate-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg dark:border-slate-700 bg-transparent dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold dark:text-slate-300">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg dark:border-slate-700 bg-transparent dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold dark:text-slate-300">
                    County *
                  </label>
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg dark:border-slate-700 bg-transparent dark:text-white outline-none">
                    <option value="" className="dark:bg-slate-900">
                      Select County
                    </option>
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c} className="dark:bg-slate-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold dark:text-slate-300">
                    Town/Area *
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg dark:border-slate-700 bg-transparent dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-green-600" size={20} />
                <h2 className="font-bold dark:text-white">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "mpesa" })
                  }
                  className={`p-4 border-2 rounded-xl text-left transition-all ${formData.paymentMethod === "mpesa" ? "border-green-600 bg-green-50 dark:bg-green-900/20" : "border-slate-100 dark:border-slate-800"}`}>
                  <p className="font-bold dark:text-white">M-Pesa STK Push</p>
                  <p className="text-xs text-slate-500">
                    Pay securely via phone
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "cod" })
                  }
                  className={`p-4 border-2 rounded-xl text-left transition-all ${formData.paymentMethod === "cod" ? "border-green-600 bg-green-50 dark:bg-green-900/20" : "border-slate-100 dark:border-slate-800"}`}>
                  <p className="font-bold dark:text-white">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay when you receive</p>
                </button>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 sticky top-24 border dark:border-slate-800">
              <h2 className="font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                Summary
              </h2>
              <div className="space-y-3 pb-4 border-b dark:border-slate-800">
                <div className="flex justify-between dark:text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold">{formatPrice(baseTotal)}</span>
                </div>
                <div className="flex justify-between dark:text-slate-300">
                  <span>Shipping</span>
                  <span className="font-bold">{formatPrice(shippingCost)}</span>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-sm font-bold text-slate-500 uppercase">
                  Total
                </span>
                <span className="text-2xl font-black text-green-700 dark:text-green-500 leading-none">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-8 py-4 bg-slate-900 dark:bg-green-600 text-white rounded-xl font-black uppercase hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 transition-all">
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check size={20} />
                )}
                {formData.paymentMethod === "mpesa"
                  ? "Complete Payment"
                  : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
