import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, ShoppingBag, Heart, MessageCircle, Star } from 'lucide-react';

function BuyerProfile() {
  const { currentUser, setCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    negotiations: 0,
    reviews: 0,
  });
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
  });

  // Get wishlist count from Redux
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    fetchUserStats();
  }, [currentUser]);

  const fetchUserStats = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Fetch orders count
      const ordersResponse = await api.get('/orders');
      const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
      
      // Fetch wishlist count from Redux (already available)
      
      // Fetch negotiations
      try {
        const negotiationsResponse = await api.get('/bargain');
        const negotiations = Array.isArray(negotiationsResponse.data) ? negotiationsResponse.data : [];
        
        // Filter negotiations for current buyer
        const buyerNegotiations = negotiations.filter(n => n.buyer_id === currentUser.id);
        
        setStats({
          orders: orders.length,
          wishlist: wishlistCount,
          negotiations: buyerNegotiations.length,
          reviews: 0, // Reviews would need a separate endpoint
        });
      } catch (negError) {
        console.log('Negotiations not available:', negError);
        setStats({
          orders: orders.length,
          wishlist: wishlistCount,
          negotiations: 0,
          reviews: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setStats({
        orders: 0,
        wishlist: wishlistCount,
        negotiations: 0,
        reviews: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put('/auth/profile', {
        full_name: formData.full_name,
        phone: formData.phone,
        location: formData.location,
      });
      
      if (response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-green-600 to-green-800"></div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-green-600 rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Camera size={18} className="text-gray-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentUser?.full_name || currentUser?.name || currentUser?.email?.split('@')[0]}
              </h2>
              <p className="text-gray-500 capitalize">{currentUser?.role || 'Buyer'}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Edit2 size={18} />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Form or Info Display */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
                  <p className="font-medium text-gray-900">{currentUser?.full_name || currentUser?.name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Mail size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="font-medium text-gray-900">{currentUser?.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="font-medium text-gray-900">{currentUser?.phone || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MapPin size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
                  <p className="font-medium text-gray-900">{currentUser?.location || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Calendar size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats - Real Data from Backend */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/dashboard/orders" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <ShoppingBag size={24} className="mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
          <p className="text-sm text-gray-500">Orders</p>
        </Link>
        <Link to="/wishlist" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <Heart size={24} className="mx-auto mb-2 text-red-500" />
          <p className="text-2xl font-bold text-gray-900">{stats.wishlist}</p>
          <p className="text-sm text-gray-500">Wishlist</p>
        </Link>
        <Link to="/dashboard/negotiations" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
          <MessageCircle size={24} className="mx-auto mb-2 text-blue-500" />
          <p className="text-2xl font-bold text-gray-900">{stats.negotiations}</p>
          <p className="text-sm text-gray-500">Negotiations</p>
        </Link>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <Star size={24} className="mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold text-gray-900">{stats.reviews}</p>
          <p className="text-sm text-gray-500">Reviews</p>
        </div>
      </div>
    </div>
  );
}

export default BuyerProfile;
