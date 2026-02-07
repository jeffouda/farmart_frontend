import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWishlist, clearWishlist } from './redux/wishlistSlice'
import { fetchOrders, clearOrders } from './redux/ordersSlice'
import { clearCart } from './redux/cartSlice'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import BrowseLivestock from './pages/BrowseLivestock'
import Marketplace from './pages/Marketplace'
import LivestockDetail from './pages/LivestockDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import BuyerDashboard from './pages/BuyerDashboard'
import BuyerOverview from './pages/BuyerOverview'
import BuyerOrders from './pages/BuyerOrders'
import BuyerWishlist from './pages/BuyerWishlist'
import BuyerSettings from './pages/BuyerSettings'
import FarmerDashboard from './pages/FarmerDashboard'
import Unauthorized from './pages/Unauthorized'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  const dispatch = useDispatch()
  const { currentUser } = useAuth()

  // Sync Redux state with backend when user logs in
  useEffect(() => {
    if (currentUser) {
      // Fetch user's wishlist from backend
      dispatch(fetchWishlist())
      // Fetch user's orders from backend
      dispatch(fetchOrders())
    } else {
      // 🧹 CLEANUP: Wipe all Redux state immediately on logout
      dispatch(clearWishlist())
      dispatch(clearOrders())
      dispatch(clearCart())
    }
  }, [currentUser, dispatch])

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<SignUp />} />
        <Route path="/browse" element={<BrowseLivestock />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/livestock/:id" element={<LivestockDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Buyer Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <BuyerDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<BuyerOverview />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<BuyerWishlist />} />
          <Route path="settings" element={<BuyerSettings />} />
        </Route>

        {/* Protected Farmer Routes */}
        <Route path="/farmer-dashboard" element={
          <ProtectedRoute allowedRoles={['farmer']}>
            <FarmerDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
      <Toaster position="top-right" />
    </>
  )
}

export default App
