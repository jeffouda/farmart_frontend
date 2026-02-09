import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, MessageCircle, ShoppingCart, MapPin, ChevronRight,
  Shield, Calendar, Weight, Scale, Award, CheckCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

function LivestockDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const wishlistItems = useSelector(state => state.wishlist.items);

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch animal details
  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/livestock/${id}`);
        setAnimal(response.data);
      } catch (error) {
        console.error('Failed to fetch animal:', error);
        setError('Failed to load animal details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    if (animal) {
      setIsWishlisted(wishlistItems.some(
        item => String(item.animal?.id) === String(animal.id)
      ));
    }
  }, [animal, wishlistItems]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    dispatch(addToCart({
      id: animal.id,
      name: `${animal.species} - ${animal.breed}`,
      price: animal.price,
      image: animal.image_url || animal.image
    }));
    toast.success('Added to cart!');
  };

  // Handle wishlist toggle
  const handleToggleWishlist = () => {
    if (!currentUser) {
      toast.error('Please login to save items');
      navigate('/auth');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(animal.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(animal.id));
      toast.success('Added to wishlist!');
    }
    setIsWishlisted(!isWishlisted);
  };

  // Handle message farmer
  const handleMessageFarmer = () => {
    if (!currentUser) {
      toast.error('Please login to message the farmer');
      navigate('/auth');
      return;
    }
    toast.success('Opening chat with farmer...');
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />

            {/* Details skeleton */}
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />

              <div className="grid grid-cols-2 gap-4 mt-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>

              <div className="h-14 bg-gray-200 rounded-xl animate-pulse mt-6" />
              <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl p-12 inline-block">
            <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/marketplace"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-700">Home</Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <Link to="/marketplace" className="text-slate-500 hover:text-slate-700">Marketplace</Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <Link to={`/marketplace?category=${animal?.species}`} className="text-slate-500 hover:text-slate-700">
            {animal?.species || 'Category'}
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 font-medium truncate">{animal?.breed}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Visuals */}
          <div>
            {/* Large Hero Image */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <img
                src={animal?.image_url || 'https://placehold.co/800x600?text=No+Image'}
                alt={animal?.breed}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Strip (if multiple images) */}
            {animal?.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {[animal.image_url, ...(animal.images || [])].slice(0, 5).map((img, idx) => (
                  <button key={idx} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-green-500 transition-colors">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* Species badge */}
              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {animal?.species}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {animal?.breed || 'Unknown Breed'}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-1 text-slate-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{animal?.location || 'Unknown Location'}</span>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-green-600 mb-6">
                {formatPrice(animal?.price)}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>

                <button
                  onClick={handleMessageFarmer}
                  className="px-6 py-4 border-2 border-slate-200 hover:border-green-500 text-slate-700 hover:text-green-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`px-6 py-4 border-2 rounded-xl flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Vital Stats Grid */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Vital Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Age</span>
                  </div>
                  <p className="font-semibold text-slate-900">{animal?.age || 'N/A'} years</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Weight className="w-4 h-4" />
                    <span className="text-sm">Weight</span>
                  </div>
                  <p className="font-semibold text-slate-900">{animal?.weight || 'N/A'} kg</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Scale className="w-4 h-4" />
                    <span className="text-sm">Gender</span>
                  </div>
                  <p className="font-semibold text-slate-900">{animal?.gender || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Breed</span>
                  </div>
                  <p className="font-semibold text-slate-900">{animal?.breed || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-100">
                {['description', 'health', 'seller'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'health' ? 'Health Records' : tab === 'seller' ? 'Seller Info' : 'Description'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">About this animal</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {animal?.description || 'No description available for this animal.'}
                    </p>
                    {animal?.features?.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {animal.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-slate-600">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {activeTab === 'health' && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Health Records</h3>
                    {animal?.health_records?.length > 0 ? (
                      <ul className="space-y-3">
                        {animal.health_records.map((record, idx) => (
                          <li key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Shield className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-slate-900">{record.vaccine}</span>
                            </div>
                            <span className="text-sm text-slate-500">{record.date}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-slate-500">No health records available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'seller' && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Seller Information</h3>
                    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-green-600">
                          {animal?.farmer_name?.substring(0, 2)?.toUpperCase() || 'FM'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900">{animal?.farmer_name || 'Unknown Farmer'}</h4>
                          {animal?.is_verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500">{animal?.farm_name || 'Farm Name'}</p>
                      </div>
                      <button
                        onClick={handleMessageFarmer}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex gap-3">
          <button
            onClick={handleToggleWishlist}
            className={`px-4 py-3 border-2 rounded-xl flex items-center justify-center ${
              isWishlisted
                ? 'border-red-200 bg-red-50 text-red-500'
                : 'border-gray-200 text-gray-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleMessageFarmer}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-600"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart - {formatPrice(animal?.price)}
          </button>
        </div>
      </div>

      {/* Mobile footer padding */}
      <div className="lg:hidden h-24" />
    </div>
  );
}

export default LivestockDetails;
