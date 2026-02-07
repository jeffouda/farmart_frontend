import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, clearWishlist } from './redux/wishlistSlice';
import { fetchOrders, clearOrders } from './redux/ordersSlice';
import { clearCart } from './redux/cartSlice';
import { useAuth } from './context/AuthContext';

// Pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import BrowseLivestock from "./pages/BrowseLivestock";
import Marketplace from "./pages/Marketplace";
import LivestockDetail from "./pages/LivestockDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Unauthorized from "./pages/Unauthorized";

// Buyer Dashboard Components
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerOverview from "./pages/BuyerOverview";
import BuyerWishlist from "./pages/BuyerWishlist";
import BuyerSettings from "./pages/BuyerSettings";

// Farmer Dashboard Components
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
  const dispatch = useDispatch();
  const { currentUser } = useAuth();

  // Sync Redux state with backend when user logs in
  useEffect(() => {
    if (currentUser) {
      // Fetch user's wishlist from backend
      dispatch(fetchWishlist());
      // Fetch user's orders from backend
      dispatch(fetchOrders());
    } else {
      // 🧹 CLEANUP: Wipe all Redux state immediately on logout
      dispatch(clearWishlist());
      dispatch(clearOrders());
      dispatch(clearCart());
    }
  }, [currentUser, dispatch]);

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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
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
            <Route path="orders" element={<Orders />} />
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
            {/* These sub-routes align with the Sidebar icons */}
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
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
