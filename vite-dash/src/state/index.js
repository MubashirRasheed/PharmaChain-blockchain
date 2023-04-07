/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  chatID: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      // state.user = null;
      state.token = null;
    },
    setChatID: (state, action) => {
      state.chatID = action.payload;
    },
    setUpdateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLogin, setLogout, setChatID, setUpdateUser } = authSlice.actions;

export default authSlice.reducer;
