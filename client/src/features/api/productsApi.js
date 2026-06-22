// src/features/api/productApi.js

import { apiSlice } from './apiSlice';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/products?page=1&limit=10&keyword=chair
    getProducts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        keyword = '',
      } = {}) => ({
        url: '/products',
        params: {
          page,
          limit,
          keyword,
        },
      }),
      providesTags: ['Product'],
    }),

    // GET /api/products/:id
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [
        { type: 'Product', id },
      ],
    }),

    // POST /api/products
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),

    // PUT /api/products/:id
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
      ],
    }),

    // DELETE /api/products/:id
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

  }),

  // Prevent duplicate endpoint registration during HMR
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;