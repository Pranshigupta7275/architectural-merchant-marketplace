import { createSlice } from "@reduxjs/toolkit";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  userInfo: UserInfo | null;
  token: string | null;
}

const getStoredUser = (): UserInfo | null => {
  try {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid stored user:", error);

    localStorage.removeItem("userInfo");

    return null;
  }
};

const initialState: AuthState = {
  userInfo: getStoredUser(),
  token: localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const {
        user,
        accessToken,
      } = action.payload;

      state.userInfo = user;
      state.token = accessToken;

      localStorage.setItem(
        "userInfo",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "accessToken",
        accessToken
      );
    },

    logout: (state) => {
      state.userInfo = null;
      state.token = null;

      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
    },
  },
});

export const {
  setCredentials,
  logout,
} = authSlice.actions;

export const selectCurrentUser = (
  state: { auth: AuthState }
) => state.auth.userInfo;

export const selectCurrentToken = (
  state: { auth: AuthState }
) => state.auth.token;

export default authSlice.reducer;