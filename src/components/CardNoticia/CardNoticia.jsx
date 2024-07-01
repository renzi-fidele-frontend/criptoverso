import { Card, Col, Image, Row } from "react-bootstrap";
import styles from "./CardNoticia.module.css";
import { Link } from "react-router-dom";

const CardNoticia = ({ noticia }) => {
   return (
      <Card className={styles.ct} as={Link}>
         <Card.Body as={Row}>
            <Col>
               <Image className="border rounded-1" id={styles.fotoNoticia} src={noticia?.imageurl} />
            </Col>
            <Col className="d-flex flex-column justify-content-between">
               <Card.Title id={styles.titulo}>{noticia?.title}</Card.Title>
               <Card.Text id={styles.body}>{noticia?.body}</Card.Text>
               <Card.Footer className="d-flex gap-3 flex-row align-items-center">
                  <Image id={styles.fotoAutor} src={noticia?.source_info?.img} />
                  <Card.Text>{noticia?.source_info?.name}</Card.Text>
               </Card.Footer>
            </Col>
         </Card.Body>
      </Card>
   );
};

export default CardNoticia;