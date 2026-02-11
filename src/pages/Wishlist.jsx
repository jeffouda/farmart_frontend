import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { addToCart } from "../redux/cartSlice";
import {
  removeFromWishlist,
  optimisticRemoveFromWishlist,
} from "../redux/wishlistSlice";
import toast from "react-hot-toast";
const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);

  const formatPrice = (price) => {
    return KSh ${price.toLocaleString()};
  };

  // Helper to get animal data (handles both API and local structure)
  const getAnimalData = (item) => {
    return item.animal || item;
  };
  const handleMoveToCart = (item) => {
    const animal = getAnimalData(item);
    dispatch(addToCart({
      id: animal.id,
      name: animal.name || animal.species,
      price: animal.price,
      image: animal.image || animal.image_url
    }));
    // Optimistic removal for instant UI feedback
    const animalId = animal.id;
    dispatch(optimisticRemoveFromWishlist(animalId));
    // Also call API to remove
    dispatch(removeFromWishlist(animalId));
    toast.success(${animal.name || animal.species} moved to cart!);
  };
  const handleRemoveFromWishlist = (item) => {
    const animal = getAnimalData(item);
    const animalId = animal.id;
    // Optimistic removal for instant UI feedback
    dispatch(optimisticRemoveFromWishlist(animalId));
    // Also call API to remove
    dispatch(removeFromWishlist(animalId));
    toast.success(${animal.name || animal.species} removed from wishlist);
  };
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Save items you want to watch here</p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            Browse Livestock
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/browse"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Browse</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">My Saved Items</h1>
          <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm font-medium">
            {wishlistItems.length}
          </span>
        </div>




