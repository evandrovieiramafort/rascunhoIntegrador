export interface ItemDTO {
    id: number;
    foto: string;
    descricao: string;
    descricaoDetalhada: string;
    periodoLancamento: string;
    precoVenda: number | string;
    percentualDesconto: number;
    precoFinal: number;
    quantidadeEstoque: number;
    estaEsgotado: boolean;
}