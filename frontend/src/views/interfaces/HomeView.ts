import type { ItemDTO } from "../../domain/ItemDTO";

export interface HomeView {
    exibirCarregamento(): void;
    exibirItens(itens: ItemDTO[]): void;
    exibirPaginacao(paginaAtual: number, totalPaginas: number): void;
    exibirErro(mensagem: string): void;
}