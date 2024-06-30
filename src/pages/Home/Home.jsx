import { Card, Col, Container, Image, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCriptomoedas, setCryptoStats } from "../../state/crypto/cryptoSlice";
import millify from "millify";
import { CryptofetchOptions } from "../../services/cryptoApi";

const Home = () => {
   const [loading, setLoading] = useState(false);
   const { cryptoStats, criptomoedas } = useSelector((state) => state.crypto);
   const dispatch = useDispatch();

   async function apanharStats() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/stats" });
         console.log(res.data);
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
         console.log(res.data);
         dispatch(setCriptomoedas(res?.data?.data?.coins));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!cryptoStats) apanharStats();
      if (!criptomoedas) apanharCriptomoedas();
   }, [criptomoedas]);

   return (
      <div id={styles.ct}>
         <Container fluid>
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
                                 <Card>
                                    <Card.Header className="flex-row align-items-center justify-content-between d-flex">
                                       <p className="mb-0">{`${v?.rank}. ${v?.name}`}</p>
                                       <Image id={styles.foto} src={v?.iconUrl} />
                                    </Card.Header>
                                    <Card.Body>
                                       <p>Preço: {millify(v?.price)} USD</p>
                                       <p>
                                          Volume de mercado: <span>{millify(v?.marketCap)}</span>
                                       </p>
                                       <p>
                                          Alteração:{" "}
                                          <span className={`${Number(millify(v?.change)) >= 0 ? "text-success" : "text-danger"}`}>
                                             {millify(v?.change)}%
                                          </span>
                                       </p>
                                    </Card.Body>
                                 </Card>
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
      </div>
   );
};

export default Home;
