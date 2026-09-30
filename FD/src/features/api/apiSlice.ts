import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";

import { setCredentials, logout } from "../auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
  /*
   * Production: VITE_API_URL points at the BD web service
   * (https://architectural-merchant-api.onrender.com/api/v1).
   * Local development: VITE_API_URL is unset, so the relative "/api/v1"
   * is used and Vite's dev server proxy forwards it to localhost:5000.
   */
  baseUrl: import.meta.env.VITE_API_URL || "/api/v1",

  // IMPORTANT:
  // Allows the browser to send the httpOnly refreshToken cookie.
  credentials: "include",

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as {
      auth?: {
        token?: string | null;
      };
    };

    const token =
      state.auth?.token ||
      localStorage.getItem("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Accept", "application/json");

    return headers;
  },
});

const baseQueryWithRefresh = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await rawBaseQuery(
    args,
    api,
    extraOptions
  );

  /*
   * If access token expired:
   *
   * 1. Call /auth/refresh.
   * 2. Browser sends refreshToken cookie.
   * 3. Backend returns new accessToken.
   * 4. Save new token.
   * 5. Retry original request.
   */
  if (result?.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (
      refreshResult?.data &&
      typeof refreshResult.data === "object" &&
      "accessToken" in refreshResult.data
    ) {
      const refreshData = refreshResult.data as {
        accessToken: string;
      };

      const currentUser = (
        api.getState() as {
          auth?: {
            userInfo?: {
              _id: string;
              name: string;
              email: string;
              role: string;
            } | null;
          };
        }
      ).auth?.userInfo;

      if (currentUser) {
        api.dispatch(
          setCredentials({
            user: currentUser,
            accessToken: refreshData.accessToken,
          })
        );
      }

      /*
       * Retry original request with the new access token.
       */
      result = await rawBaseQuery(
        args,
        api,
        extraOptions
      );
    } else {
      /*
       * Refresh failed.
       * Clear local authentication.
       */
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithRefresh,

  tagTypes: [
    "Product",
    "Order",
    "Analytics",
    "User",
    "Cart",
    "Wishlist",
    "Customer",
  ],

  endpoints: (builder) => ({
    createStripeIntent: builder.mutation({
      query: (totalAmount) => ({
        url: "/payments/stripe/create-intent",
        method: "POST",
        body: {
          totalAmount,
        },
      }),
    }),

    createRazorpayOrder: builder.mutation({
      query: (totalAmount) => ({
        url: "/payments/razorpay/create-order",
        method: "POST",
        body: {
          totalAmount,
        },
      }),
    }),

    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: "/payments/razorpay/verify-payment",
        method: "POST",
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