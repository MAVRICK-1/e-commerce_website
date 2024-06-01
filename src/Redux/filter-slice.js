import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  windowWidth:window.innerWidth,
  openFilters:false,
  openNavigation:false
};

export const filter = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setOpenFilters: (state,action) => {
        state.openFilters = (!state.openFilters);
    },
    setOpenNavigation: (state,action) => {
        state.openNavigation = action.payload;
    }
  },
});

export const {setOpenFilters,setOpenNavigation} = filter.actions;
export default filter.reducer;