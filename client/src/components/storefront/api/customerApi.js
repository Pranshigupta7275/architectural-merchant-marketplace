import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * CUSTOMER STOREFRONT API SLICE
 * ------------------------------------------------------------------
 * This API slice is strictly isolated from the Merchant Admin panel.
 * It handles all public catalog fetching and private customer actions.
 */
export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // Adjust this if your customer routes have a specific prefix like '/api/storefront'
    prepareHeaders: (headers, { getState }) => {
      // Access the isolated customer authentication token
      // This assumes your customerAuthSlice stores the token under state.customerAuth.token
      const token = getState().customerAuth?.token;
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Tags for automated caching and re-fetching
  tagTypes: ['Product', 'Profile', 'Order'],
  
  endpoints: (builder) => ({
    
    /* =========================================
       1. PUBLIC CATALOG ENDPOINTS (Phase 2)
       ========================================= */
    
    // Fetch all active products for the storefront
    // Supports querying: ?category=hardware&sort=newest&limit=12
    getStorefrontProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params, // Passes query parameters directly to the URL
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Fetch a single product by its ID for the Product Details page
    getStorefrontProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    /* =========================================
       2. PRIVATE CUSTOMER ENDPOINTS (Phase 4 & 5)
       ========================================= */

    // Fetch the logged-in customer's profile
    getCustomerProfile: builder.query({
      query: () => '/customers/profile',
      providesTags: ['Profile'],
    }),

    // Update the customer's profile (name, addresses, etc.)
    updateCustomerProfile: builder.mutation({
      query: (profileData) => ({
        url: '/customers/profile',
        method: 'PUT',
        body: profileData,
      }),
      // Invalidates the profile cache to instantly update the UI
      invalidatesTags: ['Profile'], 
    }),

    // Fetch the customer's order history
    getCustomerOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Order', id: _id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // Submit a new order from the checkout process
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      // Invalidates the order list so the new order shows up immediately in the history
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    
  }),
});

// Export hooks for usage in functional components
export const {
  useGetStorefrontProductsQuery,
  useGetStorefrontProductByIdQuery,
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useGetCustomerOrdersQuery,
  useCreateOrderMutation,
} = customerApi;