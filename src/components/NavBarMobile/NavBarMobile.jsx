import { useDispatch, useSelector } from "react-redux";
import styles from "./NavBarMobile.module.css";
import { Button, Container, Navbar } from "react-bootstrap";
import { setMostrar } from "../../state/MostrarNavBar/MostrarNavBarSlice";
import { Link } from "react-router-dom";

const NavBarMobile = () => {
   const dispatch = useDispatch();
   const { mostrar } = useSelector((state) => state.mostrarNavBar);

   return (
      <Navbar className="px-3 d-lg-none d-flex" id={styles.ct} style={{ zIndex: 10 }}>
         <Container className="container-sm d-flex justify-content-between align-items-center">
            <Navbar.Brand as={Link} to="/" className="fw-bold text-light">
               Criptoverso
            </Navbar.Brand>

            <Button onClick={() => dispatch(setMostrar(!mostrar))} variant="outline-primary">
               <i className=" bi bi-toggles2"></i>
            </Button>
         </Container>
      </Navbar>
   );
};

export default NavBarMobile;
