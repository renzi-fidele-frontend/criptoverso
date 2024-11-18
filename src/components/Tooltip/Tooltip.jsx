import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
// As opções de tema são: light, light-border, material, translucent

const Tooltip = ({ conteudo, children, tipo }) => {
    const { modoEscuro } = useSelector((state) => state.tema);
   return (
      <Tippy theme={modoEscuro && "light"} content={conteudo}>
         {children}
      </Tippy>
   );
};
export default Tooltip;
