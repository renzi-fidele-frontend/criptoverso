import { Col, Container, Row } from "react-bootstrap";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
   const fetchOptions = {
      method: "GET",
      url: "https://coinranking1.p.rapidapi.com/stats?referenceCurrencyUuid=yhjMzLPhuIDl",
      params: {
         referenceCurrencyUuid: "yhjMzLPhuIDl",
      },
      headers: {
         "x-rapidapi-key": "69b11e51eamsh115553615181e35p1ed117jsnfc95950b64fd",
         "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      },
   };

   async function apanharCryptoData() {
      const res = await axios.request(fetchOptions);
      console.log(res.data);
   }

   return (
      <div id={styles.ct}>
         <Container fluid>
            <h2 className="fw-bold mb-5">Estatísticas globais de criptomoedas</h2>
            <Row className="gy-3">
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Total de criptomoedas</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Total de movimentos</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Valor total de mercado</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Maior volume nas últimas 24h</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
               <Col md={6}>
                  <div>
                     <h5 className="text-secondary">Total de mercados</h5>
                     <p className="fs-2">12,155</p>
                  </div>
               </Col>
            </Row>

            <Row className="my-5">
               <Col md={6}>
                  <h2 className="fw-bold mb-5">Top 10 criptomoedas no mundo</h2>
                  <div></div>
               </Col>
               <Col className="text-end" md={6}>
                  <Link className="fs-3" to="/criptomoedas">
                     Ver mais
                  </Link>
               </Col>
            </Row>

            <Row>
               <Col md={6}>
                  <h2 className="fw-bold mb-5">Últimas notícias sobre o mundo Crypto</h2>
                  <div></div>
               </Col>
               <Col className="text-end" md={6}>
                  <Link className="fs-3" to="/criptomoedas">
                     Ver mais
                  </Link>
               </Col>
            </Row>
         </Container>
      </div>
   );
};

export default Home;
