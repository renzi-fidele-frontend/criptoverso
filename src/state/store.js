import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "./crypto/cryptoSlice";

export default configureStore({
   reducer: { crypto: cryptoReducer },
});