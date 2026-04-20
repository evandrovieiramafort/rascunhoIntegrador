import { VisualizadorBase } from "./VisualizadorBase";
import { CarrinhoController } from "../controllers/CarrinhoController";
import { obterHTML, criarHTML, limparFilhos } from "../utils/UtilDOM";
import type { CarrinhoDTO } from "../domain/CarrinhoDTO";
import type { ItemCarrinhoDTO } from "../domain/ItemCarrinhoDTO";
import type { CarrinhoView } from "./interfaces/CarrinhoView";

export class CarrinhoViewEmDOM extends VisualizadorBase implements CarrinhoView {
    private controladora: CarrinhoController;

    constructor() {
        super();
        this.controladora = new CarrinhoController(this);
    }

    async iniciar(): Promise<void> {
        await this.controladora.carregarCarrinho();
    }

    public exibirCarrinho(carrinho: CarrinhoDTO): void {
        const container = obterHTML("#carrinho-container");
        limparFilhos(container);

        const feedback = criarHTML('div');
        feedback.id = 'feedback-operacao-carrinho';
        container.appendChild(feedback);

        container.appendChild(this.criarElementoTexto("h2", "Meu Carrinho", "mb-4"));

        if (carrinho.itens.length === 0) {
            container.appendChild(this.criarAlerta('Seu carrinho de compras está vazio.', 'info'));
            return;
        }

        const tableRes = criarHTML('div');
        tableRes.className = 'table-responsive mb-4';
        const table = criarHTML('table');
        table.className = 'table table-hover align-middle';

        const thead = criarHTML('thead');
        thead.className = 'table-light';
        const trH = criarHTML('tr');
        ['Produto', 'Preço', 'Quantidade', 'Subtotal', 'Ação'].forEach(t => {
            const th = this.criarElementoTexto('th', t);
            if (t === 'Quantidade' || t === 'Subtotal' || t === 'Ação' || t === 'Preço') {
                th.className = 'text-center';
            }
            if (t === 'Quantidade') th.style.width = '140px';
            trH.appendChild(th);
        });
        thead.appendChild(trH);
        table.appendChild(thead);

        const tbody = criarHTML('tbody');
        [...carrinho.itens].reverse().forEach(ic => {
            tbody.appendChild(this.criarLinhaItem(ic));
        });

        table.appendChild(tbody);
        tableRes.appendChild(table);
        container.append(tableRes, this.criarRodape(carrinho.totalGeral));
    }

    private criarLinhaItem(ic: ItemCarrinhoDTO): HTMLElement {
        const tr = criarHTML('tr');

        const tdProd = criarHTML('td');
        const divFlex = criarHTML('div');
        divFlex.className = 'd-flex align-items-center';
        const img = criarHTML('img');
        img.src = ic.item.foto;
        img.className = 'img-thumbnail me-3';
        img.style.width = '64px';
        const divTxt = criarHTML('div');
        divTxt.append(
            this.criarElementoTexto("h6", ic.item.descricao, "mb-0"),
            this.criarElementoTexto("small", `No carrinho: ${ic.quantidade}`, "text-primary d-block"),
            this.criarElementoTexto("small", `Estoque total: ${ic.item.quantidadeEstoque}`, "text-muted")
        );
        divFlex.append(img, divTxt);
        tdProd.appendChild(divFlex);

        const tdPreco = this.criarElementoTexto("td", this.formatarC$(ic.item.precoFinal), "text-center");

        const tdQtd = criarHTML('td');
        tdQtd.className = 'text-center';
        tdQtd.appendChild(this.criarStepper(
            ic.quantidade, 
            ic.item.quantidadeEstoque, 
            (novo) => this.controladora.atualizarQuantidade(ic.item.id, novo)
        ));

        const tdSub = this.criarElementoTexto("td", this.formatarC$(ic.subtotal), "fw-bold text-center");

        const tdAcao = criarHTML('td');
        tdAcao.className = 'text-center';
        const btn = this.criarElementoTexto("button", "Remover", "btn btn-outline-danger btn-sm");
        btn.onclick = () => {
            const modal = this.criarEstruturaModal("Confirmar", `Remover "${ic.item.descricao}"?`, "Remover", () => this.controladora.removerItem(ic.item.id), "danger");
            document.body.appendChild(modal);
        };
        tdAcao.appendChild(btn);

        tr.append(tdProd, tdPreco, tdQtd, tdSub, tdAcao);
        return tr;
    }

    private criarRodape(total: number): HTMLElement {
        const div = criarHTML('div');
        div.className = 'd-flex justify-content-end align-items-center bg-light p-4 rounded shadow-sm';
        div.append(this.criarElementoTexto("h4", `Total: ${this.formatarC$(total)}`, "mb-0 me-4 fw-bold"));
        div.append(this.criarElementoTexto("button", "Finalizar Compra", "btn btn-success btn-lg"));
        return div;
    }

    public exibirMensagemFeedback(msg: string): void {
        const container = obterHTML('#feedback-operacao-carrinho');
        const alerta = this.criarAlerta(msg, 'warning');
        alerta.classList.add('alert-dismissible', 'fade', 'show');
        const btn = criarHTML('button');
        btn.className = 'btn-close';
        btn.onclick = () => alerta.remove();
        alerta.appendChild(btn);
        container.replaceChildren(alerta);
        setTimeout(() => alerta.remove(), 4000);
    }

    public exibirCarregamento(): void {
        const c = obterHTML("#carrinho-container");
        limparFilhos(c);
        c.appendChild(this.criarSpinner());
    }

    public exibirErro(msg: string): void {
        const c = obterHTML("#carrinho-container");
        limparFilhos(c);
        c.appendChild(this.criarAlerta(msg));
    }
}