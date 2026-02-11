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




