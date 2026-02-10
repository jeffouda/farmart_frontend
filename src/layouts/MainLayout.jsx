import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed Header */}
      <Navbar />
      
      {/* Main content with padding-top to account for fixed navbar */}
      {/* Navbar height is approximately 64px-80px depending on scroll state */}
      <main className="flex-grow pt-16 md:pt-20">
        <Outlet />
      </main>
      
      {/* Footer - only shown on home page by App.jsx control */}
      <Footer />
    </div>
  );
};

export default MainLayout;
