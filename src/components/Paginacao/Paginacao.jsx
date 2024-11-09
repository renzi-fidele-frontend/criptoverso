import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import { gerarArray } from "../../hooks/useGerarArray";

const Paginacao = ({ onPageClick, paginaAtual, totalPaginas, tamanhoDesktop, tamanhoMobile }) => {
   return (
      <Row className="mt-5 mt-md-0 mb-5 pb-0 pb-5 mb-lg-0">
         <Col className="mt-md-5">
            {/*  Desktop  */}
            <Pagination size={tamanhoDesktop} className="d-none d-md-flex flex-wrap justify-content-center">
               {gerarArray(totalPaginas)?.map((v, k) => (
                  <Pagination.Item
                     onClick={() => {
                        document.querySelector("#corpo").scrollTo({ top: 0, behavior: "smooth" });
                        if (v !== paginaAtual) onPageClick(v);
                     }}
                     active={v === paginaAtual}
                     key={k}
                  >
                     {v}
                  </Pagination.Item>
               ))}
            </Pagination>

            {/*  Mobile  */}
            <Pagination size={tamanhoMobile} className="mb-5 mb-lg-0 d-flex d-md-none flex-wrap justify-content-center">
               {gerarArray(totalPaginas)?.map((v, k) => (
                  <Pagination.Item
                     onClick={() => {
                        if (v !== paginaAtual) onPageClick(v);
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
   );
};

export default Paginacao;
