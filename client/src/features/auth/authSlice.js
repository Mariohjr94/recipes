// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../app/api';  // Assuming you have an api.js setup

const TOKEN = "token";

// Inject auth endpoints into the API
const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query({
      query: () => '/auth/me',
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me'],
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Me'],
    }),
    logout: builder.mutation({
      queryFn: () => ({ data: {} }),
      invalidatesTags: ['Me'],
    }),
  }),
});

// Define auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
  },
  reducers: {
    storeToken(state, action) {
      state.token = action.payload.token;
      window.sessionStorage.setItem(TOKEN, action.payload.token);
    },
    clearToken(state) {
      state.token = null;
      window.sessionStorage.removeItem(TOKEN);
    },
  },
});

// Export RTK Query hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useMeQuery,
  useLogoutMutation
} = authApi;

console.log({ authApi });  // Add this line in authSlice.js

export const { storeToken, clearToken } = authSlice.actions;
export default authSlice.reducer;

