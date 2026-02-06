import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Box,
  ShoppingBag,
  BarChart3,
  Plus,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/farmer-dashboard", icon: LayoutGrid },
    { name: "Inventory", path: "/farmer-dashboard/inventory", icon: Box },
    { name: "Order", path: "/farmer-dashboard/orders", icon: ShoppingBag },
    { name: "Analytic", path: "/farmer-dashboard/analytics", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#34A832] text-white rounded-md">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-100 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
      `}>
        <div className="flex flex-col h-full px-4 py-8">
          {/* Action Button from your image */}
          <Link
            to="/farmer-dashboard/add"
            className="flex items-center justify-center gap-2 bg-[#34A832] hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg mb-8 shadow-sm transition-all">
            <Plus size={18} />
            <span>Add Livestock</span>
          </Link>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
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

          <button className="flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-500 mt-auto">
            <LogOut size={22} />
            <span className="text-[15px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardSidebar;
