import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Collapse from "react-bootstrap/Collapse";
import { Link, useLocation } from "react-router-dom";
import styles from "./FooterNavBar.module.css";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const FooterNavBar = () => {
   const loc = useLocation();
   const { mostrar } = useSelector((state) => state.mostrarNavBar);
   const { t } = useTranslation();

   return (
      <Collapse in={mostrar}>
         <div style={{ zIndex: 100 }} className={`w-100 "d-flex" d-lg-none position-fixed bottom-0 start-0 end-0`}>
            <ButtonGroup className="w-100">
               <Button
                  to="/"
                  preventScrollReset={false}
                  active={loc.pathname === "/"}
                  style={{ width: "20%" }}
                  className="rounded-0 d-flex flex-column"
                  as={Link}
               >
                  <i className="bi bi-house-heart-fill fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>{t("sidebar.home")}</span>
               </Button>
               <Button
                  to="/criptomoedas"
                  preventScrollReset={false}
                  active={loc.pathname === "/criptomoedas"}
                  style={{ width: "20%" }}
                  className="rounded-0 d-flex flex-column"
                  as={Link}
               >
                  <i className="bi-currency-exchange fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>{t("sidebar.coins")}</span>
               </Button>
               <Button
                  to="/corretoras"
                  preventScrollReset={false}
                  active={loc.pathname === "/corretoras"}
                  style={{ width: "20%" }}
                  className="rounded-0 d-flex flex-column"
                  as={Link}
               >
                  <i className="bi bi-graph-up-arrow fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>{t("sidebar.exchanges")}</span>
               </Button>
               <Button
                  to="/carteiras"
                  preventScrollReset={false}
                  active={loc.pathname === "/carteiras"}
                  style={{ width: "20%" }}
                  className="rounded-0 d-flex flex-column"
                  as={Link}
               >
                  <i className="bi bi-wallet-fill fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>{t("sidebar.wallets")}</span>
               </Button>
               <Button
                  to="/noticias"
                  preventScrollReset={false}
                  active={loc.pathname === "/noticias"}
                  style={{ width: "20%" }}
                  className="rounded-0 d-flex flex-column"
                  as={Link}
               >
                  <i className="bi bi-newspaper fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>{t("sidebar.news")}</span>
               </Button>
            </ButtonGroup>
         </div>
      </Collapse>
   );
};

export default FooterNavBar;
