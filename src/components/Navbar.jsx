import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, HelpCircle, Bell, UserCircle, LayoutGrid, Heart, ShoppingCart } from "lucide-react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useSelector } from "react-redux";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Get cart and wishlist counts from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const cartCount = cartItems.length;
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Dynamic colors based on scroll state for visibility
  const textColor = isScrolled ? "text-white" : "text-slate-900";
  const hoverColor = isScrolled
    ? "hover:text-green-400"
    : "hover:text-green-600";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-green-950/95 backdrop-blur-md py-3 shadow-2xl border-b border-green-900/50"
          : "bg-white/10 backdrop-blur-md py-6"
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
        {/* LEFT: BRANDING */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-xl transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 shadow-lg shadow-green-900/20">
            <Icon icon="noto:cow" className="w-9 h-9" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>

          <div className="leading-none">
            <h1
              className={`text-2xl font-black uppercase italic tracking-tighter transition-colors duration-500 ${textColor}`}>
              FARM<span className="text-green-600">ART</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-600">
              Livestock Exchange
            </p>
          </div>
        </Link>

        {/* RIGHT: NAVIGATION & ACTIONS */}
        <div className="flex items-center gap-6 lg:gap-8 ml-auto">
          {/* Desktop Navigation Links - Text-based */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Sell - Only for farmers */}
            {currentUser?.role === 'farmer' && (
              <Link
                to="/farmer-dashboard/add"
                className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 drop-shadow-sm ${textColor} ${hoverColor} relative group`}>
                Sell
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
            
            {/* Browse Livestock - Show for everyone */}
            <Link
              to="/browse"
              className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 drop-shadow-sm ${textColor} ${hoverColor} relative group`}>
              Browse Livestock
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>

            {/* Buy - Text link to browse for buyers */}
            {currentUser?.role === 'buyer' && (
              <Link
                to="/browse"
                className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 drop-shadow-sm ${textColor} ${hoverColor} relative group`}>
                Buy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
            )}

            {/* About Us - Show for everyone */}
            <Link
              to="/#about"
              className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 drop-shadow-sm ${textColor} ${hoverColor} relative group`}>
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </Link>

            {/* Get Started - For guests only */}
            {!currentUser && (
              <Link
                to="/auth"
                className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 drop-shadow-sm ${textColor} ${hoverColor} relative group`}>
                Get Started
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </Link>
            )}
          </div>

          {/* Buyer Icons - Heart & Cart (right side) */}
          {currentUser?.role === 'buyer' && (
            <div className="hidden lg:flex items-center gap-4">
              {/* Wishlist Heart */}
              <Link
                to="/wishlist"
                className={`relative p-2 transition-colors duration-500 ${textColor} ${hoverColor}`}
                title="Wishlist">
                <Heart size={26} className="drop-shadow-sm" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full font-bold text-white shadow-sm animate-pulse">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 transition-colors duration-500 ${textColor} ${hoverColor}`}
                title="Cart">
                <ShoppingCart size={26} className="drop-shadow-sm" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full font-bold text-white shadow-sm animate-pulse">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}

          {/* Notification Bell - Only show for logged in users */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative p-2 transition-colors duration-500 ${textColor} ${hoverColor}`}>
                <Bell size={22} className="drop-shadow-sm" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full font-bold text-white shadow-sm animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              markAsRead(notification.id);
                              setIsNotificationsOpen(false);
                            }}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                              !notification.is_read ? 'bg-green-50' : ''
                            }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                notification.type === 'new_order' ? 'bg-blue-500' :
                                notification.type === 'new_negotiation' ? 'bg-green-500' :
                                notification.type === 'new_dispute' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`} />
                              <div className="flex-1">
                                <h4 className={`font-medium text-sm ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {notification.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <Link
                        to="/dashboard/notifications"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="block text-center text-sm text-green-600 hover:text-green-700 font-medium">
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {currentUser ? (
            /* CASE: User IS Logged In */
            <div className="flex items-center gap-4">
              {/* User Icon with Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {/* User Info Header */}
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {currentUser?.full_name || currentUser?.name || currentUser?.email?.split('@')[0]}
                        </h4>
                        <p className="text-xs text-gray-500">{currentUser?.role || 'User'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  <div className="p-2">
                    <Link
                      to={currentUser?.role === 'farmer' ? "/farmer-dashboard/profile" : "/dashboard/profile"}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <UserCircle size={18} className="text-gray-400" />
                      My Account
                    </Link>
                    <Link
                      to={currentUser?.role === 'farmer' ? "/farmer-dashboard" : "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <LayoutGrid size={18} className="text-gray-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/support"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <HelpCircle size={18} className="text-gray-400" />
                      Help & Support
                    </Link>
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* CASE: User is Guest - removed, using Get Started in nav links */
            <></>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${textColor}`}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`lg:hidden absolute w-full bg-green-950 border-b border-green-900 transition-all duration-500 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <div className="flex flex-col p-8 gap-4 bg-green-950">
          {/* Buyer-specific icon links */}
          {currentUser?.role === 'buyer' && (
            <div className="flex items-center gap-4 mb-2">
              <Link
                to="/wishlist"
                title="Wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg hover:bg-white/20 transition-colors relative">
                <Heart size={28} className="text-white" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                title="Cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg hover:bg-white/20 transition-colors relative">
                <ShoppingCart size={28} className="text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          )}
          
          {/* Text-based links */}
          {currentUser?.role === 'buyer' && (
            <>
              <Link
                to="/browse"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
                Browse Livestock
              </Link>
              <Link
                to="/browse"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
                Buy
              </Link>
            </>
          )}
          
          {currentUser?.role === 'farmer' && (
            <Link
              to="/farmer-dashboard/add"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
              Sell
            </Link>
          )}
          
          {/* Browse Livestock - Show for everyone */}
          <Link
            to="/browse"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
            Browse Livestock
          </Link>
          
          <Link
            to="/#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
            About Us
          </Link>
          
          {currentUser ? (
            <>
              <Link
                to={currentUser?.role === 'farmer' ? "/farmer-dashboard" : "/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
                Dashboard
              </Link>
              <Link
                to="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors flex items-center gap-2">
                <HelpCircle size={18} />
                Help & Support
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-sm font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors text-left flex items-center gap-2">
                <LogOut size={18} />
                Log Out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-4 text-center text-[10px] font-black uppercase tracking-widest text-white bg-green-600 rounded-lg shadow-lg">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
