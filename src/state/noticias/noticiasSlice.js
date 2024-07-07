import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   // ---------- Noticias--------------
   noticias: null,
   paginaAtualNoticias: 1,
   itemsPorPaginaNoticias: 6,
   totalPaginasNoticias: 0,
};

const noticiasSlice = createSlice({
   name: "noticias",
   initialState,
   reducers: {
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

export const { setNoticias, setItensPorPaginaNoticias, setPaginaAtualNoticias, setTotalPaginasNoticias } = noticiasSlice.actions;
export default noticiasSlice.reducer;
