import styles from "./SideBar.module.css";
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from "cdbreact";

import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setModoEscuro } from "../../state/tema/temaSlice";

const SideBar = () => {
   const rota = useLocation().pathname;
   const dispatch = useDispatch();
   const { modoEscuro } = useSelector((state) => state.tema);

   return (
      <div id={styles.ct} className="d-none d-lg-flex" style={{ overflow: "scroll initial" }}>
         <CDBSidebar textColor="#fff" className={`${styles.sidebar} pb-4`}>
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
               <a href="/" className="text-decoration-none" style={{ color: "inherit" }}>
                  Criptoverso
               </a>
            </CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
               <CDBSidebarMenu>
                  <NavLink to="/">
                     <CDBSidebarMenuItem active={rota === "/"} icon="home">
                        Início
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/criptomoedas">
                     <CDBSidebarMenuItem active={rota === "/criptomoedas"} icon="bi bi-currency-exchange">
                        Criptomoedas
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/corretoras">
                     <CDBSidebarMenuItem active={rota === "/corretoras"} icon="chart-line">
                        Corretoras
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/noticias">
                     <CDBSidebarMenuItem active={rota === "/noticias"} icon="newspaper">
                        Notícias
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <hr />
                  <CDBSidebarMenuItem icon={"bi bi-brightness-high-fill"}>
                     <span
                        onClick={() => {
                           dispatch(setModoEscuro(!modoEscuro));
                        }}
                     >
                        Modo {"escuro"}
                     </span>{" "}
                  </CDBSidebarMenuItem>
               </CDBSidebarMenu>
            </CDBSidebarContent>

            <CDBSidebarFooter className="text-center">
               <CDBSidebarMenu>
                  <CDBSidebarMenuItem>
                     <div className="border-top pt-3 border-secondary">
                        <small>Criado por:</small>
                        <br />
                        <a target="_blank" href="https://portfolio-renzi.vercel.app/">
                           <b>Renzi Fidele</b>
                        </a>
                     </div>
                  </CDBSidebarMenuItem>
               </CDBSidebarMenu>
            </CDBSidebarFooter>
         </CDBSidebar>
      </div>
   );
};

export default SideBar;
