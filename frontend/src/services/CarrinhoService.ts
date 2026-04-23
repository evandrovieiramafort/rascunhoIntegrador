import { API_URL } from "../infra/conf";
import type { CarrinhoDTO } from "../domain/CarrinhoDTO";
import type { ItemDTO } from "../domain/ItemDTO";

export class CarrinhoService {
    
    private async fetchAPI(endpoint: string, options: RequestInit = {}): Promise<CarrinhoDTO> {
        const config: RequestInit = {
            ...options,
            credentials: 'include', // Envia o cookie de sessão do PHP
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const erro = await response.json().catch(() => ({ mensagem: 'Erro desconhecido no servidor.' }));
            throw new Error(erro.mensagem || `Falha na requisição: ${response.status}`);
        }

        return await response.json();
    }

    async obterCarrinho(): Promise<CarrinhoDTO> {
        return this.fetchAPI('/carrinho');
    }

    async adicionarItem(item: ItemDTO, quantidade: number): Promise<CarrinhoDTO> {
        return this.fetchAPI('/carrinho/item', {
            method: 'POST',
            body: JSON.stringify({ item_id: item.id, quantidade: quantidade })
        });
    }

    private activeController: AbortController | null = null;

    async atualizarQuantidade(itemId: number, quantidade: number): Promise<CarrinhoDTO> {
        if (this.activeController) {
            this.activeController.abort();
        }
        
        this.activeController = new AbortController();

        try {
            return await this.fetchAPI(`/carrinho/item/${itemId}`, {
                method: 'PUT',
                signal: this.activeController.signal,
                body: JSON.stringify({ quantidade: quantidade })
            });
        } finally {
            this.activeController = null;
        }
    }

    async removerItem(itemId: number): Promise<CarrinhoDTO> {
        return this.fetchAPI(`/carrinho/item/${itemId}`, {
            method: 'DELETE'
        });
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
            console.error("Erro ao atualizar badge do carrinho:", error);
        }
    }

    async obterQuantidadeItem(itemId: number): Promise<number> {
        try {
            const carrinho = await this.obterCarrinho();
            const itemNoCarrinho = carrinho.itens.find(ic => ic.item && ic.item.id === itemId);
            return itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
        } catch {
            return 0;
        }
    }
}