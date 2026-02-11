import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../redux/cartSlice';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { items, totalAmount } = useSelector(state => state.cart);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('Please login to proceed to checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Add livestock to your cart to proceed with checkout</p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01]">
                {/* Product Image */}
                <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ShoppingBag size={32} />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Unit Price: {formatPrice(item.price)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                      aria-label={`Decrease quantity of ${item.name}`}
                      disabled={item.quantity <= 1}>
                      <Minus size={16} className="text-slate-600" />
                    </button>
                    <span className="w-8 text-center font-medium text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(increaseQuantity(item.id))}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      aria-label={`Increase quantity of ${item.name}`}>
                      <Plus size={16} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => {
                      dispatch(removeFromCart(item.id));
                      toast.success(`${item.name} removed from cart`);
                    }}
                    className="mt-2 text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 ml-auto"
                    aria-label={`Remove ${item.name} from cart`}>
                    <Trash2 size={16} />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCheckingOut(true);
                  if (currentUser) {
                    navigate('/checkout');
                  } else {
                    navigate('/login', { state: { from: '/cart' } });
                  }
                  setTimeout(() => setIsCheckingOut(false), 1000);
                }}
                disabled={isCheckingOut || items.length === 0}
                className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={currentUser ? 'Proceed to checkout' : 'Login to checkout'}>
                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <Link
                to="/browse"
                className="block mt-4 text-center text-sm text-slate-500 hover:text-primary transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

