import { configureStore } from "@reduxjs/toolkit";
import estatisticasGeraisReducer from "./estatisticasGerais/estatisticasGeraisSlice";
import noticiasReducer from "./noticias/noticiasSlice";
import criptomoedasReducer from "./criptomoedas/criptomoedasSlice";
import corretorasReducer from "./corretoras/corretorasSlice";

export default configureStore({
   reducer: {
      estatisticasGerais: estatisticasGeraisReducer,
      noticias: noticiasReducer,
      criptomoedas: criptomoedasReducer,
      corretoras: corretorasReducer,
   },
});
