import { ItemService } from '../services/ItemService';
import type { HomeViewInterface } from '../views/interfaces/HomeViewInterface';

export class HomePresenter {
  private servico: ItemService;

  constructor(private visao: HomeViewInterface) {
    this.servico = new ItemService();
  }

  async carregarProdutos(pagina: number = 1): Promise<void> {
    this.visao.exibirCarregamento();
    try {
      const dados = await this.servico.obterItens(pagina);
      this.visao.exibirItens(dados.itens);
      this.visao.exibirPaginacao(dados.paginaAtual, dados.totalPaginas);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Não foi possível carregar os produtos do servidor";
      this.visao.exibirErro(mensagem);
    }
  }
}