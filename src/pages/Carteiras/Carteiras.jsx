import axios from "axios";
import styles from "./Carteiras.module.css";
import { useEffect } from "react";

const Carteiras = () => {
   async function apanharCarteiras() {
      try {
         const carteiras = await axios("https://min-api.cryptocompare.com/data/wallets/general?");
      } catch (error) {
         console.log(error.message);
      }
   }

   useEffect(() => {
      apanharCarteiras();
   }, []);

   return <div>Carteiras</div>;
};
export default Carteiras;
