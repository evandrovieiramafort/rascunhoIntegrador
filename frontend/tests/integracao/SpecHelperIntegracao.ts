import { expect } from 'vitest';
import type { CarrinhoDTO } from '../../src/domain/CarrinhoDTO';

export class SpecHelperIntegracao {
    public static readonly ID_EXISTENTE = 5;
    public static readonly ID_INEXISTENTE = 999999;
    public static readonly PAGINA_INVALIDA = 99999;


    public static validarItemDTO(item: any): void {
        expect(item.id).toBeTypeOf('number');
        expect(item.descricao).toBeDefined();
        expect(item.precoFinal).toBeTypeOf('number');
        expect(item.quantidadeEstoque).toBeGreaterThanOrEqual(0);
    }

    public static validarCarrinhoDTO(carrinho: any): void {
        expect(carrinho).toHaveProperty('id');
        expect(Array.isArray(carrinho.itens)).toBeTruthy();
        expect(typeof carrinho.totalGeral).toBe('number');
    }

    public static validarPaginacao(res: any): void {
        expect(Array.isArray(res.itens)).toBeTruthy();
        expect(res.paginaAtual).toBeTypeOf('number');
        expect(res.totalPaginas).toBeGreaterThanOrEqual(1);
    }


    public static localizarNoCarrinho(carrinho: CarrinhoDTO, itemId: number) {
        return carrinho.itens.find(ic => ic.item.id === itemId);
    }

    public static async esperarErro(promessa: Promise<any>, mensagem?: string): Promise<void> {
        if (mensagem) {
            await expect(promessa).rejects.toThrow(mensagem);
        } else {
            await expect(promessa).rejects.toThrow();
        }
    }

    public static validarTamanho(lista: any[], esperado: number): void {
        expect(lista.length).toBe(esperado);
    }

    public static validarValor(atual: any, esperado: any): void {
        expect(atual).toBe(esperado);
    }

    public static validarPresenca(valor: any): void {
        expect(valor).toBeDefined();
    }

    public static validarAusencia(valor: any): void {
        expect(valor).toBeUndefined();
    }
}