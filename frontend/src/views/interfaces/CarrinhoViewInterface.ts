import type { CarrinhoDTO } from "../../domain/CarrinhoDTO";

export interface CarrinhoViewInterface {
    exibirCarregamento(): void;
    exibirCarrinho(carrinho: CarrinhoDTO): void;
    exibirErro(mensagem: string): void;
    exibirMensagemFeedback(mensagem: string): void;
}