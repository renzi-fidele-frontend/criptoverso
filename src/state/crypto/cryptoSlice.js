import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   cryptoData: null,
};

const cryptoSlice = createSlice({
   name: "crypto",
   initialState,
   reducers: {
      setCryptoData: (state, action) => {
         state.cryptoData = action.payload;
      },
   },
});

export const { setCryptoData } = cryptoSlice.actions;
export default cryptoSlice.reducer;
