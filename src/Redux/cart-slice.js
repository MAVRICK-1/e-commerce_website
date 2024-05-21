import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore";

const initialState = {
  items: [],
  isAdding: false,
  isRemoving: false,
};

export const checkIsItemInCart = (state, itemId) => {
  if (!state.cart || !state.cart.items) {
    return false; // Return false if cart or items is undefined
  }
  return state.cart.items.some((item) => item.id === itemId);
};

export const getAddToCart = createAsyncThunk(
  "cart/add",
  async ({ item, uid }) => {
    try {
      const cartRef = doc(db, "carts", uid);
      const productRef = doc(cartRef, "products", `${item.id}`);
      await setDoc(productRef, { ...item, quantity: 1 });
      return item;
    } catch (e) {
      console.log(e);
    }
  }
);

export const getDeleteCartItem = createAsyncThunk(
  "cart/delete",
  async ({ itemId, uid }) => {
    try {
      const cartItemRef = doc(db, "carts", uid, "products", itemId);
      await deleteDoc(cartItemRef);
      return itemId;
    } catch (e) {
      console.log(e);
    }
  }
);

export const getDeleteAllCartItem = createAsyncThunk(
  "cart/deleteAll",
  async ({ uid },fetchCartProducts) => {
    console.log(uid)
    try {
      const productsCollectionRef = collection(db, "carts", uid, "products");
      const querySnapshot = await getDocs(productsCollectionRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload.item);
      state.total += action.payload.price;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id != action.payload.id);
      console.log(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAddToCart.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.isAdding = false;
      })
      .addCase(getAddToCart.pending, (state, action) => {
        state.isAdding = true;
      })
      .addCase(getAddToCart.rejected, (state, action) => {
        console.log("rejected");
      })
      .addCase(getDeleteCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id != action.payload);
        console.log(state.items);
        state.isRemoving = false;
      })
      .addCase(getDeleteCartItem.pending, (state) => {
        state.isRemoving = true;
      })
      .addCase(getDeleteCartItem.rejected, (state, action) => {
        console.log("rejected", action.payload);
        state.isRemoving = false;
      })

      .addCase(getDeleteAllCartItem.fulfilled, (state, action) => {
        state.items = []
        state.isRemoving = false;
      })
      .addCase(getDeleteAllCartItem.pending, (state) => {
        state.isRemoving = true;
      })
      .addCase(getDeleteAllCartItem.rejected, (state, action) => {
        console.log("rejected", action.payload);
        state.isRemoving = false;
      });
  },
});

export const { addToCart, clearCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
