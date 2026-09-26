import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: fetchBaseQuery({
    
    baseUrl: '/api/v1', 
    prepareHeaders: (headers, { getState }) => {
      
      const token = 
        getState().customerAuth?.token || 
        getState().auth?.token || 
        localStorage.getItem('accessToken') || 
        localStorage.getItem('token');

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product', 'Profile', 'Order', 'Customer'],

  endpoints: (builder) => ({
    
    // --- PUBLIC CATALOG ENDPOINTS ---
    getStorefrontProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: (result) => {
        const productsArray = Array.isArray(result) ? result : result?.products || result?.data || [];
        return [
          ...productsArray.map(({ _id, id }) => ({ type: 'Product', id: _id || id })),
          { type: 'Product', id: 'LIST' },
        ];
      },
    }),

    getStorefrontProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    getProductReviews: builder.query({
      query: (productId) => `/reviews/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    createProductReview: builder.mutation({
      query: (data) => ({
        url: `/reviews/${data.productId}`,
        method: 'POST',
        body: { rating: data.rating, comment: data.comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // --- PRIVATE CUSTOMER ENDPOINTS ---
    getCustomerProfile: builder.query({
      query: () => '/customers/profile',
      providesTags: ['Profile'],
    }),

    updateCustomerProfile: builder.mutation({
      query: (profileData) => ({
        url: '/customers/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    getCustomerOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: (result) => {
        const ordersArray = Array.isArray(result) ? result : result?.orders || result?.data || [];
        return [
          ...ordersArray.map(({ _id, id }) => ({ type: 'Order', id: _id || id })),
          { type: 'Order', id: 'LIST' },
        ];
      },
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    // --- ADMIN CUSTOMER DIRECTORY ENDPOINT ---
    getCustomers: builder.query({
      query: () => '/customers', // Resolves to /api/v1/customers
      providesTags: ['Customer'],
    }),

  }),
});

export const {
  useGetStorefrontProductsQuery,
  useGetStorefrontProductByIdQuery,
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useGetCustomerOrdersQuery,
  useCreateOrderMutation,
  useGetCustomersQuery,
} = customerApi;
