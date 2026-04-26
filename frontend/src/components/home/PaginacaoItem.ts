import { htmlParaElemento } from "../../utils/UtilDOM";

// Função que gera o container do botão de paginação (string => DOM)
export function PaginacaoItem(texto: string, desabilitado: boolean, ativo: boolean, aoClicar: () => void): HTMLElement {
  
  // faz a conversão da string pra DOM
  const elemento = htmlParaElemento(`
    <li class="page-item ${desabilitado ? "disabled" : ""} ${ativo ? "active" : ""}">
      <button class="page-link"></button>
    </li>
  `);

  // seleciona o botão e insere o texto
  const btn = elemento.querySelector("button")!;
  btn.textContent = texto;

  // se o botão estiver habilitado, adiciona o evento aoClicar passado no parâmetro
  if (!desabilitado) {
    btn.onclick = aoClicar;
  }

  return elemento;
}