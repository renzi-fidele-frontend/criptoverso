import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CryptofetchOptions } from "../../services/cryptoApi";
import { setCriptomoedas, setPaginaAtualCriptomoedas, setTotalPaginasCriptomoedas } from "../../state/criptomoedas/criptomoedasSlice";
import axios from "axios";
import { Alert, Button, Col, Container, Form, FormControl, Image, Row } from "react-bootstrap";
import styles from "./Criptomoedas.module.css";
import CardMoeda from "../../components/CardMoeda/CardMoeda";
import { gerarArray } from "../../hooks/useGerarArray";
import nadaEncontrado from "../../assets/nadaEncontrado.png";
import { paginarArray } from "../../hooks/usePaginarArray";
import Paginacao from "../../components/Paginacao/Paginacao";
import { useTranslation } from "react-i18next";

// TODO: Na última pagina mostrar o botão de apanhar mais criptomoedas , o offset deverá ser o length das criptomoedas

const Criptomoedas = () => {
   const [loading, setLoading] = useState(false);
   const { criptomoedas, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas, totalPaginasCriptomoedas } = useSelector(
      (state) => state.criptomoedas
   );
   const dispatch = useDispatch();
   const [criptomoedasPaginadas, setCriptomoedasPaginadas] = useState([]);
   const [resultadosPesquisaInstantanea, setResultadosPesquisaInstantanea] = useState(null);
   const termoPesquisaRef = useRef(null);
   const { t } = useTranslation();

   async function apanharCriptomoedas() {
      setLoading(true);
      let res;
      try {
         res = await axios.request({ ...CryptofetchOptions, url: "https://coinranking1.p.rapidapi.com/coins?limit=100" });
         let moedas = res?.data?.data?.coins;
         dispatch(setCriptomoedas(moedas));
         dispatch(setTotalPaginasCriptomoedas(Math.ceil(moedas.length / itemsPorPaginaCriptomoedas)));
         setCriptomoedasPaginadas(paginarArray(moedas, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   async function apanharMaisCriptomoedas(offset) {
      setLoading(true);
      let res;
      try {
         res = await axios.request({
            ...CryptofetchOptions,
            url: `https://coinranking1.p.rapidapi.com/coins?limit=100&offset=${offset}`,
         });
         let moedas = res?.data?.data?.coins;
         dispatch(setCriptomoedas(criptomoedas?.concat(moedas)));
         dispatch(setTotalPaginasCriptomoedas(Math.ceil(criptomoedas?.concat(moedas).length / itemsPorPaginaCriptomoedas)));
         setCriptomoedasPaginadas(paginarArray(criptomoedas?.concat(moedas), paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas));
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
         <Row className="mb-4 mb-sm-5 mb-xl-5">
            <Col xs={12} lg={9}>
               <h2 className="fw-bold titulo1">{t("criptomoedas.tit")}</h2>
            </Col>
            {/*   Campo de pesquisa  */}
            <Col>
               <Form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                  <FormControl
                     ref={termoPesquisaRef}
                     placeholder={t("criptomoedas.search_placeholder")}
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
                        <Col md={6} xl={4} xxl={3} key={k}>
                           <CardMoeda moeda={v} />
                        </Col>
                     ))
                  ) : (
                     <>{!resultadosPesquisaInstantanea && <p>Loading</p>}</>
                  )}
                  {criptomoedas &&
                     resultadosPesquisaInstantanea?.length > 0 &&
                     resultadosPesquisaInstantanea?.map((v, k) => (
                        <Col md={6} xl={4} xxl={3} key={k}>
                           <CardMoeda moeda={v} />
                        </Col>
                     ))}
                  {criptomoedas && resultadosPesquisaInstantanea?.length === 0 && (
                     <Col className="align-items-center d-flex flex-column">
                        <Image id={styles.nadaEncontrado} src={nadaEncontrado} />
                        <Alert className="mt-4">{t("criptomoedas.not_found")}</Alert>
                     </Col>
                  )}
               </>
            ) : (
               gerarArray(12).map((v, k) => (
                  <Col md={6} xl={4} xxl={3} key={k}>
                     <CardMoeda />
                  </Col>
               ))
            )}
            {totalPaginasCriptomoedas === paginaAtualCriptomoedas && (
               <Col className="text-center pt-4">
                  <Button onClick={() => apanharMaisCriptomoedas(criptomoedas?.length)}>Carregar mais</Button>
               </Col>
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
