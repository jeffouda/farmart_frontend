import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import BrowseLivestock from './pages/BrowseLivestock'
import Marketplace from './pages/Marketplace'
import LivestockDetail from './pages/LivestockDetail'
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
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Buyer Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['buyer']}>
            <BuyerDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<BuyerOverview />} />
          <Route path="orders" element={<BuyerOrders />} />
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
    </>
  )
}

export default App
