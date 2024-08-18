import { Button, Col, Container, Image, OverlayTrigger, Placeholder, Row, Tooltip } from "react-bootstrap";
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
         res = await axios.get(`https://min-api.cryptocompare.com/data/v2/news/?lang=PT&api_key=${import.meta.env.VITE_CRYPTO_WATCH_APIKEY}`);
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
      {
         nome: "Corretoras disponíveis",
         valor: millify(estatisticasGerais?.totalExchanges),
         tooltip: "Número total de corretoras onde as criptomoedas estão listadas e disponíveis para negociação.",
      },
      {
         nome: "Valor total do mercado",
         valor: millify(Number(estatisticasGerais?.totalMarketCap)),
         usd: true,
         tooltip:
            "Valor total de mercado de todas as criptomoedas combinadas, calculado pela soma das capitalizações de mercado individuais. Reflete o tamanho e a importância do mercado de criptomoedas como um todo.",
      },
      {
         nome: "Maior volume nas últimas 24h",
         valor: millify(estatisticasGerais?.total24hVolume),
         usd: true,
         tooltip:
            "Volume total de transações realizadas nas últimas 24 horas para todas as criptomoedas, indicando a liquidez e a atividade de negociação global no mercado.",
      },
      {
         nome: "Total de mercados",
         valor: millify(estatisticasGerais?.totalMarkets),
         tooltip:
            "Número total de mercados ou pares de negociação disponíveis para todas as criptomoedas, representando a diversidade de opções de compra e venda no mercado global.",
      },
      {
         nome: "Domínio do Bitcoin",
         valor: millify(estatisticasGerais?.btcDominance) + "%",
         tooltip:
            "Percentual de dominância do Bitcoin no mercado de criptomoedas, indicando a participação do Bitcoin em relação ao valor total de mercado de todas as criptomoedas.",
      },
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
                                   <OverlayTrigger overlay={<Tooltip>{v?.tooltip}</Tooltip>}>
                                      <i className="bi bi-info-circle-fill ms-2"></i>
                                   </OverlayTrigger>
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
