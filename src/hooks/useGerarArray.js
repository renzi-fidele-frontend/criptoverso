export function gerarArray(length) {
   // Gerar um array contendo Integers de 1 até o length
   return Array.from({ length }, (v, i) => i + 1);
}
