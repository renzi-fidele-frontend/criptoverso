import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   // ---------- Criptomoedas --------------
   cryptoStats: null,
   criptomoedas: null,
   paginaAtualCriptomoedas: 1,
   itemsPorPaginaCriptomoedas: 12,
   totalPaginasCriptomoedas: Math.ceil(100 / 12),
   // ---------- Noticias--------------
   noticias: null,
   paginaAtualNoticias: 1,
   itemsPorPaginaNoticias: 6,
   totalPaginasNoticias: 0,
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
      setPaginaAtualCriptomoedas: (state, action) => {
         state.paginaAtualCriptomoedas = action.payload;
      },
      setItensPorPaginaCriptomoedas: (state, action) => {
         state.itemsPorPaginaCriptomoedas = action.payload;
      },
      setTotalPaginasCriptomoedas: (state, action) => {
         state.totalPaginasCriptomoedas = action.payload;
      },
      setNoticias: (state, action) => {
         state.noticias = action.payload;
      },
      setPaginaAtualNoticias: (state, action) => {
         state.paginaAtualNoticias = action.payload;
      },
      setTotalPaginasNoticias: (state, action) => {
         state.totalPaginasNoticias = action.payload;
      },
      setItensPorPaginaNoticias: (state, action) => {
         state.itemsPorPaginaNoticias = action.payload;
      },
   },
});

export const {
   setCryptoStats,
   setCriptomoedas,
   setPaginaAtualCriptomoedas,
   setItensPorPaginaCriptomoedas,
   setTotalPaginasCriptomoedas,
   setNoticias,
   setItensPorPaginaNoticias,
   setPaginaAtualNoticias,
   setTotalPaginasNoticias,
} = cryptoSlice.actions;
export default cryptoSlice.reducer;
