import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   cryptoStats: null,
   criptomoedas: null,
   paginaAtual: 1,
   tamanhoPagina: 12,
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
      setPaginaAtual: (state, action) => {
         state.paginaAtual = action.payload;
      },
      setTamanhoPagina: (state, action) => {
         state.tamanhoPagina = action.payload;
      },
   },
});

export const { setCryptoStats, setCriptomoedas, setPaginaAtual, setTamanhoPagina } = cryptoSlice.actions;
export default cryptoSlice.reducer;
