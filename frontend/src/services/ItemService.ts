import { API_URL } from "../infra/conf";
import type { PaginacaoDTO } from "../domain/Item";

export class ItemService {
    async obterItens(pagina: number): Promise<PaginacaoDTO> {
        const response = await fetch(`${API_URL}/itens/${pagina}`);
        
        if (!response.ok) {
            throw new Error(`Erro ao consultar os itens: Status ${response.status}`);
        }
        
        const dados = await response.json();
        return dados as PaginacaoDTO;
    }
}