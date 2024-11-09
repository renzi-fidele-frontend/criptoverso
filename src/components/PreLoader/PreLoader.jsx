import Spinner from "react-bootstrap/Spinner";
import logo from "../../assets/preloader.png";

const PreLoader = () => {
   return (
      <section className="d-flex align-items-center flex-column justify-content-center h-100 gap-3">
         <img src={logo} />
         <Spinner />
      </section>
   );
};
export default PreLoader;
