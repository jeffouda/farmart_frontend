import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Package, TrendingUp, Star, ShoppingBag, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function FarmerProfile() {
  const { currentUser, setCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    farm_name: '',
    farm_location: '',
    farm_description: '',
  });

  // Fetch fresh user data from backend on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        const userData = response.data;
        setFormData({
          full_name: userData.full_name || '',
          email: userData.email || '',
          phone: userData.phone_number || userData.phone || '',
          location: userData.location || '',
          farm_name: userData.farm_name || '',
          farm_location: userData.farm_location || '',
          farm_description: userData.farm_description || '',
        });
        // Update AuthContext with fresh data
        if (setCurrentUser) {
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [setCurrentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put('/auth/profile', formData);
      // Fetch fresh data after update
      const response = await api.get('/auth/me');
      const userData = response.data;
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone_number || userData.phone || '',
        location: userData.location || '',
        farm_name: userData.farm_name || '',
        farm_location: userData.farm_location || '',
        farm_description: userData.farm_description || '',
      });
      if (setCurrentUser) {
        setCurrentUser(userData);
      }
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#34A832]"></div>
      </div>
    );
  }

  // Use either formData or currentUser fallback
  const displayData = {
    full_name: formData.full_name || currentUser?.full_name || currentUser?.email?.split('@')[0] || '',
    email: formData.email || currentUser?.email || '',
    phone: formData.phone || currentUser?.phone_number || currentUser?.phone || '',
    location: formData.location || currentUser?.location || '',
    farm_name: formData.farm_name || currentUser?.farm_name || '',
    farm_location: formData.farm_location || currentUser?.farm_location || '',
    farm_description: formData.farm_description || currentUser?.farm_description || '',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your farm and account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-40 bg-gradient-to-r from-[#34A832] to-[#2D8E2B]"></div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="relative -mt-14 mb-6">
            <div className="w-28 h-28 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-[#34A832] rounded-full flex items-center justify-center">
                <User size={48} className="text-white" />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
              <Camera size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Farm Name */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {displayData.full_name}
              </h2>
              <p className="text-[#34A832] font-medium">{displayData.farm_name || 'My Farm'}</p>
              <p className="text-gray-500 capitalize">{currentUser?.role || 'Farmer'}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-[#34A832] text-white rounded-lg hover:bg-[#2D8E2B] transition-colors"
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
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    id="full_name"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34A832] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34A832] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34A832] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Personal Location</label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34A832] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="farm_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Name
                  </label>
                  <input
                    id="farm_name"
                    type="text"
                    name="farm_name"
                    value={formData.farm_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34A832] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="farm_location" className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Location
                  </label>
                  <input
                    id="farm_location"
                    type="text"
                    name="farm_location"
                    value={formData.farm_location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34A832] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="farm_description" className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Description
                  </label>
                  <textarea
                    id="farm_description"
                    name="farm_description"
                    value={formData.farm_description}
                    onChange={handleChange}
                    rows={3}
                    aria-describedby="farm_description-helper"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#34A832] focus:border-transparent"
                  />
                  <p id="farm_description-helper" className="mt-1 text-xs text-gray-500">
                    Describe your farm, its history, and what you specialize in.
                  </p>
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
                  disabled={saving}
                  className="px-6 py-2 bg-[#34A832] text-white rounded-lg hover:bg-[#2D8E2B] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
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
                  <p className="font-medium text-gray-900">{displayData.full_name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Mail size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="font-medium text-gray-900">{displayData.email || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="font-medium text-gray-900">{displayData.phone || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MapPin size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Personal Location</p>
                  <p className="font-medium text-gray-900">{displayData.location || 'Not set'}</p>
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
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Package size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Farm Name</p>
                  <p className="font-medium text-gray-900">{displayData.farm_name || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl md:col-span-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MapPin size={20} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Farm Location</p>
                  <p className="font-medium text-gray-900">{displayData.farm_location || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Farm Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-[#34A832]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Package size={24} className="text-[#34A832]" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500">Livestock</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShoppingBag size={24} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500">Orders</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp size={24} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500">Sales</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Star size={24} className="text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentUser?.average_rating || '0.0'}</p>
          <p className="text-sm text-gray-500">Rating</p>
        </div>
      </div>
    </div>
  );
}

export default FarmerProfile;
