import { describe, it } from 'vitest';
import { ItemService } from '../../src/services/ItemService';
import { SpecHelperIntegracao } from './SpecHelperIntegracao';

describe('Integração: ItemService', () => {
    const servico = new ItemService();

    it('deve obter a primeira página de itens com a estrutura de paginação correta', async () => {
        const resultado = await servico.obterItens(1);

        SpecHelperIntegracao.validarPaginacao(resultado);
        SpecHelperIntegracao.validarValor(resultado.paginaAtual, 1);
        
        if (resultado.itens.length > 0) {
            SpecHelperIntegracao.validarItemDTO(resultado.itens[0]);
        }
    });

    it('deve obter os detalhes de um item específico por ID', async () => {
        const id = SpecHelperIntegracao.ID_EXISTENTE;
        const item = await servico.obterPorId(id);

        SpecHelperIntegracao.validarPresenca(item);
        SpecHelperIntegracao.validarValor(item.id, id);
        
        SpecHelperIntegracao.validarItemDTO(item);
    });

    it('deve lançar um erro ao tentar buscar os detalhes de um item inexistente', async () => {
        await SpecHelperIntegracao.esperarErro(servico.obterPorId(SpecHelperIntegracao.ID_INEXISTENTE));
    });

    it('deve retornar um erro ao acessar uma página de paginação além do limite', async () => {
        await SpecHelperIntegracao.esperarErro(
            servico.obterItens(SpecHelperIntegracao.PAGINA_INVALIDA), 
            'A busca não retornou resultados.'
        );
    });
});