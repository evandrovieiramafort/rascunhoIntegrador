import { navegarPara } from '../utils/Navegacao';
import { prepararContainer } from '../utils/UtilDOM';
import { HomePresenter } from '../presenter/HomePresenter';
import { CardProduto } from '../components/home/CardProduto';
import { PaginacaoItem } from '../components/home/PaginacaoItem';
import { Spinner, Alerta } from '../components/ui/UIComponents';
import type { ItemDTO } from '../domain/ItemDTO';
import type { HomeViewInterface } from './interfaces/HomeViewInterface';

export class HomeView implements HomeViewInterface {
  private apresentadora: HomePresenter;
  private readonly CONTAINER_ITENS = "#itens-container";
  private readonly CONTAINER_PAGINACAO = "#paginacao-container";

  constructor() {
    this.apresentadora = new HomePresenter(this);
  }

  async iniciar(paginaAtual: number = 1): Promise<void> {
    await this.apresentadora.carregarProdutos(paginaAtual);
  }

  public exibirItens(itens: ItemDTO[]): void {
    const divItens = prepararContainer(this.CONTAINER_ITENS);

    itens.forEach((item) => {
      divItens.appendChild(
        CardProduto(item, (id) => navegarPara(`/detalhes?id=${id}`)),
      );
    });
  }

  public exibirPaginacao(paginaAtual: number, totalPaginas: number): void {
    const navPaginacao = prepararContainer(this.CONTAINER_PAGINACAO);

    const aoMudarPagina = (pag: number) => {
      const url = new URL(window.location.href);
      url.searchParams.set('pagina', pag.toString());
      navegarPara(url.pathname + url.search);
      this.iniciar(pag);
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    this.gerarBotoesPaginacao(navPaginacao, paginaAtual, totalPaginas, aoMudarPagina);
  }

  private gerarBotoesPaginacao(container: HTMLElement, atual: number, total: number, acao: (p: number) => void): void {
    
    container.appendChild(
      PaginacaoItem('Anterior', atual <= 1, false, () => acao(atual - 1))
    );

    for (let i = 1; i <= total; i++) {
      container.appendChild(
        PaginacaoItem(i.toString(), false, i === atual, () => acao(i))
      );
    }

    container.appendChild(
      PaginacaoItem('Próximo', atual >= total, false, () => acao(atual + 1))
    );
  }

  public exibirCarregamento(): void {
    prepararContainer(this.CONTAINER_ITENS).appendChild(Spinner());
    prepararContainer(this.CONTAINER_PAGINACAO); 
  }

  public exibirErro(mensagem: string): void {
    prepararContainer(this.CONTAINER_ITENS).appendChild(Alerta(mensagem));
    prepararContainer(this.CONTAINER_PAGINACAO);
  }
}
