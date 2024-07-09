import { configureStore } from "@reduxjs/toolkit";
import estatisticasGeraisReducer from "./estatisticasGerais/estatisticasGeraisSlice";
import noticiasReducer from "./noticias/noticiasSlice";
import criptomoedasReducer from "./criptomoedas/criptomoedasSlice";
import corretorasReducer from "./corretoras/corretorasSlice";
import MostrarNavBarReducer from "./MostrarNavBar/MostrarNavBarSlice";

export default configureStore({
   reducer: {
      estatisticasGerais: estatisticasGeraisReducer,
      noticias: noticiasReducer,
      criptomoedas: criptomoedasReducer,
      corretoras: corretorasReducer,
      mostrarNavBar: MostrarNavBarReducer,
   },
});
