import { Col, Container, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCriptomoedas, setCryptoStats, setNoticias } from "../../state/crypto/cryptoSlice";
import millify from "millify";
import { CryptofetchOptions } from "../../services/cryptoApi";
import CardMoeda from "../../components/CardMoeda/CardMoeda";

const Home = () => {
   const [loading, setLoading] = useState(false);
   const { cryptoStats, criptomoedas, noticias } = useSelector((state) => state.crypto);
   const dispatch = useDispatch();

   async function apanharStats() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/stats" });
         dispatch(setCryptoStats(res?.data?.data));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   async function apanharCriptomoedas() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/coins" });
         dispatch(setCriptomoedas(res?.data?.data?.coins));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   async function apanharNoticias() {
      setLoading(true);
      let res;
      try {
         res = await axios.get(
            "https://min-api.cryptocompare.com/data/v2/news/?lang=PT&api_key=df6fc44edb45b681313377b928ca5f322340d29fdbb6b044d81a3f2095392499"
         );
         dispatch(setNoticias(res.data.Data));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!cryptoStats) apanharStats();
      if (!criptomoedas) apanharCriptomoedas();
      if (!noticias) apanharNoticias();
   }, [criptomoedas, cryptoStats]);

   return (
      <Container id={styles.ct} fluid>
         <h2 className="fw-bold mb-4">Estatísticas globais de criptomoedas</h2>
         <Row className="gy-3">
            <Col md={6}>
               <div>
                  <h5 className="text-secondary">Total de criptomoedas</h5>
                  <p className="fs-2">{cryptoStats?.totalCoins}</p>
               </div>
            </Col>
            <Col md={6}>
               <div>
                  <h5 className="text-secondary">Total de movimentos</h5>
                  <p className="fs-2">{millify(cryptoStats?.totalExchanges)}</p>
               </div>
            </Col>
            <Col md={6}>
               <div>
                  <h5 className="text-secondary">Valor total do mercado</h5>
                  <p className="fs-2">{millify(Number(cryptoStats?.totalMarketCap))} USD</p>
               </div>
            </Col>
            <Col md={6}>
               <div>
                  <h5 className="text-secondary">Maior volume nas últimas 24h</h5>
                  <p className="fs-2">{millify(cryptoStats?.total24hVolume)} USD</p>
               </div>
            </Col>
            <Col md={6}>
               <div>
                  <h5 className="text-secondary">Total de mercados</h5>
                  <p className="fs-2">{millify(cryptoStats?.totalMarkets)}</p>
               </div>
            </Col>
            <Col md={6}>
               <div>
                  <h5 className="text-secondary">Domínio do Bitcoin</h5>
                  <p className="fs-2">{millify(cryptoStats?.btcDominance)}%</p>
               </div>
            </Col>
         </Row>

         <div className="my-4">
            {/*   Top 10 */}
            <Row>
               <Col md={6}>
                  <h2 className="fw-bold mb-4">Top 10 criptomoedas no mundo</h2>
               </Col>
               <Col className="text-end" md={6}>
                  <Link className="fs-4" to="/criptomoedas">
                     Ver mais
                  </Link>
               </Col>
            </Row>
            <Row className="g-3">
               {criptomoedas ? (
                  criptomoedas.map((v, k) => {
                     if (k < 10)
                        return (
                           <Col md={3} key={k}>
                              <CardMoeda moeda={v} />
                           </Col>
                        );
                  })
               ) : (
                  <>
                     <p>Loading</p>
                  </>
               )}
            </Row>
         </div>

         {/*   Notícias  */}
         <Row className="mt-5">
            <Col md={6}>
               <h2 className="fw-bold mb-5">Últimas notícias sobre o mundo Crypto</h2>
               <div></div>
            </Col>
            <Col className="text-end" md={6}>
               <Link className="fs-4" to="/criptomoedas">
                  Ver mais
               </Link>
            </Col>
         </Row>
      </Container>
   );
};

export default Home;
