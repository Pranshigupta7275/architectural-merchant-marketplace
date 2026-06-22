import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wishlistItems: localStorage.getItem('storefront_wishlist')
    ? JSON.parse(localStorage.getItem('storefront_wishlist'))
    : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action) {
      const itemIndex = state.wishlistItems.findIndex((item) => item._id === action.payload._id);
      if (itemIndex >= 0) {
        // Remove if exists
        state.wishlistItems = state.wishlistItems.filter((item) => item._id !== action.payload._id);
      } else {
        // Add if it doesn't exist
        state.wishlistItems.push(action.payload);
      }
      localStorage.setItem('storefront_wishlist', JSON.stringify(state.wishlistItems));
    },
    clearWishlist(state) {
      state.wishlistItems = [];
      localStorage.removeItem('storefront_wishlist');
    }
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;