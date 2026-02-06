import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import BrowseLivestock from './pages/BrowseLivestock'
import Marketplace from './pages/Marketplace'
import LivestockDetail from './pages/LivestockDetail'
import BuyerDashboard from './pages/BuyerDashboard'
import FarmerDashboard from './pages/FarmerDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<SignUp />} />
        <Route path="/browse" element={<BrowseLivestock />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/livestock/:id" element={<LivestockDetail />} />
        <Route path="/dashboard" element={<BuyerDashboard />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
