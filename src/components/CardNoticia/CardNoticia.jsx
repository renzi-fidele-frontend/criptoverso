import { Card, Col, Image, Placeholder, Row } from "react-bootstrap";
import styles from "./CardNoticia.module.css";
import { Link } from "react-router-dom";
import moment from "moment";
import { useEffect, useState } from "react";
import translate from "translate";
import { useSelector } from "react-redux";

const CardNoticia = ({ noticia }) => {
   const { lang } = useSelector((state) => state.idioma);
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
      if (lang === "pt") traduzirTexto();
   }, [noticia]);

   return noticia ? (
      <Card className={styles.ct} as={Link} to={noticia?.url} target="_blank">
         <Card.Body as={Row}>
            <Col xs={12} xl={6} className="position-relative">
               <div className="border rounded-1" id={styles.fotoIndisponivel}>
                  <Image  id={styles.fotoNoticia} src={noticia?.imageurl} />
               </div>
            </Col>
            <Col className="d-flex pt-2 pt-xl-0 flex-column justify-content-between">
               <Card.Title id={styles.titulo}>{noticia?.title}</Card.Title>
               <Card.Text id={styles.body}>{noticia?.body}</Card.Text>
               <Card.Footer className="d-flex gap-3 flex-row align-items-center">
                  <Image id={styles.fotoAutor} src={noticia?.source_info?.img} />
                  <div>
                     <Card.Text className="mb-0 ">{noticia?.source_info?.name}</Card.Text>
                     <span className="text-secondary fst-italic small">{lang === "pt" ? textoTraduzido : moment.unix(noticia?.published_on).fromNow() }</span>
                  </div>
               </Card.Footer>
            </Col>
         </Card.Body>
      </Card>
   ) : (
      <Card className={styles.ct} as={Link} to={noticia?.url} target="_blank">
         <Placeholder xs={12} animation="wave">
            <Card.Body as={Row}>
               <Col xs={12} xl={6}>
                  <Placeholder xs={12} className="border rounded-1" id={styles.fotoNoticia} />
               </Col>
               <Col className="d-flex pt-2 pt-xl-0 flex-column justify-content-between">
                  <Card.Title id={styles.titulo}>
                     <Placeholder xs={8} />
                  </Card.Title>
                  <div className="pb-3 pb-xl-0">
                     <Card.Text>
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                        <Placeholder xs={12} />
                     </Card.Text>
                  </div>
                  <Card.Footer className="d-flex gap-3 flex-row align-items-center">
                     <Placeholder id={styles.fotoAutor} />
                     <div className="w-100">
                        <Card.Text className="mb-0 d-flex flex-column gap-2">
                           <Placeholder xs={7} />
                           <div>
                              <Placeholder xs={2} />/<Placeholder xs={2} />/<Placeholder xs={2} />
                           </div>
                        </Card.Text>
                     </div>
                  </Card.Footer>
               </Col>
            </Card.Body>
         </Placeholder>
      </Card>
   );
};

export default CardNoticia;
