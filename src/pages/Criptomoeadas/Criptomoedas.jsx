import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CryptofetchOptions } from "../../services/cryptoApi";
import { setCriptomoedas, setPaginaAtualCriptomoedas } from "../../state/criptomoedas/criptomoedasSlice";
import axios from "axios";
import { Alert, Button, Col, Container, Form, FormControl, Image, Pagination, Row } from "react-bootstrap";
import styles from "./Criptomoedas.module.css";
import CardMoeda from "../../components/CardMoeda/CardMoeda";
import { gerarArray } from "../../hooks/useGerarArray";
import nadaEncontrado from "../../assets/nadaEncontrado.png";
import { paginarArray } from "../../hooks/usePaginarArray";

const Criptomoedas = () => {
   const [loading, setLoading] = useState(false);
   const { criptomoedas, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas, totalPaginasCriptomoedas } = useSelector(
      (state) => state.criptomoedas
   );

   const dispatch = useDispatch();
   const [criptomoedasPaginadas, setCriptomoedasPaginadas] = useState([]);
   const [resultadosPesquisaInstantanea, setResultadosPesquisaInstantanea] = useState(null);
   const termoPesquisaRef = useRef(null);

   async function apanharCriptomoedas() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/coins?limit=100" });
         console.log(res.data);
         dispatch(setCriptomoedas(res?.data?.data?.coins));
         setCriptomoedasPaginadas(paginarArray(res?.data?.data?.coins, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   function pesquisarAoDigitar() {
      if (termoPesquisaRef?.current?.value === "") return setResultadosPesquisaInstantanea(null);
      setResultadosPesquisaInstantanea(
         criptomoedas?.filter((criptomoeda) => criptomoeda?.name?.toLowerCase()?.includes(termoPesquisaRef?.current?.value?.toLowerCase()))
      );
   }

   /*   TODO: Adicionar feature de pesquisa ao se clickar no botão */
   async function pesquisarCriptomoeda(e) {
      e.preventDefault;
   }

   useEffect(() => {
      if (!criptomoedas) apanharCriptomoedas();

      if (criptomoedasPaginadas?.length === 0 && criptomoedas)
         setCriptomoedasPaginadas(paginarArray(criptomoedas, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas));
   }, [criptomoedas, criptomoedasPaginadas]);

   return (
      <Container id={styles.ct} fluid>
         {/*   Campo de pesquisa  */}

         <Row className="mb-4 mb-sm-5 mb-xl-5">
            <Col xs={12} lg={9}>
               <h2 className="fw-bold titulo1">Veja todas as criptomoedas do mercado</h2>
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
               criptomoedasPaginadas?.map((v, k) => (
                  <Col md={6} lg={4} xxl={3} key={k}>
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
            <Row className="mt-5 mt-md-0 mb-5 pb-0 pb-5 mb-lg-0">
               <Col className="mt-md-5">
                  {/*  Desktop  */}
                  <Pagination size="lg" className="d-none d-md-flex flex-wrap justify-content-center">
                     {gerarArray(totalPaginasCriptomoedas)?.map((v, k) => (
                        <Pagination.Item
                           onClick={() => {
                              if (v !== paginaAtualCriptomoedas.current) {
                                 window.scrollTo({ top: 0, behavior: "smooth" });
                                 dispatch(setPaginaAtualCriptomoedas(v));
                                 setCriptomoedasPaginadas(paginarArray(criptomoedas, v, itemsPorPaginaCriptomoedas));
                              }
                           }}
                           active={v === paginaAtualCriptomoedas}
                           key={k}
                        >
                           {v}
                        </Pagination.Item>
                     ))}
                  </Pagination>

                  {/*  Mobile  */}
                  <Pagination size="sm" className="mb-5 mb-lg-0 d-flex d-md-none flex-wrap justify-content-center">
                     {gerarArray(totalPaginasCriptomoedas)?.map((v, k) => (
                        <Pagination.Item
                           onClick={() => {
                              if (v !== paginaAtualCriptomoedas.current) {
                                 window.scrollTo({ top: 0, behavior: "smooth" });
                                 dispatch(setPaginaAtualCriptomoedas(v));
                                 setCriptomoedasPaginadas(paginarArray(criptomoedas, v, itemsPorPaginaCriptomoedas));
                              }
                           }}
                           active={v === paginaAtualCriptomoedas}
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
