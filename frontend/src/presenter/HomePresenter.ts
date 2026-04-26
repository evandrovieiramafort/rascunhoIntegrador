import { ItemService } from '../services/ItemService';
import type { HomeViewInterface } from '../views/interfaces/HomeViewInterface';

export class HomePresenter {
  private servico: ItemService;

  constructor(private visao: HomeViewInterface) {
    this.servico = new ItemService();
  }

  async carregarProdutos(pagina: number = 1): Promise<void> {
    
    // obtém a div #itens-container (onde cada item vai ser exibido) de home.html, 
    // limpa todos os filhos que a tag tiver e adiciona o Spinner na div
    this.visao.exibirCarregamento(); 
    try {
      const dados = await this.servico.obterItens(pagina); // chama a service pra fazer o GET paginado
      
      this.visao.exibirItens(dados.itens); // faz a exibição dos itens em tela
      
      this.visao.exibirPaginacao(dados.paginaAtual, dados.totalPaginas);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Não foi possível carregar os produtos do servidor";
      this.visao.exibirErro(mensagem);
    }
  }
}