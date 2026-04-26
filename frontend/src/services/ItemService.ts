import { API_URL } from "../infra/conf";
import type { PaginacaoDTO } from "../domain/PaginacaoDTO.ts";
import type { ItemDTO } from "../domain/ItemDTO.ts";

export class ItemService {

  // Método principal que faz a chamada a um endpoint e retorna a resposta. Esse "T" é um generics usado
  // nos métodos que invocam este método, a fim de determinar a tipagem in-loco
  private async fetchAPI<T>(endpoint: string, opcoes: RequestInit = {}): Promise<T> {
    
    // faz a chamada ao endpoint do back
    const response = await fetch(`${API_URL}${endpoint}`, opcoes);
    
    // Se der ruim, tenta extrair a mensagem de erro do JSON ou lança uma falha com o status.
    if (!response.ok) {
      const erro = await response.json().catch(() => ({ mensagem: 'Erro desconhecido no servidor.' }));
      throw new Error(erro.mensagem || `Falha na requisição: ${response.status}`);
    }

    // Se der bom, retorna a resposta no formato JSON
    return await response.json();
  }

  // Os dois métodos abaixo fazem a mesma coisa: retornam o conteúdo do back nos respectivos DTOs
  // Faz o GET paginado dos itens
  async obterItens(pagina: number): Promise<PaginacaoDTO> {
    return this.fetchAPI<PaginacaoDTO>(`/itens/${pagina}`);
  }

  // Faz o GET de um item só, via id
  async obterPorId(id: number): Promise<ItemDTO> {
    return this.fetchAPI<ItemDTO>(`/item/${id}`);
  }
}