import { Badge, Collapse, Image } from "react-bootstrap";
import styles from "./LinhaCorretora.module.css";
import { useState } from "react";

const LinhaCorretora = ({ corretora, chave }) => {
   const [mostrar, setMostrar] = useState(false);

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
            <td>{corretora?.Country}</td>
            <td>
               {corretora?.Trades ? (
                  <span className="text-success">
                     <i className="bi bi-check-circle-fill me-2"></i>Sim
                  </span>
               ) : (
                  <span className="text-danger">
                     <i className="bi bi-x-circle-fill me-2 border"></i>Não
                  </span>
               )}
            </td>
         </tr>
         {/*  Escondido  */}
         <div style={{ display: "table-row" }} className={!mostrar && "border-0"}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div>{corretora?.Description}</div>
               </Collapse>
            </td>
         </div>
      </>
   );
};

export default LinhaCorretora;
