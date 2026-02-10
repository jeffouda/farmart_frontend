import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist, optimisticRemoveFromWishlist } from '../redux/wishlistSlice';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LivestockCard from '../components/LivestockCard';

const ANIMAL_TYPES = ['Cattle', 'Goats', 'Sheep', 'Chicken', 'Pig'];
const LOCATIONS = [
  'Nairobi City', 'Kiambu', 'Nakuru', 'Kisumu', 'Eldoret',
  'Mombasa', 'Narok', 'Kajiado', 'Thika', 'Machakos'
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

function Marketplace() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const wishlistItems = useSelector(state => state.wishlist.items);

  // State
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch livestock from API
  useEffect(() => {
    const fetchLivestock = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategories.length > 0) params.append('species', selectedCategories.join(','));
        if (priceRange.min) params.append('min_price', priceRange.min);
        if (priceRange.max) params.append('max_price', priceRange.max);
        if (selectedLocation) params.append('location', selectedLocation);
        params.append('sort', sortBy);

        const response = await api.get(/livestock?${params.toString()});
        setLivestock(response.data.animals || response.data || []);
      } catch (error) {
        console.error('Failed to fetch livestock:', error);
        setError('Failed to load livestock. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLivestock();
  }, [searchQuery, selectedCategories, priceRange, selectedLocation, sortBy]);

  // Check if item is in wishlist
  const isInWishlist = (id) => {
    return wishlistItems.some(item =>
      String(item.animal?.id) === String(id) || String(item.animal_id) === String(id)
    );
  };

  // Handle add to cart
  const handleAddToCart = (id) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    const item = livestock.find(l => String(l.id) === String(id));
    if (item) {
      dispatch(addToCart({
        id: item.id,
        name: ${item.species} - ${item.breed},
        price: item.price,
        image: item.image_url || item.image
      }));
      toast.success('Added to cart!');
    }
  };

  // Handle toggle wishlist
  const handleToggleWishlist = (id) => {
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

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
