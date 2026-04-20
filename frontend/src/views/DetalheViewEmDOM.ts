import { VisualizadorBase } from "./VisualizadorBase";
import { DetalheController } from "../controllers/DetalheController";
import { obterHTML, criarHTML, limparFilhos } from "../utils/UtilDOM";
import type { ItemDTO } from "../domain/ItemDTO";
import type { DetalheItemView } from "./interfaces/DetalheView";

export class DetalheItemViewEmDOM extends VisualizadorBase implements DetalheItemView {
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

        const row = criarHTML('div');
        row.className = 'row g-4';

        const colImg = criarHTML('div');
        colImg.className = 'col-md-6';
        const img = criarHTML('img');
        img.src = item.foto;
        img.className = 'img-fluid rounded shadow-sm';
        colImg.appendChild(img);

        const colInfo = criarHTML('div');
        colInfo.className = 'col-md-6';
        colInfo.append(
            this.criarElementoTexto("h2", item.descricao),
            this.criarElementoTexto("p", `Lançamento: ${item.periodoLancamento}`, "text-muted small"),
            this.criarElementoTexto("p", item.descricaoDetalhada, "mb-4"),
            this.criarAreaFinanceira(item)
        );

        if (item.quantidadeEstoque > 0) {
            const divStepper = criarHTML("div");
            divStepper.appendChild(this.criarElementoTexto("label", "Quantidade:", "form-label fw-bold"));
            
            const stepper = this.criarStepper(1, item.quantidadeEstoque);
            stepper.id = "stepper-detalhe";
            divStepper.appendChild(stepper);
            
            colInfo.append(divStepper, this.criarBotoesAcao(item));
        }

        row.append(colImg, colInfo);
        container.appendChild(row);

        if (item.quantidadeEstoque <= 0) {
            document.body.appendChild(this.criarEstruturaModal("Esgotado", "Indisponível.", "Voltar", () => this.navegarPara("/"), "danger"));
        }
    }

    private criarAreaFinanceira(item: ItemDTO): HTMLElement {
        const div = criarHTML('div');
        div.className = 'mb-4 p-3 bg-light rounded';
        div.append(this.criarPrecoArea(item.precoVenda, item.precoFinal, item.percentualDesconto));
        div.append(this.criarElementoTexto("p", `Estoque: ${item.quantidadeEstoque} unidades`, "small mt-2 mb-0"));
        return div;
    }

    private criarBotoesAcao(item: ItemDTO): HTMLElement {
        const div = criarHTML("div");
        div.className = "d-grid gap-2";
        const btnAdd = this.criarElementoTexto("button", "Adicionar ao Carrinho", "btn btn-primary btn-lg");
        btnAdd.id = "btn-adicionar";
        btnAdd.onclick = () => {
            const input = obterHTML("#stepper-detalhe input") as HTMLInputElement;
            this.controladora.adicionarAoCarrinho(item.id, parseInt(input.value));
        };
        const btnIr = this.criarElementoTexto("button", "Ir para o Carrinho", "btn btn-outline-secondary");
        btnIr.onclick = () => this.navegarPara("/carrinho");
        div.append(btnAdd, btnIr);
        return div;
    }

    public notificarSucessoAdicao(): void {
        const btn = obterHTML("#btn-adicionar") as HTMLButtonElement;
        btn.classList.replace("btn-primary", "btn-success");
        btn.textContent = "Item Adicionado!";
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