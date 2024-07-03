import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptofetchOptions } from "../../services/cryptoApi";

const MoedaIndividual = () => {
   const { uuid } = useParams();
   const [loading, setLoading] = useState(false);
   const [criptomoeda, setCriptomoeda] = useState(null);

   async function apanharDetalhesCriptomoeda() {
      setLoading(true);
      try {
         const res = await axios.request({ ...CryptofetchOptions, url: `https://coinranking1.p.rapidapi.com/coin/${uuid}` });
         setCriptomoeda(res.data.data.coin);
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      console.log(`O uuid é: ${uuid}`);
      if (!criptomoeda) apanharDetalhesCriptomoeda();
   }, [uuid]);

   return <div>MoedaIndividual</div>;
};

export default MoedaIndividual;
