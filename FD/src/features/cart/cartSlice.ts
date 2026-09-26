import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem('cart');
    if (!stored) return { items: [], totalQuantity: 0, totalAmount: 0 };
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed.items)) throw new Error('Corrupted Cart Array');
    return parsed;
  } catch (error) {
    console.warn('Clearing corrupted cart data...');
    localStorage.removeItem('cart');
    return { items: [], totalQuantity: 0, totalAmount: 0 };
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const payload = action.payload;
      const safeId = String(payload._id || payload.id);
      const safePrice = Number(payload.price) || 0;
      const safeQuantity = Number(payload.quantity || payload.cartQuantity || 1);

      const existingItem = state.items.find(
        (item) => String(item.id) === safeId || String(item._id) === safeId
      );

      if (existingItem) {
        existingItem.quantity += safeQuantity;
        existingItem.totalPrice = existingItem.quantity * safePrice;
      } else {
        state.items.push({
          ...payload,
          id: safeId,
          price: safePrice,
          quantity: safeQuantity,
          totalPrice: safePrice * safeQuantity,
        });
      }

      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const targetId = String(action.payload);
      const existingItem = state.items.find(
        (item) => String(item.id) === targetId || String(item._id) === targetId
      );

      if (existingItem) {
        if (existingItem.quantity <= 1) {
          state.items = state.items.filter(
            (item) => String(item.id) !== targetId && String(item._id) !== targetId
          );
        } else {
          existingItem.quantity -= 1;
          existingItem.totalPrice = existingItem.quantity * Number(existingItem.price);
        }
      }

      state.totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const addItemToCart = addToCart;
export const removeItemFromCart = removeFromCart;
export default cartSlice.reducer;
