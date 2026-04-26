import { navegarPara } from "../utils/Navegacao";
import { DetalhePresenter } from "../presenter/DetalhePresenter";
import { obterHTML, prepararContainer } from "../utils/UtilDOM";
import { SecaoDetalhe } from "../components/detalhes/SecaoDetalhe";
import { Spinner, Alerta } from "../components/ui/UIComponents";
import type { ItemDTO } from "../domain/ItemDTO";
import type { DetalheItemViewInterface } from "./interfaces/DetalheItemViewInterface";

export class DetalheItemView implements DetalheItemViewInterface {
  private apresentadora: DetalhePresenter;
  private readonly CONTAINER_DETALHE = "#detalhes-container";
  private readonly BTN_VOLTAR = "#btn-voltar-loja";
  private readonly BTN_ADICIONAR = "#btn-adicionar";

  constructor() {
    this.apresentadora = new DetalhePresenter(this);
  }

  async iniciar(idItem: number): Promise<void> {
    await this.apresentadora.carregarDetalhes(idItem);
    this.configurarEventosEstaticos();
  }

  private configurarEventosEstaticos(): void {
    const btnVoltar = document.querySelector(this.BTN_VOLTAR) as HTMLButtonElement;
    if (btnVoltar) {
      btnVoltar.onclick = () => navegarPara("/");
    }
  }

  public exibirDetalhes(item: ItemDTO, quantidadeNoCarrinho: number): void {
    const container = prepararContainer(this.CONTAINER_DETALHE);

    const componente = SecaoDetalhe(
      item,
      quantidadeNoCarrinho,
      (qtd) => this.apresentadora.adicionarAoCarrinho(item, qtd),
      () => navegarPara("/carrinho"),
    );

    container.appendChild(componente);
  }

  public notificarSucessoAdicao(): void {
    const btn = obterHTML(this.BTN_ADICIONAR) as HTMLButtonElement;
    btn.classList.replace("btn-primary", "btn-success");
    btn.textContent = "✓ Adicionado!";
    btn.disabled = true;
  }

  public notificarErroAdicao(msg: string): void {
    this.exibirErro(msg);
  }

  public exibirCarregamento(): void {
    prepararContainer(this.CONTAINER_DETALHE).appendChild(Spinner());
  }

  public exibirErro(msg: string): void {
    prepararContainer(this.CONTAINER_DETALHE).appendChild(Alerta(msg, "warning"));
  }
}
