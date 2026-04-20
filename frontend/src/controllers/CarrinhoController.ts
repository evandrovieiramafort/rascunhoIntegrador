import { CarrinhoService } from "../services/CarrinhoService";
import type { CarrinhoView } from "../views/interfaces/CarrinhoView";

export class CarrinhoController {
    private servico: CarrinhoService;

    constructor(private visao: CarrinhoView) {
        this.servico = new CarrinhoService();
    }

    async carregarCarrinho(): Promise<void> {
        this.visao.exibirCarregamento();
        try {
            const carrinho = await this.servico.obterCarrinho();
            this.visao.exibirCarrinho(carrinho);
            await this.servico.atualizarBadgeNav();
        } catch {
            this.visao.exibirErro("Falha ao carregar o carrinho.");
        }
    }

    async atualizarQuantidade(itemId: number, quantidade: number): Promise<void> {
        try {
            const carrinho = await this.servico.atualizarQuantidade(itemId, quantidade);
            this.visao.exibirCarrinho(carrinho);
            await this.servico.atualizarBadgeNav();
        } catch {
            this.visao.exibirMensagemFeedback("Erro: estoque insuficiente.");
            await this.carregarCarrinho(); // Recarrega para sincronizar
        }
    }

    async removerItem(itemId: number): Promise<void> {
        try {
            const carrinho = await this.servico.removerItem(itemId);
            this.visao.exibirCarrinho(carrinho);
            await this.servico.atualizarBadgeNav();
        } catch {
            this.visao.exibirErro("Não foi possível remover o item.");
        }
    }
}