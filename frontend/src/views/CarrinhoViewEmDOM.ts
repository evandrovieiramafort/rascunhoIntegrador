import { CarrinhoService } from "../services/CarrinhoService";
import type { CarrinhoDTO } from "../domain/CarrinhoDTO";
import type { ItemCarrinhoDTO } from "../domain/ItemCarrinhoDTO";
import type { CarrinhoView } from "./interfaces/CarrinhoView";

export class CarrinhoViewEmDOM implements CarrinhoView {
    private servicoCarrinho: CarrinhoService;
    private formatadorCefetins = new Intl.NumberFormat('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    constructor() {
        this.servicoCarrinho = new CarrinhoService();
    }

    async iniciar(): Promise<void> {
        this.exibirCarregamento();
        try {
            const carrinho = await this.servicoCarrinho.obterCarrinho();
            this.exibirCarrinho(carrinho);
            this.servicoCarrinho.atualizarBadgeNav();
        } catch (erro) {
            this.exibirErro("Falha ao carregar o carrinho.");
        }
    }

    public exibirCarrinho(carrinho: CarrinhoDTO): void {
        const { divCarrinho } = this.localizarElementosDaPagina();
        if (!divCarrinho) return;

        divCarrinho.replaceChildren();

        const h2 = document.createElement('h2');
        h2.className = 'mb-4';
        h2.textContent = 'Meu Carrinho';
        divCarrinho.appendChild(h2);

        if (carrinho.itens.length === 0) {
            const pVazio = document.createElement('div');
            pVazio.className = 'alert alert-info';
            pVazio.textContent = 'Seu carrinho de compras está vazio.';
            divCarrinho.appendChild(pVazio);
            return;
        }

        const tableResponsvie = document.createElement('div');
        tableResponsvie.className = 'table-responsive mb-4';
        
        const table = document.createElement('table');
        table.className = 'table table-hover align-middle';

        table.innerHTML = `
            <thead class="table-light">
                <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Preço</th>
                    <th scope="col" style="width: 150px;">Quantidade</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col">Ação</th>
                </tr>
            </thead>
        `;
        
        const tbody = document.createElement('tbody');
        
        const itensInvertidos = [...carrinho.itens].reverse();

        itensInvertidos.forEach(itemCarrinho => {
            const tr = this.criarLinhaItem(itemCarrinho);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableResponsvie.appendChild(table);
        divCarrinho.appendChild(tableResponsvie);

        const divRodape = document.createElement('div');
        divRodape.className = 'd-flex justify-content-end align-items-center bg-light p-4 rounded shadow-sm';
        
        const h4Total = document.createElement('h4');
        h4Total.className = 'mb-0 me-4 fw-bold';
        h4Total.textContent = `Total: ${this.formatarC$(carrinho.totalGeral)}`;

        const btnFinalizar = document.createElement('button');
        btnFinalizar.className = 'btn btn-success btn-lg';
        btnFinalizar.textContent = 'Finalizar Compra';

        divRodape.append(h4Total, btnFinalizar);
        divCarrinho.appendChild(divRodape);
    }

    private criarLinhaItem(itemCarrinho: ItemCarrinhoDTO): HTMLElement {
        const item = itemCarrinho.item;
        const tr = document.createElement('tr');

        const tdProduto = document.createElement('td');
        tdProduto.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.foto}" alt="${item.descricao}" class="img-thumbnail me-3" style="width: 64px; height: 64px; object-fit: cover;">
                <div>
                    <h6 class="mb-0">${item.descricao}</h6>
                    <small class="text-muted">Estoque: ${item.quantidadeEstoque}</small>
                </div>
            </div>
        `;

        const tdPreco = document.createElement('td');
        tdPreco.textContent = this.formatarC$(item.precoFinal);

        const tdQtd = document.createElement('td');
        const selectQtd = document.createElement('select');
        selectQtd.className = 'form-select';
        
        const limiteSuperior = item.quantidadeEstoque < 10 ? item.quantidadeEstoque : 10;
        for (let i = 1; i <= limiteSuperior; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            if (i === itemCarrinho.quantidade) option.selected = true;
            selectQtd.appendChild(option);
        }

        selectQtd.onchange = async () => {
            const novaQtd = parseInt(selectQtd.value, 10);
            this.exibirCarregamento();
            await this.servicoCarrinho.atualizarQuantidade(item.id, novaQtd);
            this.iniciar();
        };
        tdQtd.appendChild(selectQtd);

        const tdSubtotal = document.createElement('td');
        tdSubtotal.className = 'fw-bold';
        tdSubtotal.textContent = this.formatarC$(itemCarrinho.subtotal);

        const tdAcao = document.createElement('td');
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-sm btn-outline-danger';
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = async () => {
            if (confirm(`Remover ${item.descricao} do carrinho?`)) {
                this.exibirCarregamento();
                await this.servicoCarrinho.removerItem(item.id);
                this.iniciar();
            }
        };
        tdAcao.appendChild(btnRemover);

        tr.append(tdProduto, tdPreco, tdQtd, tdSubtotal, tdAcao);
        return tr;
    }

    public exibirCarregamento(): void {
        const { divCarrinho } = this.localizarElementosDaPagina();
        if (!divCarrinho) return;
        divCarrinho.innerHTML = '<div class="text-center my-5"><div class="spinner-border text-primary" role="status"></div></div>';
    }

    public exibirErro(mensagem: string): void {
        const { divCarrinho } = this.localizarElementosDaPagina();
        if (!divCarrinho) return;
        divCarrinho.innerHTML = `<div class="alert alert-danger">${mensagem}</div>`;
    }

    private localizarElementosDaPagina() {
        return {
            divCarrinho: document.querySelector('#carrinho-container') as HTMLElement
        };
    }

    private formatarC$(valor: number | string): string {
        return `C$ ${this.formatadorCefetins.format(Number(valor))}`;
    }
}