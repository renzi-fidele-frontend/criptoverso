import { Badge, Collapse, Image } from "react-bootstrap";
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

   return (
      <>
         <tr style={{ cursor: "pointer" }} onClick={() => setMostrar(!mostrar)}>
            <td>{chave + 1}.</td>
            <td>
               <Image id={styles.foto} src={`https://www.cryptocompare.com/${corretora?.LogoUrl}`} />
               <span className="fw-medium ms-3">{corretora?.Name}</span>
            </td>
            <td>
               {corretora?.GradePoints === 0 && <Badge bg="warning">Indisponível</Badge>}
               {corretora?.GradePoints >= 50 && <Badge bg="success">{corretora?.GradePoints}</Badge>}
               {corretora?.GradePoints < 50 && corretora?.GradePoints > 0 && <Badge bg="danger">{corretora?.GradePoints}</Badge>}
            </td>
            <td>{corretora?.DISPLAYTOTALVOLUME24H?.BTC}</td>
            <td>{paisTraduzido}</td>
            <td>
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
         <div style={{ display: "table-row" }} className={!mostrar && "border-0"}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div>{descricaoTraduzida}</div>
               </Collapse>
            </td>
         </div>
      </>
   );
};

export default LinhaCorretora;
