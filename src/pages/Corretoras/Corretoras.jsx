import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCorretoras } from "../../state/corretoras/corretorasSlice";
import { AccordionCollapse, Col, Accordion, Container, Row, Table, useAccordionButton, Image, Badge } from "react-bootstrap";
import styles from "./Corretoras.module.css";
import millify from "millify";

const Corretoras = () => {
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { corretoras } = useSelector((state) => state.corretoras);

   async function apanharCorretoras() {
      setLoading(true);
      try {
         const res = await axios(
            "https://min-api.cryptocompare.com/data/exchanges/general?api_key=df6fc44edb45b681313377b928ca5f322340d29fdbb6b044d81a3f2095392499"
         );
         dispatch(setCorretoras(Object.entries(res.data.Data).map((v) => v[1])));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   const LinhaCollapsavel = ({ children, eventKey }) => {
      const collapsar = useAccordionButton(eventKey, () => console.log("Colapsou"));

      return <tr onClick={collapsar}>{children}</tr>;
   };

   const collapsar = useAccordionButton();

   useEffect(() => {
      if (!corretoras) apanharCorretoras();
   }, [corretoras]);

   return (
      <Container fluid>
         <Row>
            <Col>
               <h2 className="fw-bold mb-4">Veja todas as corretoras do mercado</h2>

               <div>
                  <Table size="lg" responsive hover>
                     <thead>
                        <tr>
                           <th className="fs-5 fw-medium fst-italic">#</th>
                           <th className="fs-5 fw-medium fst-italic">Corretora</th>
                           <th className="fs-5 fw-medium fst-italic">Pontuação</th>
                           <th className="fs-5 fw-medium fst-italic">Volume de 24h</th>
                           <th className="fs-5 fw-medium fst-italic">País de origem</th>
                           <th className="fs-5 fw-medium fst-italic">É Negociável?</th>
                        </tr>
                     </thead>
                     <tbody className="accordion">
                        {corretoras?.map((v, k) => (
                           <>
                              <LinhaCollapsavel eventKey={k}>
                                 <td className="">{k + 1}.</td>
                                 <td className="">
                                    <Image id={styles.foto} src={`https://www.cryptocompare.com/${v?.LogoUrl}`} />
                                    <span className="fw-medium ms-3">{v?.Name}</span>
                                 </td>
                                 <td className="">
                                    {v?.GradePoints === 0 && <Badge bg="warning">Indisponível</Badge>}
                                    {v?.GradePoints >= 50 && <Badge bg="success">{v?.GradePoints}</Badge>}
                                    {v?.GradePoints < 50 && v?.GradePoints > 0 && <Badge bg="danger">{v?.GradePoints}</Badge>}
                                 </td>
                                 <td className="">{v?.DISPLAYTOTALVOLUME24H?.BTC}</td>
                                 <td className="">{v?.Country}</td>
                                 <td className="">
                                    {v?.Trades ? (
                                       <span className="text-success">
                                          <i className="bi bi-check-circle-fill me-2"></i>Sim
                                       </span>
                                    ) : (
                                       <span className="text-danger">
                                          <i className="bi bi-x-circle-fill me-2"></i>Não
                                       </span>
                                    )}
                                 </td>
                              </LinhaCollapsavel>
                              <AccordionCollapse eventKey={k}>
                                 <div> Escondido</div>
                              </AccordionCollapse>
                           </>
                        ))}
                     </tbody>
                  </Table>
               </div>
            </Col>
         </Row>
      </Container>
   );
};

export default Corretoras;
