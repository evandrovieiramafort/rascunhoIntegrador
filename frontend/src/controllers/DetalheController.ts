import { ItemService } from "../services/ItemService";
import { CarrinhoService } from "../services/CarrinhoService";
import type { DetalheItemView } from "../views/interfaces/DetalheView";

export class DetalheController {
    private servicoItem: ItemService;
    private servicoCarrinho: CarrinhoService;

    constructor(private visao: DetalheItemView) {
        this.servicoItem = new ItemService();
        this.servicoCarrinho = new CarrinhoService();
    }

    async carregarDetalhes(id: number): Promise<void> {
        this.visao.exibirCarregamento();
        try {
            const item = await this.servicoItem.obterPorId(id);
            if (item) {
                this.visao.exibirDetalhes(item);
            } else {
                this.visao.exibirErro("Produto não encontrado.");
            }
        } catch {
            this.visao.exibirErro("Falha ao carregar detalhes.");
        }
    }

    async adicionarAoCarrinho(itemId: number, quantidade: number): Promise<void> {
        try {
            await this.servicoCarrinho.adicionarItem(itemId, quantidade);
            await this.servicoCarrinho.atualizarBadgeNav();
            this.visao.notificarSucessoAdicao();
            
            setTimeout(() => {
                this.carregarDetalhes(itemId);
            }, 2000);
        } catch (erro: any) {
            this.visao.notificarErroAdicao(erro.message || "Estoque insuficiente.");
        }
    }
}