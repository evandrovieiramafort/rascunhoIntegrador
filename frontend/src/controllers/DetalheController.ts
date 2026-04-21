import { ItemService } from "../services/ItemService";
import { CarrinhoService } from "../services/CarrinhoService";
import type { DetalheItemView } from "../views/interfaces/DetalheItemView";
import type { ItemDTO } from "../domain/ItemDTO";

export class DetalheController {
  private servicoItem: ItemService;
  private servicoCarrinho: CarrinhoService;

  constructor(private visao: DetalheItemView) {
    this.servicoItem = new ItemService();
    this.servicoCarrinho = new CarrinhoService();
  }

  async carregarDetalhes(id: number): Promise<void> {
    this.visao.exibirCarregamento();
    try {
      const item = await this.servicoItem.obterPorId(id);

      if (item) {
        const qtdNoCarrinho =
          await this.servicoCarrinho.obterQuantidadeItem(id);

        this.visao.exibirDetalhes(item, qtdNoCarrinho);
      } else {
        this.visao.exibirErro("Produto não encontrado.");
      }
    } catch {
      this.visao.exibirErro("Falha ao carregar detalhes.");
    }
  }

  async adicionarAoCarrinho(item: ItemDTO, quantidade: number): Promise<void> {
    try {
      await this.servicoCarrinho.adicionarItem(item, quantidade);
      await this.servicoCarrinho.atualizarBadgeNav();

      this.visao.notificarSucessoAdicao();

      setTimeout(() => {
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }, 800);
    } catch (erro: any) {
      this.visao.notificarErroAdicao(erro.message || "Erro ao adicionar.");
    }
  }
}
