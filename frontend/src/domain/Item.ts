export interface ItemDTO {
    id: number;
    foto: string;
    descricao: string;
    descricaoDetalhada: string;
    precoVenda: number | string;
    percentualDesconto: number;
    precoFinal: number;
    quantidadeEstoque: number;
    estaEsgotado: boolean;
}

export interface PaginacaoDTO {
    itens: ItemDTO[];
    paginaAtual: number;
    totalPaginas: number;
}