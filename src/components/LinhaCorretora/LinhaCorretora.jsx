import Badge from "react-bootstrap/Badge";
import Collapse from "react-bootstrap/Collapse";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";

import styles from "./LinhaCorretora.module.css";
import { useEffect, useState } from "react";
import translate from "translate";
import axios from "axios";
import naoDisponivel from "../../assets/semBandeira.png";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const LinhaCorretora = ({ corretora, chave }) => {
   const { t } = useTranslation();
   const [mostrar, setMostrar] = useState(false);
   const [descricaoTraduzida, setDescricaoTraduzida] = useState("");
   const [paisTraduzido, setPaisTraduzido] = useState("");
   const [fotoBandeira, setFotoBandeira] = useState("");
   const [mostrarModal, setMostrarModal] = useState(false);
   const [taxas, setTaxas] = useState("");
   const [metodosDep, setMetodosDep] = useState("");
   const [metodosLev, setMetodosLev] = useState("");
   const { lang } = useSelector((state) => state.idioma);

   const [loading, setLoading] = useState(false);

   async function traduzirTexto() {
      setLoading(true);
      try {
         const descTraduzido = await translate(corretora?.Description, "pt");
         const coutryTraduzido = await translate(corretora?.Country, "pt");
         const taxasTraduzido = await translate(corretora?.Fees, "pt");
         const metodosDepTraduzido = await translate(corretora?.DepositMethods, "pt");
         const metodosLevTraduzido = await translate(corretora?.WithdrawalMethods, "pt");

         setPaisTraduzido(coutryTraduzido);
         setDescricaoTraduzida(descTraduzido);
         setTaxas(taxasTraduzido);
         setMetodosDep(metodosDepTraduzido);
         setMetodosLev(metodosLevTraduzido);
      } catch (error) {
         console.log("Erro ao traduzir");
      }
      setLoading(false);
   }

   async function apanharCountryCode(nome) {
      try {
         const res = await axios(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(nome?.toLowerCase()?.includes("u.s.a") ? "united states" : nome)}`
         );
         setFotoBandeira(res.data[0].flags.png);
      } catch (error) {
         console.log(error.message);
         setFotoBandeira(naoDisponivel);
      }
   }

   useEffect(() => {
      if (corretora) {
         if (lang === "pt") traduzirTexto();
         apanharCountryCode(corretora?.Country);
      }
   }, [corretora]);

   return corretora ? (
      <>
         <tr role="button" onClick={() => setMostrar(!mostrar)}>
            <td className={styles.td}>{corretora?.numero}.</td>
            <td className={styles.td}>
               <div className="d-flex gap-1 gap-lg-3 flex-nowrap align-items-center">
                  <Image id={styles.foto} src={`https://www.cryptocompare.com/${corretora?.LogoUrl}`} />
                  <span className="fw-medium text-truncate">{corretora?.Name}</span>
               </div>
            </td>
            <td className={styles.td}>
               <div className="d-flex align-items-center h-100">
                  {corretora?.GradePoints === 0 && <Badge bg="warning">{t("components.linha_corretora.noGradePoins")}</Badge>}
                  {corretora?.GradePoints >= 50 && <Badge bg="success">{corretora?.GradePoints}</Badge>}
                  {corretora?.GradePoints < 50 && corretora?.GradePoints > 0 && <Badge bg="danger">{corretora?.GradePoints}</Badge>}
               </div>
            </td>
            <td className={styles.td}>{corretora?.DISPLAYTOTALVOLUME24H?.BTC}</td>
            <td className={styles.td}>
               <div className="d-flex gap-2 align-items-center">
                  {loading ? (
                     <Placeholder xs={12} animation="wave">
                        <Placeholder xs={9} />
                     </Placeholder>
                  ) : (
                     <>
                        <Image id={styles.foto} src={fotoBandeira} />
                        <span>{lang === "pt" ? paisTraduzido : corretora?.Country}</span>
                     </>
                  )}
               </div>
            </td>
            <td className={styles.td}>
               {corretora?.Trades ? (
                  <span className="text-success">
                     <i className="bi bi-check-circle-fill me-2"></i>
                     {t("components.linha_corretora.trades")}
                  </span>
               ) : (
                  <span className="text-danger">
                     <i className="bi bi-x-circle-fill me-2"></i>
                     {t("components.linha_corretora.noTrades")}
                  </span>
               )}
            </td>
         </tr>
         {/*  Escondido  */}
         <div className={`d-table-row ${!mostrar && "border-0"}`}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div className={`${styles.td} pb-2`}>
                     <p>{lang === "pt" ? descricaoTraduzida : corretora?.Description}</p>
                     <div>
                        <h6 className="mb-0">{t("components.linha_corretora.address")}</h6>
                        <p>- {corretora?.FullAddress.length > 0 ? corretora?.FullAddress : t("components.linha_corretora.noAddress")}</p>
                     </div>
                     <div>
                        <h6 className="mb-0">{t("components.linha_corretora.taxes")}</h6>
                        <p dangerouslySetInnerHTML={{ __html: lang === "pt" ? taxas : corretora?.Fees }}></p>
                     </div>
                     <div>
                        <h6 className="mb-0">{t("components.linha_corretora.depMets")}</h6>
                        <p dangerouslySetInnerHTML={{ __html: lang === "pt" ? metodosDep : corretora?.DepositMethods }}></p>
                     </div>
                     <div>
                        <h6 className="mb-0">{t("components.linha_corretora.witMets")}</h6>
                        <p dangerouslySetInnerHTML={{ __html: lang === "pt" ? metodosLev : corretora?.WithdrawalMethods }}></p>
                     </div>
                     {/*  Botões */}
                     <a target="_blank" className="text-bg-primary border border-primary rounded-1 p-1 shadow-sm" href={corretora?.AffiliateURL}>
                        {t("components.linha_corretora.officialSite")} <i className="bi bi-globe"></i>
                     </a>
                     {/*  Pontuação detalhada */}
                     <a
                        href="#"
                        onClick={() => setMostrarModal(true)}
                        className="text-bg-secondary border-secondary ms-3 border rounded-1 p-1 shadow-sm"
                     >
                        {t("components.linha_corretora.points")} <i className="bi bi-info-circle-fill"></i>
                     </a>
                     <Modal size="lg" centered onHide={() => setMostrarModal(false)} show={mostrarModal}>
                        <Modal.Header closeButton>
                           <Modal.Title>
                              {t("components.linha_corretora.titPoints")} {corretora?.Name}
                           </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <div id={styles.chartCt}>
                              <Pie
                                 data={{
                                    labels: [
                                       t("components.linha_corretora.chartLabels.0"),
                                       t("components.linha_corretora.chartLabels.1"),
                                       t("components.linha_corretora.chartLabels.2"),
                                       t("components.linha_corretora.chartLabels.3"),
                                       t("components.linha_corretora.chartLabels.4"),
                                       t("components.linha_corretora.chartLabels.5"),
                                       t("components.linha_corretora.chartLabels.6"),
                                       t("components.linha_corretora.chartLabels.7"),
                                    ],
                                    datasets: [
                                       {
                                          data: [
                                             corretora?.GradePointsSplit?.Legal,
                                             corretora?.GradePointsSplit?.KYCAndTransactionRisk,
                                             corretora?.GradePointsSplit?.Team,
                                             corretora?.GradePointsSplit?.DataProvision,
                                             corretora?.GradePointsSplit?.AssetQualityAndDiversity,
                                             corretora?.GradePointsSplit?.MarketQuality,
                                             corretora?.GradePointsSplit?.Security,
                                             corretora?.GradePointsSplit?.NegativeReportsPenalty,
                                          ],
                                       },
                                    ],
                                 }}
                              />
                           </div>
                        </Modal.Body>
                        <Modal.Footer className="flex-column flex-sm-row">
                           <p>
                              {t("components.linha_corretora.totalPoints")}:{" "}
                              {corretora?.GradePoints === 0 && (
                                 <Badge className="fs-6" bg="warning">
                                    {t("components.linha_corretora.noGradePoints")}
                                 </Badge>
                              )}
                              {corretora?.GradePoints >= 50 && (
                                 <Badge className="fs-6" bg="success">
                                    {corretora?.GradePoints}
                                 </Badge>
                              )}
                              {corretora?.GradePoints < 50 && corretora?.GradePoints > 0 && (
                                 <Badge className="fs-6" bg="danger">
                                    {corretora?.GradePoints}
                                 </Badge>
                              )}
                           </p>
                           <div className="vr d-none d-sm-block"></div>
                           <p>
                              {t("components.linha_corretora.rank")}:{" "}
                              <Badge bg="secondary" className="fw-bolder fs-6">
                                 {corretora?.Grade}
                              </Badge>
                           </p>
                        </Modal.Footer>
                     </Modal>
                  </div>
               </Collapse>
            </td>
         </div>
      </>
   ) : (
      <>
         <tr>
            <td className={styles.td}>
               <Placeholder animation="wave">
                  <Placeholder xs={4} xl={3} />.
               </Placeholder>
            </td>
            <td className={styles.td}>
               <div>
                  <Placeholder className="d-flex gap-1 gap-lg-3 flex-nowrap align-items-center" animation="wave">
                     <Placeholder id={styles.foto} />
                     <Placeholder xs={7} />
                  </Placeholder>
               </div>
            </td>
            <td className={styles.td}>
               <div>
                  <Placeholder className="d-flex align-items-center h-100" animation="wave">
                     <Placeholder xs={4} />
                  </Placeholder>
               </div>
            </td>
            <td className={styles.td}>
               <Placeholder animation="wave">
                  <Placeholder xs={4} />
               </Placeholder>
            </td>
            <td className={styles.td}>
               <Placeholder animation="wave">
                  <Placeholder xs={7} />
               </Placeholder>
            </td>
            <td className={styles.td}>
               <Placeholder animation="wave">
                  <Placeholder xs={4} />
               </Placeholder>
            </td>
         </tr>
      </>
   );
};

export default LinhaCorretora;
