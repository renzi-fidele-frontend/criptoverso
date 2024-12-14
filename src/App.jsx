import { BrowserRouter, Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import "./App.css";
import Noticias from "./pages/Noticias/Noticias";
import Home from "./pages/Home/Home";
import Criptomoedas from "./pages/Criptomoeadas/Criptomoedas";
import Corretoras from "./pages/Corretoras/Corretoras";
import { Provider } from "react-redux";
import store from "./state/store";
import MoedaIndividual from "./pages/MoedaIndividual/MoedaIndividual";
import NavBarMobile from "./components/NavBarMobile/NavBarMobile";
import FooterNavBar from "./components/FooterNavBar/FooterNavBar";
import Carteiras from "./pages/Carteiras/Carteiras";
import { Suspense } from "react";
import PreLoader from "./components/PreLoader/PreLoader";
import ScrollTop from "./components/ScrollTop/ScrollTop";

function App() {
   return (
      <>
         <BrowserRouter>
            <Provider store={store}>
               <Suspense fallback={<PreLoader />}>
                  <div id="App" className="d-flex flex-column flex-lg-row w-100">
                     <div>
                        {/*  No Desktop */}
                        <SideBar />

                        {/*  No Mobile */}
                        <NavBarMobile />
                     </div>
                     <div id="corpo" className="px-2 px-sm-4 px-md-5 py-4 w-100">
                        <ScrollTop>
                           <Routes>
                              <Route exact path="/" element={<Home />} />
                              <Route path="/criptomoedas" element={<Criptomoedas />} />
                              <Route path="/criptomoeda/:uuid" element={<MoedaIndividual />} />
                              <Route path="/corretoras" element={<Corretoras />} />
                              <Route path="/noticias" element={<Noticias />} />
                              <Route path="/carteiras" element={<Carteiras />} />
                           </Routes>
                        </ScrollTop>
                     </div>
                  </div>
                  {/*   No mobile */}
                  <FooterNavBar />
               </Suspense>
            </Provider>
         </BrowserRouter>
      </>
   );
}

export default App;
