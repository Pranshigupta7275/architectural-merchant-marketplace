// Change this line to reach the new folder
import { apiSlice } from "../features/api/apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // Mutation for Logging In
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login', 
        method: 'POST',
        body: credentials,
      }),
    }),

    // Mutation for Registering
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Mutation for Logging Out
    logoutApiCall: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

  }),
  
  // Prevents Vite Hot Module Reloading from throwing errors
  overrideExisting: true,
});

// Export the auto-generated hooks for your React components
export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutApiCallMutation 
} = usersApiSlice;