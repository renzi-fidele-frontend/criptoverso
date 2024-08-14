import axios from "axios";
import styles from "./Carteiras.module.css";
import { useEffect } from "react";

const Carteiras = () => {
   async function apanharCarteiras() {
      try {
         const res = await axios(`https://min-api.cryptocompare.com/data/wallets/general?api_key=${import.meta.env.VITE_CRYPTO_WATCH_APIKEY}`);
         console.log(res.data);
      } catch (error) {
         console.log(error.message);
      }
   }

   useEffect(() => {
      // apanharCarteiras();
   }, []);

   return <div>Carteiras</div>;
};
export default Carteiras;
