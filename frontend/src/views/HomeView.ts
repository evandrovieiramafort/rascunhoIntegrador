import { navegarPara } from '../utils/Navegacao';
import { obterHTML, limparFilhos } from '../utils/UtilDOM';
import { HomeController } from '../controllers/HomeController';
import { CardProduto } from '../components/home/CardProduto';
import { PaginacaoItem } from '../components/home/PaginacaoItem';
import { Spinner, Alerta } from '../components/ui/UIComponents';
import type { ItemDTO } from '../domain/ItemDTO';
import type { HomeView } from './interfaces/HomeView';

export class HomeView implements HomeView {
  private controladora: HomeController;

  constructor() {
    this.controladora = new HomeController(this);
  }

  async iniciar(paginaAtual: number = 1): Promise<void> {
    await this.controladora.carregarProdutos(paginaAtual);
  }

  public exibirItens(itens: ItemDTO[]): void {
    const divItens = obterHTML('#itens-container');
    limparFilhos(divItens);

    itens.forEach((item) => {
      divItens.appendChild(
        CardProduto(item, (id) => this.navegarPara(`/detalhes?id=${id}`)),
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
