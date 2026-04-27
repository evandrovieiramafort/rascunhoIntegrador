import { describe, it, expect, beforeAll } from 'vitest';
import { CarrinhoService } from '../../src/services/CarrinhoService';
import { expectValidoCarrinhoDTO, localizarNoCarrinho } from './helpers/carrinho-helper';

describe('Integração: CarrinhoService', () => {
    
    const fetchOriginal = globalThis.fetch;
    let cookieSessao = '';

    beforeAll(() => {
        globalThis.fetch = async (url, options: any = {}) => {
            if (cookieSessao) {
                options.headers = { ...options.headers, 'Cookie': cookieSessao };
            }
            const response = await fetchOriginal(url, options);
            const setCookie = response.headers.get('set-cookie');
            if (setCookie) {
                cookieSessao = setCookie.split(';')[0]; 
            }
            return response;
        };
    });

    it('deve executar o fluxo completo do carrinho (adicionar, alterar, obter e remover)', async () => {
        const servico = new CarrinhoService();
        const ID_CANECA = 5;
        
        let carrinho = await servico.adicionarItem(ID_CANECA, 2);
        expectValidoCarrinhoDTO(carrinho);
        
        let itemInserido = localizarNoCarrinho(carrinho, ID_CANECA);
        expect(itemInserido).toBeDefined();
        expect(itemInserido?.quantidade).toBe(2);

        carrinho = await servico.atualizarQuantidade(ID_CANECA, 5);
        itemInserido = localizarNoCarrinho(carrinho, ID_CANECA);
        expect(itemInserido?.quantidade).toBe(5);

        carrinho = await servico.obterCarrinho();
        expectValidoCarrinhoDTO(carrinho);
        expect(carrinho.itens.length).toBeGreaterThan(0);

        carrinho = await servico.removerItem(ID_CANECA);
        itemInserido = localizarNoCarrinho(carrinho, ID_CANECA);
        expect(itemInserido).toBeUndefined();
    });

    it('deve lançar um erro ao tentar adicionar um item que não existe no banco', async () => {
        const servico = new CarrinhoService();
        await expect(servico.adicionarItem(999999, 1)).rejects.toThrow();
    });

    it('deve lançar um erro ao tentar atualizar quantidade para um valor inválido (negativo)', async () => {
        const servico = new CarrinhoService();
        const ID_CANECA = 5;
        await servico.adicionarItem(ID_CANECA, 1);
        await expect(servico.atualizarQuantidade(ID_CANECA, -5)).rejects.toThrow();
    });
});