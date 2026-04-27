import { expect } from 'vitest';

export function expectValidoItemDTO(item: any) {
    expect(item.id).toBeTypeOf('number');
    expect(item.descricao).toBeDefined();
    expect(item.precoFinal).toBeTypeOf('number');
    expect(item.quantidadeEstoque).toBeGreaterThanOrEqual(0);
}

export function expectValidaPaginacao(res: any) {
    expect(Array.isArray(res.itens)).toBeTruthy();
    expect(res.paginaAtual).toBeTypeOf('number');
    expect(res.totalPaginas).toBeGreaterThanOrEqual(1);
}