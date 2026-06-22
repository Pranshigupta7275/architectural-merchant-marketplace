// src/services/productsApiSlice.js
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // --- PRODUCT MANAGEMENT ---
    getProducts: builder.query({
      query: (params) => ({ url: '/products', params }),
      providesTags: (result) => 
        result?.products 
          ? [...result.products.map(({ _id }) => ({ type: 'Product', id: _id })), { type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // --- IMAGE UPLOADS ---
    // Added this critical mutation to talk to your Multer backend
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/upload', // apiSlice already prefixes with /api
        method: 'POST',
        body: data,     // We will pass the raw FormData object here directly from the React component
      }),
    }),

    // --- MUTATIONS (CREATE, UPDATE, DELETE) ---
    createProduct: builder.mutation({
      query: (productData) => ({ url: '/products', method: 'POST', body: productData }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, 'Analytics'],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id }, 
        { type: 'Product', id: 'LIST' },
        'Analytics'
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, 'Analytics'],
    }),

    // --- ANALYTICS & INSIGHTS ---
    getAnalytics: builder.query({
      query: (period = '30days') => ({
        url: `/analytics/stats?period=${period}`,
      }),
      providesTags: ['Product', 'Analytics'],
    }),

    getRecentTransactions: builder.query({
      query: () => '/analytics/recent-transactions',
      providesTags: ['Product'],
    }),
  }),
  
  overrideExisting: true, 
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useUploadProductImageMutation, 
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAnalyticsQuery,
  useGetRecentTransactionsQuery,
} = productsApiSlice;