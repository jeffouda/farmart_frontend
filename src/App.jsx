import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, clearWishlist } from "./redux/wishlistSlice";
import { fetchOrders, clearOrders } from "./redux/ordersSlice";
import { clearCart } from "./redux/cartSlice";
import { useAuth } from "./context/AuthContext";
import ThemedBackground from "./components/ThemedBackground";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import BrowseLivestock from "./pages/BrowseLivestock";
import LivestockDetails from "./pages/LivestockDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Unauthorized from "./pages/Unauthorized";
import NegotiationList from "./pages/NegotiationList";
import NegotiationRoom from "./pages/NegotiationRoom";
import Negotiation from "./pages/Negotiation";
import RaiseDispute from "./pages/RaiseDispute";
import Support from "./pages/Support";

import BuyerDisputes from "./pages/BuyerDisputes";
import BuyerNegotiationList from "./pages/BuyerNegotiationList";
import BuyerNegotiationRoom from "./pages/BuyerNegotiationRoom";

// Buyer Dashboard Components
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerOverview from "./pages/BuyerOverview";
import BuyerWishlist from "./pages/BuyerWishlist";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerSettings from "./pages/BuyerSettings";
import BuyerProfile from "./pages/BuyerProfile";

// Farmer Dashboard Components
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerOverview from "./pages/FarmerOverview";
import FarmerInventory from "./pages/FarmerInventory";
import FarmerOrders from "./pages/FarmerOrders";
import FarmerAnalytics from "./pages/FarmerAnalytics";
import FarmerDisputes from "./pages/FarmerDisputes";
import FarmerRaiseDispute from "./pages/FarmerRaiseDispute";
import AddLivestock from "./pages/AddLivestock";
import FarmerProfile from "./pages/FarmerProfile";

// Admin Dashboard Components
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDisputes from "./pages/AdminDisputes";
import Finance from "./pages/admin/Finance";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ScrollToTop from "./components/ScrollToTop";

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
      <ThemedBackground />
      <ScrollToTop />
      <Routes>
        {/* --- Public Routes (with MainLayout) --- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<SignUp />} />
          <Route path="/login" element={<SignUp />} />
          <Route path="/browse" element={<BrowseLivestock />} />
          <Route path="/livestock/:id" element={<LivestockDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:orderId" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/negotiations" element={<NegotiationList />} />
          <Route path="/negotiations/:id" element={<NegotiationRoom />} />
          <Route path="/negotiation/:livestockId/:receiverId" element={<Negotiation />} />
          <Route path="/dispute/:orderId" element={<RaiseDispute />} />
          <Route path="/dispute/new" element={<RaiseDispute />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/*Protected Buyer Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }>
          <Route index element={<BuyerOverview />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="disputes" element={<BuyerDisputes />} />
          <Route path="dispute/:orderId" element={<RaiseDispute />} />
          <Route path="wishlist" element={<BuyerWishlist />} />
          <Route path="settings" element={<BuyerSettings />} />
          <Route path="profile" element={<BuyerProfile />} />
          <Route path="negotiations" element={<BuyerNegotiationList />} />
          <Route path="negotiations/:id" element={<BuyerNegotiationRoom />} />
        </Route>

        {/* Protected Farmer Routes */}
        <Route
          path="/farmer-dashboard"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </ProtectedRoute>
          }>
          <Route index element={<FarmerOverview />} />
          <Route path="inventory" element={<FarmerInventory />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="analytics" element={<FarmerAnalytics />} />
          <Route path="disputes" element={<FarmerDisputes />} />
          <Route path="disputes/new" element={<FarmerRaiseDispute />} />
          <Route path="add" element={<AddLivestock />} />
          <Route path="profile" element={<FarmerProfile />} />
        </Route>

        {/* Farmer Report Buyer Route */}
        <Route
          path="/farmer/report-buyer/:orderId"
          element={
            <ProtectedRoute allowedRoles={["farmer"]}>
              <FarmerRaiseDispute />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Protected by ProtectedAdminRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="farmers" element={<AdminUserManagement />} />
          <Route path="buyers" element={<AdminUserManagement />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="finance" element={<Finance />} />
          <Route path="settings" element={<AdminDashboard />} />
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
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
