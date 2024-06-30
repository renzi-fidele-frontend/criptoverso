import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CryptofetchOptions } from "../../services/cryptoApi";
import { setCriptomoedas } from "../../state/crypto/cryptoSlice";
import axios from "axios";
import { Button, Col, Container, Form, FormControl, Row } from "react-bootstrap";
import styles from "./Criptomoedas.module.css";
import CardMoeda from "../../components/CardMoeda/CardMoeda";

const Criptomoedas = () => {
   const [loading, setLoading] = useState(false);
   const { criptomoedas, paginaAtual, tamanhoPagina } = useSelector((state) => state.crypto);
   const dispatch = useDispatch();
   const [criptomoedasPaginadas, setCriptomoedasPaginadas] = useState([]);

   function paginarArray(array, paginaAtual, tamanhoPagina) {
      const startIndex = (paginaAtual - 1) * tamanhoPagina;
      const endIndex = startIndex + tamanhoPagina;
      return array?.slice(startIndex, endIndex);
   }

   async function apanharCriptomoedas() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/coins?limit=100" });
         console.log(res.data);
         dispatch(setCriptomoedas(res?.data?.data?.coins));
         setCriptomoedasPaginadas(paginarArray(res?.data?.data?.coins, paginaAtual, tamanhoPagina));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!criptomoedas) {
         apanharCriptomoedas();
      }
   }, [criptomoedas]);

   return (
      <Container id={styles.ct} fluid>
         {/*   Campo de pesquisa  */}
         <Row className="mb-5">
            <Col md={9}>
               <h2 className="fw-bold">Veja todas as criptomoedas do mercado</h2>
            </Col>
            <Col>
               <Form className="d-flex gap-2">
                  <FormControl placeholder="Encontre a sua moeda favorita" required type="text"></FormControl>
                  <Button type="submit">
                     <i className="bi bi-search"></i>
                  </Button>
               </Form>
            </Col>
         </Row>

         {/*  Todas as criptomoedas   */}
         <Row className="g-3">
            {criptomoedas ? (
               criptomoedasPaginadas.map((v, k) => (
                  <Col md={3} key={k}>
                     <CardMoeda moeda={v} />
                  </Col>
               ))
            ) : (
               <>
                  <p>Loading</p>
               </>
            )}
         </Row>
      </Container>
   );
};

export default Criptomoedas;
