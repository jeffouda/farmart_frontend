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
