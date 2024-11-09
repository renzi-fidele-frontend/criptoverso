import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptofetchOptions } from "../../services/cryptoApi";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import millify from "millify";
import translate from "translate";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import styles from "./MoedaIndividual.module.css";
import { gerarArray } from "../../hooks/useGerarArray";
import { useSelector } from "react-redux";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import { useTranslation } from "react-i18next";

Chart.register(CategoryScale);

const MoedaIndividual = () => {
   const { t } = useTranslation();
   const { uuid } = useParams();
   const [loading, setLoading] = useState(false);
   const [chartLoading, setChartLoading] = useState(false);
   const [criptomoeda, setCriptomoeda] = useState(null);
   const [descricaoTraduzida, setDescricaoTraduzida] = useState("");
   const [historico, setHistorico] = useState(null);
   const periodo = [
      { nome: t("moedaIndividual.periodo.3h"), valor: "3h" },
      { nome: t("moedaIndividual.periodo.24h"), valor: "24h" },
      { nome: t("moedaIndividual.periodo.7d"), valor: "7d" },
      { nome: t("moedaIndividual.periodo.30d"), valor: "30d" },
      { nome: t("moedaIndividual.periodo.3m"), valor: "3m" },
      { nome: t("moedaIndividual.periodo.1y"), valor: "1y" },
      { nome: t("moedaIndividual.periodo.3y"), valor: "3y" },
      { nome: t("moedaIndividual.periodo.5y"), valor: "5y" },
   ];
   const [datasCriptomoeda, setDatasCriptomoeda] = useState([]);
   const [precosCriptomoeda, setPrecosCriptomoeda] = useState([]);
   const { modoEscuro } = useSelector((state) => state.tema);
   const { lang } = useSelector((state) => state.idioma);

   async function apanharDetalhesCriptomoeda() {
      setLoading(true);
      try {
         const res = await axios.request({ ...CryptofetchOptions, url: `https://coinranking1.p.rapidapi.com/coin/${uuid}` });
         setCriptomoeda(res.data.data.coin);
         const textoTraduzido = await translate(res.data.data.coin?.description, "pt");
         setDescricaoTraduzida(textoTraduzido);
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   async function apanharHistoricoCriptomoeda(periodo) {
      setChartLoading(true);
      try {
         const res = await axios.request({
            ...CryptofetchOptions,
            url: `https://coinranking1.p.rapidapi.com/coin/${uuid}/history?timePeriod=${periodo}`,
         });
         let sortedHist = res.data.data.history;
         sortedHist.sort((a, b) => b.timestamp - a.timestamp);
         setHistorico(res.data.data);
         let datas;
         if (periodo === "24h" || periodo === "3h") {
            datas = sortedHist.map((v) => new Date(v.timestamp * 1000).toLocaleTimeString());
         } else {
            datas = sortedHist.map((v) => new Date(v.timestamp * 1000).toLocaleDateString());
         }

         let precos = sortedHist.map((v) => v.price);
         setDatasCriptomoeda(datas);
         setPrecosCriptomoeda(precos);
      } catch (error) {
         console.log(error);
      }
      setChartLoading(false);
   }

   useEffect(() => {
      console.log(`O uuid é: ${uuid}`);
      if (!criptomoeda) apanharDetalhesCriptomoeda();
      if (!historico) apanharHistoricoCriptomoeda("7d");
   }, [uuid]);

   const estatisticas = [
      { titulo: t("moedaIndividual.estatisticas.0.tit"), valor: `${millify(criptomoeda?.price)} USD`, icone: <i className="bi bi-coin"></i> },
      { titulo: t("moedaIndividual.estatisticas.1.tit"), valor: `#${criptomoeda?.rank}`, icone: <i className="bi bi-hash"></i> },
      {
         titulo: t("moedaIndividual.estatisticas.2.tit"),
         valor: `${millify(criptomoeda?.["24hVolume"])} USD`,
         icone: <i className="bi bi-clipboard-data"></i>,
         tooltip: t("moedaIndividual.estatisticas.2.tp"),
      },
      {
         titulo: t("moedaIndividual.estatisticas.3.tit"),
         valor: `${millify(criptomoeda?.marketCap)} USD`,
         icone: <i className="bi bi-cash-stack"></i>,
         tooltip: t("moedaIndividual.estatisticas.3.tp"),
      },
      {
         titulo: t("moedaIndividual.estatisticas.4.tit"),
         valor: `${millify(criptomoeda?.allTimeHigh?.price)} USD`,
         icone: <i className="bi bi-trophy"></i>,
         tooltip: t("moedaIndividual.estatisticas.4.tp"),
      },
   ];

   const estatisticas_genericas = [
      {
         titulo: t("moedaIndividual.estatisticas_genericas.0.tit"),
         valor: criptomoeda?.numberOfMarkets,
         icone: <i className="bi bi-graph-up-arrow"></i>,
         tooltip: t("moedaIndividual.estatisticas_genericas.0.tp"),
      },
      {
         titulo: t("moedaIndividual.estatisticas_genericas.1.tit"),
         valor: criptomoeda?.numberOfExchanges,
         icone: <i className="bi bi-arrow-left-right"></i>,
         tooltip: t("moedaIndividual.estatisticas_genericas.1.tp"),
      },
      {
         titulo: t("moedaIndividual.estatisticas_genericas.2.tit"),
         valor: criptomoeda?.supply?.confirmed ? (
            <i style={{ fontWeight: "bold !important" }} className="bi bi-check2-square text-success"></i>
         ) : (
            <i className="bi bi-x-square text-danger"></i>
         ),
         icone: <i className="bi bi-bank" style={{ fontWeight: "bold !important" }}></i>,
         tooltip: t("moedaIndividual.estatisticas_genericas.2.tp"),
      },
      {
         titulo: t("moedaIndividual.estatisticas_genericas.3.tit"),
         valor: `${millify(criptomoeda?.supply?.total)} USD`,
         icone: <i className="bi bi-exclamation-octagon"></i>,
         tooltip: t("moedaIndividual.estatisticas_genericas.3.tp"),
      },
      {
         titulo: t("moedaIndividual.estatisticas_genericas.4.tit"),
         valor: `${millify(criptomoeda?.supply?.circulating)} USD`,
         icone: <i className="bi bi-exclamation-octagon"></i>,
         tooltip: t("moedaIndividual.estatisticas_genericas.4.tp"),
      },
   ];

   function handleSelectChange(novoValor) {
      apanharHistoricoCriptomoeda(novoValor?.currentTarget.value);
   }

   return (
      <Container className="pb-5" fluid>
         <Row>
            <Col className="text-center">
               <div className="mt-1 mt-md-0 mb-2">
                  {!loading ? <Image id={styles.ico} src={criptomoeda?.iconUrl} /> : <Placeholder id={styles.loadIco} />}
               </div>

               <h2 id={styles.tit} className="fw-bold fs-1">
                  {lang === "pt" && <span>{t("moedaIndividual.tit")} </span>}
                  {!loading ? (
                     <span style={{ color: modoEscuro ? null : criptomoeda?.color, textShadow: "1px 1px 1px black" }}>
                        {criptomoeda?.name} ({criptomoeda?.symbol})
                     </span>
                  ) : (
                     <Placeholder xs={3} />
                  )}{" "}
                  {lang === "en" && <span>{t("moedaIndividual.tit")} </span>}
               </h2>
               <p id={styles.descricao} className="px-xl-5 mt-3 mt-md-4 mb-3 mb-md-5">
                  {lang === "pt" && (!loading ? descricaoTraduzida : <Placeholder xs={12} />)}
                  {lang === "en" && (!loading ? criptomoeda?.description : <Placeholder xs={12} />)}
               </p>

               <hr />

               {/*   Período  */}
               <Col className="mt-2 mx-auto gap-2 mx-xxl-0 d-flex align-items-center" md={5} xl={4} xxl={3}>
                  <Form.Select onChange={handleSelectChange} defaultValue="7d" style={{ cursor: "pointer" }}>
                     {periodo.map((v, k) => (
                        <option key={k} value={v.valor}>
                           {v.nome}
                        </option>
                     ))}
                  </Form.Select>
                  <Tippy theme={modoEscuro && "light"} content={t("moedaIndividual.periodo.tooltip")}>
                     <i className="ms-1 bi fs-3 bi-info-circle-fill"></i>
                  </Tippy>
               </Col>

               {/*   Gráfico  */}
               <Row className="mt-3">
                  <Col xs={12} xxl={6}>
                     <h3 id={styles.titulo2} className="text-xxl-start fs-2 text-center">
                        {lang === "pt" && (
                           <>
                              {t("moedaIndividual.h3_chart")} {!loading ? criptomoeda?.name : <Placeholder xs={4} />}
                           </>
                        )}
                        {lang === "en" && <>{!loading ? criptomoeda?.name : <Placeholder xs={4} />} Price chart</>}
                     </h3>
                  </Col>
                  <Col id={styles.destaque} className="d-flex gap-4 justify-content-center justify-content-xxl-end fs-5 mb-4 mb-xxl-0">
                     <span>
                        <i className="bi bi-arrow-down-up"></i> {t("moedaIndividual.change")}: <br className="d-inline d-sm-none" />
                        {!loading ? (
                           <b className={`${historico?.change >= 0 ? "text-success" : "text-danger"}`}>
                              {historico?.change >= 0 && "+"}
                              {historico?.change}%{" "}
                           </b>
                        ) : (
                           <Placeholder xs={7} />
                        )}
                     </span>
                     <span>
                        <i className="bi bi-coin"></i> {t("moedaIndividual.price")}: <br className="d-inline d-sm-none" />
                        {!loading ? <b>{millify(criptomoeda?.price)} USD</b> : <Placeholder xs={7} />}
                     </span>
                  </Col>
               </Row>
               <div className="d-flex align-items-center justify-content-center">
                  {!chartLoading ? (
                     <Line
                        data={{
                           labels: datasCriptomoeda,
                           datasets: [{ label: t("moedaIndividual.chartLabel"), data: precosCriptomoeda, fill: true }],
                        }}
                        options={{ responsive: true }}
                     />
                  ) : (
                     <Placeholder xs={12} animation="wave">
                        <Placeholder className="mt-3 d-flex align-items-center justify-content-center" id={styles.grafLoad} xs={12}>
                           <p className="text-light fs-5">{t("moedaIndividual.chartLoad")}...</p>
                        </Placeholder>
                     </Placeholder>
                  )}
               </div>

               {/*   Estatisticas da criptomoeda  */}
               <Row className="mt-5 gx-md-5">
                  <Col xs={12} xxl={6}>
                     <h3 id={styles.subtit}>
                        {lang === "pt" && t("moedaIndividual.coinValue")} {!loading ? criptomoeda?.name : <Placeholder xs={3} />}{" "}
                        {lang === "en" && t("moedaIndividual.coinValue")}
                     </h3>
                     <p>
                        {t("moedaIndividual.coinOverview")} {!loading ? criptomoeda?.name : <Placeholder xs={2} />}
                     </p>
                     <ListGroup className="mt-4">
                        {estatisticas.map((v, k) => (
                           <ListGroup.Item key={k} action>
                              <div className="p-1 p-md-3 d-flex flex-column flex-sm-row align-items-center justify-content-between">
                                 <div className="d-flex gap-3 align-items-center">
                                    {v.icone}
                                    <p className="mb-0 text-truncate">
                                       {v.titulo}{" "}
                                       {v?.tooltip && (
                                          <Tippy theme={modoEscuro && "light"} content={v?.tooltip}>
                                             <i className="ms-1 bi bi-info-circle-fill"></i>
                                          </Tippy>
                                       )}
                                    </p>
                                 </div>

                                 {!loading ? <span className="fw-bold">{v.valor}</span> : <Placeholder xs={3} />}
                              </div>
                           </ListGroup.Item>
                        ))}
                     </ListGroup>
                  </Col>
                  <Col className="pt-5 pt-xxl-0">
                     <h3 id={styles.subtit}>{t("moedaIndividual.otherStats")}</h3>
                     <p>{t("moedaIndividual.otherStats_p")}</p>
                     <ListGroup className="mt-4">
                        {estatisticas_genericas.map((v, k) => (
                           <ListGroup.Item key={k} action>
                              <div className="p-1 p-md-3 d-flex flex-column flex-sm-row align-items-center justify-content-between">
                                 <div className="d-flex gap-3 align-items-center">
                                    {v.icone}
                                    <p className="mb-0 text-truncate">
                                       {v.titulo}{" "}
                                       {v?.tooltip && (
                                          <Tippy theme={modoEscuro && "light"} content={v?.tooltip}>
                                             <i className="ms-1 bi bi-info-circle-fill"></i>
                                          </Tippy>
                                       )}
                                    </p>
                                 </div>

                                 {!loading ? <span className="fw-bold">{v.valor}</span> : <Placeholder xs={3} />}
                              </div>
                           </ListGroup.Item>
                        ))}
                     </ListGroup>
                  </Col>
               </Row>

               <hr className="mt-4" />

               {/*   Links da criptomoeda */}
               <Row className="mt-4 mb-5 mb-lg-0 pt-3" fluid>
                  <Col>
                     <h3 id={styles.titulo2} className="fs-2">
                        {lang === "pt" && (
                           <>
                              {t("moedaIndividual.h3_links")} {!loading ? criptomoeda?.name : <Placeholder xs={4} md={3} />}
                           </>
                        )}
                        {lang === "en" && (
                           <>
                              {!loading ? criptomoeda?.name : <Placeholder xs={4} md={3} />} {t("moedaIndividual.h3_links")}
                           </>
                        )}
                     </h3>
                     <ListGroup className="mt-4">
                        {!loading
                           ? criptomoeda?.links?.map((v, k) => (
                                <ListGroup.Item action key={k}>
                                   <div className="p-1 p-md-3 d-flex align-items-center justify-content-between">
                                      <p className="mb-0 text-capitalize fw-medium">{v?.type}</p>
                                      <a href={v?.url} className="fw-bolder" target="_blank">
                                         {v?.name}
                                      </a>
                                   </div>
                                </ListGroup.Item>
                             ))
                           : gerarArray(5).map((v, k) => (
                                <ListGroup.Item action key={k}>
                                   <div className="p-1 p-md-3">
                                      <Placeholder animation="wave" className="d-flex align-items-center justify-content-between">
                                         <Placeholder xs={3} />
                                         <Placeholder xs={6} />
                                      </Placeholder>
                                   </div>
                                </ListGroup.Item>
                             ))}
                     </ListGroup>
                  </Col>
               </Row>
            </Col>
         </Row>
      </Container>
   );
};

export default MoedaIndividual;
