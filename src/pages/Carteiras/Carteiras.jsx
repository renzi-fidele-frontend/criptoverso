import axios from "axios";
import styles from "./Carteiras.module.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCarteiras, setCarteirasFiltradas, setFiltros, setPaginaAtual, setTotalPaginas } from "../../state/carteiras/carteirasSlice";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import FormControl from "react-bootstrap/FormControl";
import Image from "react-bootstrap/Image";
import LinhaCarteira from "../../components/LinhaCarteira/LinhaCarteira";
import { gerarArray } from "../../hooks/useGerarArray";
import Paginacao from "../../components/Paginacao/Paginacao";
import { paginarArray } from "../../hooks/usePaginarArray";
import { useTranslation } from "react-i18next";
import nadaEncontrado from "../../assets/nadaEncontrado.png";

const Carteiras = () => {
   const { carteiras, paginaAtual, totalPaginas, itemsPorPagina, carteirasFiltradas, filtros } = useSelector((state) => state.carteiras);
   const [carteirasPaginadas, setCarteirasPaginadas] = useState([]);
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { t } = useTranslation();
   const [resultadosPesquisaInstantanea, setResultadosPesquisaInstantanea] = useState(null);
   const [open, setOpen] = useState(false);

   async function apanharCarteiras() {
      setLoading(true);
      try {
         const res = await axios(`https://min-api.cryptocompare.com/data/wallets/general?api_key=${import.meta.env.VITE_CRYPTO_WATCH_APIKEY}`);
         let data = Object.entries(res.data.Data).map((v, k) => {
            return { ...v[1], numero: k + 1 };
         });
         dispatch(setCarteiras(data));
         dispatch(setTotalPaginas(Math.ceil(data.length / itemsPorPagina)));
         setCarteirasPaginadas(paginarArray(data, paginaAtual, itemsPorPagina));
      } catch (error) {
         console.log(error.message);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!carteiras) apanharCarteiras();
      if (carteirasPaginadas.length === 0 && carteiras) {
         setCarteirasPaginadas(paginarArray(carteiras, paginaAtual, itemsPorPagina));
      }
   }, [carteiras, carteirasPaginadas]);

   function pesquisarAoDigitar(e) {
      if ((e?.target?.value === "") | (e?.target?.value?.length < 2)) return setResultadosPesquisaInstantanea(null);
      setResultadosPesquisaInstantanea(
         carteiras?.filter((carteira) => carteira?.Name?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()))
      );
   }

   // TODO: Adicionar feat de filtragem das classificações

   
   const platRef = useRef();
   function filtrarTabela() {
      dispatch(setFiltros({ plataforma: platRef?.current?.value }));
      const plataformasFiltradas = carteiras?.filter((v) =>
         v?.Platforms?.map((v) => v?.toLowerCase().includes(platRef?.current?.value))?.includes(true)
      );
      dispatch(setCarteirasFiltradas(plataformasFiltradas));
      setCarteirasPaginadas(paginarArray(plataformasFiltradas, paginaAtual, itemsPorPagina));
      setOpen(false);
   }

   // Caso se chegue e hajam filtros
   useEffect(() => {
      if (carteirasFiltradas && !!filtros?.plataforma) {
         console.log("Verifiquei se Caso se chegue e hajam filtros");
         setCarteirasPaginadas(paginarArray(carteirasFiltradas, paginaAtual, itemsPorPagina));
      }
   }, []);

   return (
      <Container fluid>
         {/*   Campo de pesquisa  */}
         <Row className="mb-4">
            <Col xs={12} lg={9}>
               <h2 className="fw-bold titulo1">{t("carteiras.tit")}</h2>
            </Col>
            <Col>
               <Form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                  <FormControl placeholder={t("carteiras.search_placeholder")} onChange={pesquisarAoDigitar} required type="text"></FormControl>

                  <Button onClick={() => setOpen(true)} variant="secondary">
                     <i className="bi bi-filter"></i>
                  </Button>
                  {/* Modal de filtragem de carteiras */}
                  <Modal centered show={open} onHide={() => setOpen(false)}>
                     <Modal.Header closeButton>
                        <Modal.Title>Adicione as opções de filtragem das carteiras crypto:</Modal.Title>
                     </Modal.Header>
                     <Modal.Body>
                        <Form>
                           <Form.Group>
                              <Form.Label className="fw-medium">Selecione a plataforma</Form.Label>
                              <Form.Select defaultValue={filtros?.plataforma ? filtros?.plataforma : "todos"} ref={platRef} role="button">
                                 <option value="todos">Todas</option>
                                 <option value="android">Android</option>
                                 <option value="mac">Mac</option>
                                 <option value="windows">Windows</option>
                                 <option value="linux">Linux</option>
                                 <option value="web">Web</option>
                                 <option value="ios">IOS</option>
                                 <option value="hardware">Hardware</option>
                                 <option value="chrome">Google Chrome Extension</option>
                              </Form.Select>
                           </Form.Group>
                           {/* TODO: Adicionar mais opções de filtragem de carteiras */}
                        </Form>
                     </Modal.Body>
                     <Modal.Footer>
                        <Button onClick={filtrarTabela}>Aplicar</Button>
                        <Button onClick={() => setOpen(false)} variant="secondary">
                           Cancelar
                        </Button>
                     </Modal.Footer>
                  </Modal>
               </Form>
            </Col>
         </Row>

         <Row>
            <Col>
               <Table bordered striped size="lg" responsive hover>
                  <thead>
                     <tr>
                        <th id={styles.th} className="text-truncate">
                           #
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("carteiras.th_wallet")}
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("carteiras.th_platforms")}
                        </th>
                        <th id={styles.th} className="d-none d-xl-block text-truncate">
                           {t("carteiras.th_security")}
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("carteiras.th_rating")}
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("carteiras.th_ease")}
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {!loading
                        ? !resultadosPesquisaInstantanea
                           ? carteirasPaginadas?.map((v, k) => <LinhaCarteira carteira={v} chave={k} key={k} />)
                           : resultadosPesquisaInstantanea?.map((v, k) => <LinhaCarteira carteira={v} key={k} />)
                        : gerarArray(12).map((v, k) => <LinhaCarteira chave={k} key={k} />)}
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
         {carteirasPaginadas && !resultadosPesquisaInstantanea && (
            <Paginacao
               paginaAtual={paginaAtual}
               tamanhoDesktop="md"
               tamanhoMobile="sm"
               totalPaginas={totalPaginas}
               onPageClick={(pagina) => {
                  const condicionalCarteiras = (carteiras) => {
                     if (filtros?.plataforma) {
                        return carteirasFiltradas;
                     } else {
                        return carteiras;
                     }
                  };
                  dispatch(setPaginaAtual(pagina));
                  setCarteirasPaginadas(paginarArray(condicionalCarteiras(), pagina, itemsPorPagina));
               }}
            />
         )}
      </Container>
   );
};
export default Carteiras;
