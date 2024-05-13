import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    total: 0
};


export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.items.push(action.payload.item);
            state.total += action.payload.price;
        },
        removeFromCart: (state, action) => {
            const removedItem = state.items.find(item => item.id === action.payload.id);
            state.items = state.items.filter(item => item.id !== action.payload.id);
            state.total -= removedItem.price;
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    }
});

export const {addToCart,clearCart,removeFromCart} = cartSlice.actions;
export default cartSlice.reducer;