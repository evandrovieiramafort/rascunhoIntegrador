import type { ItemDTO } from "../../domain/ItemDTO.js";

export interface DetalheItemView {
    exibirDetalhes(item: ItemDTO): void;
    exibirErro(mensagem: string): void;
    exibirCarregamento(): void;
    iniciar(idItem: number): Promise<void>;
}