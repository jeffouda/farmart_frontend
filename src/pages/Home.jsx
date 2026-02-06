import React from "react";
import About from "../components/About";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <Navbar />

      <main>
        <Header />

        <div id="about">
          <About />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
