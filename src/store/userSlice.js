// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userName: "",
  email: "",
  role: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userName, email, role } = action.payload;
      state.userName = userName;
      state.email = email;
      state.role = role;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.userName = "";
      state.email = "";
      state.role = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
