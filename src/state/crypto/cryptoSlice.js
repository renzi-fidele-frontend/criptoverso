import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   cryptoStats: null,
   criptomoedas: null,
};

const cryptoSlice = createSlice({
   name: "crypto",
   initialState,
   reducers: {
      setCryptoStats: (state, action) => {
         state.cryptoStats = action.payload;
      },
      setCriptomoedas: (state, action) => {
         state.criptomoedas = action.payload;
      },
   },
});

export const { setCryptoStats, setCriptomoedas } = cryptoSlice.actions;
export default cryptoSlice.reducer;
