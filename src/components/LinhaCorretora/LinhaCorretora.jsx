import { Badge, Collapse, Image, Placeholder } from "react-bootstrap";
import styles from "./LinhaCorretora.module.css";
import { useEffect, useState } from "react";
import translate from "translate";
import axios from "axios";
import naoDisponivel from "../../assets/semBandeira.png";

const LinhaCorretora = ({ corretora, chave }) => {
   const [mostrar, setMostrar] = useState(false);
   const [descricaoTraduzida, setDescricaoTraduzida] = useState("");
   const [paisTraduzido, setPaisTraduzido] = useState("");
   const [fotoBandeira, setFotoBandeira] = useState("");

   const [loading, setLoading] = useState(false);

   async function traduzirTexto() {
      setLoading(true);
      try {
         const descTraduzido = await translate(corretora?.Description, "pt");
         const coutryTraduzido = await translate(corretora?.Country, "pt");
         setPaisTraduzido(coutryTraduzido);
         setDescricaoTraduzida(descTraduzido);
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
         traduzirTexto();
         apanharCountryCode(corretora?.Country);
      }
   }, [corretora]);

   return corretora ? (
      <>
         <tr style={{ cursor: "pointer" }} onClick={() => setMostrar(!mostrar)}>
            <td className={styles.td}>{corretora?.numero}.</td>
            <td className={styles.td}>
               <div className="d-flex gap-1 gap-lg-3 flex-nowrap align-items-center">
                  <Image id={styles.foto} src={`https://www.cryptocompare.com/${corretora?.LogoUrl}`} />
                  <span className="fw-medium text-truncate">{corretora?.Name}</span>
               </div>
            </td>
            <td className={styles.td}>
               <div className="d-flex align-items-center h-100">
                  {corretora?.GradePoints === 0 && <Badge bg="warning">Indisponível</Badge>}
                  {corretora?.GradePoints >= 50 && <Badge bg="success">{corretora?.GradePoints}</Badge>}
                  {corretora?.GradePoints < 50 && corretora?.GradePoints > 0 && <Badge bg="danger">{corretora?.GradePoints}</Badge>}
               </div>
            </td>
            <td className={styles.td}>{corretora?.DISPLAYTOTALVOLUME24H?.BTC}</td>
            <td className={styles.td}>
               <div className="d-flex gap-2 align-items-center">
                  {loading ? (
                     <>
                        <Placeholder xs={12} animation="wave">
                           <Placeholder xs={9} />
                        </Placeholder>
                     </>
                  ) : (
                     <>
                        <Image id={styles.foto} src={fotoBandeira} />
                        <span>{paisTraduzido}</span>
                     </>
                  )}
               </div>
            </td>
            <td className={styles.td}>
               {corretora?.Trades ? (
                  <span className="text-success">
                     <i className="bi bi-check-circle-fill me-2"></i>Sim
                  </span>
               ) : (
                  <span className="text-danger">
                     <i className="bi bi-x-circle-fill me-2"></i>Não
                  </span>
               )}
            </td>
         </tr>
         {/*  Escondido  */}
         <div style={{ display: "table-row" }} className={`${!mostrar && "border-0"}`}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div className={styles.td}>{descricaoTraduzida}</div>
               </Collapse>
            </td>
         </div>
      </>
   ) : (
      <>
         <tr style={{ cursor: "pointer" }} onClick={() => setMostrar(!mostrar)}>
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
