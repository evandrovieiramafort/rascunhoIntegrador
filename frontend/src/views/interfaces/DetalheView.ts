import type { ItemDTO } from "../../domain/ItemDTO";

export interface DetalheItemView {
    exibirCarregamento(): void;
    exibirDetalhes(item: ItemDTO): void;
    exibirErro(mensagem: string): void;
    notificarSucessoAdicao(): void;
    notificarErroAdicao(mensagem: string): void;
}