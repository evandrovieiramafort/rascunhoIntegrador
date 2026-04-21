import type { CarrinhoDTO } from "../domain/CarrinhoDTO";
import type { ItemCarrinhoDTO } from "../domain/ItemCarrinhoDTO";
import type { ItemDTO } from "../domain/ItemDTO";

export class CarrinhoService {
    private readonly STORAGE_KEY = 'cefet_shop_cart';

    async obterCarrinho(): Promise<CarrinhoDTO> {
        const dados = localStorage.getItem(this.STORAGE_KEY);
        const itens: ItemCarrinhoDTO[] = dados ? JSON.parse(dados) : [];
        const totalGeral = itens.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
        
        return {
            id: "1",
            itens,
            totalGeral
        };
    }

    async adicionarItem(item: ItemDTO, quantidade: number): Promise<CarrinhoDTO> {
        const carrinho = await this.obterCarrinho();
        const index = carrinho.itens.findIndex(ic => ic.item && ic.item.id === item.id);

        if (index !== -1) {
            carrinho.itens[index].quantidade += quantidade;
            carrinho.itens[index].subtotal = carrinho.itens[index].quantidade * item.precoFinal;
        } else {
            carrinho.itens.push({
                item: item,
                quantidade: quantidade,
                subtotal: item.precoFinal * quantidade
            });
        }

        this.salvar(carrinho.itens);
        return this.obterCarrinho();
    }

    async atualizarQuantidade(itemId: number, quantidade: number): Promise<CarrinhoDTO> {
        const carrinho = await this.obterCarrinho();
        const itemCarrinho = carrinho.itens.find(ic => ic.item && ic.item.id === itemId);

        if (itemCarrinho) {
            itemCarrinho.quantidade = quantidade;
            itemCarrinho.subtotal = quantidade * itemCarrinho.item.precoFinal;
            this.salvar(carrinho.itens);
        }

        return this.obterCarrinho();
    }

    async removerItem(itemId: number): Promise<CarrinhoDTO> {
        const carrinho = await this.obterCarrinho();
        const novosItens = carrinho.itens.filter(ic => ic.item && ic.item.id !== itemId);
        
        this.salvar(novosItens);
        return this.obterCarrinho();
    }

    private salvar(itens: ItemCarrinhoDTO[]): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(itens));
    }

    async atualizarBadgeNav(): Promise<void> {
        try {
            const carrinho = await this.obterCarrinho();
            const totalItens = carrinho.itens.reduce((acc, ic) => acc + ic.quantidade, 0);

            const badge = document.querySelector('#badge-carrinho') as HTMLElement;
            if (badge) {
                if (totalItens > 0) {
                    badge.textContent = totalItens.toString();
                    badge.classList.remove('d-none');
                } else {
                    badge.classList.add('d-none');
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}