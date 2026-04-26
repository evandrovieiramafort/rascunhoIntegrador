import { CarrinhoPresenter } from '../presenter/CarrinhoPresenter';
import { obterHTML, htmlParaElemento, prepararContainer } from '../utils/UtilDOM';
import { LinhaCarrinho } from '../components/carrinho/LinhaCarrinho';
import { TabelaCarrinhoBase } from '../components/carrinho/TabelaCarrinho';
import { Spinner, Alerta } from '../components/ui/UIComponents';
import type { CarrinhoDTO } from '../domain/CarrinhoDTO';
import type { CarrinhoViewInterface } from './interfaces/CarrinhoViewInterface';

export class CarrinhoView implements CarrinhoViewInterface {
  private apresentadora: CarrinhoPresenter;
  private readonly CONTAINER_CARRINHO = "#carrinho-conteudo";

  constructor() {
    this.apresentadora = new CarrinhoPresenter(this);
  }

  async iniciar(): Promise<void> {
    await this.apresentadora.carregarCarrinho();
  }

  public exibirCarrinho(carrinho: CarrinhoDTO): void {
    const container = prepararContainer(this.CONTAINER_CARRINHO);

    if (carrinho.itens.length === 0) {
      container.appendChild(
        Alerta('Seu carrinho de compras está vazio.', 'info'),
      );
      return;
    }

    const baseTabela = TabelaCarrinhoBase(carrinho.totalGeral);
    const tbody = baseTabela.querySelector(
      '[data-corpo-tabela]',
    ) as HTMLElement;

    [...carrinho.itens].reverse().forEach((ic) => {
      const linha = LinhaCarrinho(
        ic,
        (id, novaQtd) => this.apresentadora.atualizarQuantidade(id, novaQtd),
        (id) => this.apresentadora.removerItem(id),
      );
      tbody.appendChild(linha);
    });

    container.appendChild(baseTabela);
  }

  public exibirMensagemFeedback(msg: string): void {
    const container = obterHTML('#feedback-operacao-carrinho');
    const alerta = Alerta(msg, 'warning');
    alerta.classList.add('alert-dismissible', 'fade', 'show');

    const btn = htmlParaElemento(`<button class="btn-close"></button>`);
    btn.onclick = () => alerta.remove();
    alerta.appendChild(btn);

    container.replaceChildren(alerta);
    setTimeout(() => alerta.remove(), 4000);
  }

  public exibirCarregamento(): void {
    prepararContainer(this.CONTAINER_CARRINHO).appendChild(Spinner());
  }

  public exibirErro(msg: string): void {
    prepararContainer(this.CONTAINER_CARRINHO).appendChild(Alerta(msg));
  }
}