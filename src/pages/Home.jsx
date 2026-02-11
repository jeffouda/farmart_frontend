import React from "react";
import Header from "../components/Header";

//import Footer from "../components/Footer";
import About from "../components/About";

function Home() {
  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">
      <main>
        <Header />
      </main>
      <About />

      
    </div>
  );
}

export default Home;
