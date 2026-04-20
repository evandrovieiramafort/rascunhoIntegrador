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
            colInfo.append(this.criarSeletorQuantidade(item.quantidadeEstoque), this.criarBotoesAcao(item));
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
        div.append(this.criarElementoTexto("p", `Estoque: ${item.quantidadeEstoque}`, "small mt-2 mb-0"));
        return div;
    }

    private criarSeletorQuantidade(estoque: number): HTMLElement {
        const div = criarHTML("div");
        div.className = "mb-4";
        const select = criarHTML("select");
        select.className = "form-select w-25";
        select.id = "quantidade-selecionada";
        const limite = Math.min(estoque, 10);
        for (let i = 1; i <= limite; i++) {
            const opt = this.criarElementoTexto("option", i.toString());
            opt.value = i.toString();
            select.appendChild(opt);
        }
        div.append(this.criarElementoTexto("label", "Quantidade:", "form-label fw-bold"), select);
        return div;
    }

    private criarBotoesAcao(item: ItemDTO): HTMLElement {
        const div = criarHTML("div");
        div.className = "d-grid gap-2";
        const btnAdd = this.criarElementoTexto("button", "Adicionar ao Carrinho", "btn btn-primary btn-lg");
        btnAdd.id = "btn-adicionar";
        btnAdd.onclick = () => {
            const qtd = parseInt((obterHTML("#quantidade-selecionada") as HTMLSelectElement).value);
            this.controladora.adicionarAoCarrinho(item.id, qtd);
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