import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, HelpCircle, Plus, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const FarmerNavbar = () => {
  const { currentUser, logout } = useAuth();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/farmer-dashboard" className="flex items-center gap-2">
          <span className="font-black text-[#34A832] text-xl">FARMART</span>
        </Link>

        {/* Center/Right: Navigation Links */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Inventory Link */}
          <Link
            to="/farmer-dashboard/inventory"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#34A832] transition-colors"
          >
            <span>Inventory</span>
          </Link>

          {/* Sell/Add Livestock Link */}
          <Link
            to="/farmer-dashboard/add"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#34A832] text-white rounded-lg text-sm font-medium hover:bg-[#2D8E2B] transition-colors"
          >
            <Plus size={18} />
            <span>Sell</span>
          </Link>

          {/* Help Link */}
          <Link
            to="/support"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#34A832] transition-colors"
          >
            <HelpCircle size={18} />
            <span>Help</span>
          </Link>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-600 hover:text-[#34A832] transition-colors"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
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
                        className="text-sm text-[#34A832] hover:text-[#2D8E2B] font-medium"
                      >
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
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                              notification.type === 'new_order' ? 'bg-blue-500' :
                              notification.type === 'new_negotiation' ? 'bg-green-500' :
                              notification.type === 'new_dispute' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <h4 className={`font-medium text-sm ${
                                !notification.is_read ? 'text-gray-900' : 'text-gray-600'
                              }`}>
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
                      to="/farmer-dashboard/notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block text-center text-sm text-[#34A832] hover:text-[#2D8E2B] font-medium"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Icon */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-[#34A832] rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {currentUser?.full_name?.split(" ")[0] || currentUser?.name || "Farmer"}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2">
                <Link
                  to="/farmer-dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  to="/farmer-dashboard/inventory"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  My Inventory
                </Link>
                <Link
                  to="/farmer-dashboard/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  My Orders
                </Link>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="p-4 space-y-2">
            <Link
              to="/farmer-dashboard/inventory"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Inventory
            </Link>
            <Link
              to="/farmer-dashboard/add"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Sell
            </Link>
            <Link
              to="/support"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Help
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default FarmerNavbar;
