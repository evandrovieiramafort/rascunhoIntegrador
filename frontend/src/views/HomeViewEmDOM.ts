import { ItemService } from "../services/ItemService.ts";
import type { ItemDTO } from "../domain/ItemDTO.ts";
import type { HomeView } from "./interfaces/HomeView.ts";

export class HomeViewEmDOM implements HomeView {
  private servicoItem: ItemService;
  private formatadorCefetins = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  constructor() {
    this.servicoItem = new ItemService();
  }

  async iniciar(paginaAtual: number = 1): Promise<void> {
    this.exibirCarregamento();

    try {
      const dados = await this.servicoItem.obterItens(paginaAtual);
      this.exibirItens(dados.itens);
      this.exibirPaginacao(dados.paginaAtual, dados.totalPaginas);
    } catch (erro) {
      this.exibirErro("Não foi possível carregar os produtos do servidor.");
    }
  }

  public exibirItens(itens: ItemDTO[]): void {
    const { divItens } = this.localizarElementosDaPagina();
    if (!divItens) return;

    divItens.replaceChildren();

    itens.forEach((item) => {
      const divColuna = this.criarColunaItem(item);
      divItens.appendChild(divColuna);
    });
  }

  public exibirPaginacao(paginaAtual: number, totalPaginas: number): void {
    const { navPaginacao } = this.localizarElementosDaPagina();
    if (!navPaginacao) return;

    navPaginacao.replaceChildren();

    navPaginacao.appendChild(
      this.criarBotaoPaginacao("Anterior", paginaAtual - 1, paginaAtual <= 1),
    );

    for (let i = 1; i <= totalPaginas; i++) {
      navPaginacao.appendChild(
        this.criarBotaoPaginacao(i.toString(), i, false, i === paginaAtual),
      );
    }

    navPaginacao.appendChild(
      this.criarBotaoPaginacao(
        "Próximo",
        paginaAtual + 1,
        paginaAtual >= totalPaginas,
      ),
    );
  }

  public exibirCarregamento(): void {
    const { divItens } = this.localizarElementosDaPagina();
    if (!divItens) return;

    divItens.replaceChildren();

    const divEnvelope = document.createElement("div");
    divEnvelope.className = "col-12 text-center my-5";

    const divSpinner = document.createElement("div");
    divSpinner.className = "spinner-border text-primary";
    divSpinner.setAttribute("role", "status");

    const spanAcessibilidade = document.createElement("span");
    spanAcessibilidade.className = "visually-hidden";
    spanAcessibilidade.textContent = "Carregando...";

    divSpinner.appendChild(spanAcessibilidade);
    divEnvelope.appendChild(divSpinner);
    divItens.appendChild(divEnvelope);
  }

  public exibirErro(mensagem: string): void {
    const { divItens, navPaginacao } = this.localizarElementosDaPagina();
    if (!divItens) return;

    divItens.replaceChildren();
    if (navPaginacao) navPaginacao.replaceChildren();

    const divAlerta = document.createElement("div");
    divAlerta.className = "alert alert-danger w-100";
    divAlerta.textContent = mensagem;

    divItens.appendChild(divAlerta);
  }

  private localizarElementosDaPagina() {
    return {
      divItens: document.querySelector("#itens-container") as HTMLElement,
      navPaginacao: document.querySelector(
        "#paginacao-container",
      ) as HTMLElement,
    };
  }

  private criarColunaItem(item: ItemDTO): HTMLElement {
    const divColuna = document.createElement("div");
    divColuna.className = "col-12 col-md-6 col-lg-4";
    divColuna.appendChild(this.criarDivCartao(item));
    return divColuna;
  }

  private criarDivCartao(item: ItemDTO): HTMLElement {
    const divCartao = document.createElement("div");
    divCartao.className = "card h-100 shadow-sm position-relative";

    this.adicionarSpansBadges(divCartao, item);
    this.adicionarImgProduto(divCartao, item);
    this.adicionarDivCorpo(divCartao, item);
    this.adicionarDivRodape(divCartao, item);

    return divCartao;
  }

