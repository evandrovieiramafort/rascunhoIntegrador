import { navegarPara } from "../utils/Navegacao";
import { DetalhePresenter } from "../presenter/DetalhePresenter";
import { obterHTML, limparFilhos } from "../utils/UtilDOM";
import { SecaoDetalhe } from "../components/detalhes/SecaoDetalhe";
import { Spinner, Alerta } from "../components/ui/UIComponents";
import type { ItemDTO } from "../domain/ItemDTO";
import type { DetalheItemViewInterface } from "./interfaces/DetalheItemViewInterface";

export class DetalheItemView implements DetalheItemViewInterface {
  private apresentadora: DetalhePresenter;

  constructor() {
    this.apresentadora = new DetalhePresenter(this);
  }

  async iniciar(idItem: number): Promise<void> {
    await this.apresentadora.carregarDetalhes(idItem);
    this.configurarEventosEstaticos();
  }

  private configurarEventosEstaticos(): void {
    const btnVoltar = document.querySelector(
      "#btn-voltar-loja",
    ) as HTMLButtonElement;
    if (btnVoltar) {
      btnVoltar.onclick = () => window.history.back();
    }
  }

  public exibirDetalhes(item: ItemDTO, quantidadeNoCarrinho: number): void {
    const container = obterHTML("#detalhes-container");
    limparFilhos(container);

    const componente = SecaoDetalhe(
      item,
      quantidadeNoCarrinho,
      (qtd) => this.apresentadora.adicionarAoCarrinho(item, qtd),
      () => navegarPara("/carrinho"),
    );

    container.appendChild(componente);
  }

  public notificarSucessoAdicao(): void {
    const btn = obterHTML("#btn-adicionar") as HTMLButtonElement;
    btn.classList.replace("btn-primary", "btn-success");
    btn.textContent = "✓ Adicionado!";
    btn.disabled = true;
  }

  public notificarErroAdicao(msg: string): void {
    const container = obterHTML("#detalhes-container");
    limparFilhos(container);
    container.appendChild(Alerta(msg, "warning"));
  }

  public exibirCarregamento(): void {
    const c = obterHTML("#detalhes-container");
    limparFilhos(c);
    c.appendChild(Spinner());
  }

  public exibirErro(msg: string): void {
    const c = obterHTML("#detalhes-container");
    limparFilhos(c);
    c.appendChild(Alerta(msg, "warning"));
  }
}
