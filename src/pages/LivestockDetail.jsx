import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Scale, 
  Calendar, 
  Heart, 
  Share2,
  ArrowLeft,
  Star,
  ShoppingCart
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mock Data - Single Animal Detail
const ANIMAL_DATA = {
  id: 1,
  title: "Boran Bull - Premium Grade",
  price: 185000,
  breed: "Boran",
  type: "Cattle",
  weight: "450kg",
  age: "3.5 Years",
  gender: "Male",
  location: "Nakuru, Njoro Farm",
  farmer: {
    name: "James Kimani",
    rating: 4.8,
    verified: true,
    avatar: "JK"
  },
  healthHistory: "Fully vaccinated against FMD. Dewormed last month. Grazing on organic pasture.",
  images: [
    {
      url: "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80",
      alt: "Front view"
    },
    {
      url: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80",
      alt: "Side view"
    },
    {
      url: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
      alt: "Grazing"
    },
    {
      url: "https://images.unsplash.com/photo-1604842247038-08c761d7a4d2?auto=format&fit=crop&q=80",
      alt: "Close up"
    }
  ]
};

function LivestockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const wishlistItems = useSelector(state => state.wishlist.items);
  
  // Safety: Handle string vs number ID comparison
  const numericId = parseInt(id, 10);
  
  // In production, this would fetch from API
  // For now, we use static data but with proper safety checks
  const animal = ANIMAL_DATA;
  
  // Safety Guard: Check if animal data is valid
  if (!animal || !animal.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-600">Loading Product Details...</div>
      </div>
    );
  }
  
  const isInWishlist = wishlistItems.some(item => item.id === animal.id);

  const handleContactFarmer = () => {
    // In production, this would open phone/WhatsApp
    window.open(`tel:+254700000000`, "_self");
  };

  const handleAddToCart = () => {
    // 🔒 Security Check: Require authentication
    if (!currentUser) {
      navigate('/auth', { state: { from: location.pathname, message: "Please login to add items to cart" } });
      return;
    }
    
    // Safety: Ensure animal exists before dispatch
    if (!animal) return;
    
    dispatch(addToCart({
      id: animal.id,
      name: animal.title,
      price: animal.price,
      image: animal.images?.[0]?.url || ""
    }));
    toast.success(`${animal.title} added to cart!`);
  };

  const handleToggleWishlist = async () => {
    // 🔒 Security Check: Require authentication
    if (!currentUser) {
      navigate('/auth', { state: { from: location.pathname, message: "Please login to save items" } });
      return;
    }
    
    // Safety: Ensure animal exists before dispatch
    if (!animal) return;
    
    if (isInWishlist) {
      try {
        await dispatch(removeFromWishlist(animal.id)).unwrap();
        toast.success(`${animal.title} removed from wishlist`);
      } catch (error) {
        console.error("Remove from wishlist failed:", error);
        toast.error("Failed to remove from wishlist. Please try again.");
      }
    } else {
      try {
        await dispatch(addToWishlist(animal.id)).unwrap();
        toast.success(`${animal.title} added to wishlist!`);
      } catch (error) {
        console.error("Add to wishlist failed:", error);
        toast.error("Failed to add to wishlist. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to listings</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-sm">
              <img
                src={animal.images?.[selectedImage]?.url || ""}
                alt={animal.images?.[selectedImage]?.alt || "Animal image"}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-colors ${
                  isInWishlist ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
                }`}>
                <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
              <button className="absolute top-4 right-16 p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-slate-600 transition-colors shadow-lg">
                <Share2 size={20} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {animal.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-green-600 ring-2 ring-green-600/20" : "border-transparent"
                  }`}>
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
                    {animal.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-slate-500">
                    <MapPin size={16} />
                    <span className="font-medium">{animal.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-black text-orange-500 mt-4">
                KES {animal.price?.toLocaleString() || "0"}
              </p>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                <Scale className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-bold text-slate-900">{animal.weight}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Weight</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-bold text-slate-900">{animal.age}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Age</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-bold text-slate-900">{animal.breed}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Breed</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-bold text-slate-900">{animal.location?.split(",")[0] || "N/A"}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">County</p>
              </div>
            </div>

            {/* Farmer Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-lg font-bold text-green-700">
                  {animal.farmer?.avatar || "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{animal.farmer?.name || "Unknown"}</h3>
                    {animal.farmer?.verified && (
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    <Star size={14} fill="currentColor" />
                    <span className="font-bold text-slate-900">{animal.farmer?.rating || "N/A"}</span>
                    <span className="text-slate-400 text-sm">rating</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/profile/${animal.farmer?.name?.toLowerCase().replace(" ", "-") || "unknown"}`)}
                  className="px-4 py-2 text-sm font-bold text-green-600 uppercase tracking-wider hover:text-green-500 transition-colors">
                  View Profile
                </button>
              </div>
            </div>

            {/* Health/Description */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-100">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-slate-900">Health & History</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {animal.healthHistory || "No health history available"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleContactFarmer}
                className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-600/20">
                <Phone size={18} />
                Contact Farmer
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black uppercase text-sm tracking-wider rounded-xl hover:border-green-600 hover:text-green-600 transition-all active:scale-95">
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>

            {/* Safety Notice */}
            <div className="flex items-start gap-3 p-4 bg-slate-100 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600">
                <strong>FarmArt Guarantee:</strong> All verified sellers undergo strict vetting. 
                Payments are held in escrow until livestock is safely delivered.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LivestockDetail;
