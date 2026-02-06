import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="w-full bg-white">
      {/* Ensure there is a min-height so the page doesn't collapse to 0px */}
      <main className="min-h-screen">
        <Header />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
