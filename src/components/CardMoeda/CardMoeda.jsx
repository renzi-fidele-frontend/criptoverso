import millify from "millify";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import Image from "react-bootstrap/Image";
import styles from "./CardMoeda.module.css";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { gerarArray } from "../../hooks/useGerarArray";
import { useTranslation } from "react-i18next";

const CardMoeda = ({ moeda }) => {
   const { t } = useTranslation();

   return moeda ? (
      <Card as={Link} className={styles.ct} to={`/criptomoeda/${moeda.uuid}`}>
         <Card.Header className="flex-row align-items-center justify-content-between d-flex">
            <p className="mb-0 fw-medium">{`${moeda?.rank}. ${moeda?.name}`}</p>
            <Image id={styles.foto} src={moeda?.iconUrl} />
         </Card.Header>
         <Card.Body>
            <p>
               {t("components.cardMoeda.price")}: {millify(moeda?.price)} USD
            </p>
            <p>
               {t("components.cardMoeda.marketVol")}: <span>{millify(moeda?.marketCap)} USD</span>
            </p>
            <p className="pb-0">
               {t("components.cardMoeda.change")}:{" "}
               <span className={`${moeda?.change >= 0 ? "text-success" : "text-danger"}`}>{`${moeda?.change >= 0 ? "+" : ""}${
                  moeda?.change
               }%`}</span>
            </p>
         </Card.Body>
         <Card.Footer className="py-0">
            <div id={styles.chartCt}>
               <Line
                  options={{
                     plugins: {
                        legend: false,
                        tooltip: false,
                     },
                     scales: {
                        x: {
                           display: false,
                        },
                        y: {
                           display: false,
                        },
                     },
                     maintainAspectRatio: false,
                  }}
                  data={{
                     labels: gerarArray(23),
                     datasets: [{ data: moeda?.sparkline?.toReversed()?.slice(0, 23), fill: true, pointBorderWidth: 0 }],
                  }}
               />
            </div>
         </Card.Footer>
      </Card>
   ) : (
      <Card className={`${styles.ct}`}>
         <Card.Header>
            <Placeholder className="flex-row align-items-center justify-content-between d-flex" xs={12} animation="wave">
               <Placeholder xs={8} />
               <Placeholder id={styles.foto} xs={3} />
            </Placeholder>
         </Card.Header>
         <Card.Body>
            <Placeholder className="d-flex flex-column gap-3" xs={12} animation="wave">
               <p>
                  {t("components.cardMoeda.price")}: <Placeholder xs={2} /> USD
               </p>
               <p>
                  {t("components.cardMoeda.marketVol")}:{" "}
                  <span>
                     <Placeholder xs={2} />
                  </span>{" "}
                  USD
               </p>
               <p>
                  {t("components.cardMoeda.change")}:{" "}
                  <span className={`text-success`}>
                     <Placeholder xs={2} /> %
                  </span>
               </p>
            </Placeholder>
         </Card.Body>
      </Card>
   );
};

export default CardMoeda;
