import { htmlParaElemento } from "../../utils/UtilDOM";
import { formatarC$ } from "../../utils/Formatador";


// usamos só pra não deixar a tela em branco enquanto os dados carregam - escolha editorial kkkk
export function Spinner(): HTMLElement {
  return htmlParaElemento(`
    <div class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
  `);
}

export function Alerta(mensagem: string, tipo: string = "danger"): HTMLElement {
  const elemento = htmlParaElemento(`<div class="alert alert-${tipo} w-100"></div>`);
  elemento.textContent = mensagem;
  return elemento;
}

export function Badge(texto: string, cor: string, classesAdicionais: string = ""): HTMLElement {
  const elemento = htmlParaElemento(`<span class="badge bg-${cor} ${classesAdicionais}"></span>`);
  elemento.textContent = texto;
  return elemento;
}

export function PrecoArea(precoVenda: number | string, precoFinal: number, percentualDesconto: number): HTMLElement {
  const div = htmlParaElemento(`<div></div>`);
  
  if (percentualDesconto > 0) {
    const pVenda = htmlParaElemento(`<small class="text-decoration-line-through text-muted d-block"></small>`);
    pVenda.textContent = formatarC$(precoVenda);
    div.appendChild(pVenda);
  }
  
  const pFinal = htmlParaElemento(`<span class="fs-4 fw-bold text-primary"></span>`);
  pFinal.textContent = formatarC$(precoFinal);
  div.appendChild(pFinal);
  
  return div;
}

export function Stepper(
  valorInicial: number, 
  maximo: number, 
  largura: string = "140px", 
  aoMudar?: (novoValor: number) => Promise<void> 
): HTMLElement {
  
  const elemento = htmlParaElemento(`
    <div class="input-group shadow-sm" style="width: ${largura};">
      <button class="btn btn-outline-secondary px-3" data-btn="menos">-</button>
      <input type="text" class="form-control text-center fw-bold bg-white" readonly value="${valorInicial}">
      <button class="btn btn-outline-secondary px-3" data-btn="mais">+</button>
    </div>
  `);

  const inputQtd = elemento.querySelector("input") as HTMLInputElement;
  const btnMenos = elemento.querySelector('[data-btn="menos"]') as HTMLButtonElement;
  const btnMais = elemento.querySelector('[data-btn="mais"]') as HTMLButtonElement;

  const alterarQuantidade = async (delta: number) => {
    const atual = parseInt(inputQtd.value);
    const novoValor = atual + delta;

    if (novoValor >= 1 && novoValor <= maximo) {
      inputQtd.value = novoValor.toString();

      btnMenos.disabled = true;
      btnMais.disabled = true;

      try {
        if (aoMudar) {
          await aoMudar(novoValor); 
        }
      } finally {
        btnMenos.disabled = false;
        btnMais.disabled = false;
      }
    }
  };

  btnMenos.onclick = () => alterarQuantidade(-1);
  btnMais.onclick = () => alterarQuantidade(1);

  return elemento;
}

export function ModalConfirmacao(titulo: string, corpoTexto: string, textoBtn: string, acao: () => void, corBtn: string = "primary"): void {
  const modal = htmlParaElemento(`
    <div class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5);" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content shadow">
          <div class="modal-header d-flex justify-content-between align-items-center">
            <h5 class="modal-title"></h5>
            <button class="btn-close" data-btn="fechar"></button>
          </div>
          <div class="modal-body text-center p-4">
            <p class="mb-0 fw-bold" data-corpo></p>
          </div>
          <div class="modal-footer justify-content-center">
            <button class="btn btn-secondary me-2" data-btn="cancelar">Cancelar</button>
            <button class="btn btn-${corBtn}" data-btn="acao"></button>
          </div>
        </div>
      </div>
    </div>
  `);

  modal.querySelector(".modal-title")!.textContent = titulo;
  modal.querySelector("[data-corpo]")!.textContent = corpoTexto;
  modal.querySelector("[data-btn='acao']")!.textContent = textoBtn;

  const fecharModal = () => modal.remove();

  (modal.querySelector("[data-btn='fechar']") as HTMLButtonElement).onclick = fecharModal;
  (modal.querySelector("[data-btn='cancelar']") as HTMLButtonElement).onclick = fecharModal;
  (modal.querySelector("[data-btn='acao']") as HTMLButtonElement).onclick = () => {
    acao();
    fecharModal();
  };

  document.body.appendChild(modal);
}