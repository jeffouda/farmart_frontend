import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutGrid,
  Box,
  ShoppingBag,
  BarChart3,
  Plus,
  LogOut,
  Menu,
  X,
  MessageCircle,
  Scale,
} from "lucide-react";

const FarmerDashboard = () => {
  // State to control the visibility of the sidebar on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/farmer-dashboard", icon: LayoutGrid },
    { name: "Inventory", path: "/farmer-dashboard/inventory", icon: Box },
    { name: "Negotiations", path: "/negotiations", icon: MessageCircle },
    { name: "Order", path: "/farmer-dashboard/orders", icon: ShoppingBag },
    { name: "Disputes", path: "/farmer-dashboard/disputes", icon: Scale },
    { name: "Analytic", path: "/farmer-dashboard/analytics", icon: BarChart3 },
  ];

  // Helper to toggle the sidebar
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = "/auth";
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* 1. MOBILE TOP BAR (Hidden on Desktop) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-50">
        <span className="font-black text-[#34A832] text-xl">FARMART</span>
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle Menu">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 2. SIDEBAR OVERLAY (Mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* 3. SIDEBAR (Fixed/Drawer Logic) */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-6 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
      `}>
        {/* Sidebar Header */}
        <div className="mb-10 px-2 hidden lg:block">
          <span className="font-black text-[#34A832] text-2xl tracking-tighter">
            FARMART
          </span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Livestock Exchange
          </p>
        </div>

        {/* Add Button - Matching your image */}
        <Link
          to="/farmer-dashboard/add"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center justify-center gap-2 bg-[#34A832] hover:bg-[#2D8E2B] text-white py-3 rounded-xl font-bold mb-8 shadow-md transition-all active:scale-95">
          <Plus size={18} /> Add Livestock
        </Link>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)} // Close menu on click (mobile)
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-slate-50 text-slate-900 font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}>
                <Icon
                  size={22}
                  className={isActive ? "text-slate-900" : "text-slate-400"}
                />
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 mt-auto font-bold transition-colors"
        >
          <LogOut size={22} /> Logout
        </button>
      </aside>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 w-full overflow-x-hidden pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Sub-pages (Overview, Orders, etc.) render here */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
