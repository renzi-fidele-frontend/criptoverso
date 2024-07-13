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
import Paginacao from "../../components/Paginacao/Paginacao";

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
               <Form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
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
            {!loading ? (
               <>
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
                        <Col md={6} lg={4} xxl={3} key={k}>
                           <CardMoeda moeda={v} />
                        </Col>
                     ))}
                  {criptomoedas && resultadosPesquisaInstantanea?.length === 0 && (
                     <Col className="align-items-center d-flex flex-column">
                        <Image id={styles.nadaEncontrado} src={nadaEncontrado} />
                        <Alert className="mt-4">Nada foi encontrado, tente clicar no botão de pesquisa</Alert>
                     </Col>
                  )}
               </>
            ) : (
               gerarArray(12).map((v, k) => (
                  <Col md={6} lg={4} xxl={3} key={k}>
                     <CardMoeda />
                  </Col>
               ))
            )}
         </Row>

         {/*  Paginação  */}
         {!resultadosPesquisaInstantanea && criptomoedas && (
            <Paginacao
               paginaAtual={paginaAtualCriptomoedas}
               tamanhoDesktop="lg"
               tamanhoMobile="sm"
               totalPaginas={totalPaginasCriptomoedas}
               onPageClick={(pagina) => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  dispatch(setPaginaAtualCriptomoedas(pagina));
                  setCriptomoedasPaginadas(paginarArray(criptomoedas, pagina, itemsPorPaginaCriptomoedas));
               }}
            />
         )}
      </Container>
   );
};

export default Criptomoedas;
