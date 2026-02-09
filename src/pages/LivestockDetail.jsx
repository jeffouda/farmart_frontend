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