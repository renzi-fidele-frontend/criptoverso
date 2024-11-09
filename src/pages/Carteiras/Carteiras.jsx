import axios from "axios";
import styles from "./Carteiras.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCarteiras, setPaginaAtual, setTotalPaginas } from "../../state/carteiras/carteirasSlice";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import LinhaCarteira from "../../components/LinhaCarteira/LinhaCarteira";
import { gerarArray } from "../../hooks/useGerarArray";
import Paginacao from "../../components/Paginacao/Paginacao";
import { paginarArray } from "../../hooks/usePaginarArray";
import { useTranslation } from "react-i18next";

const Carteiras = () => {
   const { carteiras, paginaAtual, totalPaginas, itemsPorPagina } = useSelector((state) => state.carteiras);
   const [carteirasPaginadas, setCarteirasPaginadas] = useState([]);
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   const { t } = useTranslation();

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

   return (
      <Container fluid>
         <Row>
            <Col>
               <h2 className="fw-bold mb-4 titulo1">{t("carteiras.tit")}</h2>

               <div>
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
                           ? carteirasPaginadas?.map((v, k) => <LinhaCarteira carteira={v} chave={k} key={k} />)
                           : gerarArray(12).map((v, k) => <LinhaCarteira chave={k} key={k} />)}
                     </tbody>
                  </Table>
               </div>
            </Col>
         </Row>

         {/*  Paginação  */}
         {carteirasPaginadas && (
            <Paginacao
               paginaAtual={paginaAtual}
               tamanhoDesktop="md"
               tamanhoMobile="sm"
               totalPaginas={totalPaginas}
               onPageClick={(pagina) => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  dispatch(setPaginaAtual(pagina));
                  setCarteirasPaginadas(paginarArray(carteiras, pagina, itemsPorPagina));
               }}
            />
         )}
      </Container>
   );
};
export default Carteiras;
