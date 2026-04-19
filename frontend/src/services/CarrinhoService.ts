import { API_URL } from "../infra/conf";
import type { CarrinhoDTO } from "../domain/CarrinhoDTO";

export class CarrinhoService {
    private configuracaoFetch: RequestInit = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    async obterCarrinho(): Promise<CarrinhoDTO> {
        const response = await fetch(`${API_URL}/carrinho`, this.configuracaoFetch);
        if (!response.ok) throw new Error("Erro ao obter carrinho.");
        return await response.json();
    }

    async adicionarItem(itemId: number, quantidade: number): Promise<CarrinhoDTO> {
        const response = await fetch(`${API_URL}/carrinho/item`, {
            ...this.configuracaoFetch,
            method: 'POST',
            body: JSON.stringify({ item_id: itemId, quantidade })
        });
        if (!response.ok) throw new Error("Erro ao adicionar item.");
        return await response.json();
    }

    async atualizarQuantidade(itemId: number, quantidade: number): Promise<CarrinhoDTO> {
        const response = await fetch(`${API_URL}/carrinho/item/${itemId}`, {
            ...this.configuracaoFetch,
            method: 'PUT',
            body: JSON.stringify({ quantidade })
        });
        if (!response.ok) throw new Error("Erro ao atualizar quantidade.");
        return await response.json();
    }

    async removerItem(itemId: number): Promise<CarrinhoDTO> {
        const response = await fetch(`${API_URL}/carrinho/item/${itemId}`, {
            ...this.configuracaoFetch,
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Erro ao remover item.");
        return await response.json();
    }

    async atualizarBadgeNav(): Promise<void> {
        try {
            const carrinho = await this.obterCarrinho();
            let totalItens = 0;
            
            carrinho.itens.forEach(ic => totalItens += ic.quantidade);

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
            console.error("Erro ao atualizar badge do carrinho", error);
        }
    }
}