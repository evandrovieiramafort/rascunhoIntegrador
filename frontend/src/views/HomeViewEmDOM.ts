import { VisualizadorBase } from "./VisualizadorBase";
import { ItemService } from "../services/ItemService.ts";
import { obterHTML, limparFilhos, criarHTML } from "../utils/UtilDOM.ts";
import type { ItemDTO } from "../domain/ItemDTO.ts";
import type { HomeView } from "./interfaces/HomeView.ts";

export class HomeViewEmDOM extends VisualizadorBase implements HomeView {
  private servicoItem: ItemService;

  constructor() {
    super();
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
    const divItens = obterHTML("#itens-container");
    limparFilhos(divItens);
    
    itens.forEach((item) => {
      divItens.appendChild(this.criarColunaItem(item));
    });
  }

  public exibirPaginacao(paginaAtual: number, totalPaginas: number): void {
    const navPaginacao = obterHTML("#paginacao-container");
    limparFilhos(navPaginacao);

    navPaginacao.appendChild(this.criarBotaoPaginacao("Anterior", paginaAtual - 1, paginaAtual <= 1));
    
    for (let i = 1; i <= totalPaginas; i++) {
      navPaginacao.appendChild(this.criarBotaoPaginacao(i.toString(), i, false, i === paginaAtual));
    }
    
    navPaginacao.appendChild(this.criarBotaoPaginacao("Próximo", paginaAtual + 1, paginaAtual >= totalPaginas));
  }

  public exibirCarregamento(): void {
    const divItens = obterHTML("#itens-container");
    limparFilhos(divItens);
    divItens.appendChild(this.criarSpinner());
  }

  public exibirErro(mensagem: string): void {
    const divItens = obterHTML("#itens-container");
    limparFilhos(divItens);
    divItens.appendChild(this.criarAlerta(mensagem));
    
    try {
      const navPaginacao = obterHTML("#paginacao-container");
      limparFilhos(navPaginacao);
    } catch (e) {
    }
  }

  private criarColunaItem(item: ItemDTO): HTMLElement {
    const divColuna = criarHTML("div");
    divColuna.className = "col-12 col-md-6 col-lg-4";
    divColuna.appendChild(this.criarDivCartao(item));
    return divColuna;
  }

  private criarDivCartao(item: ItemDTO): HTMLElement {
    const divCartao = criarHTML("div");
    divCartao.className = "card h-100 shadow-sm position-relative";

    if (item.estaEsgotado) {
      divCartao.appendChild(this.criarBadge("Esgotado", "danger", "position-absolute top-0 end-0 m-2"));
    }
    
    if (item.percentualDesconto > 0) {
      divCartao.appendChild(this.criarBadge(`-${item.percentualDesconto}%`, "success", "position-absolute top-0 start-0 m-2"));
    }

    const imgProduto = criarHTML("img");
    imgProduto.src = item.foto;
    imgProduto.className = "card-img-top";
    imgProduto.alt = item.descricao;
    imgProduto.style.height = "200px";
    imgProduto.style.objectFit = "cover";
    imgProduto.style.cursor = "pointer";
    imgProduto.onclick = () => this.navegarPara(`/detalhes?id=${item.id}`);

    const divCorpo = criarHTML("div");
    divCorpo.className = "card-body d-flex flex-column";

    const h5Titulo = criarHTML("h5");
    h5Titulo.className = "card-title";
    h5Titulo.textContent = item.descricao;

    const pDescricao = criarHTML("p");
    pDescricao.className = "card-text text-muted small flex-grow-1";
    pDescricao.textContent = item.descricaoDetalhada;

    divCorpo.append(
      h5Titulo, 
      pDescricao, 
      this.criarPrecoArea(item.precoVenda, item.precoFinal, item.percentualDesconto)
    );

    const divRodape = criarHTML("div");
    divRodape.className = "card-footer bg-transparent border-top-0 pb-3";

    const buttonComprar = criarHTML("button");
    buttonComprar.className = "btn btn-primary w-100";
    buttonComprar.disabled = item.estaEsgotado;
    buttonComprar.textContent = item.estaEsgotado ? "Sem estoque" : "Comprar";
    
    if (!item.estaEsgotado) {
      buttonComprar.onclick = () => this.navegarPara(`/detalhes?id=${item.id}`);
    }

    divRodape.appendChild(buttonComprar);
    divCartao.append(imgProduto, divCorpo, divRodape);
    
    return divCartao;
  }

  private criarBotaoPaginacao(texto: string, pagina: number, desabilitado: boolean, ativo: boolean = false): HTMLElement {
    const liItem = criarHTML("li");
    liItem.className = `page-item ${desabilitado ? "disabled" : ""} ${ativo ? "active" : ""}`;
    
    const buttonPagina = criarHTML("button");
    buttonPagina.className = "page-link";
    buttonPagina.textContent = texto;
    
    if (!desabilitado) {
      buttonPagina.onclick = () => {
        const urlEndereco = new URL(window.location.href);
        urlEndereco.searchParams.set("pagina", pagina.toString());
        window.history.pushState({}, "", urlEndereco);
        this.iniciar(pagina);
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    }
    
    liItem.appendChild(buttonPagina);
    return liItem;
  }
}