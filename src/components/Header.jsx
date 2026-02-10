import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSellClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/auth", { state: { role: 'farmer' } });
    }
  };
  
  return (
    <>
      {/* HERO SECTION */}
      <div className="relative bg-[url('/HeaderBg.jpg')] bg-cover bg-center h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* CLEAR BACKGROUND SETTINGS: 
            Removed the solid color overlay. 
            Added a subtle bottom gradient to ensure text doesn't blend into the footer. */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />

        <div className="relative z-10 max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-7xl md:text-[92px] font-black text-slate-900 leading-[0.9] tracking-tighter italic uppercase drop-shadow-sm">
            Buy & Sell <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
              Livestock Direct
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-slate-800 text-lg md:text-xl font-bold mt-8 max-w-2xl mx-auto drop-shadow-sm">
            Connect with trusted farmers and buyers. Trade cattle, sheep, goats,
            and more with total transparency and secure logistics.
          </motion.p>

                    <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <a
              href="/browse"
              className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-green-600 transition-all shadow-xl flex items-center justify-center gap-2">
              Browse Animals <ChevronRight size={18} />
            </a>
            <a
              href={isAuthenticated ? "/sell" : "#"}
              onClick={handleSellClick}
              className="bg-white/90 backdrop-blur-sm border-2 border-slate-200 text-slate-900 px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:border-green-600 hover:text-green-600 transition-all flex items-center justify-center shadow-sm">
              Sell Livestock
            </a>
          </motion.div>
        </div>

        {/* Bottom fade - ensures a clean transition into the white About section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
      </div>