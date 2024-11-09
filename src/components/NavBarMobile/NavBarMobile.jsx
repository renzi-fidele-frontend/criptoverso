import { useDispatch, useSelector } from "react-redux";
import styles from "./NavBarMobile.module.css";
import Button from "react-bootstrap/Button";
import FormSelect from "react-bootstrap/FormSelect";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import { setMostrar } from "../../state/MostrarNavBar/MostrarNavBarSlice";
import { Link } from "react-router-dom";
import { setModoEscuro } from "../../state/tema/temaSlice";
import logo from "../../assets/logo1.png";
import i18n from "../../i18n/i18n";

const NavBarMobile = () => {
   const dispatch = useDispatch();
   const { mostrar } = useSelector((state) => state.mostrarNavBar);
   const { modoEscuro } = useSelector((state) => state.tema);

   function mudarTema() {
      dispatch(setModoEscuro(!modoEscuro));
      let tema = !modoEscuro ? "dark" : "light";
      document.documentElement.setAttribute("data-bs-theme", tema);
   }

   function mudarIdioma(e) {
      i18n.changeLanguage(e.target.value);
   }

   return (
      <Navbar className="d-lg-none d-flex" id={styles.ct} style={{ zIndex: 10 }}>
         <div className="px-3 px-sm-4 px-md-5 w-100 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
               <Link to="/">
                  <Image src={logo} id={styles.logo} />
               </Link>
            </div>

            <div className="d-flex gap-2 gap-sm-3 align-items-center">
               <FormSelect className="d-none d-sm-block border-0 bg-opacity-25 text-light bg-light" role="button" onChange={mudarIdioma}>
                  <option className="bg-opacity-100 text-dark" value="pt">
                     <div>🇵🇹 Português</div>
                  </option>
                  <option className="bg-opacity-100 text-dark" value="en">
                     🇺🇸 English
                  </option>
               </FormSelect>
               <FormSelect className="d-sm-none border-0 bg-opacity-25 text-light bg-light" role="button" onChange={mudarIdioma}>
                  <option className="bg-opacity-100 text-dark" value="pt">
                     🇵🇹
                  </option>
                  <option className="bg-opacity-100 text-dark" value="en">
                     🇺🇸
                  </option>
               </FormSelect>
               <Button onClick={mudarTema} className="rounded-circle" variant="outline-light">
                  <i className={modoEscuro ? "bi bi-brightness-high-fill" : "bi bi-moon-stars-fill"}></i>
               </Button>
               <Button onClick={() => dispatch(setMostrar(!mostrar))} variant="outline-primary">
                  <i className="bi bi-toggles2"></i>
               </Button>
            </div>
         </div>
      </Navbar>
   );
};

export default NavBarMobile;
