import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CarrinhoService } from '../../src/services/CarrinhoService';

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
        
        // --- 1. Adicionar Item ---
        let carrinho = await servico.adicionarItem(ID_CANECA, 2);
        
        expect(carrinho).toHaveProperty('itens');
        let itemInserido = carrinho.itens.find(ic => ic.item.id === ID_CANECA);
        
        expect(itemInserido).toBeDefined();
        expect(itemInserido?.quantidade).toBe(2);

        // --- 2. Atualizar Quantidade ---
        carrinho = await servico.atualizarQuantidade(ID_CANECA, 5);
        itemInserido = carrinho.itens.find(ic => ic.item.id === ID_CANECA);
        
        expect(itemInserido?.quantidade).toBe(5);

        // --- 3. Obter Carrinho ---
        carrinho = await servico.obterCarrinho();
        expect(carrinho.itens.length).toBeGreaterThan(0);
        expect(carrinho).toHaveProperty('totalGeral');

        // --- 4. Remover Item ---
        carrinho = await servico.removerItem(ID_CANECA);
        itemInserido = carrinho.itens.find(ic => ic.item.id === ID_CANECA);
        
        expect(itemInserido).toBeUndefined();
    });

    it('deve lançar um erro ao tentar adicionar um item que não existe no banco', async () => {
        const servico = new CarrinhoService();
        const ID_FANTASMA = 999999;
        
        await expect(servico.adicionarItem(ID_FANTASMA, 1))
            .rejects
            .toThrow();
    });

    it('deve lançar um erro ao tentar atualizar quantidade para um valor inválido (negativo)', async () => {
        const servico = new CarrinhoService();
        const ID_CANECA = 5;
        
        await servico.adicionarItem(ID_CANECA, 1);

        await expect(servico.atualizarQuantidade(ID_CANECA, -5))
            .rejects
            .toThrow();
    });
});