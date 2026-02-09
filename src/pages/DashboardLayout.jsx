import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
} from "lucide-react";

const FarmerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Force full page reload to clear all cached state
    window.location.href = "/auth";
  };

  const menuItems = [
    { name: "Dashboard", path: "/farmer-dashboard", icon: LayoutGrid },
    { name: "Inventory", path: "/farmer-dashboard/inventory", icon: Box },
    { name: "Order", path: "/farmer-dashboard/orders", icon: ShoppingBag },
    { name: "Analytic", path: "/farmer-dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile Header - Only shows on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-50">
        <span className="font-black text-[#34A832] text-xl">Farmart</span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Matching image_d70257.png */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:sticky lg:top-0
      `}>
        <div className="hidden lg:block mb-8">
          <span className="font-black text-[#34A832] text-2xl px-4">
            Farmart
          </span>
        </div>

        <Link
          to="/farmer-dashboard/add"
          onClick={() => setIsSidebarOpen(false)}
          className="flex items-center justify-center gap-2 bg-[#34A832] hover:bg-[#2D8E2B] text-white py-3 rounded-lg font-bold mb-10 shadow-sm transition-all">
          <Plus size={18} /> Add Livestock
        </Link>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
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

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 mt-auto transition-colors"
        >
          <LogOut size={22} />
          <span className="text-[15px]">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      {/* Mobile: pt-16 to account for fixed header. Desktop: pt-0 since sidebar has its own positioning */}
      <main className="flex-1 p-4 md:p-8 pt-16 lg:pt-0 w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
