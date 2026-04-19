import type { ItemDTO } from "./ItemDTO.ts";

export interface PaginacaoDTO {
    itens: ItemDTO[];
    paginaAtual: number;
    totalPaginas: number;
}