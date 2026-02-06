import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

// Placeholder components
const Browse = () => (
  <div className="pt-32 text-white text-center">Browse Livestock Page</div>
);
const Marketplace = () => (
  <div className="pt-32 text-white text-center">Marketplace Page</div>
);
const Sell = () => (
  <div className="pt-32 text-white text-center">Sell Your Livestock</div>
);
const About = () => (
  <div className="pt-32 text-white text-center">About FarmArt</div>
);
const Login = () => (
  <div className="pt-32 text-white text-center">Login / OTP Page</div>
);

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/market" element={<Marketplace />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
