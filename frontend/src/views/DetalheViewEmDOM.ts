import { VisualizadorBase } from "./VisualizadorBase";
import { ItemService } from "../services/ItemService";
import { CarrinhoService } from "../services/CarrinhoService";
import { obterHTML, criarHTML, limparFilhos } from "../utils/UtilDOM";
import type { ItemDTO } from "../domain/ItemDTO";
import type { DetalheItemView } from "./interfaces/DetalheView";

export class DetalheItemViewEmDOM extends VisualizadorBase implements DetalheItemView {
    private servicoItem: ItemService;
    private servicoCarrinho: CarrinhoService;

    constructor() {
        super();
        this.servicoItem = new ItemService();
        this.servicoCarrinho = new CarrinhoService();
    }

    async iniciar(idItem: number): Promise<void> {
        this.exibirCarregamento();

        try {
            const item = await this.servicoItem.obterPorId(idItem);
            if (item) {
                this.exibirDetalhes(item);
                if (item.quantidadeEstoque <= 0) {
                    this.exibirModalEsgotado(item);
                }
            } else {
                this.exibirErro("Produto não encontrado.");
            }
        } catch (erro) {
            this.exibirErro("Falha ao carregar os detalhes do produto.");
        }
    }

    public exibirDetalhes(item: ItemDTO): void {
        const divDetalhes = obterHTML("#detalhes-container");
        limparFilhos(divDetalhes);

        const divLinha = criarHTML("div");
        divLinha.className = "row g-4";

        divLinha.append(
            this.criarColunaImagem(item), 
            this.criarColunaInformacoes(item)
        );
        
        divDetalhes.appendChild(divLinha);
    }

    public exibirCarregamento(): void {
        const divDetalhes = obterHTML("#detalhes-container");
        limparFilhos(divDetalhes);
        divDetalhes.appendChild(this.criarSpinner());
    }

    public exibirErro(mensagem: string): void {
        const divDetalhes = obterHTML("#detalhes-container");
        limparFilhos(divDetalhes);
        divDetalhes.appendChild(this.criarAlerta(mensagem, "warning"));
    }

    private criarColunaImagem(item: ItemDTO): HTMLElement {
        const divColuna = criarHTML("div");
        divColuna.className = "col-12 col-md-6";

        const imgProduto = criarHTML("img");
        imgProduto.src = item.foto;
        imgProduto.alt = item.descricao;
        imgProduto.className = "img-fluid rounded shadow-sm";
        imgProduto.style.width = "100%";
        imgProduto.style.maxHeight = "500px";
        imgProduto.style.objectFit = "contain";
        
        divColuna.appendChild(imgProduto);
        return divColuna;
    }

    private criarColunaInformacoes(item: ItemDTO): HTMLElement {
        const divColuna = criarHTML("div");
        divColuna.className = "col-12 col-md-6";

        const h2Titulo = criarHTML("h2");
        h2Titulo.className = "mb-1";
        h2Titulo.textContent = item.descricao;

        const pLancamento = criarHTML("p");
        pLancamento.className = "text-muted small mb-3";
        pLancamento.textContent = `Lançamento: ${item.periodoLancamento}`;

        const pDescricaoLonga = criarHTML("p");
        pDescricaoLonga.className = "mb-4";
        pDescricaoLonga.textContent = item.descricaoDetalhada;

        const divFinanceiro = criarHTML("div");
        divFinanceiro.className = "mb-4 p-3 bg-light rounded";
        divFinanceiro.appendChild(
            this.criarPrecoArea(item.precoVenda, item.precoFinal, item.percentualDesconto)
        );

        const pEstoque = criarHTML("p");
        pEstoque.className = "small mt-2 mb-0";
        pEstoque.textContent = item.quantidadeEstoque > 0 
            ? `Em estoque: ${item.quantidadeEstoque} unidades` 
            : "Produto Esgotado";
        divFinanceiro.appendChild(pEstoque);

        divColuna.append(h2Titulo, pLancamento, pDescricaoLonga, divFinanceiro);

        if (item.quantidadeEstoque > 0) {
            divColuna.appendChild(this.criarSeletorQuantidade(item.quantidadeEstoque));
            divColuna.appendChild(this.criarBotoesAcao(item));
        }

        return divColuna;
    }

    private criarSeletorQuantidade(estoque: number): HTMLElement {
        const divGroup = criarHTML("div");
        divGroup.className = "mb-4";

        const label = criarHTML("label");
        label.className = "form-label fw-bold";
        label.textContent = "Quantidade:";

        const select = criarHTML("select");
        select.className = "form-select w-25";
        select.id = "quantidade-selecionada";

        const limiteSuperior = estoque < 10 ? estoque : 10;
        for (let i = 1; i <= limiteSuperior; i++) {
            const option = criarHTML("option");
            option.value = i.toString();
            option.textContent = i.toString();
            select.appendChild(option);
        }

        divGroup.append(label, select);
        return divGroup;
    }

    private criarBotoesAcao(item: ItemDTO): HTMLElement {
        const divBotoes = criarHTML("div");
        divBotoes.className = "d-grid gap-2";

        const btnAdicionar = criarHTML("button");
        btnAdicionar.className = "btn btn-primary btn-lg";
        btnAdicionar.textContent = "Adicionar ao Carrinho";
        
        btnAdicionar.onclick = async () => {
            const selectQtd = obterHTML("#quantidade-selecionada") as HTMLSelectElement;
            const qtd = parseInt(selectQtd.value, 10);
            
            btnAdicionar.disabled = true;
            btnAdicionar.textContent = "Adicionando...";

            try {
                await this.servicoCarrinho.adicionarItem(item.id, qtd);
                await this.servicoCarrinho.atualizarBadgeNav();
                
                btnAdicionar.classList.replace("btn-primary", "btn-success");
                btnAdicionar.textContent = "Item Adicionado!";
                
                setTimeout(() => {
                    this.iniciar(item.id);
                }, 2000);
            } catch (error: any) {
                alert(error.message || "Quantidade indisponível em estoque.");
                btnAdicionar.disabled = false;
                btnAdicionar.textContent = "Adicionar ao Carrinho";
            }
        };

        const btnIrCarrinho = criarHTML("button");
        btnIrCarrinho.className = "btn btn-outline-secondary";
        btnIrCarrinho.textContent = "Ir para o Carrinho";
        btnIrCarrinho.onclick = () => this.navegarPara("/carrinho");

        divBotoes.append(btnAdicionar, btnIrCarrinho);
        return divBotoes;
    }

    private exibirModalEsgotado(item: ItemDTO): void {
        const modal = this.criarEstruturaModal(
            "Aviso de Estoque",
            `Lamentamos, mas o item "${item.descricao}" está esgotado no momento.`,
            "Voltar para Produtos",
            () => this.navegarPara("/"),
            "danger"
        );
        document.body.appendChild(modal);
    }
}