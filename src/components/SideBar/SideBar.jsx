import styles from "./SideBar.module.css";
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from "cdbreact";
import { Dropdown, Image } from "react-bootstrap";
import fotoUser from "../../assets/fotoUser.jpg";

import { NavLink, useLocation } from "react-router-dom";

const SideBar = () => {
   const rota = useLocation().pathname;
   return (
      <div id={styles.ct} className="d-none d-lg-flex" style={{ overflow: "scroll initial" }}>
         <CDBSidebar textColor="#fff" className={`${styles.sidebar} pb-4`}>
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
               <a href="/" className="text-decoration-none" style={{ color: "inherit" }}>
                  Criptoverso
               </a>
            </CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
               <CDBSidebarMenu >
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
               </CDBSidebarMenu>
            </CDBSidebarContent>

            <CDBSidebarFooter className="text-center">
               <Dropdown drop="up-centered">
                  <Dropdown.Toggle className="rounded-circle" id={styles.tg} variant="light">
                     <Image id={styles.fotoUser} className="object-fit-cover rounded-circle" src={fotoUser} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="border border-black">
                     <Dropdown.Item>Editar Perfil</Dropdown.Item>
                  </Dropdown.Menu>
               </Dropdown>
            </CDBSidebarFooter>
         </CDBSidebar>
      </div>
   );
};

export default SideBar;
