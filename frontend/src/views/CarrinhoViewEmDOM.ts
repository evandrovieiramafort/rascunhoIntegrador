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

        const divFeedback = document.createElement('div');
        divFeedback.id = 'feedback-operacao-carrinho';
        divCarrinho.appendChild(divFeedback);

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

        const tableResponsive = document.createElement('div');
        tableResponsive.className = 'table-responsive mb-4';
        
        const table = document.createElement('table');
        table.className = 'table table-hover align-middle';

        table.appendChild(this.criarCabecalhoTabela());
        
        const tbody = document.createElement('tbody');
        const itensInvertidos = [...carrinho.itens].reverse();

        itensInvertidos.forEach(itemCarrinho => {
            tbody.appendChild(this.criarLinhaItem(itemCarrinho));
        });

        table.appendChild(tbody);
        tableResponsive.appendChild(table);
        divCarrinho.appendChild(tableResponsive);
        divCarrinho.appendChild(this.criarRodapeCarrinho(carrinho.totalGeral));
    }

    private criarCabecalhoTabela(): HTMLElement {
        const thead = document.createElement('thead');
        thead.className = 'table-light';
        
        const tr = document.createElement('tr');
        const colunas = ['Produto', 'Preço', 'Quantidade', 'Subtotal', 'Ação'];

        colunas.forEach(texto => {
            const th = document.createElement('th');
            th.setAttribute('scope', 'col');
            th.textContent = texto;
            if (texto === 'Quantidade') th.style.width = '150px';
            tr.appendChild(th);
        });

        thead.appendChild(tr);
        return thead;
    }

    private criarLinhaItem(itemCarrinho: ItemCarrinhoDTO): HTMLElement {
        const item = itemCarrinho.item;
        const tr = document.createElement('tr');

        const tdProduto = document.createElement('td');
        const divFlex = document.createElement('div');
        divFlex.className = 'd-flex align-items-center';

        const img = document.createElement('img');
        img.src = item.foto;
        img.alt = item.descricao;
        img.className = 'img-thumbnail me-3';
        img.style.width = '64px';
        img.style.height = '64px';
        img.style.objectFit = 'cover';

        const divInfo = document.createElement('div');
        const h6 = document.createElement('h6');
        h6.className = 'mb-0';
        h6.textContent = item.descricao;

        const smallQuantidade = document.createElement('small');
        smallQuantidade.className = 'text-primary d-block';
        smallQuantidade.textContent = `No carrinho: ${itemCarrinho.quantidade} unidades`;

        const smallEstoque = document.createElement('small');
        smallEstoque.className = 'text-muted';
        smallEstoque.textContent = `Disponível em estoque: ${item.quantidadeEstoque}`;

        divInfo.append(h6, smallQuantidade, smallEstoque);
        divFlex.append(img, divInfo);
        tdProduto.appendChild(divFlex);

        const tdPreco = document.createElement('td');
        tdPreco.textContent = this.formatarC$(item.precoFinal);

        const tdQtd = document.createElement('td');
        const selectQtd = document.createElement('select');
        selectQtd.className = 'form-select';
        
        const estoqueTotalDisponivel = itemCarrinho.quantidade + item.quantidadeEstoque;
        const limiteSuperior = estoqueTotalDisponivel < 10 ? estoqueTotalDisponivel : 10;

        for (let i = 1; i <= limiteSuperior; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            if (i === itemCarrinho.quantidade) option.selected = true;
            selectQtd.appendChild(option);
        }

        selectQtd.onchange = async () => {
            const novaQtd = parseInt(selectQtd.value, 10);
            try {
                await this.servicoCarrinho.atualizarQuantidade(item.id, novaQtd);
                this.iniciar();
            } catch (error: any) {
                this.exibirMensagemFeedback("Não há como realizar a operação: estoque insuficiente.");
                this.iniciar();
            }
        };
        tdQtd.appendChild(selectQtd);

        const tdSubtotal = document.createElement('td');
        tdSubtotal.className = 'fw-bold';
        tdSubtotal.textContent = this.formatarC$(itemCarrinho.subtotal);

        const tdAcao = document.createElement('td');
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-sm btn-outline-danger';
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => {
            this.exibirModalConfirmacao(
                `Deseja realmente remover "${item.descricao}" do carrinho?`,
                async () => {
                    await this.servicoCarrinho.removerItem(item.id);
                    this.iniciar();
                }
            );
        };
        tdAcao.appendChild(btnRemover);

        tr.append(tdProduto, tdPreco, tdQtd, tdSubtotal, tdAcao);
        return tr;
    }

    private criarRodapeCarrinho(totalGeral: number): HTMLElement {
        const divRodape = document.createElement('div');
        divRodape.className = 'd-flex justify-content-end align-items-center bg-light p-4 rounded shadow-sm';
        
        const h4Total = document.createElement('h4');
        h4Total.className = 'mb-0 me-4 fw-bold';
        h4Total.textContent = `Total: ${this.formatarC$(totalGeral)}`;

        const btnFinalizar = document.createElement('button');
        btnFinalizar.className = 'btn btn-success btn-lg';
        btnFinalizar.textContent = 'Finalizar Compra';

        divRodape.append(h4Total, btnFinalizar);
        return divRodape;
    }

    private exibirModalConfirmacao(mensagem: string, acaoConfirmar: () => void): void {
        const divModal = document.createElement('div');
        divModal.className = 'modal fade show';
        divModal.style.display = 'block';
        divModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        divModal.setAttribute('role', 'dialog');

        const divDialog = document.createElement('div');
        divDialog.className = 'modal-dialog modal-dialog-centered';

        const divContent = document.createElement('div');
        divContent.className = 'modal-content';

        const divHeader = document.createElement('div');
        divHeader.className = 'modal-header';
        const h5 = document.createElement('h5');
        h5.className = 'modal-title';
        h5.textContent = 'Confirmação';
        divHeader.appendChild(h5);

        const divBody = document.createElement('div');
        divBody.className = 'modal-body';
        divBody.textContent = mensagem;

        const divFooter = document.createElement('div');
        divFooter.className = 'modal-footer';

        const btnCancelar = document.createElement('button');
        btnCancelar.className = 'btn btn-secondary';
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.onclick = () => divModal.remove();

        const btnConfirmar = document.createElement('button');
        btnConfirmar.className = 'btn btn-danger';
        btnConfirmar.textContent = 'Confirmar Remoção';
        btnConfirmar.onclick = () => {
            acaoConfirmar();
            divModal.remove();
        };

        divFooter.append(btnCancelar, btnConfirmar);
        divContent.append(divHeader, divBody, divFooter);
        divDialog.appendChild(divContent);
        divModal.appendChild(divDialog);
        document.body.appendChild(divModal);
    }

    private exibirMensagemFeedback(mensagem: string): void {
        const container = document.querySelector('#feedback-operacao-carrinho');
        if (!container) return;

        container.replaceChildren();
        const divAlerta = document.createElement('div');
        divAlerta.className = 'alert alert-warning alert-dismissible fade show';
        divAlerta.setAttribute('role', 'alert');
        divAlerta.textContent = mensagem;

        const btnClose = document.createElement('button');
        btnClose.className = 'btn-close';
        btnClose.setAttribute('type', 'button');
        btnClose.onclick = () => divAlerta.remove();
        
        divAlerta.appendChild(btnClose);
        container.appendChild(divAlerta);

        setTimeout(() => divAlerta.remove(), 5000);
    }

    public exibirCarregamento(): void {
        const { divCarrinho } = this.localizarElementosDaPagina();
        if (!divCarrinho) return;
        divCarrinho.replaceChildren();
        const divCenter = document.createElement('div');
        divCenter.className = 'text-center my-5';
        const divSpinner = document.createElement('div');
        divSpinner.className = 'spinner-border text-primary';
        divSpinner.appendChild(document.createElement('span'));
        divCenter.appendChild(divSpinner);
        divCarrinho.appendChild(divCenter);
    }

    public exibirErro(mensagem: string): void {
        const { divCarrinho } = this.localizarElementosDaPagina();
        if (!divCarrinho) return;
        divCarrinho.replaceChildren();
        const divAlerta = document.createElement('div');
        divAlerta.className = 'alert alert-danger';
        divAlerta.textContent = mensagem;
        divCarrinho.appendChild(divAlerta);
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