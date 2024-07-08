import { Card, Col, Image, Row } from "react-bootstrap";
import styles from "./CardNoticia.module.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { useEffect, useState } from "react";
import translate from "translate";

const CardNoticia = ({ noticia }) => {
   const [textoTraduzido, setTextoTraduzido] = useState("");

   async function traduzirTexto() {
      const tempo = moment.unix(noticia?.published_on).fromNow();
      try {
         const tempoTraduzido = await translate(tempo, "pt");
         setTextoTraduzido(tempoTraduzido);
      } catch (error) {
         console.log(error);
      }
   }

   useEffect(() => {
      traduzirTexto();
   }, [noticia]);

   return (
      <Card className={styles.ct} as={Link} to={noticia?.url} target="_blank">
         <Card.Body as={Row}>
            <Col>
               <Image className="border rounded-1" id={styles.fotoNoticia} src={noticia?.imageurl} />
            </Col>
            <Col className="d-flex flex-column justify-content-between">
               <Card.Title id={styles.titulo}>{noticia?.title}</Card.Title>
               <Card.Text id={styles.body}>{noticia?.body}</Card.Text>
               <Card.Footer className="d-flex gap-3 flex-row align-items-center">
                  <Image id={styles.fotoAutor} src={noticia?.source_info?.img} />
                  <div>
                     <Card.Text className="mb-0 ">{noticia?.source_info?.name}</Card.Text>
                     <span className="text-secondary fst-italic small">{textoTraduzido}</span>
                  </div>
               </Card.Footer>
            </Col>
         </Card.Body>
      </Card>
   );
};

export default CardNoticia;
