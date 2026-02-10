import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { fetchWishlist, optimisticRemoveFromWishlist } from '../redux/wishlistSlice';
import toast from 'react-hot-toast';

function BuyerWishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxWishlistItems = useSelector(state => state.wishlist.items);
  const loading = useSelector(state => state.wishlist.status === 'loading');
  
  // Debug: Log wishlist items structure
  console.log("Redux Wishlist Items:", reduxWishlistItems);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch wishlist from API and sync with Redux
  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        // Dispatch Redux action to fetch and sync wishlist
        await dispatch(fetchWishlist()).unwrap();
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      }
    };

    fetchWishlistData();
  }, [dispatch]);

  const handleRemove = async (item) => {
    try {
      // Get the animal_id and wishlist item id
      const animalId = item.animal?.id || item.animal_id;
      const wishlistItemId = item.id;
      
      // Optimistic removal for instant UI feedback (before API call)
      dispatch(optimisticRemoveFromWishlist(animalId));
      
      // Call API to remove the wishlist item using the wishlist item's id
      await api.delete(`/wishlist/${wishlistItemId}`);
      
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      // Re-fetch to sync state if API call fails
      dispatch(fetchWishlist());
      toast.error('Failed to remove item from wishlist');
    }
  };

  const handleBuyNow = (item) => {
    // Add to cart using Redux
    dispatch(addToCart({
      id: item.animal.id,
      name: `${item.animal.species} - ${item.animal.breed}`,
      price: item.animal.price,
      quantity: 1,
    }));
    navigate('/cart');
  };

  // Empty State
  if (!loading && reduxWishlistItems.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            My Wishlist
          </h1>
          <p className="text-slate-500 mt-1">Items you've saved for later</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-pink-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Save items you're interested in to see them here</p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
            <ShoppingBag size={20} />
            Browse Marketplace
          </Link>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            My Wishlist
          </h1>
          <p className="text-slate-500 mt-1">
            {loading ? 'Loading...' : `${reduxWishlistItems.length} items saved`}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && reduxWishlistItems.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <span className="ml-2 text-slate-500">Loading wishlist...</span>
        </div>
      )}

      {/* Wishlist Grid */}
      {!loading && reduxWishlistItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reduxWishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Animal Image/Icon */}
              <div className="h-48 bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center text-6xl">
                {item.animal?.image_url ? (
                  <img 
                    src={item.animal.image_url} 
                    alt={item.animal.species}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">🐂</span>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.animal?.species || 'Unknown'} - {item.animal?.breed || 'Unknown'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {item.animal?.age ? `${item.animal.age} months` : 'Age unknown'}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                  <span className="text-green-600">📍</span> Available
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-green-600">
                    {formatCurrency(item.animal?.price || 0)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRemove(item)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from wishlist">
                      <Trash2 size={18} />
                    </button>
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
                      <ShoppingBag size={16} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back Link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}

export default BuyerWishlist;
