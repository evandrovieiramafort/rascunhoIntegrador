import { API_URL } from "../infra/conf";
import type { PaginacaoDTO } from "../domain/PaginacaoDTO.ts";
import type { ItemDTO } from "../domain/ItemDTO.ts";

export class ItemService {

  private async fetchAPI<T>(endpoint: string, opcoes: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, opcoes);
    
    if (!response.ok) {
      const erro = await response.json().catch(() => ({ mensagem: 'Erro desconhecido no servidor.' }));
      throw new Error(erro.mensagem || `Falha na requisição: ${response.status}`);
    }

    return await response.json();
  }

  async obterItens(pagina: number): Promise<PaginacaoDTO> {
    return this.fetchAPI<PaginacaoDTO>(`/itens/${pagina}`);
  }

  async obterPorId(id: number): Promise<ItemDTO> {
    return this.fetchAPI<ItemDTO>(`/item/${id}`);
  }
}