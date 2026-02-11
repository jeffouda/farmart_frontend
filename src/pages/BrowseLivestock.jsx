import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, MapPin, Filter, Star, ShoppingCart, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist, optimisticRemoveFromWishlist } from '../redux/wishlistSlice';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const ANIMAL_TYPES = ['Cow', 'Goat', 'Sheep', 'Chicken', 'Pig'];
const LOCATIONS = [
  'Nairobi City', 'Kiambu', 'Nakuru', 'Kisumu', 'Eldoret',
  'Mombasa', 'Narok', 'Kajiado', 'Thika', 'Machakos'
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

function BrowseLivestock() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const wishlistItems = useSelector(state => state.wishlist.items);

  // State
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Debounce function
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
      const handler = setTimeout(() => setDebouncedValue(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
  };

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedMinPrice = useDebounce(priceRange.min, 500);
  const debouncedMaxPrice = useDebounce(priceRange.max, 500);

  // Fetch livestock from API
  const fetchLivestock = useCallback(async () => {
    try {
      setFiltering(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (selectedCategories.length > 0) params.append('species', selectedCategories.join(','));
      if (debouncedMinPrice) params.append('min_price', debouncedMinPrice);
      if (debouncedMaxPrice) params.append('max_price', debouncedMaxPrice);
      if (selectedLocation) params.append('location', selectedLocation);
      params.append('sort', sortBy);

      const response = await api.get(`/livestock?${params.toString()}`);
      setLivestock(response.data.animals || response.data || []);
    } catch (error) {
      console.error('Failed to fetch livestock:', error);
      setError('Failed to load livestock. Please try again.');
    } finally {
      setFiltering(false);
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategories, debouncedMinPrice, debouncedMaxPrice, selectedLocation, sortBy]);

  // Initial load and filter changes
  useEffect(() => {
    fetchLivestock();
  }, [fetchLivestock]);

  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return wishlistItems.some(item =>
      String(item.animal?.id) === String(id) || String(item.animal_id) === String(id)
    );
  };

  // Handle add to cart
  const handleAddToCart = (e, id) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    const item = livestock.find(l => String(l.id) === String(id));
    if (item) {
      dispatch(addToCart({
        id: item.id,
        name: `${item.species} - ${item.breed}`,
        price: item.price,
        image: item.image_url || item.image
      }));
      toast.success('Added to cart!');
      navigate('/cart');
    }
  };

  // Handle toggle wishlist
  const handleToggleWishlist = (e, id) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error('Please login to save items');
      navigate('/auth');
      return;
    }

    if (isInWishlist(id)) {
      dispatch(optimisticRemoveFromWishlist(id));
      dispatch(removeFromWishlist(id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(id));
      toast.success('Added to wishlist!');
    }
  };

  // Toggle category checkbox
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setSelectedLocation('');
    setSortBy('newest');
  };

  // Has active filters
  const hasActiveFilters = selectedCategories.length > 0 || priceRange.min || priceRange.max || selectedLocation;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-green-600 uppercase tracking-wider hover:text-green-500">
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Animal Type</h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(type)}
                      onChange={() => handleCategoryToggle(type)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
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

            {/* Location Filter */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Location</h3>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              {filtering ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                <>
                  Showing <span className="font-bold text-slate-900">{livestock.length}</span> livestock
                </>
              )}
            </p>
          </div>

          {/* Empty State */}
          {livestock.length === 0 && !filtering && (
            <div className="bg-white rounded-2xl p-12 text-center">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No livestock found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query</p>
            </div>
          )}

          {/* Livestock Grid - Big Cards */}
          {livestock.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {livestock.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/livestock/${animal.id}`)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={animal.image_url || animal.image || 'https://placehold.co/400x300?text=No+Image'}
                      alt={animal.breed || 'Livestock'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Species Badge - Left */}
                    {animal.species && (
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-600 text-white text-xs font-black uppercase tracking-wider rounded-lg">
                        {animal.species}
                      </div>
                    )}
                    {/* Verified Badge - Left Bottom */}
                    {animal.is_verified && (
                      <div className="absolute bottom-4 left-28 px-3 py-1 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-lg">
                        Verified
                      </div>
                    )}
                    {/* Wishlist Button - Right */}
                    <button
                      onClick={(e) => handleToggleWishlist(e, animal.id)}
                      className={`absolute top-4 right-4 p-4 bg-white/90 backdrop-blur-sm rounded-full transition-colors ${
                        isInWishlist(animal.id)
                          ? 'text-red-500'
                          : 'text-slate-400 hover:text-red-500'
                      }`}
                    >
                      <Heart size={24} fill={isInWishlist(animal.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-3">
                      {animal.breed || `${animal.species} - Breed`}
                    </h3>

                    {/* Price */}
                    <p className="text-3xl font-black text-orange-500 mb-4">
                      KES {animal.price?.toLocaleString() || '0'}
                    </p>

                    {/* Details Row */}
                    <div className="flex items-center gap-4 text-base text-slate-500 mb-6">
                      {animal.age && <span>{animal.age} years</span>}
                      {animal.weight && <span>• {animal.weight}kg</span>}
                      <span>• {animal.gender || 'N/A'}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-base text-slate-400 mb-6">
                      <MapPin size={14} />
                      <span>{animal.location || 'Unknown Location'}</span>
                    </div>

                    {/* Farmer Info */}
                    {animal.farmer_name && (
                      <div className="flex items-center gap-2 mb-6 pb-6 border-b border-slate-100">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-base font-bold text-green-700">
                          {(animal.farmer_name || "U").substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-base font-medium text-slate-600">{animal.farmer_name}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={(e) => handleAddToCart(e, animal.id)}
                        className="flex-1 py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/livestock/${animal.id}`);
                        }}
                        className="flex-1 py-4 text-center bg-slate-100 text-slate-700 font-black uppercase text-sm tracking-wider rounded-xl hover:bg-slate-200 transition-all active:scale-95">
                        Details
                      </button>
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

            {/* Category */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Animal Type</h3>
              <div className="space-y-2">
                {ANIMAL_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(type)}
                      onChange={() => handleCategoryToggle(type)}
                      className="w-4 h-4 rounded border-slate-300 text-green-600 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
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
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm"
              >
                <option value="">All Locations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-100 rounded-lg text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 py-4 bg-gray-100 text-slate-700 font-black uppercase text-sm tracking-wider rounded-xl">
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-4 bg-green-600 text-white font-black uppercase text-sm tracking-wider rounded-xl">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseLivestock;
