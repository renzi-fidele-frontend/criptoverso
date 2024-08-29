import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   // ---------- Criptomoedas --------------
   criptomoedas: null,
   paginaAtualCriptomoedas: 1,
   itemsPorPaginaCriptomoedas: 12,
   totalPaginasCriptomoedas: 0,
};

const criptomoedasSlice = createSlice({
   name: "criptomoedas",
   initialState,
   reducers: {
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
   },
});

export const { setCriptomoedas, setPaginaAtualCriptomoedas, setItensPorPaginaCriptomoedas, setTotalPaginasCriptomoedas } =
   criptomoedasSlice.actions;

export default criptomoedasSlice.reducer;
