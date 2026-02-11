import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutGrid,
  Box,
  ShoppingBag,
  BarChart3,
  LogOut,
  ChevronRight,
  MessageCircle,
  Scale,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Sidebar navigation links
const SIDEBAR_LINKS = [
  { icon: LayoutGrid, label: "Dashboard", path: "/farmer-dashboard" },
  { icon: Box, label: "Inventory", path: "/farmer-dashboard/inventory" },
  { icon: MessageCircle, label: "Negotiations", path: "/negotiations" },
  { icon: ShoppingBag, label: "Orders", path: "/farmer-dashboard/orders" },
  { icon: Scale, label: "Disputes", path: "/farmer-dashboard/disputes" },
  { icon: BarChart3, label: "Analytics", path: "/farmer-dashboard/analytics" },
];

const FarmerDashboard = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  const isActive = (path) => {
    if (path === "/farmer-dashboard") {
      return location.pathname === "/farmer-dashboard";
    }
    return location.pathname.startsWith(path);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (currentUser?.full_name) {
      return currentUser.full_name.split(" ").map((n) => n[0]).join("");
    }
    if (currentUser?.name) {
      return currentUser.name.split(" ").map((n) => n[0]).join("");
    }
    if (currentUser?.email) {
      return currentUser.email[0].toUpperCase();
    }
    return "?";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navbar */}
      <Navbar />

      {/* Dashboard Container - Centered with max-width */}
      <div className="max-w-7xl mx-auto flex pt-20 mt-4 min-h-[calc(100vh-6rem)]">
        {/* Left Sidebar - Sticky below Navbar */}
        <aside className="w-64 flex-shrink-0 hidden md:block border-r border-gray-200 bg-white sticky top-16 h-[calc(100vh-4rem)]">
          <div className="flex flex-col h-full">
            {/* User Info */}
            <div className="p-6 bg-[#34A832] text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                  {getUserInitials()}
                </div>
                <div>
                  <h3 className="font-bold">
                    {currentUser?.full_name || currentUser?.name || currentUser?.email?.split("@")[0] || "Farmer"}
                  </h3>
                  <p className="text-xs text-green-100 uppercase tracking-wider">
                    {currentUser?.role || "Farmer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                {SIDEBAR_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? "bg-[#34A832]/10 text-[#34A832]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <link.icon size={18} />
                      {link.label}
                      {isActive(link.path) && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Add Livestock Button */}
              <Link
                to="/farmer-dashboard/add"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-[#34A832] text-white rounded-xl text-sm font-bold hover:bg-[#2D8E2B] transition-all"
              >
                <Box size={18} />
                Add Livestock
              </Link>

              {/* Log Out Button - Prominent at bottom */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default FarmerDashboard;
