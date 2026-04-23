import type { ItemDTO } from "../../domain/ItemDTO";

export interface HomeViewInterface {
    exibirCarregamento(): void;
    exibirItens(itens: ItemDTO[]): void;
    exibirPaginacao(paginaAtual: number, totalPaginas: number): void;
    exibirErro(mensagem: string): void;
}