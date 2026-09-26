import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  userInfo: { _id: string; name: string; email: string; role: string } | null;
  token: string | null;
}

const initialState: AuthState = {
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  token: localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.userInfo = user;
      state.token = accessToken;
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('accessToken', accessToken);
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.userInfo;
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;
