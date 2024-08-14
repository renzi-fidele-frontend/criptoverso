import axios from "axios";
import styles from "./Carteiras.module.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCarteiras } from "../../state/carteiras/carteirasSlice";

const Carteiras = () => {
   const { carteiras } = useSelector((state) => state.carteiras);
   const dispatch = useDispatch();
   async function apanharCarteiras() {
      try {
         const res = await axios(`https://min-api.cryptocompare.com/data/wallets/general?api_key=${import.meta.env.VITE_CRYPTO_WATCH_APIKEY}`);
         dispatch(setCarteiras(res.data.Data));
      } catch (error) {
         console.log(error.message);
      }
   }

   useEffect(() => {
      if (!carteiras) apanharCarteiras();
   }, []);

   return <div>Carteiras</div>;
};
export default Carteiras;
