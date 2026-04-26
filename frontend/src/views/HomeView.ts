import { navegarPara } from '../utils/Navegacao';
import { obterHTML, limparFilhos } from '../utils/UtilDOM';
import { HomePresenter } from '../presenter/HomePresenter';
import { CardProduto } from '../components/home/CardProduto';
import { PaginacaoItem } from '../components/home/PaginacaoItem';
import { Spinner, Alerta } from '../components/ui/UIComponents';
import type { ItemDTO } from '../domain/ItemDTO';
import type { HomeViewInterface } from './interfaces/HomeViewInterface';

export class HomeView implements HomeViewInterface {
  private apresentadora: HomePresenter;

  constructor() {
    this.apresentadora = new HomePresenter(this);
  }

  // MÉTODO PRINCIPAL: Chama a presenter/controller pra obter os produtos
  async iniciar(paginaAtual: number = 1): Promise<void> {
    await this.apresentadora.carregarProdutos(paginaAtual);
  }

  //
  public exibirItens(itens: ItemDTO[]): void {
    const divItens = obterHTML('#itens-container'); // pega o "#itens-container" (onde cada item vai ficar)
    limparFilhos(divItens); // faz a limpeza da div caso haja algo na tag (usado a cada vez que a página muda)

    // chama o forEach para todos os 6 itens que retornarem do GET->6
    itens.forEach((item) => {
      // ---------- Para cada um dos itens que vier do back: ------------

      // É feita a injeção dos dados do item via container "CardProduto" na div de exibição do item
      divItens.appendChild(
        CardProduto(item, (id) => navegarPara(`/detalhes?id=${id}`)), // 
      );
    });
  }

  public exibirPaginacao(paginaAtual: number, totalPaginas: number): void {
    const navPaginacao = obterHTML('#paginacao-container');
    limparFilhos(navPaginacao);

    const aoMudarPagina = (pag: number) => {
      const url = new URL(window.location.href);
      url.searchParams.set('pagina', pag.toString());
      window.history.pushState({}, '', url);
      this.iniciar(pag);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navPaginacao.appendChild(
      PaginacaoItem('Anterior', paginaAtual <= 1, false, () =>
        aoMudarPagina(paginaAtual - 1),
      ),
    );

    for (let i = 1; i <= totalPaginas; i++) {
      navPaginacao.appendChild(
        PaginacaoItem(i.toString(), false, i === paginaAtual, () =>
          aoMudarPagina(i),
        ),
      );
    }

    navPaginacao.appendChild(
      PaginacaoItem('Próximo', paginaAtual >= totalPaginas, false, () =>
        aoMudarPagina(paginaAtual + 1),
      ),
    );
  }

  // obtém a div #itens-container (onde cada item vai ficar em tela) do html, 
  // limpa todos os filhos que a tag tiver e adiciona o Spinner na div
  public exibirCarregamento(): void {
    const divItens = obterHTML('#itens-container');
    limparFilhos(divItens);
    divItens.appendChild(Spinner());
  }

  public exibirErro(mensagem: string): void {
    const divItens = obterHTML('#itens-container');
    limparFilhos(divItens);
    divItens.appendChild(Alerta(mensagem));
    limparFilhos(obterHTML('#paginacao-container'));
  }
}
