import { Badge, Collapse, Image, Placeholder } from "react-bootstrap";
import styles from "./LinhaCorretora.module.css";
import { useEffect, useState } from "react";
import translate from "translate";

const LinhaCorretora = ({ corretora, chave }) => {
   const [mostrar, setMostrar] = useState(false);
   const [descricaoTraduzida, setDescricaoTraduzida] = useState("");
   const [paisTraduzido, setPaisTraduzido] = useState("");
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

   useEffect(() => {
      traduzirTexto();
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
            <td className={styles.td}>{paisTraduzido}</td>
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
         <Placeholder></Placeholder>
         <tr style={{ cursor: "pointer" }} onClick={() => setMostrar(!mostrar)}>
            <td className={styles.td}>
               <Placeholder xs={4} xl={3} />.
            </td>
            <td className={styles.td}>
               <div className="d-flex gap-1 gap-lg-3 flex-nowrap align-items-center">
                  <Placeholder id={styles.foto} />
                  <Placeholder xs={7} />
               </div>
            </td>
            <td className={styles.td}>
               <div className="d-flex align-items-center h-100">
                  <Placeholder xs={4} />
               </div>
            </td>
            <td className={styles.td}>
               <Placeholder xs={4} />
            </td>
            <td className={styles.td}>
               <Placeholder xs={7} />
            </td>
            <td className={styles.td}>
               <Placeholder xs={4} />
            </td>
         </tr>
      </>
   );
};

export default LinhaCorretora;
