import styles from "./SideBar.module.css";
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from "cdbreact";

import { NavLink, useLocation } from "react-router-dom";

const SideBar = () => {
   const rota = useLocation().pathname;
   return (
      <div id={styles.ct} className="d-flex h-100 " style={{ overflow: "scroll initial" }}>
         <CDBSidebar textColor="#fff" className={styles.sidebar}>
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
                     <CDBSidebarMenuItem active={rota === "/criptomoedas"} icon="yen-sign">
                        Criptomoedas
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/movimentos">
                     <CDBSidebarMenuItem active={rota === "/movimentos"} icon="chart-line">
                        Movimentos
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/noticias">
                     <CDBSidebarMenuItem active={rota === "/noticias"} icon="newspaper">
                        Notícias
                     </CDBSidebarMenuItem>
                  </NavLink>
               </CDBSidebarMenu>
            </CDBSidebarContent>

            <CDBSidebarFooter style={{ textAlign: "center" }}>
               <div
                  style={{
                     padding: "20px 5px",
                  }}
               >
                  Sidebar Footer
               </div>
            </CDBSidebarFooter>
         </CDBSidebar>
      </div>
   );
};

export default SideBar;
