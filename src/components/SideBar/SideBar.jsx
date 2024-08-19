import styles from "./SideBar.module.css";
import { CDBSidebar, CDBSidebarContent, CDBSidebarFooter, CDBSidebarHeader, CDBSidebarMenu, CDBSidebarMenuItem } from "cdbreact";

import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setModoEscuro } from "../../state/tema/temaSlice";
import { FormSelect, Image } from "react-bootstrap";
import logo from "../../assets/logo1.png";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n/i18n";
import { setLang } from "../../state/idioma/idiomaSlice";

const SideBar = () => {
   const rota = useLocation().pathname;
   const dispatch = useDispatch();
   const { modoEscuro } = useSelector((state) => state.tema);

   const { t } = useTranslation();

   function mudarTema() {
      dispatch(setModoEscuro(!modoEscuro));
      let tema = !modoEscuro ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", tema);
   }

   i18n.on("languageChanged", (lng) => dispatch(setLang(lng)));
   function mudarIdioma(e) {
      i18n.changeLanguage(e.target.value);
   }

   return (
      <div id={styles.ct} className="d-none d-lg-flex" style={{ overflow: "scroll initial" }}>
         <CDBSidebar textColor="#fff" className={`${styles.sidebar} pb-4`}>
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
               <div className="d-flex align-items-center">
                  <Image id={styles.logo} src={logo} />
               </div>
            </CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
               <CDBSidebarMenu>
                  <NavLink to="/">
                     <CDBSidebarMenuItem active={rota === "/"} icon="home">
                        {t("sidebar.home")}
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/criptomoedas">
                     <CDBSidebarMenuItem active={rota === "/criptomoedas"} icon="bi bi-currency-exchange">
                        {t("sidebar.coins")}
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/corretoras">
                     <CDBSidebarMenuItem active={rota === "/corretoras"} icon="chart-line">
                        {t("sidebar.exchanges")}
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/carteiras">
                     <CDBSidebarMenuItem active={rota === "/carteiras"} icon="bi bi-wallet-fill">
                        {t("sidebar.wallets")}
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink to="/noticias">
                     <CDBSidebarMenuItem active={rota === "/noticias"} icon="newspaper">
                        {t("sidebar.news")}
                     </CDBSidebarMenuItem>
                  </NavLink>
                  <hr />
                  <div onClick={mudarTema}>
                     <CDBSidebarMenuItem icon={`bi ${!modoEscuro ? "bi-moon-stars-fill" : "bi-brightness-high-fill"}`}>
                        {t("sidebar.modes.name")} {modoEscuro ? t("sidebar.modes.light") : t("sidebar.modes.dark")}
                     </CDBSidebarMenuItem>
                  </div>
                  <div>
                     <CDBSidebarMenuItem>
                        <FormSelect className="border-0 bg-opacity-25 text-light bg-light" role="button" onChange={mudarIdioma}>
                           <option className="bg-opacity-100 text-dark" value="pt">
                              Português
                           </option>
                           <option className="bg-opacity-100 text-dark" value="en">
                              English
                           </option>
                        </FormSelect>
                     </CDBSidebarMenuItem>
                  </div>
               </CDBSidebarMenu>
            </CDBSidebarContent>

            <CDBSidebarFooter className="text-center">
               <CDBSidebarMenu>
                  <CDBSidebarMenuItem>
                     <div className="border-top pt-3 border-secondary">
                        <small>{t("sidebar.author")}:</small>
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
