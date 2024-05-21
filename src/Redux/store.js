import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"
import storage from 'redux-persist/lib/storage';
import {persistReducer} from "redux-persist"
import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cart-slice";
import filterReduer from "./filter-slice";

const persistConfig = {
    key: 'root',
    storage
}

const reducer = combineReducers({
    authReducer,
    cart:cartReducer,
    filter:filterReduer
})

const persistedReducer = persistReducer(persistConfig,reducer)

export const store = configureStore({
    //Reducer is a function that takes an action and updates the previous state 
    reducer: persistedReducer
})