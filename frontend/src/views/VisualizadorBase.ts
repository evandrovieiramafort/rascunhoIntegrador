import { criarHTML } from "../utils/UtilDOM";

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

  protected criarBadge(texto: string, cor: string, classesAdicionais: string = ""): HTMLElement {
    return this.criarElementoTexto("span", texto, `badge bg-${cor} ${classesAdicionais}`);
  }

  protected criarPrecoArea(precoVenda: number | string, precoFinal: number, percentualDesconto: number): HTMLElement {
    const divPreco = criarHTML("div");
    if (percentualDesconto > 0) {
      divPreco.appendChild(this.criarElementoTexto("small", this.formatarC$(precoVenda), "text-decoration-line-through text-muted d-block"));
    }
    divPreco.appendChild(this.criarElementoTexto("span", this.formatarC$(precoFinal), "fs-5 fw-bold text-primary"));
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

  protected criarEstruturaModal(titulo: string, corpo: HTMLElement | string, textoBtn: string, acao: () => void, corBtn: string = "primary"): HTMLElement {
    const modal = criarHTML("div");
    modal.className = "modal fade show d-block";
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.setAttribute("role", "dialog");
    
    const dialog = criarHTML("div");
    dialog.className = "modal-dialog modal-dialog-centered";
    
    const content = criarHTML("div");
    content.className = "modal-content shadow";

    const header = criarHTML("div");
    header.className = "modal-header";
    header.appendChild(this.criarElementoTexto("h5", titulo, "modal-title"));

    const body = criarHTML("div");
    body.className = "modal-body text-center p-4";
    if (typeof corpo === "string") {
      body.appendChild(this.criarElementoTexto("p", corpo, "mb-0 fw-bold"));
    } else {
      body.appendChild(corpo);
    }

    const footer = criarHTML("div");
    footer.className = "modal-footer justify-content-center";
    
    const btn = this.criarElementoTexto("button", textoBtn, `btn btn-${corBtn}`);
    btn.onclick = () => { acao(); modal.remove(); };
    footer.appendChild(btn);

    content.append(header, body, footer);
    dialog.appendChild(content);
    modal.appendChild(dialog);
    return modal;
  }
}