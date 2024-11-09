import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollTop = ({ children }) => {
   const loc = useLocation();

   useEffect(() => {
      console.log("Mudei");
      const elDesktop = document.querySelector("#corpo");
      const elMobile = document.querySelector("html");

      setTimeout(() => {
         elDesktop.scrollTo({ top: 0, behavior: "smooth" });
         elMobile.scrollTo({ top: 0, behavior: "smooth" });
      }, 200);
   }, [loc.pathname]);

   return <div>{children}</div>;
};
export default ScrollTop;
