import { VisualizadorBase } from "./VisualizadorBase";
import { CarrinhoService } from "../services/CarrinhoService";
import { obterHTML, criarHTML, limparFilhos } from "../utils/UtilDOM";
import type { CarrinhoDTO } from "../domain/CarrinhoDTO";
import type { ItemCarrinhoDTO } from "../domain/ItemCarrinhoDTO";

export class CarrinhoViewEmDOM extends VisualizadorBase {
    private servicoCarrinho = new CarrinhoService();

    async iniciar(): Promise<void> {
        this.exibirCarregamento();
        try {
            const carrinho = await this.servicoCarrinho.obterCarrinho();
            this.exibirCarrinho(carrinho);
            this.servicoCarrinho.atualizarBadgeNav();
        } catch {
            this.exibirErro("Falha ao carregar o carrinho.");
        }
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
            if (t === 'Quantidade') th.style.width = '120px';
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
        divTxt.appendChild(this.criarElementoTexto("h6", ic.item.descricao, "mb-0"));
        divTxt.appendChild(this.criarElementoTexto("small", `No carrinho: ${ic.quantidade}`, "text-primary d-block"));
        
        const estoqueDisponivel = ic.item.quantidadeEstoque - ic.quantidade;
        divTxt.appendChild(this.criarElementoTexto("small", `Estoque: ${estoqueDisponivel}`, "text-muted"));
        
        divFlex.append(img, divTxt);
        tdProd.appendChild(divFlex);

        const tdPreco = this.criarElementoTexto("td", this.formatarC$(ic.item.precoFinal));

        const tdQtd = criarHTML('td');
        const select = criarHTML('select');
        select.className = 'form-select';
        
        const limiteSuperior = Math.min(ic.item.quantidadeEstoque, ic.quantidade + 10);

        for (let i = 1; i <= limiteSuperior; i++) {
            const opt = this.criarElementoTexto("option", i.toString());
            opt.value = i.toString();
            if (i === ic.quantidade) opt.selected = true;
            select.appendChild(opt);
        }
        select.onchange = async () => {
            try {
                await this.servicoCarrinho.atualizarQuantidade(ic.item.id, parseInt(select.value));
                this.iniciar();
            } catch {
                this.exibirMensagemFeedback("Erro: estoque insuficiente.");
                this.iniciar();
            }
        };
        tdQtd.appendChild(select);

        const tdSub = this.criarElementoTexto("td", this.formatarC$(ic.subtotal), "fw-bold");

        const tdAcao = criarHTML('td');
        const btn = this.criarElementoTexto("button", "Remover", "btn btn-outline-danger btn-sm");
        btn.onclick = () => {
            const modal = this.criarEstruturaModal(
                "Confirmar", 
                `Remover "${ic.item.descricao}" do carrinho?`, 
                "Remover", 
                async () => {
                    await this.servicoCarrinho.removerItem(ic.item.id);
                    this.iniciar();
                }, 
                "danger"
            );
            document.body.appendChild(modal);
        };
        tdAcao.appendChild(btn);

        tr.append(tdProd, tdPreco, tdQtd, tdSub, tdAcao);
        return tr;
    }

    private criarRodape(total: number): HTMLElement {
        const div = criarHTML('div');
        div.className = 'd-flex justify-content-end align-items-center bg-light p-4 rounded shadow-sm';
        div.appendChild(this.criarElementoTexto("h4", `Total: ${this.formatarC$(total)}`, "mb-0 me-4 fw-bold"));
        
        const btn = this.criarElementoTexto("button", "Finalizar Compra", "btn btn-success btn-lg");
        div.appendChild(btn);
        
        return div;
    }

    private exibirMensagemFeedback(msg: string): void {
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

    private exibirCarregamento(): void {
        const c = obterHTML("#carrinho-container");
        limparFilhos(c);
        c.appendChild(this.criarSpinner());
    }

    private exibirErro(msg: string): void {
        const c = obterHTML("#carrinho-container");
        limparFilhos(c);
        c.appendChild(this.criarAlerta(msg));
    }
}