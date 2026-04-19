import type { ItemDTO } from "./ItemDTO";

export interface ItemCarrinhoDTO {
    item: ItemDTO;
    quantidade: number;
    subtotal: number;
}