import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CryptofetchOptions } from "../../services/cryptoApi";
import { setCriptomoedas, setPaginaAtual } from "../../state/crypto/cryptoSlice";
import axios from "axios";
import { Alert, Button, Col, Container, Form, FormControl, Image, Pagination, Row } from "react-bootstrap";
import styles from "./Criptomoedas.module.css";
import CardMoeda from "../../components/CardMoeda/CardMoeda";
import { gerarArray } from "../../hooks/useGerarArray";
import nadaEncontrado from "../../assets/nadaEncontrado.png";

const Criptomoedas = () => {
   const [loading, setLoading] = useState(false);
   const { criptomoedas, paginaAtual, tamanhoPagina, totalPaginas } = useSelector((state) => state.crypto);
   const dispatch = useDispatch();
   const [criptomoedasPaginadas, setCriptomoedasPaginadas] = useState([]);
   const [resultadosPesquisaInstantanea, setResultadosPesquisaInstantanea] = useState(null);
   const termoPesquisaRef = useRef(null);

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

   function pesquisarAoDigitar() {
      if (termoPesquisaRef?.current?.value === "") return setResultadosPesquisaInstantanea([]);
      setResultadosPesquisaInstantanea(
         criptomoedas?.filter((criptomoeda) => criptomoeda?.name?.toLowerCase()?.includes(termoPesquisaRef?.current?.value?.toLowerCase()))
      );
   }

   async function pesquisarCriptomoeda(e) {
      e.preventDefault;
   }

   useEffect(() => {
      if (!criptomoedas) apanharCriptomoedas();

      if (criptomoedasPaginadas?.length === 0) setCriptomoedasPaginadas(paginarArray(criptomoedas, paginaAtual, tamanhoPagina));
   }, [criptomoedas, criptomoedasPaginadas]);

   return (
      <Container id={styles.ct} fluid>
         {/*   Campo de pesquisa  */}

         {/*   TODO: Adicionar feature de pesquisa ao se clickar no botão */}
         <Row className="mb-5">
            <Col md={9}>
               <h2 className="fw-bold">Veja todas as criptomoedas do mercado</h2>
            </Col>
            <Col>
               <Form onSubmit={pesquisarCriptomoeda} className="d-flex gap-2">
                  <FormControl
                     ref={termoPesquisaRef}
                     placeholder="Encontre a sua moeda favorita"
                     onChange={pesquisarAoDigitar}
                     required
                     type="text"
                  ></FormControl>
                  <Button type="submit">
                     <i className="bi bi-search"></i>
                  </Button>
               </Form>
            </Col>
         </Row>

         {/*  Todas as criptomoedas   */}
         <Row className="g-3">
            {criptomoedas && !resultadosPesquisaInstantanea ? (
               criptomoedasPaginadas.map((v, k) => (
                  <Col md={3} key={k}>
                     <CardMoeda moeda={v} />
                  </Col>
               ))
            ) : (
               <>{!resultadosPesquisaInstantanea && <p>Loading</p>}</>
            )}
            {criptomoedas &&
               resultadosPesquisaInstantanea?.length > 0 &&
               resultadosPesquisaInstantanea?.map((v, k) => (
                  <Col md={3} key={k}>
                     <CardMoeda moeda={v} />
                  </Col>
               ))}
            {criptomoedas && resultadosPesquisaInstantanea?.length === 0 && (
               <Col className="align-items-center d-flex flex-column">
                  <Image id={styles.nadaEncontrado} src={nadaEncontrado} />
                  <Alert className="mt-4">Nada foi encontrado, tente clicar no botão de pesquisa</Alert>
               </Col>
            )}
         </Row>

         {/*  Paginação  */}
         {!resultadosPesquisaInstantanea && (
            <Row className="mt-2 mb-1 mb-md-0">
               <Col className="mt-md-5">
                  <Pagination size="lg" className="d-none d-md-flex justify-content-center">
                     {gerarArray(totalPaginas)?.map((v, k) => (
                        <Pagination.Item
                           onClick={() => {
                              if (v !== paginaAtual.current) {
                                 window.scrollTo({ top: 0, behavior: "smooth" });
                                 dispatch(setPaginaAtual(v));
                                 setCriptomoedasPaginadas(paginarArray(criptomoedas, v, tamanhoPagina));
                              }
                           }}
                           active={v === paginaAtual}
                           key={k}
                        >
                           {v}
                        </Pagination.Item>
                     ))}
                  </Pagination>
               </Col>
            </Row>
         )}
      </Container>
   );
};

export default Criptomoedas;
