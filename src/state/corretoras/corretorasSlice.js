import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   corretoras: null,
   paginaAtual: 1,
   itemsPorPagina: 12,
   totalPaginas: 0,
   filtros: null,
   corretorasFiltradas: null,
};

const corretorasSlice = createSlice({
   name: "corretoras",
   initialState,
   reducers: {
      setCorretoras: (state, action) => {
         state.corretoras = action.payload;
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
      setCorretorasFiltradas: (state, action) => {
         state.corretorasFiltradas = action.payload;
      },
   },
});

export const { setCorretoras, setItemsPorPagina, setPaginaAtual, setTotalPaginas, setFiltros, setCorretorasFiltradas } = corretorasSlice.actions;

export default corretorasSlice.reducer;
