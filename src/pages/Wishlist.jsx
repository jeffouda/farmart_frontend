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


