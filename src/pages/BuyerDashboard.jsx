import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  ChevronRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mock User Data
const USER_DATA = {
  fullName: "Jeff Ouda",
  role: "Buyer",
  phone: "+254 712 345 678",
  location: "Kiambu County",
  email: "jeff@example.com",
};

const STATS = {
  activeOrders: 0,
  wishlistItems: 2,
  totalSpent: 0,
};

const SIDEBAR_LINKS = [
  { icon: User, label: "Overview", active: true },
  { icon: Package, label: "My Orders" },
  { icon: Heart, label: "Wishlist" },
  { icon: Settings, label: "Settings" },
];

function BuyerDashboard() {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("Overview");

  const handleLogout = () => {
    // In production, this would clear auth tokens and redirect
    localStorage.removeItem("access_token");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-28">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-28">
              {/* User Info */}
              <div className="p-6 bg-green-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                    {USER_DATA.fullName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold">{USER_DATA.fullName}</h3>
                    <p className="text-xs text-green-100 uppercase tracking-wider">{USER_DATA.role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {SIDEBAR_LINKS.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => setActiveLink(link.label)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          activeLink === link.label
                            ? "bg-green-50 text-green-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}>
                        <link.icon size={18} />
                        {link.label}
                        {activeLink === link.label && (
                          <ChevronRight size={16} className="ml-auto" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Log Out Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all">
                  <LogOut size={18} />
                  Log Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Welcome Banner */}
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                    Welcome back, {USER_DATA.fullName.split(" ")[0]}!
                  </h1>
                  <p className="text-slate-500 mt-1">Ready to find your next livestock?</p>
                </div>
                <Link
                  to="/browse"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-black uppercase text-xs tracking-wider rounded-xl hover:bg-green-500 transition-all active:scale-95">
                  <ShoppingBag size={18} />
                  Browse Marketplace
                </Link>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-6">
                Profile Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Full Name</p>
                    <p className="font-bold text-slate-900">{USER_DATA.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
                    <p className="font-bold text-slate-900">{USER_DATA.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                    <p className="font-bold text-slate-900">{USER_DATA.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                    <p className="font-bold text-slate-900">{USER_DATA.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package size={24} className="text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900">{STATS.activeOrders}</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Active Orders</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Heart size={24} className="text-pink-600" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900">{STATS.wishlistItems}</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Wishlist Items</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={24} className="text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-black text-slate-900">KSh {STATS.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider">Total Spent</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BuyerDashboard;
