import { createSlice } from "@reduxjs/toolkit";

const initialState = { lang: "pt" };

const idiomaSlice = createSlice({
   name: "idioma",
   initialState,
   reducers: {
      setLang: (state, action) => {
         state.lang = action.payload;
      },
   },
});

export const { setLang } = idiomaSlice.actions;
export default idiomaSlice.reducer;
