import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, MapPin, Filter, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { fetchWishlist, addToWishlist, removeFromWishlist, optimisticRemoveFromWishlist } from "../redux/wishlistSlice";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";

const ANIMAL_TYPES = ["Cow", "Goat", "Sheep", "Chicken", "Pig"];
const LOCATIONS = ["Nakuru", "Kiambu", "Narok", "Kajiado", "Nairobi", "Eldoret", "Kisumu", "Marsabit"];
const PLACEHOLDER_IMAGE = "https://placehold.co/400x300?text=No+Image";

// Helper function to get image URL with fallback
const getImageUrl = (item) => {
  return item.image_url || item.image || PLACEHOLDER_IMAGE;
};

// Helper to format API data to match component's expected structure
const formatLivestockItem = (item) => ({
  id: item.id,
  title: `${item.species} - ${item.breed}`,
  price: item.price,
  location: item.location || "Unknown",
  type: item.species,
  breed: item.breed,
  weight: `${item.weight}kg`,
  age: item.age ? `${Math.floor(item.age / 12)} years` : "Unknown",
  image: getImageUrl(item),
  farmer: { 
    name: item.farmer_name || "Unknown Farmer", 
    avatar: (item.farmer_name || "U").substring(0, 2).toUpperCase() 
  },
  rating: item.average_rating || 4.5,
  verified: item.is_verified || true,
  // Keep original data
  ...item
});

