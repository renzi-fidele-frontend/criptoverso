export function paginarArray(array, paginaAtual, tamanhoPagina) {
   const startIndex = (paginaAtual - 1) * tamanhoPagina;
   const endIndex = startIndex + tamanhoPagina;
   return array?.slice(startIndex, endIndex);
}
