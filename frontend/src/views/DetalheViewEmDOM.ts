import { ItemService } from "../services/ItemService";
import type { ItemDTO } from "../domain/ItemDTO";
import type { DetalheItemView } from "./interfaces/DetalheView";

export class DetalheItemViewEmDOM implements DetalheItemView {
    private servicoItem: ItemService;
    private formatadorCefetins = new Intl.NumberFormat('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    constructor() {
        this.servicoItem = new ItemService();
    }


    async iniciar(idItem: number): Promise<void> {
        this.exibirCarregamento();

        try {
            const item = await this.servicoItem.obterPorId(idItem);
            if (item) {
                this.exibirDetalhes(item);
            } else {
                this.exibirErro("Produto não encontrado.");
            }
        } catch (erro) {
            this.exibirErro("Falha ao carregar os detalhes do produto.");
        }
    }


    public exibirDetalhes(item: ItemDTO): void {
        const { divDetalhes } = this.localizarElementosDaPagina();
        if (!divDetalhes) return;

        divDetalhes.replaceChildren();

        const divLinha = document.createElement('div');
        divLinha.className = 'row g-4';

        const divColunaImagem = this.criarColunaImagem(item);
        const divColunaInfo = this.criarColunaInformacoes(item);

        divLinha.append(divColunaImagem, divColunaInfo);
        divDetalhes.appendChild(divLinha);
    }

    public exibirCarregamento(): void {
        const { divDetalhes } = this.localizarElementosDaPagina();
        if (!divDetalhes) return;

        divDetalhes.replaceChildren();
        
        const divEnvelope = document.createElement('div');
        divEnvelope.className = 'col-12 text-center my-5';
        
        const divSpinner = document.createElement('div');
        divSpinner.className = 'spinner-border text-primary';
        divSpinner.setAttribute('role', 'status');
        
        const spanAcessibilidade = document.createElement('span');
        spanAcessibilidade.className = 'visually-hidden';
        spanAcessibilidade.textContent = 'Carregando detalhes...';
        
        divSpinner.appendChild(spanAcessibilidade);
        divEnvelope.appendChild(divSpinner);
        divDetalhes.appendChild(divEnvelope);
    }

    public exibirErro(mensagem: string): void {
        const { divDetalhes } = this.localizarElementosDaPagina();
        if (!divDetalhes) return;

        divDetalhes.replaceChildren();
        
        const divAlerta = document.createElement('div');
        divAlerta.className = 'alert alert-warning w-100';
        divAlerta.textContent = mensagem;
        
        divDetalhes.appendChild(divAlerta);
    }

    private localizarElementosDaPagina() {
        return {
            divDetalhes: document.querySelector('#detalhes-container') as HTMLElement
        };
    }

    private criarColunaImagem(item: ItemDTO): HTMLElement {
        const divColuna = document.createElement('div');
        divColuna.className = 'col-12 col-md-6';

        const imgProduto = document.createElement('img');
        imgProduto.src = item.foto;
        imgProduto.alt = item.descricao;
        imgProduto.className = 'img-fluid rounded shadow-sm';
        imgProduto.style.width = '100%';
        imgProduto.style.maxHeight = '500px';
        imgProduto.style.objectFit = 'contain';
        
        divColuna.appendChild(imgProduto);
        return divColuna;
    }

    private criarColunaInformacoes(item: ItemDTO): HTMLElement {
        const divColuna = document.createElement('div');
        divColuna.className = 'col-12 col-md-6';

        const h2Titulo = document.createElement('h2');
        h2Titulo.className = 'mb-1';
        h2Titulo.textContent = item.descricao;

        const pLancamento = document.createElement('p');
        pLancamento.className = 'text-muted small mb-3';
        pLancamento.textContent = `Lançamento: ${item.periodoLancamento}`;

        const pDescricaoLonga = document.createElement('p');
        pDescricaoLonga.className = 'mb-4';
        pDescricaoLonga.textContent = item.descricaoDetalhada;

        divColuna.append(h2Titulo, pLancamento, pDescricaoLonga, this.criarAreaFinanceira(item));

        if (item.quantidadeEstoque > 0) {
            divColuna.appendChild(this.criarSeletorQuantidade(item.quantidadeEstoque));
            divColuna.appendChild(this.criarBotoesAcao(item));
        } else {
            const divEsgotado = document.createElement('div');
            divEsgotado.className = 'alert alert-danger text-center fw-bold';
            divEsgotado.textContent = 'Esgotado';
            divColuna.appendChild(divEsgotado);
        }

        return divColuna;
    }

    private criarAreaFinanceira(item: ItemDTO): HTMLElement {
        const divFinanceiro = document.createElement('div');
        divFinanceiro.className = 'mb-4 p-3 bg-light rounded';

        if (item.percentualDesconto > 0) {
            const spanDesconto = document.createElement('span');
            spanDesconto.className = 'badge bg-success mb-2 d-inline-block';
            spanDesconto.textContent = `${item.percentualDesconto}% de desconto`;
            
            const smallPrecoOriginal = document.createElement('small');
            smallPrecoOriginal.className = 'd-block text-decoration-line-through text-muted';
            smallPrecoOriginal.textContent = `De: ${this.formatarC$(item.precoVenda)}`;
            
            divFinanceiro.append(spanDesconto, smallPrecoOriginal);
        }

        const h3PrecoFinal = document.createElement('h3');
        h3PrecoFinal.className = 'text-primary fw-bold';
        h3PrecoFinal.textContent = this.formatarC$(item.precoFinal);

        const pEstoque = document.createElement('p');
        pEstoque.className = 'small mt-2 mb-0';
        pEstoque.textContent = `Em estoque: ${item.quantidadeEstoque} unidades`;

        divFinanceiro.append(h3PrecoFinal, pEstoque);
        return divFinanceiro;
    }


    private criarSeletorQuantidade(estoque: number): HTMLElement {
        const divGroup = document.createElement('div');
        divGroup.className = 'mb-4';

        const label = document.createElement('label');
        label.className = 'form-label fw-bold';
        label.textContent = 'Quantidade:';

        const select = document.createElement('select');
        select.className = 'form-select w-25';
        select.id = 'quantidade-selecionada';

        const limiteSuperior = estoque < 10 ? estoque : 10;
        for (let i = 1; i <= limiteSuperior; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            select.appendChild(option);
        }

        divGroup.append(label, select);
        return divGroup;
    }

    private criarBotoesAcao(item: ItemDTO): HTMLElement {
        const divBotoes = document.createElement('div');
        divBotoes.className = 'd-grid gap-2';

        const btnAdicionar = document.createElement('button');
        btnAdicionar.className = 'btn btn-primary btn-lg';
        btnAdicionar.textContent = 'Adicionar ao Carrinho';
        btnAdicionar.onclick = () => {
            const qtd = (document.querySelector('#quantidade-selecionada') as HTMLSelectElement).value;
            console.log(`Item ${item.id} (${qtd} unidades) adicionado ao carrinho`);
        };

        const btnIrCarrinho = document.createElement('button');
        btnIrCarrinho.className = 'btn btn-outline-secondary';
        btnIrCarrinho.textContent = 'Ir para o Carrinho';
        btnIrCarrinho.onclick = () => {
            window.history.pushState({}, '', '/carrinho');
            // Disparar evento de navegação global se necessário
        };

        divBotoes.append(btnAdicionar, btnIrCarrinho);
        return divBotoes;
    }

    private formatarC$(valor: number | string): string {
        return `C$ ${this.formatadorCefetins.format(Number(valor))}`;
    }
}