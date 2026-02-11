import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist, optimisticRemoveFromWishlist } from "../redux/wishlistSlice";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";
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
  ShoppingCart,
  MessageCircle,
  Flag
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=No+Image";

function LivestockDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const wishlistItems = useSelector(state => state.wishlist.items);

  // Fetch animal data from API
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setError(null);
        const response = await api.get(`/livestock/${id}`);
        const resData = response.data;
        
        // Verification logging
        console.group("🦄 LIVESTOCK DETAIL API VERIFICATION");
        console.log("Source URL:", `/livestock/${id}`);
        console.log("HTTP Status:", response.status);
        console.log("Raw Data:", resData);
        console.groupEnd();

        // Map API response to expected structure
        const formattedAnimal = {
          id: resData.id,
          title: `${resData.species} - ${resData.breed}`,
          price: resData.price,
          breed: resData.breed,
          species: resData.species,
          weight: resData.weight,
          age: resData.age,
          gender: resData.gender,
          location: resData.location || "Unknown",
          healthHistory: resData.health_history || "No health history available",
          farmer_id: resData.farmer_id,
          farmer: {
            name: resData.farmer_name || resData.farmer?.name || "Unknown Farmer",
            id: resData.farmer_id,
            rating: resData.average_rating || resData.farmer?.average_rating || 0,
            verified: resData.is_verified || false,
            avatar: (resData.farmer_name || "U").substring(0, 2).toUpperCase()
          },
          image: resData.image_url || resData.image || PLACEHOLDER_IMAGE,
          images: resData.images || [
            { url: resData.image_url || resData.image || PLACEHOLDER_IMAGE, alt: "Main image" }
          ],
          // Keep original data
          ...resData
        };
        
        setAnimal(formattedAnimal);
      } catch (error) {
        console.error("Failed to fetch animal:", error);
        setError("Failed to load animal details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // Safety: Check if animal data is valid
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading animal details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-300 mx-auto mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-600">Animal not found</div>
      </div>
    );
  }

  const isInWishlist = wishlistItems.some(item => 
    String(item.animal?.id) === String(animal.id) || String(item.animal_id) === String(animal.id)
  );

  const handleContactFarmer = () => {
    // Open phone/WhatsApp with farmer's contact if available
    if (animal.farmer?.phone) {
      window.open(`tel:${animal.farmer.phone}`, "_self");
    } else {
      window.open(`tel:+254700000000`, "_self");
    }
  };

  const handleAddToCart = () => {
    // Security Check: Require authentication
    if (!currentUser) {
      navigate('/auth', { state: { from: location.pathname, message: "Please login to add items to cart" } });
      return;
    }
    
    dispatch(addToCart({
      id: animal.id,
      name: animal.title,
      price: animal.price,
      image: animal.image
    }));
    toast.success(`${animal.title} added to cart!`);
    // Navigate to cart page after adding
    navigate('/cart');
  };

  const handleToggleWishlist = async () => {
    // Security Check: Require authentication
    if (!currentUser) {
      navigate('/auth', { state: { from: location.pathname, message: "Please login to save items" } });
      return;
    }
    
    if (isInWishlist) {
      // Optimistic removal for instant UI feedback
      dispatch(optimisticRemoveFromWishlist(animal.id));
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

  // Handle Make Offer - Starts a negotiation bargain
  const handleMakeOffer = async () => {
    // Security Check: Require authentication
    if (!currentUser) {
      navigate('/auth', { state: { from: location.pathname, message: "Please login to make an offer" } });
      return;
    }
    
    // Only buyers can make offers
    if (currentUser.role !== 'buyer') {
      toast.error("Only buyers can make offers");
      return;
    }

    try {
      // Calculate initial offer (90% of asking price as default)
      const initialOffer = Math.round(animal.price * 0.9);
      
      const response = await api.post('/bargain/sessions', {
        animal_id: animal.id,
        offer_amount: initialOffer,
        message: `I'm interested in buying this ${animal.breed}. Would you accept KES ${initialOffer.toLocaleString()}?`
      });
      
      toast.success('Offer sent! Starting negotiation...');
      
      // Redirect to the negotiation room
      navigate(`/negotiations/${response.data.session.id}`);
    } catch (error) {
      console.error('Failed to create offer:', error);
      toast.error(error.response?.data?.error || 'Failed to create offer. Please try again.');
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
                src={animal.images?.[selectedImage]?.url || animal.image || PLACEHOLDER_IMAGE}
                alt={animal.title || "Animal image"}
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
            {animal.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {animal.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-green-600 ring-2 ring-green-600/20" : "border-transparent"
                    }`}>
                    <img
                      src={image.url || PLACEHOLDER_IMAGE}
                      alt={image.alt || `Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
                <p className="text-lg font-bold text-slate-900">{animal.weight}kg</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Weight</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <p className="text-lg font-bold text-slate-900">{animal.age ? `${Math.floor(animal.age / 12)} years` : "Unknown"}</p>
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
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/dispute/new?targetId=${animal.farmer?.id || ''}&type=user&context=livestock&ref=${animal.id}`)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Report this user"
                  >
                    <Flag size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/profile/${animal.farmer?.name?.toLowerCase().replace(/\\s+/g, "-") || "unknown"}`)}
                    className="px-4 py-2 text-sm font-bold text-green-600 uppercase tracking-wider hover:text-green-500 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
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
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleContactFarmer}
                className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl hover:bg-green-500 transition-all active:scale-95 shadow-lg shadow-green-600/20"
              >
                <Phone size={18} />
                Contact
              </button>
              <button
                onClick={handleMakeOffer}
                className="flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-black uppercase text-sm tracking-wider rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
              >
                <MessageCircle size={18} />
                Make Offer
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 text-slate-700 font-black uppercase text-sm tracking-wider rounded-xl hover:border-green-600 hover:text-green-600 transition-all active:scale-95"
              >
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

            {/* Data Source Indicator */}
            <div className="text-center py-2 text-xs text-slate-400">
              Data Source: Live API ✅
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LivestockDetail;
