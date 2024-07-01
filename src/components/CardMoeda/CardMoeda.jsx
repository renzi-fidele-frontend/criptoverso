import millify from "millify";
import { Card, Image } from "react-bootstrap";
import styles from "./CardMoeda.module.css";
import { Link } from "react-router-dom";

const CardMoeda = ({ moeda }) => {
   return (
      <Card as={Link} className={styles.ct} to={`/criptomoeda/${moeda.uuid}`}>
         <Card.Header className="flex-row align-items-center justify-content-between d-flex">
            <p className="mb-0 fw-medium">{`${moeda?.rank}. ${moeda?.name}`}</p>
            <Image id={styles.foto} src={moeda?.iconUrl} />
         </Card.Header>
         <Card.Body>
            <p>Preço: {millify(moeda?.price)} USD</p>
            <p>
               Volume de mercado: <span>{millify(moeda?.marketCap)}</span>
            </p>
            <p>
               Alteração:{" "}
               <span className={`${Number(millify(moeda?.change)) >= 0 ? "text-success" : "text-danger"}`}>{millify(moeda?.change)}%</span>
            </p>
         </Card.Body>
      </Card>
   );
};

export default CardMoeda;
