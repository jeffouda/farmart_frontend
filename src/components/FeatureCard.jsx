import React from "react";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="group relative p-8 bg-slate-50 rounded-[32px] border-2 border-slate-100 hover:border-green-100 hover:bg-white hover:shadow-[0_20px_50px_rgba(22,163,74,0.1)] transition-all duration-500 overflow-hidden">
      <div className="relative z-10">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-md mb-8 group-hover:bg-slate-900 group-hover:text-green-400 group-hover:rotate-6 transition-all duration-500">
          <Icon className="w-7 h-7" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight mb-4 group-hover:text-green-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 text-sm font-bold leading-relaxed opacity-90 group-hover:opacity-100">
          {description}
        </p>
      </div>
      <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-green-600 group-hover:w-full transition-all duration-500" />
    </div>
  );
};

// THIS IS THE LINE YOU ARE LIKELY MISSING:
export default FeatureCard;
