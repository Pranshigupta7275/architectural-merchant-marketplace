// src/services/apiSlice.js

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: "https://architectural-merchant-api.onrender.com/api",

  prepareHeaders: (headers, { getState }) => {
    // 1. Get token from Redux state
    let token = getState().auth?.token;

    // 2. Fallback to localStorage after refresh
    if (!token) {
      token = localStorage.getItem("accessToken");
    }

    // 3. Attach Authorization header
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});


export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery,

  tagTypes: [
    "Product",
    "Order",
    "Analytics",
    "User",
    "Cart",
    "Wishlist"
  ],

  endpoints: () => ({}),
});