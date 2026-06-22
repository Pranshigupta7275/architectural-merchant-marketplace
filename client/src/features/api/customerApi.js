import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  // Ensure this points to your Express backend
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), 
  endpoints: (builder) => ({
    
    // 1. Existing endpoint
    getCustomers: builder.query({ 
      query: () => '/customers',
    }),

    // 2. Existing products endpoint with dynamic filtering
    getProducts: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        if (params?.category) queryParams.append("category", params.category);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.minPrice) queryParams.append("minPrice", params.minPrice);
        if (params?.maxPrice) queryParams.append("maxPrice", params.maxPrice);
        if (params?.sort) queryParams.append("sort", params.sort);

        return `/products?${queryParams.toString()}`;
      },
    }),

    // ✅ 3. NEW: Fetch a single product by its ID
    getStorefrontProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),

  }),
});

// ✅ EXPORT ALL HOOKS
export const { 
  useGetCustomersQuery, 
  useGetProductsQuery,
  useGetStorefrontProductByIdQuery // Now exported correctly!
} = customerApi;