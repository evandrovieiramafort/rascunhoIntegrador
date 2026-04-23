import { htmlParaElemento } from "../../utils/UtilDOM";

export function PaginacaoItem(texto: string, desabilitado: boolean, ativo: boolean, aoClicar: () => void): HTMLElement {
  const elemento = htmlParaElemento(`
    <li class="page-item ${desabilitado ? "disabled" : ""} ${ativo ? "active" : ""}">
      <button class="page-link"></button>
    </li>
  `);

  const btn = elemento.querySelector("button")!;
  btn.textContent = texto;

  if (!desabilitado) {
    btn.onclick = aoClicar;
  }

  return elemento;
}