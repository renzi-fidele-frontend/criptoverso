import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCorretoras, setPaginaAtual, setTotalPaginas } from "../../state/corretoras/corretorasSlice";
import { Col, Container, Pagination, Row, Table } from "react-bootstrap";
import styles from "./Corretoras.module.css";
import LinhaCorretora from "../../components/LinhaCorretora/LinhaCorretora";
import { paginarArray } from "../../hooks/usePaginarArray";
import { gerarArray } from "../../hooks/useGerarArray";

const Corretoras = () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { corretoras, paginaAtual, itemsPorPagina, totalPaginas } = useSelector((state) => state.corretoras);

   const [corretorasPaginadas, setCorretorasPaginadas] = useState([]);

   async function apanharCorretoras() {
      setLoading(true);
      try {
         const res = await axios(
            "https://min-api.cryptocompare.com/data/exchanges/general?api_key=df6fc44edb45b681313377b928ca5f322340d29fdbb6b044d81a3f2095392499"
         );
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

   return (
      <Container fluid>
         <Row>
            <Col>
               <h2 className="fw-bold mb-4 titulo1">Veja todas as corretoras do mercado</h2>

               <div>
                  <Table striped size="lg" responsive hover>
                     <thead>
                        <tr>
                           <th id={styles.th} className="text-truncate">
                              #
                           </th>
                           <th id={styles.th} className="text-truncate">
                              Corretora
                           </th>
                           <th id={styles.th} className="text-truncate">
                              Pontuação
                           </th>
                           <th id={styles.th} className="text-truncate">
                              Volume de 24h
                           </th>
                           <th id={styles.th} className="text-truncate">
                              País de origem
                           </th>
                           <th id={styles.th} className="text-truncate">
                              É Negociável?
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {loading
                           ? corretorasPaginadas?.map((v, k) => <LinhaCorretora corretora={v} chave={k} key={k} />)
                           : gerarArray(12).map((v, k) => <LinhaCorretora chave={k} key={k} />)}
                     </tbody>
                  </Table>
               </div>
            </Col>
         </Row>

         {/*  Paginação  */}
         {corretorasPaginadas && (
            <Row className="mt-2 mb-1 mb-md-0">
               <Col className="mt-xxl-4 ">
                  {/*  Desktop  */}
                  <Pagination className="d-none d-md-flex flex-wrap justify-content-center mb-5 pb-5 mb-lg-0 pb-lg-0">
                     {gerarArray(totalPaginas)?.map((v, k) => (
                        <Pagination.Item
                           onClick={() => {
                              if (v !== paginaAtual.current) {
                                 window.scrollTo({ top: 0, behavior: "smooth" });
                                 dispatch(setPaginaAtual(v));
                                 setCorretorasPaginadas(paginarArray(corretoras, v, itemsPorPagina));
                              }
                           }}
                           active={v === paginaAtual}
                           key={k}
                        >
                           {v}
                        </Pagination.Item>
                     ))}
                  </Pagination>

                  {/*  Mobile  */}
                  <Pagination size="sm" className="d-flex d-md-none flex-wrap justify-content-center mb-5 pb-5 mb-lg-0 pb-lg-0">
                     {gerarArray(totalPaginas)?.map((v, k) => (
                        <Pagination.Item
                           onClick={() => {
                              if (v !== paginaAtual.current) {
                                 window.scrollTo({ top: 0, behavior: "smooth" });
                                 dispatch(setPaginaAtual(v));
                                 setCorretorasPaginadas(paginarArray(corretoras, v, itemsPorPagina));
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

export default Corretoras;
