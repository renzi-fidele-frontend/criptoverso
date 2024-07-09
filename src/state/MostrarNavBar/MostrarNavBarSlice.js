import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   mostrar: true,
};

const MostrarNavBarSlice = createSlice({
   name: "mostrarNavNar",
   initialState,
   reducers: {
      setMostrar: (state, action) => {
         state.mostrar = action.payload;
      },
   },
});

export const { setMostrar } = MostrarNavBarSlice.actions;

export default MostrarNavBarSlice.reducer;
