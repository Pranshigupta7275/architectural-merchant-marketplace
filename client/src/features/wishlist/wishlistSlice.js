import { createSlice } from "@reduxjs/toolkit";

// Load initial state from local storage if it exists
const loadWishlistFromStorage = () => {
  const stored = localStorage.getItem("curator_wishlist");
  return stored ? JSON.parse(stored) : [];
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex((item) => item.id === product.id);

      if (existingIndex >= 0) {
        // If it's already in the wishlist, remove it (unlike)
        state.items.splice(existingIndex, 1);
      } else {
        // If it's not in the wishlist, add it (like)
        state.items.push(product);
      }

      // Sync with localStorage
      localStorage.setItem("curator_wishlist", JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;