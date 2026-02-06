import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock User Data
const USER_DATA = {
  fullName: 'Jeff Ouda',
  role: 'Buyer',
};

const SIDEBAR_LINKS = [
  { icon: User, label: 'Overview', path: '/dashboard' },
  { icon: Package, label: 'My Orders', path: '/dashboard/orders' },
  { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

function BuyerDashboard() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/auth';
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Navbar */}
      <Navbar />

      {/* Dashboard Container - Pushed down by Navbar height */}
      <div className="flex pt-16">
        {/* Left Sidebar - Fixed position below Navbar */}
        <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex flex-col h-full">
            {/* User Info */}
            <div className="p-6 bg-green-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                  {USER_DATA.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold">{USER_DATA.fullName}</h3>
                  <p className="text-xs text-green-100 uppercase tracking-wider">{USER_DATA.role}</p>
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
                          ? 'bg-green-50 text-green-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                      <link.icon size={18} />
                      {link.label}
                      {isActive(link.path) && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </Link>
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

        {/* Right Main Content Area */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default BuyerDashboard;
