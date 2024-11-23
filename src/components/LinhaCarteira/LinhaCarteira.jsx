import Badge from "react-bootstrap/Badge";
import Col from "react-bootstrap/Col";
import Collapse from "react-bootstrap/Collapse";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import styles from "./LinhaCarteira.module.css";
import { useEffect, useState } from "react";
import linux from "../../assets/linux.png";
import ios from "../../assets/ios.png";
import windows from "../../assets/windows.png";
import android from "../../assets/android.png";
import hardware from "../../assets/hardware.png";
import star from "../../assets/star.png";
import chrome_extension from "../../assets/chrome_extension.png";
import { gerarArray } from "../../hooks/useGerarArray";
import translate from "translate";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import Tooltip from "../Tooltip/Tooltip";

function LinhaCarteira({ carteira }) {
   const { t } = useTranslation();
   const [mostrar, setMostrar] = useState(false);
   const [segurancaTraduzido, setSegurancaTraduzido] = useState(false);
   const [facilidadeTraduzida, setFacilidadeTraduzida] = useState("");
   const { modoEscuro } = useSelector((state) => state.tema);
   const [mostrarClassificacao, setMostrarClassificacao] = useState(false);
   const { lang } = useSelector((state) => state.idioma);

   async function traduzirTexto() {
      try {
         const secTraduzido = await translate(carteira?.Security, "pt");
         const easyTraduzido = await translate(carteira?.EaseOfUse, "pt");
         setSegurancaTraduzido(secTraduzido);
         setFacilidadeTraduzida(easyTraduzido);
      } catch (error) {
         console.log(error.message);
      }
   }

   useEffect(() => {
      if (carteira) traduzirTexto();
   }, [carteira]);

   const iconePlataforma = (plataforma) => {
      if (plataforma?.toLowerCase()?.includes("android")) {
         return <Image src={android} />;
      } else if (plataforma?.toLowerCase()?.includes("mac")) {
         return <i className="bi bi-apple"></i>;
      } else if (plataforma?.toLowerCase()?.includes("windows")) {
         return <Image src={windows} />;
      } else if (plataforma?.toLowerCase()?.includes("linux")) {
         return <Image src={linux} />;
      } else if (plataforma?.toLowerCase()?.includes("web")) {
         return <i className="bi bi-globe"></i>;
      } else if (plataforma?.toLowerCase()?.includes("ios")) {
         return <Image src={ios} />;
      } else if (plataforma?.toLowerCase()?.includes("hardware")) {
         return <Image src={hardware} />;
      } else if (plataforma?.toLowerCase()?.includes("chrome")) {
         return <Image src={chrome_extension} />;
      }
   };

   return carteira ? (
      <>
         <tr style={{ cursor: "pointer" }} onClick={() => setMostrar(!mostrar)}>
            <td className={styles.td}>{carteira?.numero}.</td>
            <td className={styles.td}>
               <div className="d-flex gap-1 gap-lg-3 flex-nowrap align-items-center">
                  <Image id={styles.foto} src={`https://www.cryptocompare.com/${carteira?.LogoUrl}`} />
                  <span className="fw-medium text-truncate">{carteira?.Name}</span>
               </div>
            </td>
            <td className={styles.td}>
               <div id={styles.plataformas} className="d-flex gap-2 align-items-center flex-wrap h-100 ">
                  {carteira?.Platforms?.map((v, k) => {
                     return (
                        <Tooltip conteudo={v} key={k}>
                           {iconePlataforma(v)}
                        </Tooltip>
                     );
                  })}
               </div>
            </td>
            <td className={styles.td + " d-none d-xl-table-cell"}>
               {lang === "pt" &&
                  (segurancaTraduzido.length > 0 ? (
                     segurancaTraduzido
                  ) : (
                     <Placeholder xs={12} animation="wave">
                        <Placeholder xs={7} />
                     </Placeholder>
                  ))}
               {lang === "en" &&
                  (carteira?.Security.length > 0 ? (
                     carteira?.Security
                  ) : (
                     <Placeholder xs={12} animation="wave">
                        <Placeholder xs={7} />
                     </Placeholder>
                  ))}
            </td>
            {/* TODO: Melhorar renderização da classificação de estrelas
             */}
            <td className={styles.td}>
               <div className="d-flex gap-2 align-items-center">
                  {gerarArray(5).map((v, k) => (
                     <>
                        {/* Prencher as alcancadas  */}
                        {Math.floor(carteira?.Rating?.Avg) >= k + 1 && <i className="bi-star-fill" key={k}></i>}

                        {/* Adicionar metade caso o arredondamento seja aplicavel */}
                        {Math.floor(carteira?.Rating?.Avg) === k && <i className="bi-star-half" key={k}></i>}
                     </>
                  ))}

                  {/* <span>{carteira?.Rating?.Avg}/5</span>
                  <div className="d-none d-xl-flex gap-1 align-items-center">
                     {gerarArray(carteira?.Rating?.Avg).map((v, k) => (
                        <Image key={k} id={styles.star} src={star} />
                     ))}
                  </div> 
                  <Image className="d-xl-none" id={styles.star} src={star} /> */}
               </div>
            </td>
            <td className={styles.td}>
               {lang === "pt" &&
                  (facilidadeTraduzida.length > 0 ? (
                     facilidadeTraduzida
                  ) : (
                     <Placeholder xs={12} animation="wave">
                        <Placeholder xs={7} />
                     </Placeholder>
                  ))}
               {lang === "en" &&
                  (carteira?.EaseOfUse?.length > 0 ? (
                     carteira?.EaseOfUse
                  ) : (
                     <Placeholder xs={12} animation="wave">
                        <Placeholder xs={7} />
                     </Placeholder>
                  ))}
            </td>
         </tr>
         {/*  Escondido  */}
         <div style={{ display: "table-row" }} className={`${!mostrar && "border-0"}`}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div className={`${styles.td} pb-2`}>
                     <div className="d-flex gap-3 mb-3">
                        <div>
                           <h6>{t("components.linha_carteira.coins")}</h6>
                           <span>- {carteira?.Coins?.join(" | ")}</span>
                        </div>
                        <div className="vr"></div>
                        <div>
                           <h6>{t("components.linha_carteira.valid")}:</h6>
                           <span>- {carteira?.ValidationType}</span>
                        </div>
                        <div className="vr"></div>
                        <div>
                           <h6>{t("components.linha_carteira.anon")}:</h6>
                           <span>- {carteira?.Anonymity}</span>
                        </div>
                     </div>

                     <a target="_blank" className="text-bg-primary rounded-1 py-1 px-2 shadow-sm" href={carteira?.AffiliateURL}>
                        {t("components.linha_carteira.btn1")} <i className="bi bi-box-arrow-in-up-right"></i>
                     </a>
                     {carteira?.SourceCodeUrl ? (
                        <a
                           target="_blank"
                           className={`rounded-1 py-1 px-2 shadow-sm ms-2 ${modoEscuro ? "text-bg-light" : "text-bg-dark"}`}
                           href={carteira?.SourceCodeUrl}
                        >
                           {t("components.linha_carteira.btn2")} <i className="bi bi-github"></i>
                        </a>
                     ) : (
                        <a
                           style={{ cursor: "not-allowed" }}
                           target="_blank"
                           className={`rounded-1 py-1 px-2 shadow-sm ms-2 ${modoEscuro ? "text-bg-light" : "text-bg-dark"}`}
                        >
                           {t("components.linha_carteira.noRepo")} <i className="bi bi-github"></i>
                        </a>
                     )}

                     <a
                        role="button"
                        onClick={() => setMostrarClassificacao(true)}
                        className={`text-bg-secondary rounded-1 py-1 px-2 shadow-sm ms-2 ${modoEscuro && "border-light border"}`}
                     >
                        {t("components.linha_carteira.btn3")} <i className="bi bi-info-circle-fill"></i>
                     </a>
                     <Modal centered size="lg" show={mostrarClassificacao} onHide={() => setMostrarClassificacao(false)}>
                        <Modal.Header closeButton>
                           <Modal.Title>
                              {t("components.linha_carteira.titMod")} {carteira?.Name}
                           </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <Row>
                              <Col sm={3}>
                                 <h5 className="fst-italic mb-0">{t("components.linha_carteira.avg")}</h5>
                                 <hr />
                                 <h6 id={styles.media}>{carteira?.Rating?.Avg}</h6>
                                 <div className="d-flex gap-2 mb-3 mb-sm-0">
                                    {gerarArray(carteira?.Rating?.Avg).map((v, k) => (
                                       <Image src={star} key={k} />
                                    ))}
                                 </div>
                              </Col>
                              <Col sm={9}>
                                 <div id={styles.chartCt}>
                                    <Bar
                                       data={{
                                          labels: [
                                             t("components.linha_carteira.chartLabels.0"),
                                             t("components.linha_carteira.chartLabels.1"),
                                             t("components.linha_carteira.chartLabels.2"),
                                             t("components.linha_carteira.chartLabels.3"),
                                             t("components.linha_carteira.chartLabels.4"),
                                          ],
                                          datasets: [
                                             {
                                                label: t("components.linha_carteira.chartLabel"),
                                                data: [
                                                   carteira?.Rating?.One,
                                                   carteira?.Rating?.Two,
                                                   carteira?.Rating?.Three,
                                                   carteira?.Rating?.Four,
                                                   carteira?.Rating?.Five,
                                                ],
                                             },
                                          ],
                                       }}
                                       options={{ indexAxis: "y", responsive: true }}
                                    />
                                 </div>
                              </Col>
                           </Row>
                        </Modal.Body>
                        <Modal.Footer>
                           <span>
                              {t("components.linha_carteira.totUsers")}:{" "}
                              <Badge className="fs-6 bg-secondary">{carteira?.Rating?.TotalUsers}</Badge>
                           </span>
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
                  <Placeholder className="d-flex gap-3 align-items-center h-100" animation="wave">
                     <Placeholder id={styles.foto} />
                     <Placeholder id={styles.foto} />
                     <Placeholder id={styles.foto} />
                  </Placeholder>
               </div>
            </td>
            <td className={styles.td + " d-none d-xl-table-cell"}>
               <Placeholder animation="wave">
                  <Placeholder xs={7} />
               </Placeholder>
            </td>
            <td className={styles.td}>
               <Placeholder animation="wave" className="d-flex align-items-center">
                  <Placeholder xs={2} /> <span className="ms-1">/5</span>
                  <Image className="ms-2" id={styles.star} src={star} />
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
}
export default LinhaCarteira;
