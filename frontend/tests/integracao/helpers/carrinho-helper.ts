import { expect } from 'vitest';
import type { CarrinhoDTO } from '../../../src/domain/CarrinhoDTO';

export function expectValidoCarrinhoDTO(carrinho: any) {
    expect(carrinho).toHaveProperty('id');
    expect(Array.isArray(carrinho.itens)).toBeTruthy();
    expect(typeof carrinho.totalGeral).toBe('number');
}

export const localizarNoCarrinho = (carrinho: CarrinhoDTO, itemId: number) => 
    carrinho.itens.find(ic => ic.item.id === itemId);