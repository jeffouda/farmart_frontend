import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";

//import Footer from "../components/Footer";
import About from "../components/About";

function Home() {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to it
    const hash = location.hash;
    if (hash === "#about") {
      // Use setTimeout to ensure the element is rendered
      setTimeout(() => {
        const element = document.getElementById("about");
        if (element) {
          // Scroll to the element with offset for fixed navbar
          const navbarHeight = document.querySelector('nav')?.offsetHeight || 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: elementPosition - navbarHeight,
            behavior: "smooth"
          });
        }
      }, 100);
    }
  }, [location]);

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
