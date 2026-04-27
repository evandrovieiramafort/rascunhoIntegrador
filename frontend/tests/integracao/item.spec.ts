import { describe, it, expect } from 'vitest';
import { ItemService } from '../../src/services/ItemService';
import { expectValidoItemDTO, expectValidaPaginacao } from './helpers/validador-dto';

describe('Integração: ItemService', () => {
    const servico = new ItemService();

    it('deve obter a primeira página de itens com a estrutura de paginação correta', async () => {
        const resultado = await servico.obterItens(1);

        expectValidaPaginacao(resultado);
        expect(resultado.paginaAtual).toBe(1);
        expect(resultado.totalPaginas).toBeGreaterThanOrEqual(2);
        
        if (resultado.itens.length > 0) {
            expectValidoItemDTO(resultado.itens[0]);
        }
    });

    it('deve obter os detalhes de um item específico por ID', async () => {
        const ID_PRODUTO = 5; 
        const item = await servico.obterPorId(ID_PRODUTO);

        expect(item).toBeDefined();
        expect(item.id).toBe(ID_PRODUTO);
        
        expectValidoItemDTO(item);
        
        expect(item).toHaveProperty('descricaoDetalhada');
    });

    it('deve lançar um erro ao tentar buscar os detalhes de um item inexistente', async () => {
        const ID_FANTASMA = 999999;
        await expect(servico.obterPorId(ID_FANTASMA)).rejects.toThrow();
    });

    it('deve retornar um erro ao acessar uma página de paginação além do limite', async () => {
        const PAGINA_INEXISTENTE = 99999;
        await expect(servico.obterItens(PAGINA_INEXISTENTE))
            .rejects
            .toThrow('A busca não retornou resultados.');
    });
});