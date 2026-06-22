import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('storefront_user') ? JSON.parse(localStorage.getItem('storefront_user')) : null,
  token: localStorage.getItem('storefront_token') ? localStorage.getItem('storefront_token') : null,
};

const customerAuthSlice = createSlice({
  name: 'customerAuth',
  initialState,
  reducers: {
    setCustomerCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      localStorage.setItem('storefront_user', JSON.stringify(user));
      localStorage.setItem('storefront_token', accessToken);
    },
    logoutCustomer: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('storefront_user');
      localStorage.removeItem('storefront_token');
    },
  },
});

export const { setCustomerCredentials, logoutCustomer } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;