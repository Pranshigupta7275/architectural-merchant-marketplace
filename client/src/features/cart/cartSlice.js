import { createSlice } from '@reduxjs/toolkit';

// 1. SAFE LOAD: Automatically deletes corrupted data so your app never crashes
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem("curator_cart");
    if (!stored) return { items: [], totalQuantity: 0, totalAmount: 0 };
    
    const parsed = JSON.parse(stored);
    
    // If the data is corrupted or from an older version, reset it safely
    if (!Array.isArray(parsed.items)) throw new Error("Corrupted Cart Array");
    
    return parsed;
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.warn("Clearing corrupted cart data...");
    localStorage.removeItem("curator_cart");
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addItemToCart(state, action) {
      const payload = action.payload;
      
      // ✅ BULLETPROOF DATA NORMALIZATION
      // Forces the ID to be a string, whether it came from MongoDB (_id) or static (id)
      const safeId = String(payload._id || payload.id);
      const safePrice = Number(payload.price) || 0;
      const safeQuantity = Number(payload.quantity) || 1;

      // Safely check both potential ID locations
      const existingItem = state.items.find(item => String(item.id) === safeId || String(item._id) === safeId);

      if (existingItem) {
        existingItem.quantity += safeQuantity;
        existingItem.totalPrice = existingItem.quantity * safePrice;
      } else {
        state.items.push({
          ...payload,
          id: safeId, // Force standard 'id' property so the frontend maps correctly
          price: safePrice,
          quantity: safeQuantity,
          totalPrice: safePrice * safeQuantity
        });
      }

      // ✅ RECALCULATE FROM SCRATCH (Prevents Ghost Carts and Sync Bugs)
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);

      localStorage.setItem("curator_cart", JSON.stringify(state));
    },
    
    removeItemFromCart(state, action) {
      const targetId = String(action.payload); 
      const existingItem = state.items.find(item => String(item.id) === targetId || String(item._id) === targetId);

      if (existingItem) {
        if (existingItem.quantity <= 1) {
          // Remove item completely
          state.items = state.items.filter(item => String(item.id) !== targetId && String(item._id) !== targetId);
        } else {
          // Decrease quantity by 1
          existingItem.quantity -= 1;
          existingItem.totalPrice = existingItem.quantity * Number(existingItem.price);
        }
      }

      // ✅ RECALCULATE FROM SCRATCH
      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);

      localStorage.setItem("curator_cart", JSON.stringify(state));
    },

    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem("curator_cart");
    }
  }
});

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;