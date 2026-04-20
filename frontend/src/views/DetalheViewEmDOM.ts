import { ItemService } from "../services/ItemService";
import { CarrinhoService } from "../services/CarrinhoService";
import type { ItemDTO } from "../domain/ItemDTO";
import type { DetalheItemView } from "./interfaces/DetalheView";

export class DetalheItemViewEmDOM implements DetalheItemView {
    private servicoItem: ItemService;
    private servicoCarrinho: CarrinhoService;
    private formatadorCefetins = new Intl.NumberFormat('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });

    constructor() {
        this.servicoItem = new ItemService();
        this.servicoCarrinho = new CarrinhoService();
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

        if (item.quantidadeEstoque <= 0) {
            this.exibirModalEsgotado(item);
        }
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
        pEstoque.textContent = item.quantidadeEstoque > 0 
            ? `Em estoque: ${item.quantidadeEstoque} unidades` 
            : "Produto Esgotado";

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
        
        btnAdicionar.onclick = async () => {
            const selectQtd = document.querySelector('#quantidade-selecionada') as HTMLSelectElement;
            const qtd = parseInt(selectQtd.value, 10);
            
            btnAdicionar.disabled = true;
            btnAdicionar.textContent = 'Adicionando...';

            try {
                await this.servicoCarrinho.adicionarItem(item.id, qtd);
                await this.servicoCarrinho.atualizarBadgeNav();
                
                btnAdicionar.classList.replace('btn-primary', 'btn-success');
                btnAdicionar.textContent = 'Item Adicionado!';
                
                setTimeout(() => {
                    this.iniciar(item.id);
                }, 2000);
            } catch (error: any) {
                alert(error.message || "Quantidade indisponível em estoque.");
                btnAdicionar.disabled = false;
                btnAdicionar.textContent = 'Adicionar ao Carrinho';
            }
        };

        const btnIrCarrinho = document.createElement('button');
        btnIrCarrinho.className = 'btn btn-outline-secondary';
        btnIrCarrinho.textContent = 'Ir para o Carrinho';
        btnIrCarrinho.onclick = () => {
            window.history.pushState({}, '', '/carrinho');
            window.dispatchEvent(new PopStateEvent('popstate'));
        };

        divBotoes.append(btnAdicionar, btnIrCarrinho);
        return divBotoes;
    }

    private exibirModalEsgotado(item: ItemDTO): void {
        const divModal = document.createElement('div');
        divModal.className = 'modal fade show';
        divModal.style.display = 'block';
        divModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        divModal.setAttribute('role', 'dialog');

        const divDialog = document.createElement('div');
        divDialog.className = 'modal-dialog modal-dialog-centered';

        const divContent = document.createElement('div');
        divContent.className = 'modal-content border-danger';

        const divHeader = document.createElement('div');
        divHeader.className = 'modal-header bg-danger text-white';
        const h5 = document.createElement('h5');
        h5.className = 'modal-title';
        h5.textContent = 'Aviso de Estoque';
        divHeader.appendChild(h5);

        const divBody = document.createElement('div');
        divBody.className = 'modal-body text-center p-4';
        
        const pAviso = document.createElement('p');
        pAviso.className = 'mb-0 fw-bold';
        pAviso.textContent = `Lamentamos, mas o item "${item.descricao}" está esgotado no momento.`;
        divBody.appendChild(pAviso);

        const divFooter = document.createElement('div');
        divFooter.className = 'modal-footer justify-content-center';

        
        const btnVoltar = document.createElement('button');
        btnVoltar.className = 'btn btn-danger';
        btnVoltar.textContent = 'Voltar para Produtos';
        btnVoltar.onclick = () => {
            divModal.remove();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
        };

        divFooter.appendChild(btnVoltar);
        divContent.append(divHeader, divBody, divFooter);
        divDialog.appendChild(divContent);
        divModal.appendChild(divDialog);
        document.body.appendChild(divModal);
    }

    private formatarC$(valor: number | string): string {
        return `C$ ${this.formatadorCefetins.format(Number(valor))}`;
    }
}