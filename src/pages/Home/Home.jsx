import { Col, Container, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCryptoData } from "../../state/crypto/cryptoSlice";

const fetchOptions = {
   method: "GET",
   url: "https://coinranking1.p.rapidapi.com/stats",
   params: {
      referenceCurrencyUuid: "yhjMzLPhuIDl",
   },
   headers: {
      "x-rapidapi-key": "69b11e51eamsh115553615181e35p1ed117jsnfc95950b64fd",
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
   },
};

const Home = () => {
   const [loading, setLoading] = useState(false);
   const { cryptoData } = useSelector((state) => state.crypto);
   const dispatch = useDispatch();

   async function apanharCryptoData() {
      setLoading(true);
      let res;
      try {
         res = await axios.request(fetchOptions);
         console.log(res.data);
         dispatch(setCryptoData(res.data));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!cryptoData) apanharCryptoData();
   }, [cryptoData]);

   return (
      <div id={styles.ct}>
         <Container fluid>
            <h2 className="fw-bold mb-5">Estatísticas globais de criptomoedas</h2>
            <Row className="gy-3">
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Total de criptomoedas</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Total de movimentos</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Valor total de mercado</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Maior volume nas últimas 24h</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Total de mercados</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
            </Row>

            <Row className="my-5">
               <Col md={6}>
                  <h2 className="fw-bold mb-5">Top 10 criptomoedas no mundo</h2>
                  <div></div>
               </Col>
               <Col className="text-end" md={6}>
                  <Link className="fs-3" to="/criptomoedas">
                     Ver mais
                  </Link>
               </Col>
            </Row>

            <Row>
               <Col md={6}>
                  <h2 className="fw-bold mb-5">Últimas notícias sobre o mundo Crypto</h2>
                  <div></div>
               </Col>
               <Col className="text-end" md={6}>
                  <Link className="fs-3" to="/criptomoedas">
                     Ver mais
                  </Link>
               </Col>
            </Row>
         </Container>
      </div>
   );
};

export default Home;
