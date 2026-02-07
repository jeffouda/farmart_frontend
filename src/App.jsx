import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import BrowseLivestock from "./pages/BrowseLivestock";
import Marketplace from "./pages/Marketplace";
import LivestockDetail from "./pages/LivestockDetail";
import Unauthorized from "./pages/Unauthorized";

// Buyer Dashboard Components
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerOverview from "./pages/BuyerOverview";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerWishlist from "./pages/BuyerWishlist";
import BuyerSettings from "./pages/BuyerSettings";

// Farmer Dashboard Components (Updated for your Sidebar design)
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerOverview from "./pages/FarmerOverview";
import FarmerInventory from "./pages/FarmerInventory";
import FarmerOrders from "./pages/FarmerOrders";
import FarmerAnalytics from "./pages/FarmerAnalytics";
import AddLivestock from "./pages/AddLivestock";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<SignUp />} />
          <Route path="/browse" element={<BrowseLivestock />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/livestock/:id" element={<LivestockDetail />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* --- Protected Buyer Routes --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }>
            <Route index element={<BuyerOverview />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="wishlist" element={<BuyerWishlist />} />
            <Route path="settings" element={<BuyerSettings />} />
          </Route>

          {/* --- Protected Farmer Routes --- */}
          <Route
            path="/farmer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }>
            {/* These sub-routes align with the Sidebar icons in your image */}
            <Route index element={<FarmerOverview />} />
            <Route path="inventory" element={<FarmerInventory />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="analytics" element={<FarmerAnalytics />} />
            <Route path="add" element={<AddLivestock />} />
          </Route>

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center pt-20">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
                <a href="/" className="text-green-600 hover:underline mt-2">
                  Return Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>

    
    </div>
  );
}

export default App;
