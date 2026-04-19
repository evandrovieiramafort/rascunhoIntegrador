import { API_URL } from "../infra/conf";
import type { PaginacaoDTO } from "../domain/PaginacaoDTO.ts";
import type { ItemDTO } from "../domain/ItemDTO.ts";

export class ItemService {
    async obterItens(pagina: number): Promise<PaginacaoDTO> {
        const response = await fetch(`${API_URL}/itens/${pagina}`);
        if (!response.ok) throw new Error(`Erro ao consultar itens: ${response.status}`);
        return await response.json();
    }

    async obterPorId(id: number): Promise<ItemDTO> {
        const response = await fetch(`${API_URL}/item/${id}`);
        if (!response.ok) throw new Error(`Erro ao buscar detalhes: ${response.status}`);
        return await response.json();
    }
}