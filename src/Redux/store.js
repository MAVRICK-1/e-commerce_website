import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"

export const store = configureStore({
    //Reducer is a function that takes an action and updates the previous state 
    reducer: {
        authReducer
    }
})
  
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    //Reducer is a function that takes an action and updates the previous state 
    reducer: {
        
    }
})
  