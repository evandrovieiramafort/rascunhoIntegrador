import { criarHTML, limparFilhos } from "../utils/UtilDOM";

export abstract class VisualizadorBase {
  protected formatadorCefetins = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  protected formatarC$(valor: number | string): string {
    return `C$ ${this.formatadorCefetins.format(Number(valor))}`;
  }

  protected navegarPara(rota: string): void {
    window.history.pushState({}, "", rota);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  protected criarElementoTexto<K extends keyof HTMLElementTagNameMap>(
    tag: K, 
    texto: string, 
    classes: string = ""
  ): HTMLElementTagNameMap[K] {
    const elemento = criarHTML(tag);
    elemento.textContent = texto;
    if (classes) {
      elemento.className = classes;
    }
    return elemento;
  }

  protected criarStepper(
    valorInicial: number, 
    maximo: number, 
    largura: string = "140px",
    aoMudar?: (novoValor: number) => void
  ): HTMLElement {
    const divGroup = criarHTML("div");
    divGroup.className = "input-group shadow-sm";
    divGroup.style.width = largura;

    const btnMenos = this.criarElementoTexto("button", "-", "btn btn-outline-secondary px-3");
    const inputQtd = criarHTML("input");
    inputQtd.type = "text";
    inputQtd.className = "form-control text-center fw-bold bg-white";
    inputQtd.value = valorInicial.toString();
    inputQtd.readOnly = true;

    const btnMais = this.criarElementoTexto("button", "+", "btn btn-outline-secondary px-3");

    btnMenos.onclick = () => {
      const atual = parseInt(inputQtd.value);
      if (atual > 1) {
        const novo = atual - 1;
        inputQtd.value = novo.toString();
        if (aoMudar) aoMudar(novo);
      }
    };

    btnMais.onclick = () => {
      const atual = parseInt(inputQtd.value);
      if (atual < maximo) {
        const novo = atual + 1;
        inputQtd.value = novo.toString();
        if (aoMudar) aoMudar(novo);
      }
    };

    divGroup.append(btnMenos, inputQtd, btnMais);
    return divGroup;
  }

  protected criarBadge(texto: string, cor: string, classesAdicionais: string = ""): HTMLElement {
    return this.criarElementoTexto("span", texto, `badge bg-${cor} ${classesAdicionais}`);
  }

  protected criarPrecoArea(precoVenda: number | string, precoFinal: number, percentualDesconto: number): HTMLElement {
    const divPreco = criarHTML("div");
    if (percentualDesconto > 0) {
      divPreco.appendChild(this.criarElementoTexto("small", this.formatarC$(precoVenda), "text-decoration-line-through text-muted d-block"));
    }
    divPreco.appendChild(this.criarElementoTexto("span", this.formatarC$(precoFinal), "fs-4 fw-bold text-primary"));
    return divPreco;
  }

  protected criarSpinner(): HTMLElement {
    const divCentro = criarHTML("div");
    divCentro.className = "text-center my-5";
    const divSpinner = criarHTML("div");
    divSpinner.className = "spinner-border text-primary";
    divSpinner.setAttribute("role", "status");
    divSpinner.appendChild(this.criarElementoTexto("span", "Carregando...", "visually-hidden"));
    divCentro.appendChild(divSpinner);
    return divCentro;
  }

  protected criarAlerta(mensagem: string, tipo: string = "danger"): HTMLElement {
    return this.criarElementoTexto("div", mensagem, `alert alert-${tipo} w-100`);
  }

  protected criarEstruturaModal(
    titulo: string, 
    corpo: HTMLElement | string, 
    textoBtn: string, 
    acao: () => void, 
    corBtn: string = "primary"
  ): HTMLElement {
    const modal = criarHTML("div");
    modal.className = "modal fade show d-block";
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.setAttribute("role", "dialog");

    const dialog = criarHTML("div");
    dialog.className = "modal-dialog modal-dialog-centered";

    const content = criarHTML("div");
    content.className = "modal-content shadow";

    const header = criarHTML("div");
    header.className = "modal-header d-flex justify-content-between align-items-center";
    header.appendChild(this.criarElementoTexto("h5", titulo, "modal-title"));
    
    const btnFecharX = criarHTML("button");
    btnFecharX.className = "btn-close";
    btnFecharX.onclick = () => modal.remove();
    header.appendChild(btnFecharX);

    const body = criarHTML("div");
    body.className = "modal-body text-center p-4";
    if (typeof corpo === "string") {
      body.appendChild(this.criarElementoTexto("p", corpo, "mb-0 fw-bold"));
    } else {
      body.appendChild(corpo);
    }

    const footer = criarHTML("div");
    footer.className = "modal-footer justify-content-center";

    const btnCancelar = this.criarElementoTexto("button", "Cancelar", "btn btn-secondary me-2");
    btnCancelar.onclick = () => modal.remove();

    const btnAcao = this.criarElementoTexto("button", textoBtn, `btn btn-${corBtn}`);
    btnAcao.onclick = () => { 
      acao(); 
      modal.remove(); 
    };

    footer.append(btnCancelar, btnAcao);
    content.append(header, body, footer);
    dialog.appendChild(content);
    modal.appendChild(dialog);
    
    return modal;
  }

  public exibir404(container: HTMLElement): void {
    limparFilhos(container);
    const divCentro = criarHTML("div");
    divCentro.className = "text-center mt-5";
    const h1 = this.criarElementoTexto("h1", "404", "display-1 fw-bold");
    const pMensagem = this.criarElementoTexto("p", "Página não encontrada.", "fs-3");
    const spanOps = this.criarElementoTexto("span", "Ops! ", "text-danger");
    pMensagem.prepend(spanOps);
    const pDescricao = this.criarElementoTexto("p", "O endereço que você procura não existe no sistema Cefet Shop.", "lead");
    const btnVoltar = this.criarElementoTexto("button", "Voltar para o início", "btn btn-primary");
    btnVoltar.onclick = (e) => { e.preventDefault(); this.navegarPara("/"); };
    divCentro.append(h1, pMensagem, pDescricao, btnVoltar);
    container.appendChild(divCentro);
  }
}