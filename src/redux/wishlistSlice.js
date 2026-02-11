import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Async thunks for backend synchronization
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/wishlist/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (animalId, { rejectWithValue }) => {
    try {
      const response = await api.post('/wishlist/', { animal_id: animalId });
      return response.data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (animalId, { getState, rejectWithValue }) => {
    try {
      // Get current state to find the wishlist item's id by animal_id
      const state = getState();
      const wishlistItem = state.wishlist.items.find(
        item => String(item.animal?.id) === String(animalId) || String(item.animal_id) === String(animalId)
      );
      
      if (!wishlistItem) {
        return rejectWithValue('Item not found in wishlist');
      }
      
      // Delete using the wishlist item's id
      await api.delete(`/wishlist/${wishlistItem.id}`);
      // Return animal_id for filtering
      return animalId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const initialState = {
  items: [], // Array of wishlist items with animal details
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    // Optimistic update for instant UI feedback
    optimisticAddToWishlist(state, action) {
      const animalId = String(action.payload);
      const exists = state.items.some(item => String(item.animal?.id) === animalId || String(item.animal_id) === animalId);
      if (!exists) {
        state.items.push({ animal: { id: animalId }, id: `temp-${Date.now()}` });
      }
    },
    // Optimistic remove from wishlist
    optimisticRemoveFromWishlist(state, action) {
      const animalId = String(action.payload);
      state.items = state.items.filter(
        item => String(item.animal?.id) !== animalId && String(item.animal_id) !== animalId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const newItem = action.payload;
        const newItemAnimalId = String(newItem.animal?.id || newItem.animal_id);
        const exists = state.items.some(item => 
          String(item.animal?.id) === newItemAnimalId || String(item.animal_id) === newItemAnimalId
        );
        if (!exists) {
          state.items.push(newItem);
        }
      })
      // Remove from wishlist - filter by animal_id
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const animalId = String(action.payload);
        state.items = state.items.filter(
          item => String(item.animal?.id) !== animalId && String(item.animal_id) !== animalId
        );
      });
  },
});

export const { clearWishlist, optimisticAddToWishlist, optimisticRemoveFromWishlist } = wishlistSlice.actions;

// Selector to check if an animal is in wishlist
export const selectIsInWishlist = (state, animalId) => {
  const searchId = String(animalId);
  return state.wishlist.items.some(item => 
    String(item.animal?.id) === searchId || String(item.animal_id) === searchId
  );
};

// Selector for all wishlist items
export const selectWishlistItems = (state) => state.wishlist.items;

// Selector for wishlist count
export const selectWishlistCount = (state) => state.wishlist.items.length;

export default wishlistSlice.reducer;
