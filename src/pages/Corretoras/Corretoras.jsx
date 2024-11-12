import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { setCorretoras, setPaginaAtual, setTotalPaginas } from "../../state/corretoras/corretorasSlice";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import styles from "./Corretoras.module.css";
import LinhaCorretora from "../../components/LinhaCorretora/LinhaCorretora";
import { paginarArray } from "../../hooks/usePaginarArray";
import { gerarArray } from "../../hooks/useGerarArray";
import Paginacao from "../../components/Paginacao/Paginacao";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import nadaEncontrado from "../../assets/nadaEncontrado.png";

const Corretoras = () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { corretoras, paginaAtual, itemsPorPagina, totalPaginas } = useSelector((state) => state.corretoras);
   const { modoEscuro } = useSelector((state) => state.tema);
   const { t } = useTranslation();
   const [resultadosPesquisaInstantanea, setResultadosPesquisaInstantanea] = useState(null);
   const [corretorasPaginadas, setCorretorasPaginadas] = useState([]);

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

      if (corretorasPaginadas.length === 0 && corretoras) {
         setCorretorasPaginadas(paginarArray(corretoras, paginaAtual, itemsPorPagina));
      }
   }, [corretoras, corretorasPaginadas]);

   // TODO: Adicionar feature de filtragem da tabela
   function pesquisarAoDigitar(e) {
      if ((e?.target?.value === "") | (e?.target?.value?.length < 2)) return setResultadosPesquisaInstantanea(null);
      setResultadosPesquisaInstantanea(
         corretoras?.filter((corretora) => corretora?.Name?.toLowerCase()?.includes(e?.target?.value?.toLowerCase()))
      );
   }

   return (
      <Container fluid>
         {/*   Campo de pesquisa  */}
         <Row className="mb-4">
            <Col xs={12} lg={9}>
               <h2 className="fw-bold titulo1">{t("corretoras.tit")}</h2>
            </Col>
            <Col>
               <Form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                  <FormControl placeholder={t("corretoras.search_placeholder")} onChange={pesquisarAoDigitar} required type="text"></FormControl>
                  <Button style={{ cursor: "not-allowed" }} type="submit">
                     <i className="bi bi-search"></i>
                  </Button>
               </Form>
            </Col>
         </Row>

         <Row>
            <Col>
               <Table striped size="lg" responsive hover>
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
                           <Tippy theme={modoEscuro && "light"} content={t("corretoras.24hvol_tt")}>
                              <i className="bi bi-info-circle-fill"></i>
                           </Tippy>
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("corretoras.country")}
                        </th>
                        <th id={styles.th} className="text-truncate">
                           {t("corretoras.trades")}{" "}
                           <Tippy theme={modoEscuro && "light"} content={t("corretoras.trades_tt")}>
                              <i className="bi bi-info-circle-fill"></i>
                           </Tippy>
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
               totalPaginas={totalPaginas}
               onPageClick={(pagina) => {
                  dispatch(setPaginaAtual(pagina));
                  setCorretorasPaginadas(paginarArray(corretoras, pagina, itemsPorPagina));
               }}
            />
         )}
      </Container>
   );
};

export default Corretoras;
