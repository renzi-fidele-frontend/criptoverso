import { Col, Container, Pagination, Row } from "react-bootstrap";
import CardNoticia from "../../components/CardNoticia/CardNoticia";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setNoticias, setPaginaAtualNoticias, setTotalPaginasNoticias } from "../../state/crypto/cryptoSlice";
import { useEffect, useState } from "react";
import { gerarArray } from "../../hooks/useGerarArray";
import { paginarArray } from "../../hooks/usePaginarArray";

const Noticias = () => {
   const [loading, setLoading] = useState(false);
   const [noticiasPaginadas, setNoticiasPaginadas] = useState([]);
   const dispatch = useDispatch();

   const { noticias, paginaAtualNoticias, itemsPorPaginaNoticias, totalPaginasNoticias } = useSelector((state) => state.crypto);

   async function apanharNoticias() {
      setLoading(true);
      let res;
      try {
         res = await axios.get(
            "https://min-api.cryptocompare.com/data/v2/news/?lang=PT&api_key=df6fc44edb45b681313377b928ca5f322340d29fdbb6b044d81a3f2095392499"
         );
         dispatch(setNoticias(res.data.Data));
         dispatch(setTotalPaginasNoticias(Math.ceil(Number(res.data.Data.length) / itemsPorPaginaNoticias)));
         setNoticiasPaginadas(paginarArray(res.data.Data, paginaAtualNoticias, itemsPorPaginaNoticias));
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      if (!noticias) apanharNoticias();

      if (noticiasPaginadas?.length === 0 && noticias) setNoticiasPaginadas(paginarArray(noticias, paginaAtualNoticias, itemsPorPaginaNoticias));
   }, [noticias, noticiasPaginadas]);

   return (
      <Container fluid>
         <h2 className="fw-bold mb-5">Veja as notícias sobre o mundo crypto</h2>

         <Row className="g-4">
            {noticiasPaginadas.length > 0 &&
               noticiasPaginadas.map((v, k) => {
                  if (paginaAtualNoticias !== 1) {
                     return (
                        <Col md={6} key={k}>
                           <CardNoticia noticia={v} />
                        </Col>
                     );
                  } else {
                     if (k !== 1)
                        return (
                           <Col md={6} key={k}>
                              <CardNoticia noticia={v} />
                           </Col>
                        );
                  }
               })}
         </Row>

         {/*  Paginação  */}
         {noticias && (
            <Row className="mt-2 mb-1 mb-md-0">
               <Col className="mt-md-5">
                  <Pagination size="lg" className="d-none d-md-flex justify-content-center">
                     {gerarArray(totalPaginasNoticias)?.map((page, k) => (
                        <Pagination.Item
                           onClick={() => {
                              if (page !== paginaAtualNoticias.current) {
                                 window.scrollTo({ top: 0, behavior: "smooth" });
                                 dispatch(setPaginaAtualNoticias(page));
                                 setNoticiasPaginadas(paginarArray(noticias, page, itemsPorPaginaNoticias));
                              }
                           }}
                           active={page === paginaAtualNoticias}
                           key={k}
                        >
                           {page}
                        </Pagination.Item>
                     ))}
                  </Pagination>
               </Col>
            </Row>
         )}
      </Container>
   );
};

export default Noticias;
