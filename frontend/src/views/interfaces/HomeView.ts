import type { ItemDTO } from "../../domain/ItemDTO.js";

export interface HomeView {
    exibirItens(itens: ItemDTO[]): void;
    exibirPaginacao(paginaAtual: number, totalPaginas: number): void;
    exibirErro(mensagem: string): void;
    exibirCarregamento(): void;
    iniciar(paginaAtual: number): Promise<void>;
}