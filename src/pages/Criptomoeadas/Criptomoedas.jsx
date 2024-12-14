import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CryptofetchOptions } from "../../services/cryptoApi";
import {
   setCriptomoedas,
   setCriptomoedasFiltradas,
   setFiltros,
   setPaginaAtualCriptomoedas,
   setTotalPaginasCriptomoedas,
} from "../../state/criptomoedas/criptomoedasSlice";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import styles from "./Criptomoedas.module.css";
import CardMoeda from "../../components/CardMoeda/CardMoeda";
import { gerarArray } from "../../hooks/useGerarArray";
import nadaEncontrado from "../../assets/nadaEncontrado.png";
import { paginarArray } from "../../hooks/usePaginarArray";
import Paginacao from "../../components/Paginacao/Paginacao";
import { useTranslation } from "react-i18next";
import Tooltip from "../../components/Tooltip/Tooltip";
import { setPaginaAtual } from "../../state/corretoras/corretorasSlice";

const Criptomoedas = () => {
   const { criptomoedas, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas, totalPaginasCriptomoedas, filtros, criptomoedasFiltradas } =
      useSelector((state) => state.criptomoedas);
   const dispatch = useDispatch();
   const [criptomoedasPaginadas, setCriptomoedasPaginadas] = useState([]);
   const [resultadosPesquisaInstantanea, setResultadosPesquisaInstantanea] = useState(null);
   const [loading, setLoading] = useState(false);
   const termoPesquisaRef = useRef(null);
   const { t } = useTranslation();
   const [open, setOpen] = useState(false);

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
      if ((termoPesquisaRef?.current?.value === "") | (termoPesquisaRef?.current?.value?.length < 2))
         return setResultadosPesquisaInstantanea(null);
      setResultadosPesquisaInstantanea(
         criptomoedas?.filter((criptomoeda) => criptomoeda?.name?.toLowerCase()?.includes(termoPesquisaRef?.current?.value?.toLowerCase()))
      );
   }

   function filtrarTabela() {
      const ordemSelecionada = document.querySelector("input[name='ordenar']:checked").value;
      const direcaoSelecionada = document.querySelector("input[name='direcao']:checked").value;

      // Preservando as configurações para manter os filtros selecionados no formulário
      dispatch(setFiltros({ ordenarPor: ordemSelecionada, direcao: direcaoSelecionada }));

      let dadosOrdenados = criptomoedas?.filter(() => true);

      // Ordenando os dados de acordo com o filtro selecionado
      if (direcaoSelecionada === "decrescente") {
         if (ordemSelecionada === "rank") {
            dadosOrdenados?.sort((a, b) => b?.rank - a?.rank);
         } else if (ordemSelecionada === "alteracao") {
            dadosOrdenados?.sort((a, b) => b?.change - a?.change);
         } else if (ordemSelecionada === "preco") {
            dadosOrdenados?.sort((a, b) => Number(b?.price) - a?.price);
         } else if (ordemSelecionada === "volMercado") {
            dadosOrdenados?.sort((a, b) => b?.marketCap - a?.marketCap);
         }
      } else if (direcaoSelecionada === "crescente") {
         if (ordemSelecionada === "rank") {
            dadosOrdenados?.sort((a, b) => a?.rank - b?.rank);
         } else if (ordemSelecionada === "alteracao") {
            dadosOrdenados?.sort((a, b) => a?.change - b?.change);
         } else if (ordemSelecionada === "preco") {
            dadosOrdenados?.sort((a, b) => Number(a?.price) - b?.price);
         } else if (ordemSelecionada === "volMercado") {
            dadosOrdenados?.sort((a, b) => a?.marketCap - b?.marketCap);
         }
      }

      dispatch(setCriptomoedasFiltradas(dadosOrdenados));
      if (dadosOrdenados?.length > 0) {
         setCriptomoedasPaginadas(paginarArray(dadosOrdenados, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas));
      } else {
         setCriptomoedasPaginadas([]);
      }

      setOpen(false);
      dispatch(setPaginaAtual(1));
   }

   useEffect(() => {
      if (!criptomoedas) apanharCriptomoedas();
      if (criptomoedasPaginadas?.length === 0 && criptomoedas)
         setCriptomoedasPaginadas(paginarArray(criptomoedas, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas));
   }, [criptomoedas, criptomoedasPaginadas]);

   // Caso a página carregue e hajam filtros
   useEffect(() => {
      if (criptomoedasFiltradas && filtros) {
         setCriptomoedasPaginadas(paginarArray(criptomoedasFiltradas, paginaAtualCriptomoedas, itemsPorPaginaCriptomoedas));
      }
   }, []);

   return (
      <Container id={styles.ct} fluid>
         <Row className="mb-4 mb-sm-5 mb-xl-5">
            <Col xs={12} xxl={8}>
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

                  <Tooltip conteudo={t("carteiras.filter")}>
                     <Button onClick={() => setOpen(true)} variant="secondary">
                        <i className="bi bi-filter"></i>
                     </Button>
                  </Tooltip>

                  {/* Modal de filtragem das corretoras */}
                  <Modal centered show={open} onHide={() => setOpen(false)}>
                     <Modal.Header className="align-items-start" closeButton>
                        <Modal.Title>{t("criptomoedas.modal.tit")}</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                        <Form onSubmit={(e) => e.preventDefault()} className="d-flex flex-column gap-2">
                           {/* Ordenar tabela */}
                           <Form.Group>
                              <Form.Label className="fw-medium">{t("corretoras.modal.sortBy")}</Form.Label>
                              <div>
                                 <Form.Check
                                    defaultChecked
                                    value="rank"
                                    inline
                                    name="ordenar"
                                    role="button"
                                    type="radio"
                                    label={t("criptomoedas.modal.rank")}
                                 />
                                 <Form.Check
                                    defaultChecked={filtros?.ordenarPor === "alteracao"}
                                    value="alteracao"
                                    inline
                                    name="ordenar"
                                    role="button"
                                    type="radio"
                                    label={t("criptomoedas.modal.change")}
                                 />
                                 <Form.Check
                                    defaultChecked={filtros?.ordenarPor === "preco"}
                                    value="preco"
                                    inline
                                    name="ordenar"
                                    role="button"
                                    type="radio"
                                    label={t("criptomoedas.modal.price")}
                                 />
                                 <Form.Check
                                    defaultChecked={filtros?.ordenarPor === "volMercado"}
                                    value="volMercado"
                                    inline
                                    name="ordenar"
                                    role="button"
                                    type="radio"
                                    label={t("criptomoedas.modal.marketVol")}
                                 />
                              </div>
                           </Form.Group>

                           {/* Direção da ordem */}
                           <Form.Group>
                              <Form.Label className="fw-medium">{t("corretoras.modal.sortOrder")}</Form.Label>
                              <div>
                                 <Form.Check
                                    defaultChecked
                                    value="decrescente"
                                    inline
                                    name="direcao"
                                    role="button"
                                    type="radio"
                                    label={t("corretoras.modal.decrease")}
                                 />
                                 <Form.Check
                                    defaultChecked={filtros?.direcao === "crescente"}
                                    value="crescente"
                                    inline
                                    name="direcao"
                                    role="button"
                                    type="radio"
                                    label={t("corretoras.modal.increase")}
                                 />
                              </div>
                           </Form.Group>
                        </Form>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button onClick={filtrarTabela}>{t("carteiras.modal.btn1")}</Button>
                        <Button onClick={() => setOpen(false)} variant="secondary">
                           {t("carteiras.modal.btn2")}
                        </Button>
                     </Modal.Footer>
                  </Modal>
               </Form>
            </Col>
         </Row>

         {/*  Todas as criptomoedas   */}
         <Row className="g-3 mb-4">
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
                  {!loading && <Button onClick={() => apanharMaisCriptomoedas(criptomoedas?.length)}>{t("components.loadBtn")}</Button>}
               </Col>
            )}
         </Row>

         {/*  Paginação  */}
         {!resultadosPesquisaInstantanea && criptomoedas && (
            <Paginacao
               paginaAtual={paginaAtualCriptomoedas}
               tamanhoDesktop="lg"
               tamanhoMobile="sm"
               totalPaginas={filtros ? Math.ceil(criptomoedasFiltradas?.length / itemsPorPaginaCriptomoedas) : totalPaginasCriptomoedas}
               onPageClick={(pagina) => {
                  const condicionalCriptomoedas = (criptomoedas) => {
                     if (filtros) {
                        return criptomoedasFiltradas;
                     } else {
                        return criptomoedas;
                     }
                  };
                  dispatch(setPaginaAtualCriptomoedas(pagina));
                  setCriptomoedasPaginadas(paginarArray(condicionalCriptomoedas(criptomoedas), pagina, itemsPorPaginaCriptomoedas));
               }}
            />
         )}
      </Container>
   );
};

export default Criptomoedas;
