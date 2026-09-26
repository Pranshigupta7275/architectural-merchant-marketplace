import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../auth/authSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers, { getState }: any) => {
    const token = getState().auth?.token || localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefresh: any = async (args: any, api: any, extraOptions: any) => {
  const timeout = 10000;
  const timeoutPromise = new Promise((_, reject: any) => {
    setTimeout(() => {
      reject({
        error: {
          status: 'TIMEOUT',
          data: { success: false, message: 'Request timed out. Please check your connection.' },
        },
      });
    }, timeout);
  });

  try {
    let result: any = await Promise.race([rawBaseQuery(args, api, extraOptions), timeoutPromise]);

    if (result?.error?.status === 401) {
      const refreshResult: any = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult?.data?.success && refreshResult?.data?.accessToken) {
        api.dispatch(setCredentials({ accessToken: refreshResult.data.accessToken }));

        const retryHeaders = new Headers();
        const token = refreshResult.data.accessToken;
        retryHeaders.set('Authorization', `Bearer ${token}`);

        const retryArgs = {
          ...args,
          headers: retryHeaders,
        };

        result = await rawBaseQuery(retryArgs, api, extraOptions);
      }
    }

    return result;
  } catch (err) {
    return err;
  }
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [
    'Product',
    'Order',
    'Analytics',
    'User',
    'Cart',
    'Wishlist',
    'Customer',
  ] as const,
  endpoints: (builder) => ({
    createStripeIntent: builder.mutation({
      query: (totalAmount) => ({
        url: '/payments/stripe/create-intent',
        method: 'POST',
        body: { totalAmount },
      }),
    }),
    createRazorpayOrder: builder.mutation({
      query: (totalAmount) => ({
        url: '/payments/razorpay/create-order',
        method: 'POST',
        body: { totalAmount },
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: '/payments/razorpay/verify-payment',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateStripeIntentMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} = apiSlice;
