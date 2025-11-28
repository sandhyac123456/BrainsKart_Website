import { createSlice } from "@reduxjs/toolkit";

const getUserKey = (email, key) => {
  if (!email) return null;
  return `user_${email}_${key}`;
};

const LAST_USER_EMAIL_KEY = "lastLoggedInUserEmail";

const lastUserEmail = localStorage.getItem(LAST_USER_EMAIL_KEY);
const initialUser = lastUserEmail
  ? JSON.parse(localStorage.getItem(getUserKey(lastUserEmail, "data")))
  : null;

const initialCartCount = lastUserEmail
  ? Number(localStorage.getItem(getUserKey(lastUserEmail, "cartCount"))) || 0
  : 0;

const initialState = {
  user: initialUser,
  cartCount: initialCartCount,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const userData = { ...action.payload, isLoggedIn: true };
      state.user = userData;
      state.cartCount = state.cartCount || 0;

      localStorage.setItem(getUserKey(userData.email, "data"), JSON.stringify(userData));
      localStorage.setItem(getUserKey(userData.email, "cartCount"), state.cartCount);

      localStorage.setItem(LAST_USER_EMAIL_KEY, userData.email);
    },

    logout(state) {
      if (state.user && state.user.email) {
        localStorage.removeItem(getUserKey(state.user.email, "data"));
        localStorage.removeItem(getUserKey(state.user.email, "cartCount"));
        localStorage.removeItem(LAST_USER_EMAIL_KEY);
      }
      state.user = null;
      state.cartCount = 0;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;