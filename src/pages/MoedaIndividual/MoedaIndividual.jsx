import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptofetchOptions } from "../../services/cryptoApi";
import { Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import millify from "millify";

const MoedaIndividual = () => {
   const { uuid } = useParams();
   const [loading, setLoading] = useState(false);
   const [criptomoeda, setCriptomoeda] = useState(null);

   async function apanharDetalhesCriptomoeda() {
      setLoading(true);
      try {
         const res = await axios.request({ ...CryptofetchOptions, url: `https://coinranking1.p.rapidapi.com/coin/${uuid}` });
         setCriptomoeda(res.data.data.coin);
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   const periodo = ["3 horas", "1 dia", "1 semana", "1 mês", "3 mêses", "1 ano", "3 anos", "5 anos"];

   // TODO: Adicionar icone com tooltip passando mais info
   //o Market Cap nada mais é do que o valor total das ações de uma companhia.

   const estatisticas = [
      { titulo: "Preço", valor: `${millify(criptomoeda?.price)} USD`, icone: <i className="bi bi-coin"></i> },
      { titulo: "Posição Global", valor: `#${criptomoeda?.rank}`, icone: <i className="bi bi-hash"></i> },
      { titulo: "Volume nas últimas 24h", valor: `${millify(criptomoeda?.["24hVolume"])} USD`, icone: <i className="bi bi-clipboard-data"></i> },
      { titulo: "Capitalização de mercado", valor: `${millify(criptomoeda?.marketCap)} USD`, icone: <i className="bi bi-cash-stack"></i> },
      {
         titulo: "Auge (média diária)",
         valor: `${millify(criptomoeda?.allTimeHigh?.price)} USD`,
         icone: <i className="bi bi-trophy"></i>,
      },
   ];

   const estatisticas_genericas = [
      { titulo: "Total de mercados", valor: criptomoeda?.numberOfMarkets, icone: <i className="bi bi-graph-up-arrow"></i> },
      { titulo: "Total de Exchanges", valor: criptomoeda?.numberOfExchanges, icone: <i className="bi bi-arrow-left-right"></i> },
      {
         titulo: "Validação do fornecimento",
         valor: criptomoeda?.supply?.confirmed ? (
            <i style={{ fontWeight: "bold !important" }} className="bi bi-check2-square text-success"></i>
         ) : (
            <i className="bi bi-x-square text-danger"></i>
         ),
         icone: <i className="bi bi-bank" style={{ fontWeight: "bold !important" }}></i>,
      },
      {
         titulo: "Total de moedas fornecidas",
         valor: `${millify(criptomoeda?.supply?.total)} USD`,
         icone: <i className="bi bi-exclamation-octagon"></i>,
      },
      {
         titulo: "Total de moedas circulando",
         valor: `${millify(criptomoeda?.supply?.circulating)} USD`,
         icone: <i className="bi bi-exclamation-octagon"></i>,
      },
   ];

   function handleSelectChange(novoValor) {
      console.log(novoValor?.currentTarget.value);
   }

   useEffect(() => {
      console.log(`O uuid é: ${uuid}`);
      if (!criptomoeda) apanharDetalhesCriptomoeda();
   }, [uuid]);

   return (
      <Container fluid>
         <Row>
            <Col className="text-center">
               <h2 className="fw-bold fs-1 mt-4">
                  Estatísticas do{" "}
                  <span style={{ color: criptomoeda?.color, textShadow: "1px 1px 1px black" }}>
                     {criptomoeda?.name} ({criptomoeda?.symbol})
                  </span>
               </h2>
               <p className="px-5 mt-4 mb-5">{criptomoeda?.description}</p>

               <hr className="" />

               {/*   Período  */}
               <Col className="mt-2" md={2}>
                  <Form.Select onChange={handleSelectChange} defaultValue="7d" style={{ cursor: "pointer" }}>
                     {periodo.map((v, k) => (
                        <option key={k} value={v}>
                           {v}
                        </option>
                     ))}
                  </Form.Select>
               </Col>
               {/*   TODO: Adicionar linha de gráfico */}

               {/*   Estatisticas da criptomoeda  */}
               <Row className="mt-5 gx-5" fluid>
                  <Col>
                     <h3>Estatísticas de valor do {criptomoeda?.name}</h3>
                     <p>Visão geral mostrando as estatisticas do {criptomoeda?.name}</p>
                     <ListGroup className="mt-4">
                        {estatisticas.map((v, k) => (
                           <ListGroup.Item key={k} action>
                              <div className="p-3 d-flex flex-row align-items-center justify-content-between">
                                 <div className="d-flex gap-3 align-items-center">
                                    {v.icone}
                                    <p className="mb-0">{v.titulo}</p>
                                 </div>

                                 <span className="fw-bold">{v.valor}</span>
                              </div>
                           </ListGroup.Item>
                        ))}
                     </ListGroup>
                  </Col>
                  <Col>
                     <h3>Outras Estatísticas</h3>
                     <p>Visão geral mostrando as estatisticas de todas as criptomoedas</p>
                     <ListGroup className="mt-4">
                        {estatisticas_genericas.map((v, k) => (
                           <ListGroup.Item key={k} action>
                              <div className="p-3 d-flex flex-row align-items-center justify-content-between">
                                 <div className="d-flex gap-3 align-items-center">
                                    {v.icone}
                                    <p className="mb-0">{v.titulo}</p>
                                 </div>

                                 <span className="fw-bold">{v.valor}</span>
                              </div>
                           </ListGroup.Item>
                        ))}
                     </ListGroup>
                  </Col>
               </Row>

               <hr className="mt-4" />

               {/*   Perguntas frequentes e Links */}
               <Row className="mt-4 pt-3 gx-5" fluid>
                  <Col></Col>
                  <Col>
                     <h3 className="fs-1">Links do {criptomoeda?.name}</h3>
                     <ListGroup className="mt-3">
                        {criptomoeda?.links?.map((v, k) => (
                           <ListGroup.Item action key={k}>
                              <div className="p-3 d-flex align-items-center justify-content-between">
                                 <p className="mb-0 text-capitalize">{v?.type}</p>
                                 <a href={v?.url} className="fw-bolder" target="_blank">
                                    {v?.name}
                                 </a>
                              </div>
                           </ListGroup.Item>
                        ))}
                     </ListGroup>
                  </Col>
               </Row>
            </Col>
         </Row>
      </Container>
   );
};

export default MoedaIndividual;
