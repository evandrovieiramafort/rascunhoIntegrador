import { describe, it, expect } from 'vitest';
import { ItemService } from '../../src/services/ItemService';

describe('Integração: ItemService', () => {
    const servico = new ItemService();

    it('deve obter a primeira página de itens com a estrutura de paginação correta', async () => {
        const resultado = await servico.obterItens(1);

        // Verifica a estrutura do PaginacaoDTO
        expect(resultado).toHaveProperty('itens');
        expect(Array.isArray(resultado.itens)).toBeTruthy();
        expect(resultado.paginaAtual).toBe(1);
        expect(resultado.totalPaginas).toBeGreaterThanOrEqual(2);
        
        // Se houver itens no banco, valida se eles têm as propriedades do ItemDTO
        if (resultado.itens.length > 0) {
            const primeiroItem = resultado.itens[0];
            expect(primeiroItem).toHaveProperty('id');
            expect(primeiroItem).toHaveProperty('descricao');
            expect(primeiroItem).toHaveProperty('precoFinal');
        }
    });

    it('deve obter os detalhes de um item específico por ID', async () => {
        const ID_PRODUTO = 5; 
        const item = await servico.obterPorId(ID_PRODUTO);

        // Verifica se retornou o ItemDTO corretamente
        expect(item).toBeDefined();
        expect(item.id).toBe(ID_PRODUTO);
        expect(item).toHaveProperty('descricaoDetalhada');
        expect(item.quantidadeEstoque).toBeGreaterThanOrEqual(0);
    });
});