import { VisualizadorBase } from "./VisualizadorBase";
import { DetalheController } from "../controllers/DetalheController";
import { obterHTML, criarHTML, limparFilhos } from "../utils/UtilDOM";
import type { ItemDTO } from "../domain/ItemDTO";
import type { DetalheItemView } from "./interfaces/DetalheView";

export class DetalheItemViewEmDOM
  extends VisualizadorBase
  implements DetalheItemView
{
  private controladora: DetalheController;

  constructor() {
    super();
    this.controladora = new DetalheController(this);
  }

  async iniciar(idItem: number): Promise<void> {
    await this.controladora.carregarDetalhes(idItem);
  }

  public exibirDetalhes(item: ItemDTO): void {
    const container = obterHTML("#detalhes-container");
    limparFilhos(container);

    const row = criarHTML("div");
    row.className = "row g-5 align-items-center";

    const colImg = criarHTML("div");
    colImg.className = "col-md-6";
    const img = criarHTML("img");
    img.src = item.foto;
    img.className = "img-fluid rounded-4 shadow-sm";
    colImg.appendChild(img);

    const colInfo = criarHTML("div");
    colInfo.className = "col-md-6";
    colInfo.append(
      this.criarElementoTexto("h2", item.descricao, "fw-bold mb-1"),
      this.criarElementoTexto(
        "p",
        `Lançamento: ${item.periodoLancamento}`,
        "text-muted small mb-3",
      ),
      this.criarElementoTexto("p", item.descricaoDetalhada, "lead fs-6 mb-4"),
      this.criarAreaFinanceira(item),
    );

    if (item.quantidadeEstoque <= 0) {
      colInfo.append(
        this.criarElementoTexto("h3", "Esgotado", "text-danger fw-bold my-4"),
      );
    } else {
      const divQtdeSection = criarHTML("div");
      divQtdeSection.className = "mb-4";
      divQtdeSection.appendChild(
        this.criarElementoTexto(
          "label",
          "Quantidade:",
          "form-label fw-bold d-block mb-2",
        ),
      );

      const limiteMaximo = Math.min(10, item.quantidadeEstoque);
      const stepper = this.criarStepper(1, limiteMaximo, "160px");
      stepper.id = "stepper-detalhe";

      divQtdeSection.appendChild(stepper);
      colInfo.append(divQtdeSection, this.criarBotaoAdicionar(item));
    }

    colInfo.append(this.criarBotaoIrParaCarrinho());

    row.append(colImg, colInfo);
    container.appendChild(row);
  }

  private criarAreaFinanceira(item: ItemDTO): HTMLElement {
    const div = criarHTML("div");
    div.className =
      "mb-4 p-4 bg-light rounded-3 border-start border-primary border-4";
    div.append(
      this.criarPrecoArea(
        item.precoVenda,
        item.precoFinal,
        item.percentualDesconto,
      ),
    );
    div.append(
      this.criarElementoTexto(
        "p",
        `Estoque total: ${item.quantidadeEstoque} unidades`,
        "small text-muted mt-2 mb-0",
      ),
    );
    return div;
  }

  private criarBotaoAdicionar(item: ItemDTO): HTMLElement {
    const btnAdd = this.criarElementoTexto(
      "button",
      "Adicionar ao Carrinho",
      "btn btn-primary btn-lg w-100 py-3 fw-bold shadow-sm mb-3",
    );
    btnAdd.id = "btn-adicionar";
    btnAdd.onclick = () => {
      const input = obterHTML("#stepper-detalhe input") as HTMLInputElement;
      this.controladora.adicionarAoCarrinho(item, parseInt(input.value));
    };
    return btnAdd;
  }

  private criarBotaoIrParaCarrinho(): HTMLElement {
    const btnIr = this.criarElementoTexto(
      "button",
      "Ir para o Carrinho",
      "btn btn-outline-secondary btn-lg w-100",
    );
    btnIr.onclick = () => this.navegarPara("/carrinho");
    return btnIr;
  }

  public notificarSucessoAdicao(): void {
    const btn = obterHTML("#btn-adicionar") as HTMLButtonElement;
    btn.classList.replace("btn-primary", "btn-success");
    btn.textContent = "✓ Adicionado!";
    btn.disabled = true;
  }

  public notificarErroAdicao(msg: string): void {
    alert(msg);
  }

  public exibirCarregamento(): void {
    const c = obterHTML("#detalhes-container");
    limparFilhos(c);
    c.appendChild(this.criarSpinner());
  }

  public exibirErro(msg: string): void {
    const c = obterHTML("#detalhes-container");
    limparFilhos(c);
    c.appendChild(this.criarAlerta(msg, "warning"));
  }
}
