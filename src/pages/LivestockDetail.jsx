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

  const handleMessageFarmer = () => {
    if (!currentUser) {
      toast.error('Please login to message the farmer');
      navigate('/auth');
      return;
    }

    toast.success('Opening chat with farmer...');
  };

  {/* Tabs */}
  <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">
   <div className="flex border-b border-gray-100">
      {['description', 'health', 'seller'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-4 text-sm font-semibold capitalize ${
          activeTab === tab
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-slate-500'
        }`}
      >
        {tab === 'health' ? 'Health Records' : tab === 'seller' ? 'Seller Info' : 'Description'}
      </button>
    ))}
  </div>

  {activeTab === 'description' && (
  <p>{animal?.description || 'No description available for this animal.'}</p>
)}

  {activeTab === 'health' && (
  <p>No health records available</p>
)}

  {activeTab === 'seller' && (
  <button onClick={handleMessageFarmer}>Contact</button>
)}


if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 text-center">
      <Shield className="w-16 h-16 text-red-300 mx-auto mb-4" />
      <p className="text-red-600">{error}</p>
    </div>
  );
}

{/* Mobile Sticky Footer */}
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
  <button onClick={handleAddToCart}>
    Add to Cart - {formatPrice(animal?.price)}
  </button>
</div>