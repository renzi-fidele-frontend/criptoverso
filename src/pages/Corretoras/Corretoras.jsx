import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCorretoras, setCorretorasFiltradas, setFiltros, setPaginaAtual, setTotalPaginas } from "../../state/corretoras/corretorasSlice";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import styles from "./Corretoras.module.css";
import LinhaCorretora from "../../components/LinhaCorretora/LinhaCorretora";
import { paginarArray } from "../../hooks/usePaginarArray";
import { gerarArray } from "../../hooks/useGerarArray";
import Paginacao from "../../components/Paginacao/Paginacao";
import nadaEncontrado from "../../assets/nadaEncontrado.png";
import Tooltip from "../../components/Tooltip/Tooltip";

const Corretoras = () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { corretoras, paginaAtual, itemsPorPagina, totalPaginas, filtros, corretorasFiltradas } = useSelector((state) => state.corretoras);
   const { t } = useTranslation();
   const [resultadosPesquisaInstantanea, setResultadosPesquisaInstantanea] = useState(null);
   const [corretorasPaginadas, setCorretorasPaginadas] = useState([]);
   const [open, setOpen] = useState(false);
   const tradesRef = useRef();

   async function apanharCorretoras() {
      setLoading(true);
      try {
         const res = await axios(`https://min-api.cryptocompare.com/data/exchanges/general?api_key=${import.meta.env.VITE_CRYPTO_WATCH_APIKEY}`);
         let data = Object.entries(res.data.Data).map((v, k) => {
            return { ...v[1], numero: k + 1 };
         });
         dispatch(setCorretoras(data));
         dispatch(setTotalPaginas(Math.ceil(data.length / itemsPorPagina)));
         setCorretorasPaginadas(paginarArray(data, paginaAtual, itemsPorPagina));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!corretoras) apanharCorretoras();

      if (corretorasPaginadas.length === 0 && corretoras && !filtros) {
         setCorretorasPaginadas(paginarArray(corretoras, paginaAtual, itemsPorPagina));
      }
   }, [corretoras, corretorasPaginadas]);

   function pesquisarAoDigitar(e) {
      if ((e?.target?.value === "") | (e?.target?.value?.length < 2)) return setResultadosPesquisaInstantanea(null);
      setResultadosPesquisaInstantanea(
         corretoras?.filter((corretora) => corretora?.Name?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()))
      );
   }

   function filtrarTabela() {
      const ordemSelecionada = document.querySelector("input[name='ordenar']:checked").value;
      const direcaoSelecionada = document.querySelector("input[name='direcao']:checked").value;

      // Preservando as configurações para manter os filtros selecionados no formulário
      dispatch(setFiltros({ trades: tradesRef?.current?.checked, ordenarPor: ordemSelecionada, direcao: direcaoSelecionada }));

      const dadosFiltrados = corretoras?.filter((trades) => {
         return tradesRef?.current?.checked ? trades?.Trades : true;
      });

      // Ordenando os dados de acordo com o filtro selecionado
      let dadosOrdenados = dadosFiltrados;

      if (direcaoSelecionada === "decrescente") {
         if (ordemSelecionada === "#") {
            dadosFiltrados?.sort((a, b) => a?.numero - b?.numero);
         } else if (ordemSelecionada === "pontuacao") {
            dadosFiltrados?.sort((a, b) => b?.GradePoints - a?.GradePoints);
         } else if (ordemSelecionada === "vol24h") {
            dadosFiltrados?.sort((a, b) => b?.TOTALVOLUME24H?.BTC - a?.TOTALVOLUME24H?.BTC);
         }
      } else if (direcaoSelecionada === "crescente") {
         if (ordemSelecionada === "#") {
            dadosFiltrados?.sort((a, b) => a?.numero - b?.numero);
         } else if (ordemSelecionada === "pontuacao") {
            dadosFiltrados?.sort((a, b) => a?.GradePoints - b?.GradePoints);
         } else if (ordemSelecionada === "vol24h") {
            dadosFiltrados?.sort((a, b) => a?.TOTALVOLUME24H?.BTC - b?.TOTALVOLUME24H?.BTC);
         }
      }

      dispatch(setCorretorasFiltradas(dadosOrdenados));
      if (dadosOrdenados?.length > 0) {
         setCorretorasPaginadas(paginarArray(dadosOrdenados, paginaAtual, itemsPorPagina));
      } else {
         setCorretorasPaginadas([]);
      }

      setOpen(false);
      dispatch(setPaginaAtual(1));
   }

   // Caso a página carregue e hajam filtros
   useEffect(() => {
      if (corretorasFiltradas && filtros) {
         setCorretorasPaginadas(paginarArray(corretorasFiltradas, paginaAtual, itemsPorPagina));
      }
   }, []);

   return (
      <Container fluid>
         {/*   Campo de pesquisa  */}
         <Row className="mb-4">
            <Col xs={12} xxl={8}>
               <h2 className="fw-bold titulo1">{t("corretoras.tit")}</h2>
            </Col>
            <Col>
               <Form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                  <FormControl placeholder={t("corretoras.search_placeholder")} onChange={pesquisarAoDigitar} required type="text"></FormControl>

                  <Tooltip conteudo={t("carteiras.filter")}>
                     <Button onClick={() => setOpen(true)} variant="secondary">
                        <i className="bi bi-filter"></i>
                     </Button>
                  </Tooltip>

                  {/* Modal de filtragem das corretoras */}
                  <Modal centered show={open} onHide={() => setOpen(false)}>
                     <Modal.Header className="align-items-start" closeButton>
                        <Modal.Title>{t("corretoras.modal.tit")}</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                        <Form onSubmit={(e) => e.preventDefault()} className="d-flex flex-column gap-2">
                           {/* Status de negociação */}
                           <Form.Group>
                              <Form.Label className="fw-medium">{t("corretoras.modal.trades")}</Form.Label>
                              <Form.Check
                                 defaultChecked={filtros?.trades}
                                 ref={tradesRef}
                                 role="button"
                                 type="switch"
                                 label={t("corretoras.modal.lb_trades")}
                              />
                           </Form.Group>

                           {/* Ordenar tabela */}
                           <Form.Group>
                              <Form.Label className="fw-medium">{t("corretoras.modal.sortBy")}</Form.Label>
                              <div>
                                 <Form.Check defaultChecked value="#" inline name="ordenar" role="button" type="radio" label="#" />
                                 <Form.Check
                                    defaultChecked={filtros?.ordenarPor === "pontuacao"}
                                    value="pontuacao"
                                    inline
                                    name="ordenar"
                                    role="button"
                                    type="radio"
                                    label={t("corretoras.modal.score")}
                                 />
                                 <Form.Check
                                    defaultChecked={filtros?.ordenarPor === "vol24h"}
                                    value="vol24h"
                                    inline
                                    name="ordenar"
                                    role="button"
                                    type="radio"
                                    label={t("corretoras.modal.vol")}
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

         <Row>
            <Col>
               <Table striped size="lg" responsive hover>
                  {/* TODO: Destacar caso a pontuação ou volume esteja com filtro */}
                  <thead>
                     <tr>
                        <th id={styles.th} className="text-truncate">
                           #
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("corretoras.exchange")}
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("corretoras.points")}
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("corretoras.24hvol")}{" "}
                           <Tooltip conteudo={t("corretoras.24hvol_tt")}>
                              <i className="bi bi-info-circle-fill"></i>
                           </Tooltip>
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("corretoras.country")}
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("corretoras.trades")}{" "}
                           <Tooltip conteudo={t("corretoras.trades_tt")}>
                              <i className="bi bi-info-circle-fill"></i>
                           </Tooltip>
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {!loading
                        ? !resultadosPesquisaInstantanea
                           ? corretorasPaginadas?.map((v, k) => <LinhaCorretora corretora={v} key={k} />)
                           : resultadosPesquisaInstantanea?.map((v, k) => <LinhaCorretora corretora={v} key={k} />)
                        : gerarArray(12).map((v, k) => <LinhaCorretora chave={k} key={k} />)}
                  </tbody>
               </Table>
               {resultadosPesquisaInstantanea?.length === 0 && (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-4">
                     <Image src={nadaEncontrado} />
                     <Alert>Nada foi encontrado</Alert>
                  </div>
               )}
            </Col>
         </Row>

         {/*  Paginação  */}
         {corretorasPaginadas && !resultadosPesquisaInstantanea && (
            <Paginacao
               paginaAtual={paginaAtual}
               tamanhoDesktop="md"
               tamanhoMobile="sm"
               totalPaginas={filtros ? Math.ceil(corretorasFiltradas?.length / itemsPorPagina) : totalPaginas}
               onPageClick={(pagina) => {
                  const condicionalCorretoras = (corretoras) => {
                     if (filtros) {
                        return corretorasFiltradas;
                     } else {
                        return corretoras;
                     }
                  };
                  dispatch(setPaginaAtual(pagina));
                  setCorretorasPaginadas(paginarArray(condicionalCorretoras(corretoras), pagina, itemsPorPagina));
               }}
            />
         )}
      </Container>
   );
};

export default Corretoras;
