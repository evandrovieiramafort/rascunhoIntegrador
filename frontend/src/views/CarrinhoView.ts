import { CarrinhoController } from '../controllers/CarrinhoController';
import { obterHTML, limparFilhos, htmlParaElemento } from '../utils/UtilDOM';
import { LinhaCarrinho } from '../components/carrinho/LinhaCarrinho';
import { TabelaCarrinhoBase } from '../components/carrinho/TabelaCarrinho';
import { Spinner, Alerta } from '../components/ui/UIComponents';
import type { CarrinhoDTO } from '../domain/CarrinhoDTO';
import type { CarrinhoView } from './interfaces/CarrinhoView';

export class CarrinhoView implements CarrinhoView {
  private controladora: CarrinhoController;

  constructor() {
    this.controladora = new CarrinhoController(this);
  }

  async iniciar(): Promise<void> {
    await this.controladora.carregarCarrinho();
  }

  public exibirCarrinho(carrinho: CarrinhoDTO): void {
    const container = obterHTML('#carrinho-container');
    limparFilhos(container);

    const feedback = htmlParaElemento(
      `<div id="feedback-operacao-carrinho"></div>`,
    );
    container.appendChild(feedback);

    const titulo = htmlParaElemento(`<h2 class="mb-4">Meu Carrinho</h2>`);
    container.appendChild(titulo);

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
        (id, novaQtd) => this.controladora.atualizarQuantidade(id, novaQtd),
        (id) => this.controladora.removerItem(id),
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
    const c = obterHTML('#carrinho-container');
    limparFilhos(c);
    c.appendChild(Spinner());
  }

  public exibirErro(msg: string): void {
    const c = obterHTML('#carrinho-container');
    limparFilhos(c);
    c.appendChild(Alerta(msg));
  }
}
