import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Package } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { addToWishlist, removeFromWishlist, optimisticAddToWishlist, optimisticRemoveFromWishlist } from '../redux/wishlistSlice';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

const LivestockCard = ({ animal, onQuantityUpdate, isOwner = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const wishlistItems = useSelector(state => state.wishlist.items);
  
  // Local state for optimistic updates
  const [quantity, setQuantity] = useState(animal.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if animal is in wishlist from Redux state
  const isWishlisted = wishlistItems.some(
    item => String(item.animal?.id) === String(animal.id) || String(item.animal_id) === String(animal.id)
  );

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Please login to save items');
      navigate('/auth');
      return;
    }

    if (isWishlisted) {
      // Remove from wishlist
      dispatch(optimisticRemoveFromWishlist(animal.id));
      dispatch(removeFromWishlist(animal.id));
      toast.success('Removed from wishlist');
    } else {
      // Add to wishlist - use optimistic update for instant feedback
      dispatch(optimisticAddToWishlist(animal.id));
      dispatch(addToWishlist(animal.id));
      toast.success('Added to wishlist!');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 0) {
      toast.error('This item is out of stock');
      return;
    }
    navigate(`/livestock/${animal.id}`);
  };

  const handleDecrementQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (quantity <= 1 || isUpdating) return;
    
    setIsUpdating(true);
    const newQuantity = quantity - 1;
    
    try {
      // Call API to update quantity
      await api.post(`/livestock/${animal.id}/update-quantity`, {
        action: "decrement",
        amount: 1
      });
      
      // Update local state
      setQuantity(newQuantity);
      toast.success(`Quantity updated to ${newQuantity}`);
      
      // Notify parent component
      onQuantityUpdate?.(animal.id, newQuantity);
      
      // If quantity reached 0, notify to remove card
      if (newQuantity === 0) {
        toast.success('All livestock sold!');
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  // Format price with Kenyan Shillings
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Species badge color mapping
  const getSpeciesBadgeColor = (species) => {
    const colors = {
      'Cow': 'bg-blue-600',
      'Goat': 'bg-amber-600',
      'Sheep': 'bg-gray-600',
      'Pig': 'bg-pink-600',
      'Chicken': 'bg-orange-600',
      'Horse': 'bg-brown-600',
    };
    return colors[species] || 'bg-green-600';
  };

  // Don't render if quantity is 0
  if (quantity <= 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {/* Image Area (60%) */}
      <div className="relative h-48 w-full">
        <Link to={`/livestock/${animal.id}`}>
          <img
            src={animal.image_url || 'https://placehold.co/600x400?text=No+Image'}
            alt={animal.breed}
            className="h-48 w-full object-cover"
          />
        </Link>

        {/* Species Badge - Top Left */}
        <span className={`absolute top-3 left-3 ${getSpeciesBadgeColor(animal.species)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
          {animal.species || 'Animal'}
        </span>

        {/* Quantity Badge - Top Center */}
        {quantity > 1 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Package size={12} />
            <span>{quantity} available</span>
          </div>
        )}

        {/* Wishlist Heart Button - Top Right */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center transition-all duration-200 ${
            isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Info Area (40%) */}
      <div className="p-4">
        {/* Title - Breed Name */}
        <Link to={`/livestock/${animal.id}`}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-green-600 transition-colors">
            {animal.breed || 'Unknown Breed'}
          </h3>
        </Link>

        {/* Details Row */}
        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
          {animal.age && <span>{animal.age} yrs</span>}
          {animal.age && animal.weight && <span>•</span>}
          {animal.weight && <span>{animal.weight}kg</span>}
          {(animal.age || animal.weight) && animal.location && <span>•</span>}
          {animal.location && <span className="truncate">{animal.location}</span>}
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold text-green-600">
            {formatPrice(animal.price || 0)}
          </p>
          {/* Quantity Badge - visible to everyone */}
          {quantity > 0 && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              <Package size={12} />
              {quantity} available
            </span>
          )}
        </div>

        {/* Quantity Controls (for owner) */}
        {isOwner && quantity > 1 && (
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleDecrementQuantity}
              disabled={isUpdating || quantity <= 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={14} />
              <span className="text-sm font-medium">Sell 1</span>
            </button>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Package size={14} />
              <span>{quantity} left</span>
            </span>
          </div>
        )}

        {/* Single quantity indicator for non-owners */}
        {!isOwner && quantity === 1 && (
          <p className="text-sm text-green-600 mt-2 font-medium">In Stock</p>
        )}

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={quantity <= 0}
          className={`w-full mt-3 flex items-center justify-center gap-2 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 group ${
            quantity <= 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <ShoppingCart size={18} />
          <span>{quantity > 0 ? 'View Details' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};

export default LivestockCard;
