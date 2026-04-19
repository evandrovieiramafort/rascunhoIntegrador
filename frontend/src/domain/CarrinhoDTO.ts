import type { ItemCarrinhoDTO } from "./ItemCarrinhoDTO";

export interface CarrinhoDTO {
    id: string;
    itens: ItemCarrinhoDTO[];
    totalGeral: number;
}