import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist, optimisticRemoveFromWishlist } from '../redux/wishlistSlice';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LivestockCard from '../components/LivestockCard';

const ANIMAL_TYPES = ['Cattle', 'Goats', 'Sheep', 'Chicken', 'Pig'];
const LOCATIONS = [
  'Nairobi City', 'Kiambu', 'Nakuru', 'Kisumu', 'Eldoret',
  'Mombasa', 'Narok', 'Kajiado', 'Thika', 'Machakos'
];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

function Marketplace() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const wishlistItems = useSelector(state => state.wishlist.items);

  // State
  const [livestock, setLivestock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);