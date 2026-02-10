import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

const LivestockCard = ({ animal, onAddToCart, onToggleWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(animal.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(animal.id);
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

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Area (60%) */}
      <div className="relative h-48 w-full">
        <Link to={`/livestock/${animal.id}`}>
          <img
            src={animal.image_url || '/placeholder-livestock.jpg'}
            alt={animal.breed}
            className="h-48 w-full object-cover"
          />
        </Link>

        {/* Species Badge - Top Left */}
        <span className={`absolute top-3 left-3 ${getSpeciesBadgeColor(animal.species)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
          {animal.species || 'Animal'}
        </span>

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

        {/* Price */}
        <p className="text-xl font-bold text-green-600 mt-2">
          {formatPrice(animal.price || 0)}
        </p>

        {/* Action Button */}
        <Link
          to={`/livestock/${animal.id}`}
          className="w-full mt-3 block text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 group"
        >
          <span className="group-hover:hidden">Add to Cart</span>
          <span className="hidden group-hover:block">View Details</span>
        </Link>
      </div>
    </div>
  );
};

export default LivestockCard;
