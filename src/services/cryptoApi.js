import axios from "axios";

const options = {
   method: "GET",
   url: "https://coinranking1.p.rapidapi.com/stats?referenceCurrencyUuid=yhjMzLPhuIDl",
   params: {
      referenceCurrencyUuid: "yhjMzLPhuIDl",
   },
   headers: {
      "x-rapidapi-key": "69b11e51eamsh115553615181e35p1ed117jsnfc95950b64fd",
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
   },
};

async function apanharCryptoData() {
   const res = await axios.request(options);
   console.log(res.data);
}

export default apanharCryptoData;
