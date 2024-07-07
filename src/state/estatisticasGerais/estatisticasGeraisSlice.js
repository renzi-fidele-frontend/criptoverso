import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   estatisticasGerais: null,
};

const estatisticasGeraisSlice = createSlice({
   name: "estatisticasGerais",
   initialState,
   reducers: {
      setEstatisticasGerais: (state, action) => {
         state.estatisticasGerais = action.payload;
      },
   },
});

export const { setEstatisticasGerais } = estatisticasGeraisSlice.actions;
export default estatisticasGeraisSlice.reducer;
