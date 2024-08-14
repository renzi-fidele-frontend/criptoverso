import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   carteiras: null,
   paginaAtual: 1,
   itemsPorPagina: 12,
   totalPaginas: 0,
};

const carteiraSlice = createSlice({
   name: "carteiras",
   initialState,
   reducers: {
      setCarteiras: (state, action) => {
         state.carteiras = action.payload;
      },
      setPaginaAtual: (state, action) => {
         state.paginaAtual = action.payload;
      },
      setItemsPorPagina: (state, action) => {
         state.itemsPorPagina = action.payload;
      },
      setTotalPaginas: (state, action) => {
         state.totalPaginas = action.payload;
      },
   },
});

export const { setCarteiras, setItemsPorPagina, setPaginaAtual, setTotalPaginas } = carteiraSlice.actions;

export default carteiraSlice.reducer;
