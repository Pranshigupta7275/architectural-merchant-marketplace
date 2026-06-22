// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Check for existing token in localStorage on app load
const initialState = {
  // CHANGED: 'user' to 'userInfo' to match your components
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
  // CHANGED: 'token' to 'accessToken' to match standard naming
  token: localStorage.getItem('accessToken') || null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      
      // Update State
      state.userInfo = user; 
      state.token = accessToken;
      
      // Persist to LocalStorage
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
    },
    
    // CHANGED: 'logOut' to 'logout' (lowercase 'o') so HeaderProfile.jsx doesn't crash
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      
      // Clear from LocalStorage
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

// Selectors for easy access in components
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectCurrentToken = (state) => state.auth.token;

export default authSlice.reducer;