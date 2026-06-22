// src/services/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

baseQuery: fetchBaseQuery({
    baseUrl: "https://architectural-merchant-api.onrender.com/api",
}),
  
  prepareHeaders: (headers, { getState }) => {
    // 1. Try to grab the token from Redux state first
    let token = getState().auth?.token;
    
    // 2. FALLBACK: If Redux state is empty (e.g., user just refreshed the page),
    // grab it directly from localStorage to prevent sudden 401 Unauthorized errors.
    if (!token) {
      token = localStorage.getItem('accessToken');
    }
    
    // 3. Attach the secure token using standard Capitalization
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  // Added 'User' to the array for complete cache control
  tagTypes: ['Product', 'Order', 'Analytics', 'User'], 
  
  // Endpoints remain empty here. We use apiSlice.injectEndpoints() in other files.
  endpoints: () => ({}),
});