import type { ItemDTO } from "../../domain/ItemDTO";

export interface DetalheItemViewInterface {
    exibirCarregamento(): void;
    exibirErro(mensagem: string): void;
    notificarSucessoAdicao(): void;
    notificarErroAdicao(mensagem: string): void;
    exibirDetalhes(item: ItemDTO, quantidadeNoCarrinho: number): void;
}