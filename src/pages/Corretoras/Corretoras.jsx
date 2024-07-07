import axios from "axios";
import { useEffect, useState } from "react";

const Corretoras = () => {
   const [loading, setLoading] = useState(false);

   async function apanharCorretoras() {
      setLoading(true);
      try {
         const res = await axios(
            "https://min-api.cryptocompare.com/data/exchanges/general?api_key=df6fc44edb45b681313377b928ca5f322340d29fdbb6b044d81a3f2095392499"
         );
         console.log(res.data.data);
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      apanharCorretoras();
   }, []);

   return <div>Corretoras</div>;
};

export default Corretoras;
