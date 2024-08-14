import { Col, Container, Row } from "react-bootstrap";
import CardNoticia from "../../components/CardNoticia/CardNoticia";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setNoticias, setPaginaAtualNoticias, setTotalPaginasNoticias } from "../../state/noticias/noticiasSlice";
import { useEffect, useRef, useState } from "react";
import { gerarArray } from "../../hooks/useGerarArray";
import { paginarArray } from "../../hooks/usePaginarArray";
import Paginacao from "../../components/Paginacao/Paginacao";

const Noticias = () => {
   const [loading, setLoading] = useState(false);
   const [noticiasPaginadas, setNoticiasPaginadas] = useState([]);
   const dispatch = useDispatch();
   const ctRef = useRef(null);

   const { noticias, paginaAtualNoticias, itemsPorPaginaNoticias, totalPaginasNoticias } = useSelector((state) => state.noticias);

   async function apanharNoticias() {
      setLoading(true);
      let res;
      try {
         res = await axios.get(`https://min-api.cryptocompare.com/data/v2/news/?lang=PT&api_key=${import.meta.env.VITE_CRYPTO_WATCH_APIKEY}`);
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

      if (noticiasPaginadas?.length === 0 && noticias) {
         dispatch(setTotalPaginasNoticias(Math.ceil(Number(noticias.length) / itemsPorPaginaNoticias)));
         setNoticiasPaginadas(paginarArray(noticias, paginaAtualNoticias, itemsPorPaginaNoticias));
      }
   }, [noticias, noticiasPaginadas]);

   return (
      <Container ref={ctRef} fluid>
         <h2 className="fw-bold mb-5 titulo1">Veja as notícias sobre o mundo crypto</h2>

         <Row className="g-4">
            {!loading
               ? noticiasPaginadas.map((v, k) => (
                    <Col md={6} key={k}>
                       <CardNoticia noticia={v} />
                    </Col>
                 ))
               : gerarArray(6).map((v, k) => (
                    <Col md={6} key={k}>
                       <CardNoticia />
                    </Col>
                 ))}
         </Row>

         {/*  Paginação  */}
         {noticias && (
            <Paginacao
               onPageClick={(pagina) => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  dispatch(setPaginaAtualNoticias(pagina));
                  setNoticiasPaginadas(paginarArray(noticias, pagina, itemsPorPaginaNoticias));
               }}
               paginaAtual={paginaAtualNoticias}
               tamanhoDesktop="lg"
               tamanhoMobile="sm"
               totalPaginas={totalPaginasNoticias}
            />
         )}
      </Container>
   );
};

export default Noticias;
