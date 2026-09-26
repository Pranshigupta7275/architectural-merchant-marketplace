import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice';
import { customerApi } from "../features/api/customerApi";
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import productDraftReducer from '../features/productDraft/productDraftSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    productDraft: productDraftReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      customerApi.middleware 
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
