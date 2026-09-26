import { apiSlice } from '../features/api/apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: (result: any) =>
        result?.data
          ? [
              ...result.data.map(({ _id }: { _id: string }) => ({ type: 'Order' as const, id: _id })),
              { type: 'Order' as const, id: 'LIST' },
            ]
          : [{ type: 'Order' as const, id: 'LIST' }],
    }),

    getOrderById: builder.query({
      query: (id: string) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Order' as const, id },
      ],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
} = ordersApiSlice;