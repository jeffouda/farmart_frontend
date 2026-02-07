import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, LogOut, Heart } from "lucide-react";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get cart count and wishlist count from Redux
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const wishlistCount = useSelector(state => state.wishlist.items.length);

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

  const navLinks = [
    { name: "Browse Livestock", path: "/browse" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Sell", path: currentUser ? "/sell" : "#", clickHandler: !currentUser ? () => navigate("/auth") : null },
    { name: "About Us", path: "/about" },
  ];

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
        className={`text-2xl font-black uppercase italic tracking-tighter transition-colors duration-500 ${textColor}`}
      >
        FARM<span className="text-green-600">ART</span>
      </h1>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-600">
        Livestock Exchange
      </p>
    </div>
  </Link>

  {/* CENTER: DESKTOP NAVIGATION */}
  <div className="hidden lg:flex items-center gap-10">
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        onClick={link.clickHandler}
        className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 drop-shadow-sm ${textColor} ${hoverColor} relative group`}>
        {link.name}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
      </Link>
    ))}
  </div>

  {/* RIGHT: ACTIONS */}
  <div className="flex items-center gap-2 sm:gap-6">
    {currentUser ? (
      /* CASE: User IS Logged In */
      <div className="flex items-center gap-4">
        {/* 1. Show User Icon (Link to Dashboard) - With red border for debugging */}
        <Link
          to="/dashboard"
          className="border-2 border-red-500 p-2 hover:bg-green-100 rounded-full transition-colors flex items-center gap-2">
          <User className="h-6 w-6 text-green-700" />
          <span className="hidden sm:block text-sm font-medium text-green-700">
            {currentUser.full_name?.split(" ")[0] || "User"}
          </span>
        </Link>
        {/* 2. Show Log Out Button */}
        <button
          onClick={handleLogout}
          className={`hidden sm:block text-sm font-medium transition-colors ${textColor} hover:text-red-500`}>
          Log Out
        </button>
      </div>
    ) : (
      /* CASE: User is Guest (NOT Logged In) */
      <Link
        to="/auth"
        className={`hidden sm:block px-7 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg shadow-lg ${
          isScrolled
            ? "bg-green-600 text-white hover:bg-green-500 shadow-green-950/40"
            : "bg-green-600 text-white hover:bg-green-500 shadow-slate-900/20"
        } hover:-translate-y-0.5 active:scale-95`}>
        Get Started
      </Link>
    )}

    {/* Wishlist Icon - Only show for logged in users */}
    {currentUser && (
      <Link
        to="/dashboard/wishlist"
        className={`relative p-2 transition-colors duration-500 ${textColor} ${hoverColor}`}>
        <Heart size={22} className="drop-shadow-sm" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full font-bold text-white shadow-sm animate-pulse">
            {wishlistCount}
          </span>
        )}
      </Link>
    )}

    {/* Cart Icon */}
    <Link
      to="/cart"
      className={`relative p-2 transition-colors duration-500 ${textColor} ${hoverColor}`}>
      <ShoppingCart size={22} className="drop-shadow-sm" />
      {totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] flex items-center justify-center rounded-full font-bold text-white shadow-sm animate-pulse">
          {totalQuantity}
        </span>
      )}
    </Link>

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
    isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
  }`}>
  <div className="flex flex-col p-8 gap-6 bg-green-950">
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        onClick={link.clickHandler ? link.clickHandler : () => setIsMobileMenuOpen(false)}
        className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
        {link.name}
      </Link>
    ))}
    {currentUser ? (
      <>
        <Link
          to="/dashboard"
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-sm font-bold uppercase tracking-widest text-white hover:text-green-500 transition-colors">
          Dashboard
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
