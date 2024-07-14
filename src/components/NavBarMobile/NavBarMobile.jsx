import { useDispatch, useSelector } from "react-redux";
import styles from "./NavBarMobile.module.css";
import { Button, Container, Image, Navbar } from "react-bootstrap";
import { setMostrar } from "../../state/MostrarNavBar/MostrarNavBarSlice";
import { Link } from "react-router-dom";
import { setModoEscuro } from "../../state/tema/temaSlice";
import logo from "../../assets/logo1.png";

const NavBarMobile = () => {
   const dispatch = useDispatch();
   const { mostrar } = useSelector((state) => state.mostrarNavBar);
   const { modoEscuro } = useSelector((state) => state.tema);

   function mudarTema() {
      dispatch(setModoEscuro(!modoEscuro));
      let tema = !modoEscuro ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", tema);
   }

   return (
      <Navbar className="px-3 d-lg-none d-flex" id={styles.ct} style={{ zIndex: 10 }}>
         <Container className="container-sm d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
               <Link to="/" preventScrollReset={false}>
                  <Image src={logo} id={styles.logo} />
               </Link>
            </div>

            <div className="d-flex gap-2 gap-sm-3 align-items-center">
               <Button onClick={mudarTema} className="rounded-circle" variant="outline-light">
                  <i className={modoEscuro ? "bi bi-brightness-high-fill" : "bi bi-moon-stars-fill"}></i>
               </Button>
               <Button onClick={() => dispatch(setMostrar(!mostrar))} variant="outline-primary">
                  <i className="bi bi-toggles2"></i>
               </Button>
            </div>
         </Container>
      </Navbar>
   );
};

export default NavBarMobile;
