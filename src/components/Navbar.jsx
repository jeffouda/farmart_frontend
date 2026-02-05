import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function Navbar() {
    return (
        <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg py-3 shadow-xl shadow-slate-900/5"
          : "bg-transparent py-6"
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
        {/* LEFT: BRANDING */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src="/logo.jpg"
              alt="logo"
              className="relative w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="leading-none">
            <h1
              className={`text-xl font-black uppercase italic tracking-tighter transition-colors ${
                isScrolled ? "text-slate-900" : "text-white"
              }`}>
              FARM<span className="text-indigo-500">ART</span>
            </h1>
             <p
              className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 transition-colors ${
                isScrolled ? "text-slate-400" : "text-white/60"
              }`}>
              Buy • Sell
            </p>
          </div>

    );
}

export default Navbar;