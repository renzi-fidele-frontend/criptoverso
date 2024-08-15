import { Badge, Collapse, Image, Placeholder } from "react-bootstrap";
import styles from "./LinhaCarteira.module.css";
import { useState } from "react";
import linux from "../../assets/linux.png";
import ios from "../../assets/ios.png";
import windows from "../../assets/windows.png";
import android from "../../assets/android.png";
import hardware from "../../assets/hardware.png";
import star from "../../assets/star.png";
import { gerarArray } from "../../hooks/useGerarArray";

const LinhaCarteira = ({ carteira, chave }) => {
   const [mostrar, setMostrar] = useState(false);
   const [loading, setLoading] = useState(false);
   const [fotoBandeira, setFotoBandeira] = useState(false);
   const [paisTraduzido, setPaisTraduzido] = useState(false);
   const iconePlataforma = (plataforma) => {
      if (plataforma?.toLowerCase()?.includes("android")) {
         return <Image title={plataforma} src={android} />;
      } else if (plataforma?.toLowerCase()?.includes("mac")) {
         return <i title={plataforma} className="bi bi-apple"></i>;
      } else if (plataforma?.toLowerCase()?.includes("windows")) {
         return <Image title={plataforma} src={windows} />;
      } else if (plataforma?.toLowerCase()?.includes("linux")) {
         return <Image title={plataforma} src={linux} />;
      } else if (plataforma?.toLowerCase()?.includes("web")) {
         return <i title={plataforma} className="bi bi-globe"></i>;
      } else if (plataforma?.toLowerCase()?.includes("ios")) {
         return <Image title={plataforma} src={ios} />;
      } else if (plataforma?.toLowerCase()?.includes("hardware")) {
         return <Image title={plataforma} src={hardware} />;
      }
   };
   return (
      <>
         <tr style={{ cursor: "pointer" }} onClick={() => setMostrar(!mostrar)}>
            <td className={styles.td}>{carteira?.numero}.</td>
            <td className={styles.td}>
               <div className="d-flex gap-1 gap-lg-3 flex-nowrap align-items-center">
                  <Image id={styles.foto} src={`https://www.cryptocompare.com/${carteira?.LogoUrl}`} />
                  <span className="fw-medium text-truncate">{carteira?.Name}</span>
               </div>
            </td>
            <td className={styles.td}>
               <div id={styles.plataformas} className="d-flex gap-2 align-items-center flex-wrap h-100 ">
                  {carteira?.Platforms?.map((v) => {
                     return iconePlataforma(v);
                  })}
               </div>
            </td>
            <td className={styles.td + " d-none d-xl-table-cell"}>{carteira?.Security}</td>
            <td className={styles.td}>
               <div className="d-flex gap-2 align-items-center">
                  {loading ? (
                     <>
                        <Placeholder xs={12} animation="wave">
                           <Placeholder xs={9} />
                        </Placeholder>
                     </>
                  ) : (
                     <>
                        <span>{carteira?.Rating?.Avg}/5</span>
                        <div className="d-none d-xl-flex gap-1 align-items-center">
                           {gerarArray(carteira?.Rating?.Avg).map((v, k) => (
                              <Image key={k} id={styles.star} src={star} />
                           ))}
                        </div>
                        <Image className="d-xl-none" id={styles.star} src={star} />
                     </>
                  )}
               </div>
            </td>
            <td className={styles.td}>{carteira?.EaseOfUse}</td>
         </tr>
         {/*  Escondido  */}
         <div style={{ display: "table-row" }} className={`${!mostrar && "border-0"}`}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div className={`${styles.td} pb-2`}>
                     <a target="_blank" className="border border-primary rounded-1 p-1 shadow-sm" href={carteira?.AffiliateURL}>
                        Site de Afiliação <i className="bi bi-globe"></i>
                     </a>
                  </div>
               </Collapse>
            </td>
         </div>
      </>
   );
};
export default LinhaCarteira;
