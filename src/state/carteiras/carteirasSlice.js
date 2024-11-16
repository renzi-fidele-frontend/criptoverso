import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   carteiras: null,
   paginaAtual: 1,
   itemsPorPagina: 12,
   totalPaginas: 0,
   filtros: null,
   carteirasFiltradas: null,
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
      setFiltros: (state, action) => {
         state.filtros = action.payload;
      },
      setCarteirasFiltradas: (state, action) => {
         state.carteirasFiltradas = action.payload;
      },
   },
});

export const { setCarteiras, setItemsPorPagina, setPaginaAtual, setTotalPaginas, setFiltros, setCarteirasFiltradas } = carteiraSlice.actions;

export default carteiraSlice.reducer;
