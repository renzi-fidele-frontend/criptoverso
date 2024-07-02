import { Col, Container, Row } from "react-bootstrap";
import CardNoticia from "../../components/CardNoticia/CardNoticia";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setNoticias } from "../../state/crypto/cryptoSlice";
import { useEffect, useState } from "react";

const Noticias = () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();

   const { noticias } = useSelector((state) => state.crypto);

   async function apanharNoticias() {
      setLoading(true);
      let res;
      try {
         res = await axios.get(
            "https://min-api.cryptocompare.com/data/v2/news/?lang=PT&api_key=df6fc44edb45b681313377b928ca5f322340d29fdbb6b044d81a3f2095392499"
         );
         dispatch(setNoticias(res.data.Data));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!noticias) apanharNoticias();
   }, [noticias]);

   return (
      <Container fluid>
         <h2 className="fw-bold mb-4">Notícias</h2>

         <Row className="g-4">
            {noticias &&
               noticias.map((v, k) => {
                  if (k !== 1)
                     return (
                        <Col md={6} key={k}>
                           <CardNoticia noticia={v} />
                        </Col>
                     );
               })}
         </Row>
      </Container>
   );
};

export default Noticias;
