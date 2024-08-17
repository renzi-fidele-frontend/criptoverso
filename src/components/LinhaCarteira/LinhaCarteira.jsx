import { Badge, Col, Collapse, Image, Modal, Placeholder, Row } from "react-bootstrap";
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

const LinhaCarteira = ({ carteira, chave }) => {
   const [mostrar, setMostrar] = useState(false);
   const [segurancaTraduzido, setSegurancaTraduzido] = useState(false);
   const [facilidadeTraduzida, setFacilidadeTraduzida] = useState("");
   const { modoEscuro } = useSelector((state) => state.tema);
   const [mostrarClassificacao, setMostrarClassificacao] = useState(false);

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
         return <Image title={plataforma} src={android} />;
      } else if (plataforma?.toLowerCase()?.includes("mac")) {
         return <i title={plataforma} className="bi bi-apple"></i>;
      } else if (plataforma?.toLowerCase()?.includes("windows")) {
         return <Image title={plataforma} src={windows} />;
      } else if (plataforma?.toLowerCase()?.includes("linux")) {
         return <Image title={plataforma} src={linux} />;
      } else if (plataforma?.toLowerCase()?.includes("web")) {
         return <i title={plataforma} className="bi bi-globe"></i>;
      } else if (plataforma?.toLowerCase()?.includes("ios")) {
         return <Image title={plataforma} src={ios} />;
      } else if (plataforma?.toLowerCase()?.includes("hardware")) {
         return <Image title={plataforma} src={hardware} />;
      } else if (plataforma?.toLowerCase()?.includes("chrome")) {
         return <Image title={plataforma} src={chrome_extension} />;
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
                  {carteira?.Platforms?.map((v) => {
                     return iconePlataforma(v);
                  })}
               </div>
            </td>
            <td className={styles.td + " d-none d-xl-table-cell"}>
               {segurancaTraduzido.length > 0 ? (
                  segurancaTraduzido
               ) : (
                  <Placeholder xs={12} animation="wave">
                     <Placeholder xs={7} />
                  </Placeholder>
               )}
            </td>
            <td className={styles.td}>
               <div className="d-flex gap-2 align-items-center">
                  <span>{carteira?.Rating?.Avg}/5</span>
                  <div className="d-none d-xl-flex gap-1 align-items-center">
                     {gerarArray(carteira?.Rating?.Avg).map((v, k) => (
                        <Image key={k} id={styles.star} src={star} />
                     ))}
                  </div>
                  <Image className="d-xl-none" id={styles.star} src={star} />
               </div>
            </td>
            <td className={styles.td}>
               {facilidadeTraduzida.length > 0 ? (
                  facilidadeTraduzida
               ) : (
                  <Placeholder xs={12} animation="wave">
                     <Placeholder xs={7} />
                  </Placeholder>
               )}
            </td>
         </tr>
         {/*  Escondido  */}
         <div style={{ display: "table-row" }} className={`${!mostrar && "border-0"}`}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div className={`${styles.td} pb-2`}>
                     <div className="d-flex gap-3 mb-3">
                        <div>
                           <h6>Criptomoedas suportadas:</h6>
                           <span>- {carteira?.Coins?.join(" | ")}</span>
                        </div>
                        <div className="vr"></div>
                        <div>
                           <h6>Tipo de validação:</h6>
                           <span>- {carteira?.ValidationType}</span>
                        </div>
                        <div className="vr"></div>
                        <div>
                           <h6>Anônimidade:</h6>
                           <span>- {carteira?.Anonymity}</span>
                        </div>
                     </div>

                     <a target="_blank" className="text-bg-primary rounded-1 py-1 px-2 shadow-sm" href={carteira?.AffiliateURL}>
                        Utilizar carteira <i className="bi bi-box-arrow-in-up-right"></i>
                     </a>
                     <a
                        target="_blank"
                        className={`rounded-1 py-1 px-2 shadow-sm ms-2 ${modoEscuro ? "text-bg-light" : "text-bg-dark"}`}
                        href={carteira?.SourceCodeUrl}
                     >
                        Acessar repositório <i className="bi bi-github"></i>
                     </a>
                     <a
                        role="button"
                        onClick={() => setMostrarClassificacao(true)}
                        className={`text-bg-secondary rounded-1 py-1 px-2 shadow-sm ms-2 ${modoEscuro && "border-light border"}`}
                     >
                        Classificação detalhada <i className="bi bi-info-circle-fill"></i>
                     </a>
                     <Modal centered size="lg" show={mostrarClassificacao} onHide={() => setMostrarClassificacao(false)}>
                        <Modal.Header closeButton>
                           <Modal.Title>Classificação detalhada do {carteira?.Name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                           <Row>
                              <Col sm={3}>
                                 <h5 className="fst-italic mb-0">Média</h5>
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
                                          labels: ["1 Estrela", "2 Estrelas", "3 Estrelas", "4 Estrelas", "5 Estrelas"],
                                          datasets: [
                                             {
                                                label: "Classificações",
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
                              Total de classificações: <Badge className="fs-6 bg-secondary">{carteira?.Rating?.TotalUsers}</Badge>
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
};
export default LinhaCarteira;
