import { navegarPara } from '../utils/Navagacao';
import { DetalheController } from '../controllers/DetalheController';
import { obterHTML, limparFilhos } from '../utils/UtilDOM';
import { SecaoDetalhe } from '../components/detalhes/SecaoDetalhe';
import { Spinner, Alerta } from '../components/ui/UIComponents';
import type { ItemDTO } from '../domain/ItemDTO';
import type { DetalheItemView } from './interfaces/DetalheItemView';

export class DetalheItemView implements DetalheItemView {
  private controladora: DetalheController;

  constructor() {
    this.controladora = new DetalheController(this);
  }

  async iniciar(idItem: number): Promise<void> {
    await this.controladora.carregarDetalhes(idItem);
  }

  public exibirDetalhes(item: ItemDTO, quantidadeNoCarrinho: number): void {
    const container = obterHTML('#detalhes-container');
    limparFilhos(container);

    const componente = SecaoDetalhe(
      item,
      quantidadeNoCarrinho,
      (qtd) => this.controladora.adicionarAoCarrinho(item, qtd),
      () => this.navegarPara('/carrinho'),
    );

    container.appendChild(componente);
  }

  public notificarSucessoAdicao(): void {
    const btn = obterHTML('#btn-adicionar') as HTMLButtonElement;
    btn.classList.replace('btn-primary', 'btn-success');
    btn.textContent = '✓ Adicionado!';
    btn.disabled = true;
  }

  public notificarErroAdicao(msg: string): void {
    alert(msg);
  }

  public exibirCarregamento(): void {
    const c = obterHTML('#detalhes-container');
    limparFilhos(c);
    c.appendChild(Spinner());
  }

  public exibirErro(msg: string): void {
    const c = obterHTML('#detalhes-container');
    limparFilhos(c);
    c.appendChild(Alerta(msg, 'warning'));
  }
}
