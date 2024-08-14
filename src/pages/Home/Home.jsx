import { Button, Col, Container, Image, Placeholder, Row } from "react-bootstrap";
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
import { gerarArray } from "../../hooks/useGerarArray";

const Home = () => {
   const [loading, setLoading] = useState(false);
   const { estatisticasGerais } = useSelector((state) => state.estatisticasGerais);
   const { criptomoedas } = useSelector((state) => state.criptomoedas);
   const { noticias } = useSelector((state) => state.noticias);
   const { modoEscuro } = useSelector((state) => state.tema);

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

   const estatisticasGlobais = [
      { nome: "Total de criptomoedas", valor: estatisticasGerais?.totalCoins },
      { nome: "Corretoras disponíveis", valor: millify(estatisticasGerais?.totalExchanges) },
      { nome: "Valor total do mercado", valor: millify(Number(estatisticasGerais?.totalMarketCap)), usd: true },
      { nome: "Maior volume nas últimas 24h", valor: millify(estatisticasGerais?.total24hVolume), usd: true },
      { nome: "Total de mercados", valor: millify(estatisticasGerais?.totalMarkets) },
      { nome: "Domínio do Bitcoin", valor: millify(estatisticasGerais?.btcDominance) + "%" },
   ];

   return (
      <Container id={styles.ct} fluid>
         <h2 className="fw-bold mb-4 titulo1">Estatísticas globais de criptomoedas</h2>
         <Row className="gy-3">
            <Col xs={12} sm={12} xl={8}>
               <Row>
                  {!loading
                     ? estatisticasGlobais?.map((v, k) => (
                          <Col key={k} sm={6}>
                             <div>
                                <h5 id={styles.subtit} className="text-secondary">
                                   {v.nome}
                                </h5>
                                <p className="fs-2">
                                   {v.valor} {v?.usd ? "USD" : ""}
                                </p>
                             </div>
                          </Col>
                       ))
                     : estatisticasGlobais?.map((v, k) => (
                          <Col key={k} sm={6}>
                             <div>
                                <h5 id={styles.subtit} className="text-secondary">
                                   {v.nome}
                                </h5>
                                <p className="fs-2">
                                   <Placeholder key={k} animation="wave">
                                      <Placeholder xs={5} md={8} />
                                   </Placeholder>
                                </p>
                             </div>
                          </Col>
                       ))}
               </Row>
            </Col>
            <Col className="d-none d-xl-inline">
               <Image src={foto} className={modoEscuro && styles.filtroEscuro} id={styles.foto} />
            </Col>
         </Row>

         <div className="my-4">
            {/*   Top 10 */}
            <Row>
               <Col xs={12} md={9}>
                  <h2 className="fw-bold mb-4 titulo1">Top 10 criptomoedas no mundo</h2>
               </Col>
               <Col className="text-end d-none d-md-inline">
                  <Link className="fs-4" to="/criptomoedas">
                     Ver mais
                  </Link>
               </Col>
            </Row>
            <Row className="g-3">
               {!loading ? (
                  criptomoedas?.map((v, k) => {
                     if (k < 10)
                        return (
                           <Col md={6} lg={4} xxl={3} key={k}>
                              <CardMoeda moeda={v} />
                           </Col>
                        );
                  })
               ) : (
                  <>
                     {gerarArray(6).map((v, k) => (
                        <Col md={6} lg={4} xxl={3} key={k}>
                           <CardMoeda />
                        </Col>
                     ))}
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
                  <h2 className="fw-bold mb-4 titulo1">Últimas notícias sobre o mundo Crypto</h2>
               </Col>
               <Col className="text-end d-none d-md-inline">
                  <Link className="fs-4" to="/noticias">
                     Ver mais
                  </Link>
               </Col>
            </Row>
            <Row className="g-4">
               {!loading
                  ? noticias?.map((v, k) => {
                       if (k < 7 && k !== 1 && v?.imageurl?.length > 0)
                          return (
                             <Col md={6} key={k}>
                                <CardNoticia noticia={v} />
                             </Col>
                          );
                    })
                  : gerarArray(6).map((v, k) => (
                       <Col md={6} key={k}>
                          <CardNoticia />
                       </Col>
                    ))}
            </Row>
            <div className="d-md-none text-center">
               <Button as={Link} className="mt-3 mb-5 mb-lg-0" to="/noticias">
                  Ver mais
               </Button>
            </div>
         </div>
      </Container>
   );
};

export default Home;
