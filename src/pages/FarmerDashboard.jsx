import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function FarmerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 pt-28">
        <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter text-center">
          Farmer Dashboard
        </h1>
        <p className="text-center text-slate-500 mt-4 text-lg">
          Coming Soon
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default FarmerDashboard;
