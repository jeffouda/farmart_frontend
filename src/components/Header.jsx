import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

      {/* ABOUT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 px-6 md:px-20 lg:px-32 max-w-7xl mx-auto overflow-hidden text-slate-900 bg-white"
        id="About">
        <div className="flex flex-col items-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter">
            About <span className="text-green-600">Farmart</span>
          </h2>
          <div className="w-24 h-2 bg-green-600 mt-4 rounded-full" />
          <p className="text-green-600 font-bold uppercase text-xs tracking-[0.3em] mt-6">
            Pioneering Digital Agriculture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="relative group w-full lg:w-1/2">
            <div className="absolute -inset-4 bg-green-100/50 rounded-[100px] rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-green-200" />
            <img
              src={"/About.jpg"}
              alt="Farm Management"
              className="relative w-full aspect-square object-cover rounded-[80px] shadow-2xl transition-all duration-700 border border-green-100"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {[
                { val: "15k+", lab: "Verified Farmers" },
                { val: "50k+", lab: "Heads Traded" },
                { val: "24h", lab: "Vet Support" },
                { val: "100%", lab: "Secure Payments" },
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <p className="text-4xl md:text-5xl font-black text-slate-900 group-hover:text-green-600 transition-all duration-300">
                    {stat.val}
                  </p>
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mt-3">
                    {stat.lab}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-[1px] w-full bg-slate-100 my-10" />

            <div className="relative p-8 rounded-3xl bg-green-50 border-l-8 border-green-600 mb-10 shadow-sm">
              <p className="text-slate-800 leading-relaxed font-bold italic text-lg">
                "We are building the bridge between the ranch and the market.
                Our mission is to empower farmers with fair pricing and buyers
                with healthy, traceable livestock through a modern digital
                ecosystem."
              </p>
            </div>

            <button className="group flex items-center gap-4 bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-green-500 transition-all shadow-xl shadow-green-900/20 active:scale-95">
              Our Process
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={18}
              />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Header;
