import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCorretoras } from "../../state/corretoras/corretorasSlice";
import { Col, Container, Row, Table } from "react-bootstrap";
import styles from "./Corretoras.module.css";
import LinhaCorretora from "../../components/LinhaCorretora/LinhaCorretora";

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

   useEffect(() => {
      if (!corretoras) apanharCorretoras();
   }, [corretoras]);

   return (
      <Container fluid>
         <Row>
            <Col>
               <h2 className="fw-bold mb-4">Veja todas as corretoras do mercado</h2>

               <div>
                  <Table striped size="lg" responsive hover>
                     <thead>
                        <tr>
                           <th className="fs-5 fw-medium fst-italic text-truncate">#</th>
                           <th className="fs-5 fw-medium fst-italic text-truncate">Corretora</th>
                           <th className="fs-5 fw-medium fst-italic text-truncate">Pontuação</th>
                           <th className="fs-5 fw-medium fst-italic text-truncate">Volume de 24h</th>
                           <th className="fs-5 fw-medium fst-italic text-truncate">País de origem</th>
                           <th className="fs-5 fw-medium fst-italic text-truncate">É Negociável?</th>
                        </tr>
                     </thead>
                     <tbody>
                        {corretoras?.map((v, k) => (
                           <LinhaCorretora corretora={v} chave={k} key={k} />
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
