import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {
    isAuth: false,
    email: ''
  }
};

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },
    logIn: (state, action) => {
      return {
        value: {
          isAuth: true,
          email: action.payload.email
        }
      };
    }
  }
});

export const { logIn, logOut } = auth.actions;
export default auth.reducer;
