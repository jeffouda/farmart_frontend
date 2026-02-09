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