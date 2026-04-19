import type { CarrinhoDTO } from "../../domain/CarrinhoDTO";

export interface CarrinhoView {
    exibirCarrinho(carrinho: CarrinhoDTO): void;
    exibirCarregamento(): void;
    exibirErro(mensagem: string): void;
    iniciar(): Promise<void>;
}