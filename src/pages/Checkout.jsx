import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useParams } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  MapPin,
  Phone,
  CreditCard,
  Truck,
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

  // Dynamic Data Source Selection
  const items = useMemo(
    () => bargainOrder?.items || cartItems,
    [bargainOrder, cartItems],
  );
  const baseTotal = useMemo(
    () => Number(bargainOrder?.total_amount || cartTotal || 0),
    [bargainOrder, cartTotal],
  );

  useEffect(() => {
    if (orderId) fetchBargainOrder();
  }, [orderId]);

  const fetchBargainOrder = async () => {
    setLoadingOrder(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (
        response.data.status === "paid" ||
        response.data.status === "completed"
      ) {
        toast.error("This order has already been paid!");
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

const formatPrice = (price) => `KSh ${Number(price).toLocaleString()}`;

const shippingCost = baseTotal > 50000 ? 0 : 1;
const grandTotal = baseTotal + shippingCost;

useEffect(() => {
  if (!orderId && cartItems.length === 0 && !loadingOrder) {
    toast.error("Your cart is empty");
    navigate("/marketplace");
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
          {bargainOrder ? "No items in order" : "Your cart is empty"}
        </h2>
        <p className="text-slate-500 mb-6">
          {bargainOrder
            ? "The order has no items."
            : "Add some livestock to your cart before checking out."}
        </p>
        <Link
          to={bargainOrder ? "/dashboard/orders" : "/marketplace"}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
          <ArrowLeft size={20} />
          {bargainOrder ? "Back to Orders" : "Browse Marketplace"}
        </Link>
      </div>
    </div>
  );
}

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
} 
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
  newErrors.email = "Invalid email format";
}
    const phone = formData.phone.trim();
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid M-Pesa number";
    }

    if (!formData.county) newErrors.county = 'County is required';
    if (!formData.town.trim()) newErrors.town = 'Town/Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pollPaymentStatus = async (id, toastId) => {
    let attempts = 0;
    const maxAttempts = 15;

    const interval = setInterval(async () => {
      try {
        attempts++;
        const response = await api.get(`/orders/${id}/status`);
        const status = response.data.status;

        if (status === "paid" || status === "delivered") {
        clearInterval(interval);
        setIsWaitingForMpesa(false);
        setSubmitting(false);
        toast.success("Payment confirmed!", { id: toastId });
        if (!bargainOrder) dispatch(clearCart());
        navigate(`/order-confirmation/${id}`);
        } 
        
        else if (status === "failed" || attempts >= maxAttempts) {
          clearInterval(interval);
          setIsWaitingForMpesa(false);
          setSubmitting(false);
          toast.error(
            status === "failed" ? "Payment failed." : "Request timed out.",
            { id: toastId },
          );
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);
    
    return interval;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const loadingToastId = toast.loading("Processing...");

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
      } 
      
      else {
        const response = await api.post("/orders/", orderPayload);
        currentOrderId = response.data.order_id || response.data.order?.id;
      }

      if (formData.paymentMethod === "mpesa") {
        setIsWaitingForMpesa(true);
        toast.loading("Check your phone for the PIN prompt...", {
          id: loadingToastId,
        });
        pollPaymentStatus(currentOrderId, loadingToastId);
      } 
      
      else {
        toast.success(
          "Farmart: Payment Received! Your animal is now secured!!",
          { id: loadingToastId },
        );
        
       if (!bargainOrder) dispatch(clearCart());
        navigate(`/order-confirmation/${currentOrderId}`);
      }
    } 
        catch (error) {
        setSubmitting(false);
        toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to place order. Please try again.",
        { id: loadingToastId },
  );
     }
  };


    return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      {isWaitingForMpesa && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <Smartphone className="w-12 h-12 text-green-600 animate-bounce mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Awaiting Payment</h3>
            <p className="text-slate-600 mb-6">
              Processing <strong>{formatPrice(grandTotal)}</strong>
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Loader2 className="animate-spin" size={20} />
              <span className="font-medium">Verifying with Safaricom...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={bargainOrder ? "/dashboard/orders" : "/cart"}
            className="text-slate-600 hover:text-slate-900">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <MapPin className="text-green-600" size={20} />
                <h2 className="font-bold">Shipping</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold">
                    M-Pesa Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="07XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none ${errors.phone ? "border-red-500" : "border-slate-200"}`} 
                    />
                </div>
                <div>
                  <label className="text-sm font-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">County *</label>
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg outline-none">
                    <option value="">Select County</option>
                    {KENYAN_COUNTIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Town *</label>
                  <input
                    type="text"
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    className="w-full mt-1 p-3 border rounded-lg outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="text-green-600" size={20} />
                <h2 className="font-bold">Payment</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "mpesa" })
                  }
                  className={`p-4 border-2 rounded-xl text-left ${formData.paymentMethod === "mpesa" ? "border-green-600 bg-green-50" : "border-slate-100"}`}>
                  <p className="font-bold">M-Pesa STK</p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "cod" })
                  }
                  className={`p-4 border-2 rounded-xl text-left ${formData.paymentMethod === "cod" ? "border-green-600 bg-green-50" : "border-slate-100"}`}>
                  <p className="font-bold">Cash on Delivery</p>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="font-black text-slate-900 mb-4 uppercase">
                Summary
              </h2>
              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span className="font-bold">{formatPrice(baseTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold">{formatPrice(shippingCost)}</span>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-sm font-bold text-slate-500">Total</span>
                <span className="text-2xl font-black text-green-700 leading-none">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-black uppercase hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-3">
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Check size={20} />
                )}
                {formData.paymentMethod === "mpesa" ? "Pay Now" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;