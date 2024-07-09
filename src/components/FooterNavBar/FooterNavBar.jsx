import { Button, ButtonGroup, Collapse } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import styles from "./FooterNavBar.module.css";
import { useSelector } from "react-redux";

const FooterNavBar = () => {
   const loc = useLocation();
   const { mostrar } = useSelector((state) => state.mostrarNavBar);

   return (
      <Collapse in={mostrar}>
         <div style={{zIndex: 100}} className={`w-100 "d-flex" d-lg-none position-fixed bottom-0 start-0 end-0`}>
            <ButtonGroup className="w-100">
               <Button to="/" active={loc.pathname === "/"} className="w-25 rounded-0 d-flex flex-column" as={Link}>
                  <i className="bi bi-house-heart-fill fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>Início</span>
               </Button>
               <Button to="/criptomoedas" active={loc.pathname === "/criptomoedas"} className="w-25 rounded-0 d-flex flex-column" as={Link}>
                  <i className="bi-currency-exchange fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>Criptomoeadas</span>
               </Button>
               <Button to="/corretoras" active={loc.pathname === "/corretoras"} className="w-25 rounded-0 d-flex flex-column" as={Link}>
                  <i className="bi bi-graph-up-arrow fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>Corretoras</span>
               </Button>
               <Button to="/noticias" active={loc.pathname === "/noticias"} className="w-25 rounded-0 d-flex flex-column" as={Link}>
                  <i className="bi bi-newspaper fs-2"></i>
                  <span className={`text-truncate ${styles.tit}`}>Notícias</span>
               </Button>
            </ButtonGroup>
         </div>
      </Collapse>
   );
};

export default FooterNavBar;
