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

  // MÉTODO PRINCIPAL: Chama a presenter pra carregar os produtos
  async iniciar(paginaAtual: number = 1): Promise<void> {
    await this.apresentadora.carregarProdutos(paginaAtual);
  }

  // Método pra exibir os itens de uma página (usado na presenter)
  public exibirItens(itens: ItemDTO[]): void {
    const divItens = obterHTML('#itens-container'); // pega a tag onde cada item vai ficar
    limparFilhos(divItens); // limpa o que tiver na tag (usado a cada vez que a página muda)

    // chama o forEach para todos os 6 itens que retornarem do GET->6
    itens.forEach((item) => {
      // ---------- Para cada um dos itens que vier do back: ------------

      // É feita a injeção dos dados do item na div de exibição de itens via container "CardProduto"
      divItens.appendChild(
        CardProduto(item, (id) => navegarPara(`/detalhes?id=${id}`)), // 
      );
    });
  }

  // método pra gerir a paginação da home (usado na presenter)
  public exibirPaginacao(paginaAtual: number, totalPaginas: number): void {
    
    // mesma coisa do exibirItens
    // p.s.: Isso aqui bem que podia estar em um método que já faz tanto a obtenção quanto a limpeza do DOM
    const navPaginacao = obterHTML('#paginacao-container'); // pega a tag onde a paginação vai ficar 
    limparFilhos(navPaginacao); // limpa o que tiver na tag (usado a cada vez que uma página é selecionada)


    // evento que dispara quando o botão de mudança de página receber um click
    const aoMudarPagina = (pag: number) => {
      const url = new URL(window.location.href); // pega a url atual
      url.searchParams.set('pagina', pag.toString()); // pega a query parameter da página atual
      window.history.pushState({}, '', url); // atualiza a barra de endereço e o histórico de navegação
      this.iniciar(pag); // inicia a outra página (e aí entramos no método exibirItens de novo)
      
      // joga a página pro topo quando a troca de página é feita
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    // Adiciona o botão "Anterior". Qual é a lógica dele?
    // 1. O texto que vai no botão
    // 2. A condicional, que não entendi como funciona
    // 3. Se o botão vai estar ativo pra clicks
    // 4. O evento que é disparado caso o 3. esteja como true - o que não é o caso
    navPaginacao.appendChild(
      PaginacaoItem('Anterior', paginaAtual <= 1, false, () =>
        aoMudarPagina(paginaAtual - 1),
      ),
    );

    // Adiciona o botão que exibe a página atual. Qual é a lógica dele?
    // 1. O texto que vai no botão
    // 2. A condicional, preciso de explicação pra entender
    // 3. Se o botão vai estar ativo pra clicks
    // 4. O evento que é disparado caso o 3. esteja como true - o que não é o caso
    for (let i = 1; i <= totalPaginas; i++) {
      navPaginacao.appendChild(
        PaginacaoItem(i.toString(), false, i === paginaAtual, () =>
          aoMudarPagina(i),
        ),
      );
    }

    // Adiciona o botão "Próximo". Qual é a lógica dele?
    // 1. O texto que vai no botão
    // 2. A condicional, preciso de explicação pra entender
    // 3. Se o botão vai estar ativo pra clicks
    // 4. O evento que é disparado caso o 3. esteja como true - o que não é o caso
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

  // Método pra exibição de erros que vem da presenter (se a exceção ocorrer)
  public exibirErro(mensagem: string): void {
    const divItens = obterHTML('#itens-container'); // pega #itens-container, assim como na exibirItens
    limparFilhos(divItens); // limpa os filhos da tag
    divItens.appendChild(Alerta(mensagem)); // adiciona o container de Alerta com a mensagem
    limparFilhos(obterHTML('#paginacao-container')); // Limpa a paginação
  }
}


/* ótimo, todos os comentários inseridos. Quero que faça o seguinte: Não vai ter como eu mandar  
todos os códigos onde inseri os comentários pois irá estourar o limite de quantidade de arquivos que posso enviar
 para você. Quero que */