function BrowseLivestock() {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [healthVerifiedOnly, setHealthVerifiedOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [livestockData, setLivestockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch livestock from API
  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setError(null);
        const response = await api.get('/livestock/all');
        
        // Verification logging for API data confirmation
        console.group("🦄 API DATA VERIFICATION");
        console.log("Source URL:", "/api/livestock/all");
        console.log("HTTP Status:", response.status);
        console.log("Raw Data Count:", response.data.animals?.length || 0);
        console.log("Sample Item (ID 1):", response.data.animals?.[0]);
        console.groupEnd();
        
        setLivestockData(response.data.animals || []);
      } catch (error) {
        console.error("Failed to fetch livestock:", error);
        setError("Failed to load livestock. Please try again.");
        setLivestockData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLivestock();
  }, []);

  const wishlistItems = useSelector(state => state.wishlist.items);

  const isInWishlist = (id) => {
    const searchId = String(id);
    return wishlistItems.some(item => 
      String(item.animal?.id) === searchId || String(item.animal_id) === searchId
    );
  };

  const handleToggleWishlist = async (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Security Check: Require authentication
    if (!currentUser) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <p className="font-medium">Please login to save items</p>
          <button 
            onClick={() => { toast.dismiss(t.id); navigate('/auth'); }}
            className="px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-lg"
          >
            Login
          </button>
        </div>
      ), { duration: 5000 });
      return;
    }

    const itemId = item.id || item.animal?.id;
    
    if (isInWishlist(itemId)) {
      // Optimistic removal for instant UI feedback
      dispatch(optimisticRemoveFromWishlist(itemId));
      try {
        await dispatch(removeFromWishlist(itemId)).unwrap();
        toast.success(`${item.title} removed from wishlist`);
      } catch (error) {
        console.error("Remove from wishlist failed:", error);
        toast.error("Failed to remove from wishlist. Please try again.");
      }
    } else {
      try {
        await dispatch(addToWishlist(itemId)).unwrap();
        toast.success(`${item.title} added to wishlist!`);
      } catch (error) {
        console.error("Add to wishlist failed:", error);
        toast.error("Failed to add to wishlist. Please try again.");
      }
    }
  };

  const handleAddToCart = (item) => {
    // Security Check: Require authentication
    if (!currentUser) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(addToCart({
      id: item.id || item.animal?.id,
      name: item.title,
      price: item.price,
      image: item.image
    }));
    toast.success(`${item.title} added to cart!`);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleLocationToggle = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  // Format API data for display
  const allLivestock = useMemo(() => {
    return livestockData.map(formatLivestockItem);
  }, [livestockData]);

  const filteredLivestock = allLivestock.filter((item) => {
    const matchesSearch = (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.breed || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(item.location);
    const matchesMinPrice = !priceRange.min || item.price >= parseInt(priceRange.min);
    const matchesMaxPrice = !priceRange.max || item.price <= parseInt(priceRange.max);
    const matchesVerified = !healthVerifiedOnly || item.verified;
    return matchesSearch && matchesType && matchesLocation && matchesMinPrice && matchesMaxPrice && matchesVerified;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading livestock...</p>
        </div>
      </div>
    );
  }

  // Error state
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Browse Livestock
            </h1>
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search livestock..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-medium text-slate-700">
              <Filter size={20} />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-36">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 uppercase italic">Filters</h2>
              {(selectedTypes.length > 0 || selectedLocations.length > 0 || healthVerifiedOnly) && (
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedLocations([]);
                    setPriceRange({ min: "", max: "" });
                    setHealthVerifiedOnly(false);
                  }}
                  className="text-xs font-bold text-green-600 uppercase tracking-wider hover:text-green-500">
                  Clear All
                </button>
              )}
            </div>

            {/* Animal Types */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Animal Type</h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Location</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {LOCATIONS.map((location) => (
                  <label key={location} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Health Verified Toggle */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-700">Health Verified Only</span>
                <button
                  onClick={() => setHealthVerifiedOnly(!healthVerifiedOnly)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    healthVerifiedOnly ? "bg-green-600" : "bg-slate-200"
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      healthVerifiedOnly ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Showing <span className="font-bold text-slate-900">{filteredLivestock.length}</span> livestock
            </p>
          </div>

          {filteredLivestock.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No livestock found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLivestock.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={getImageUrl(item)}
                      alt={item.title || "Livestock"}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button 
                      onClick={(e) => handleToggleWishlist(item, e)}
                      className={`absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full transition-colors ${
                        isInWishlist(item.id)
                          ? 'text-red-500'
                          : 'text-slate-400 hover:text-red-500'
                      }`}>
                      <Heart size={18} fill={isInWishlist(item.id) ? "currentColor" : "none"} />
                    </button>
                    {item.verified && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg">
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-xl font-black text-orange-500 mb-2">
                      KES {item.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      {item.breed} • {item.weight} • {item.age}
                    </p>

                    {/* Farmer Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-[10px] font-bold text-green-700">
                        {(item.farmer?.avatar || item.farmer?.name?.substring(0, 2) || "U").toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-slate-600">{item.farmer?.name || "Unknown"}</span>
                      <div className="flex items-center gap-1 ml-auto text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{item.rating || "N/A"}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 py-3 bg-green-600 text-white font-black uppercase text-xs tracking-wider rounded-xl hover:bg-green-700 transition-all active:scale-95">
                        Add to Cart
                      </button>
                      <Link
                        to={`/livestock/${item.id}`}
                        className="flex-1 py-3 text-center bg-slate-100 text-slate-700 font-black uppercase text-xs tracking-wider rounded-xl hover:bg-slate-200 transition-all active:scale-95">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-slate-900 uppercase italic">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-slate-400">
                ✕
              </button>
            </div>

            {/* Animal Types */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Animal Type</h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600"
                    />
                    <span className="text-sm font-medium text-slate-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Location</h3>
              <div className="space-y-2">
                {LOCATIONS.map((location) => (
                  <label key={location} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location)}
                      onChange={() => handleLocationToggle(location)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600"
                    />
                    <span className="text-sm font-medium text-slate-700">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Health Verified */}
            <div className="mb-6">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-slate-700">Health Verified Only</span>
                <button
                  onClick={() => setHealthVerifiedOnly(!healthVerifiedOnly)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    healthVerifiedOnly ? "bg-green-600" : "bg-slate-200"
                  }`}>
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      healthVerifiedOnly ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </label>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl">
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Data Source Indicator */}
      <div className="text-center py-4 text-xs text-slate-400">
        Data Source: {livestockData.length > 0 ? "Live API Connected ✅" : "No Data / Loading ⏳"}
      </div>
    </div>
  );
}

export default BrowseLivestock;
