import { Collapse, Image, Placeholder } from "react-bootstrap";
import styles from "./LinhaCarteira.module.css";
import { useEffect, useState } from "react";
import linux from "../../assets/linux.png";
import ios from "../../assets/ios.png";
import windows from "../../assets/windows.png";
import android from "../../assets/android.png";
import hardware from "../../assets/hardware.png";
import star from "../../assets/star.png";
import chrome_extension from "../../assets/chrome_extension.png";
import { gerarArray } from "../../hooks/useGerarArray";
import translate from "translate";

const LinhaCarteira = ({ carteira, chave }) => {
   const [mostrar, setMostrar] = useState(false);
   const [loadingTraducao, setLoadingTraducao] = useState(false);
   const [segurancaTraduzido, setSegurancaTraduzido] = useState(false);
   const [facilidadeTraduzida, setFacilidadeTraduzida] = useState("");

   async function traduzirTexto() {
      setLoadingTraducao(true);
      try {
         const secTraduzido = await translate(carteira?.Security, "pt");
         const easyTraduzido = await translate(carteira?.EaseOfUse, "pt");
         setSegurancaTraduzido(secTraduzido);
         setFacilidadeTraduzida(easyTraduzido);
      } catch (error) {
         console.log(error.message);
      }
      setLoadingTraducao(false);
   }

   useEffect(() => {
      if (carteira) traduzirTexto();
   }, [carteira]);

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
      } else if (plataforma?.toLowerCase()?.includes("chrome")) {
         return <Image title={plataforma} src={chrome_extension} />;
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
            <td className={styles.td + " d-none d-xl-table-cell"}>{segurancaTraduzido}</td>
            <td className={styles.td}>
               <div className="d-flex gap-2 align-items-center">
                  <span>{carteira?.Rating?.Avg}/5</span>
                  <div className="d-none d-xl-flex gap-1 align-items-center">
                     {gerarArray(carteira?.Rating?.Avg).map((v, k) => (
                        <Image key={k} id={styles.star} src={star} />
                     ))}
                  </div>
                  <Image className="d-xl-none" id={styles.star} src={star} />
               </div>
            </td>
            <td className={styles.td}>{facilidadeTraduzida}</td>
         </tr>
         {/*  Escondido  */}
         <div style={{ display: "table-row" }} className={`${!mostrar && "border-0"}`}>
            <td className={!mostrar && "p-0 border-0"} colSpan={12}>
               <Collapse in={mostrar}>
                  <div className={`${styles.td} pb-2`}>
                     <div>
                        <h6>Criptomoedas suportadas:</h6>
                        <p className="">- {carteira?.Coins?.join(" | ")}</p>
                     </div>

                     <a target="_blank" className="text-bg-primary rounded-1 py-1 px-2 shadow-sm" href={carteira?.AffiliateURL}>
                        Utilizar carteira <i className="bi bi-box-arrow-in-up-right"></i>
                     </a>
                     <a target="_blank" className="text-bg-dark rounded-1 py-1 px-2 shadow-sm ms-2" href={carteira?.SourceCodeUrl}>
                        Acessar repositório <i className="bi bi-github"></i>
                     </a>
                  </div>
               </Collapse>
            </td>
         </div>
      </>
   );
};
export default LinhaCarteira;
