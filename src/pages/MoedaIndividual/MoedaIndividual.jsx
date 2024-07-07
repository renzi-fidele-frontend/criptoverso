import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptofetchOptions } from "../../services/cryptoApi";
import { Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import millify from "millify";
import translate from "translate";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";

Chart.register(CategoryScale);

const MoedaIndividual = () => {
   const { uuid } = useParams();
   const [loading, setLoading] = useState(false);
   const [criptomoeda, setCriptomoeda] = useState(null);
   const [descricaoTraduzida, setDescricaoTraduzida] = useState("");
   const [historico, setHistorico] = useState(null);
   const periodo = [
      { nome: "3 horas", valor: "3h" },
      { nome: "1 dia", valor: "24h" },
      { nome: "1 semana", valor: "7d" },
      { nome: "1 mês", valor: "30d" },
      { nome: "3 meses", valor: "3m" },
      { nome: "12 meses", valor: "1y" },
      { nome: "3 anos", valor: "3y" },
      { nome: "5 anos", valor: "5y" },
   ];
   const [datasCriptomoeda, setDatasCriptomoeda] = useState([]);
   const [precosCriptomoeda, setPrecosCriptomoeda] = useState([]);

   // Problema atual - 3h 24h 7d 30d 3m 1y 3y 5y
   // TODO: Criar array de labels contendo a data formatada
   // TODO: Criar array de precos de todos os tempos, da criptomoeda, deverá estar em respectivo com as labels

   async function apanharDetalhesCriptomoeda() {
      setLoading(true);
      try {
         const res = await axios.request({ ...CryptofetchOptions, url: `https://coinranking1.p.rapidapi.com/coin/${uuid}` });
         setCriptomoeda(res.data.data.coin);
         const textoTraduzido = await translate(res.data.data.coin?.description, "pt");
         setDescricaoTraduzida(textoTraduzido);
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   async function apanharHistoricoCriptomoeda(periodo) {
      setLoading(true);
      try {
         const res = await axios.request({
            ...CryptofetchOptions,
            url: `https://coinranking1.p.rapidapi.com/coin/${uuid}/history?timePeriod=${periodo}`,
         });
         console.log(res.data.data.history);
         let sortedHist = res.data.data.history;
         sortedHist.sort((a, b) => b.timestamp - a.timestamp);
         console.log(sortedHist);
         setHistorico(res.data.data);
         let datas = sortedHist.map((v) => new Date(v.timestamp * 1000).toLocaleDateString());
         let precos = sortedHist.map((v) => v.price);
         setDatasCriptomoeda(datas);
         setPrecosCriptomoeda(precos);
      } catch (error) {
         console.log(error);
      }
      setLoading(false);
   }

   useEffect(() => {
      console.log(`O uuid é: ${uuid}`);
      if (!criptomoeda) apanharDetalhesCriptomoeda();
      if (!historico) apanharHistoricoCriptomoeda("7d");
   }, [uuid]);

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
      { titulo: "Corretoras disponíveis", valor: criptomoeda?.numberOfExchanges, icone: <i className="bi bi-arrow-left-right"></i> },
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
      apanharHistoricoCriptomoeda(novoValor?.currentTarget.value);
   }

   return (
      <Container className="pb-5" fluid>
         <Row>
            <Col className="text-center">
               <h2 className="fw-bold fs-1 mt-4">
                  Estatísticas do{" "}
                  <span style={{ color: criptomoeda?.color, textShadow: "1px 1px 1px black" }}>
                     {criptomoeda?.name} ({criptomoeda?.symbol})
                  </span>
               </h2>
               <p className="px-5 mt-4 mb-5">{descricaoTraduzida}</p>

               <hr className="" />

               {/*   Período  */}
               <Col className="mt-2" md={2}>
                  <Form.Select onChange={handleSelectChange} defaultValue="7d" style={{ cursor: "pointer" }}>
                     {periodo.map((v, k) => (
                        <option key={k} value={v.valor}>
                           {v.nome}
                        </option>
                     ))}
                  </Form.Select>
               </Col>

               {/*   Gráfico  */}
               <Row className="mt-3">
                  <Col>
                     <h3 className="text-start fs-2">Gráfico do preço do {criptomoeda?.name}</h3>
                  </Col>
                  <Col className="d-flex gap-4 justify-content-end fs-5">
                     <span>
                        <i className="bi bi-arrow-down-up"></i> Alteração:{" "}
                        <b className={`${historico?.change >= 0 ? "text-success" : "text-danger"}`}>{historico?.change}% </b>
                     </span>
                     <span>
                        <i className="bi bi-coin"></i> Preço atual: <b>{millify(criptomoeda?.price)} USD</b>
                     </span>
                  </Col>
               </Row>
               <div>
                  <Line
                     data={{ labels: datasCriptomoeda, datasets: [{ label: "Preço em dólar", data: precosCriptomoeda }] }}
                     options={{ responsive: true }}
                  />
               </div>

               {/*   Estatisticas da criptomoeda  */}
               <Row className="mt-5 gx-5">
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

               {/*   Links da criptomoeda */}
               <Row className="mt-4 pt-3 gx-5" fluid>
                  <Col>
                     <h3 className="fs-2">Links do {criptomoeda?.name}</h3>
                     <ListGroup className="mt-4">
                        {criptomoeda?.links?.map((v, k) => (
                           <ListGroup.Item action key={k}>
                              <div className="p-3 d-flex align-items-center justify-content-between">
                                 <p className="mb-0 text-capitalize fw-medium">{v?.type}</p>
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