  private adicionarSpansBadges(divCartao: HTMLElement, item: ItemDTO): void {
    if (item.estaEsgotado) {
      const spanEsgotado = document.createElement("span");
      spanEsgotado.className =
        "badge bg-danger position-absolute top-0 end-0 m-2";
      spanEsgotado.textContent = "Esgotado";
      divCartao.appendChild(spanEsgotado);
    }

    if (item.percentualDesconto > 0) {
      const spanDesconto = document.createElement("span");
      spanDesconto.className =
        "badge bg-success position-absolute top-0 start-0 m-2";
      spanDesconto.textContent = `-${item.percentualDesconto}%`;
      divCartao.appendChild(spanDesconto);
    }
  }


  private adicionarImgProduto(divCartao: HTMLElement, item: ItemDTO): void {
    const imgProduto = document.createElement("img");
    imgProduto.src = item.foto;
    imgProduto.className = "card-img-top";
    imgProduto.alt = item.descricao;
    imgProduto.style.height = "200px";
    imgProduto.style.objectFit = "cover";
    imgProduto.style.cursor = "pointer";

    imgProduto.addEventListener("click", () => {
      window.history.pushState({}, "", `/detalhes?id=${item.id}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    divCartao.appendChild(imgProduto);
  }

  private adicionarDivCorpo(divCartao: HTMLElement, item: ItemDTO): void {
    const divCorpo = document.createElement("div");
    divCorpo.className = "card-body d-flex flex-column";

    const h5Titulo = document.createElement("h5");
    h5Titulo.className = "card-title";
    h5Titulo.textContent = item.descricao;

    const pDescricao = document.createElement("p");
    pDescricao.className = "card-text text-muted small flex-grow-1";
    pDescricao.textContent = item.descricaoDetalhada;

    divCorpo.append(h5Titulo, pDescricao, this.criarDivAreaPreco(item));
    divCartao.appendChild(divCorpo);
  }

  private criarDivAreaPreco(item: ItemDTO): HTMLElement {
    const divPreco = document.createElement("div");
    divPreco.className = "mt-3";

    if (item.percentualDesconto > 0) {
      const smallPrecoAntigo = document.createElement("small");
      smallPrecoAntigo.className = "text-decoration-line-through text-muted";
      smallPrecoAntigo.textContent = this.formatarC$(item.precoVenda);
      divPreco.appendChild(smallPrecoAntigo);
      divPreco.appendChild(document.createElement("br"));
    }

    const spanPrecoFinal = document.createElement("span");
    spanPrecoFinal.className = "fs-5 fw-bold text-primary";
    spanPrecoFinal.textContent = this.formatarC$(item.precoFinal);
    divPreco.appendChild(spanPrecoFinal);

    return divPreco;
  }

  private adicionarDivRodape(divCartao: HTMLElement, item: ItemDTO): void {
    const divRodape = document.createElement("div");
    divRodape.className = "card-footer bg-transparent border-top-0 pb-3";

    const buttonComprar = document.createElement("button");
    buttonComprar.className = "btn btn-primary w-100";
    buttonComprar.disabled = item.estaEsgotado;
    buttonComprar.textContent = item.estaEsgotado ? "Sem estoque" : "Comprar";

    if (!item.estaEsgotado) {
      buttonComprar.addEventListener("click", () => {
        window.history.pushState({}, "", `/detalhes?id=${item.id}`);
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
    }

    divRodape.appendChild(buttonComprar);
    divCartao.appendChild(divRodape);
  }

  private criarBotaoPaginacao(
    texto: string,
    pagina: number,
    desabilitado: boolean,
    ativo: boolean = false,
  ): HTMLElement {
    const liItem = document.createElement("li");
    liItem.className = `page-item ${desabilitado ? "disabled" : ""} ${ativo ? "active" : ""}`;

    const buttonPagina = document.createElement("button");
    buttonPagina.className = "page-link";
    buttonPagina.textContent = texto;

    if (!desabilitado) {
      buttonPagina.addEventListener("click", () => {
        const urlEndereco = new URL(window.location.href);
        urlEndereco.searchParams.set("pagina", pagina.toString());
        window.history.pushState({}, "", urlEndereco);
        this.iniciar(pagina);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    liItem.appendChild(buttonPagina);
    return liItem;
  }

  private formatarC$(valor: number | string): string {
    return `C$ ${this.formatadorCefetins.format(Number(valor))}`;
  }
}
