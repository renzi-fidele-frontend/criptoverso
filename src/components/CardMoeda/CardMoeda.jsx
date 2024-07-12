import millify from "millify";
import { Card, Image, Placeholder } from "react-bootstrap";
import styles from "./CardMoeda.module.css";
import { Link } from "react-router-dom";

const CardMoeda = ({ moeda }) => {
   return moeda ? (
      <Card as={Link} className={styles.ct} preventScrollReset={false} to={`/criptomoeda/${moeda.uuid}`}>
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
   ) : (
      <Card className={`${styles.ct}`}>
         <Card.Header>
            <Placeholder className="flex-row align-items-center justify-content-between d-flex" xs={12} animation="wave">
               <Placeholder xs={8} />
               <Placeholder id={styles.foto} xs={3} />
            </Placeholder>
         </Card.Header>
         <Card.Body>
            <Placeholder className="d-flex flex-column gap-3" xs={12} animation="wave">
               <p>
                  Preço: <Placeholder xs={2} /> USD
               </p>
               <p>
                  Volume de mercado:{" "}
                  <span>
                     <Placeholder xs={2} />
                  </span>{" "}
                  USD
               </p>
               <p>
                  Alteração:{" "}
                  <span className={`text-success`}>
                     <Placeholder xs={2} /> %
                  </span>
               </p>
            </Placeholder>
         </Card.Body>
      </Card>
   );
};

export default CardMoeda;
