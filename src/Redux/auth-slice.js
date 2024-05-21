import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  phoneNumber: null,
  photoURL: "",
  uid: "",
  displayName: "",
  email: "",
  emailVerified: "",
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state, action) => {
      state.isAuth = true;
      state.phoneNumber = action.payload.phoneNumber;
      state.photoURL = action.payload.photoURL;
      state.uid = action.payload.uid;
      state.displayName = action.payload.dispalyName;
      state.email = action.payload.email;
      state.emailVerified = action.payload.emailVerified;
    },
  },
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
