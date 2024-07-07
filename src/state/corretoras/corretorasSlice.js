import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   corretoras: null,
};

const corretorasSlice = createSlice({
   name: "corretoras",
   initialState,
   reducers: {
      setCorretoras: (state, action) => {
         state.corretoras = action.payload;
      },
   },
});

export const { setCorretoras } = corretorasSlice.actions;

export default corretorasSlice.reducer;
