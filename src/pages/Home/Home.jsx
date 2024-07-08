import { Button, Col, Container, Image, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import millify from "millify";
import { CryptofetchOptions } from "../../services/cryptoApi";
import CardMoeda from "../../components/CardMoeda/CardMoeda";
import CardNoticia from "../../components/CardNoticia/CardNoticia";
import foto from "../../assets/ill.png";
import { setEstatisticasGerais } from "../../state/estatisticasGerais/estatisticasGeraisSlice";
import { setCriptomoedas } from "../../state/criptomoedas/criptomoedasSlice";
import { setNoticias } from "../../state/noticias/noticiasSlice";

const Home = () => {
   const [loading, setLoading] = useState(false);
   const { estatisticasGerais } = useSelector((state) => state.estatisticasGerais);
   const { criptomoedas } = useSelector((state) => state.criptomoedas);
   const { noticias } = useSelector((state) => state.noticias);

   const dispatch = useDispatch();

   async function apanharStats() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/stats" });
         dispatch(setEstatisticasGerais(res?.data?.data));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   async function apanharCriptomoedas() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/coins?limit=100" });
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
      if (!estatisticasGerais) apanharStats();
      if (!criptomoedas) apanharCriptomoedas();
      if (!noticias) apanharNoticias();
   }, [criptomoedas, estatisticasGerais, noticias]);

   return (
      <Container id={styles.ct} fluid>
         <h2 className="fw-bold mb-4">Estatísticas globais de criptomoedas</h2>
         <Row className="gy-3">
            <Col xs={12} sm={12} xl={8}>
               <Row>
                  <Col sm={6}>
                     <div>
                        <h5 className="text-secondary">Total de criptomoedas</h5>
                        <p className="fs-2">{estatisticasGerais?.totalCoins}</p>
                     </div>
                  </Col>
                  <Col sm={6}>
                     <div>
                        <h5 className="text-secondary">Corretoras disponíveis</h5>
                        <p className="fs-2">{millify(estatisticasGerais?.totalExchanges)}</p>
                     </div>
                  </Col>
                  <Col sm={6}>
                     <div>
                        <h5 className="text-secondary">Valor total do mercado</h5>
                        <p className="fs-2">{millify(Number(estatisticasGerais?.totalMarketCap))} USD</p>
                     </div>
                  </Col>
                  <Col sm={6}>
                     <div>
                        <h5 className="text-secondary">Maior volume nas últimas 24h</h5>
                        <p className="fs-2">{millify(estatisticasGerais?.total24hVolume)} USD</p>
                     </div>
                  </Col>
                  <Col sm={6}>
                     <div>
                        <h5 className="text-secondary">Total de mercados</h5>
                        <p className="fs-2">{millify(estatisticasGerais?.totalMarkets)}</p>
                     </div>
                  </Col>
                  <Col sm={6}>
                     <div>
                        <h5 className="text-secondary">Domínio do Bitcoin</h5>
                        <p className="fs-2">{millify(estatisticasGerais?.btcDominance)}%</p>
                     </div>
                  </Col>
               </Row>
            </Col>
            <Col className="d-none d-xl-inline">
               <Image src={foto} id={styles.foto} />
            </Col>
         </Row>

         <div className="my-4">
            {/*   Top 10 */}
            <Row>
               <Col xs={12} md={9}>
                  <h2 className="fw-bold mb-4">Top 10 criptomoedas no mundo</h2>
               </Col>
               <Col className="text-end d-none d-md-inline">
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
                           <Col md={6} lg={4} xxl={3} key={k}>
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
            <div className="d-md-none text-center">
               <Button as={Link} className="mt-3" to="/criptomoedas">
                  Ver mais
               </Button>
            </div>
         </div>

         {/*   Notícias  */}
         <div className="my-5">
            <Row>
               <Col xs={12} md={9}>
                  <h2 className="fw-bold mb-4">Últimas notícias sobre o mundo Crypto</h2>
               </Col>
               <Col className="text-end d-none d-md-inline">
                  <Link className="fs-4" to="/noticias">
                     Ver mais
                  </Link>
               </Col>
            </Row>
            <Row className="g-4">
               {noticias &&
                  noticias.map((v, k) => {
                     if (k < 7 && k !== 1 && v?.imageurl.length > 0)
                        return (
                           <Col md={6} key={k}>
                              <CardNoticia noticia={v} />
                           </Col>
                        );
                  })}
            </Row>
            <div className="d-md-none text-center">
               <Button as={Link} className="mt-3" to="/noticias">
                  Ver mais
               </Button>
            </div>
         </div>
      </Container>
   );
};

export default Home;
