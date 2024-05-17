import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    isAuth:false,
    user:{
        phoneNumber:null,
        photoURL:"",
        uid:"",
        displayName:"",
        email:"",
        emailVerified:""
    },
}

export const auth = createSlice({
    name:"auth",
    initialState,
    reducers:{
        logOut:()=>{
            return initialState
        },
        logIn:(state,action)=>{
            state.isAuth = true;
            state.user.phoneNumber = action.payload.phoneNumber;
            state.user.photoURL = action.payload.photoURL;
            state.user.uid = action.payload.uid;
            state.user.displayName = action.payload.dispalyName;
            state.user.email = action.payload.email;
            state.user.emailVerified = action.payload.emailVerified;
        }
    }
})

export const {logIn,logOut} = auth.actions;
export default auth.reducer;