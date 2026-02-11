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
