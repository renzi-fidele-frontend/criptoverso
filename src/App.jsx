import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";

import "./App.css";
import Home from "./pages/Home/Home";
import Criptomoedas from "./pages/Criptomoeadas/Criptomoedas";
import Movimentos from "./pages/Movimentos/Movimentos";
import Noticias from "./pages/Noticias/Noticias";
import { Provider } from "react-redux";
import store from "./state/store";

function App() {
   return (
      <>
         <BrowserRouter>
            <Provider store={store}>
               <div id="App" className="d-flex flex-row w-100">
                  <div className="">
                     <SideBar />
                  </div>
                  <div style={{ height: "100dvh", overflowY: "scroll" }} className="px-5 py-4 w-100">
                     <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route path="/criptomoedas" element={<Criptomoedas />} />
                        <Route path="/movimentos" element={<Movimentos />} />
                        <Route path="/noticias" element={<Noticias />} />
                     </Routes>
                  </div>
               </div>
            </Provider>
         </BrowserRouter>
      </>
   );
}

export default App;
