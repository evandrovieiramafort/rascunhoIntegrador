import { describe, it, beforeAll } from 'vitest';
import { CarrinhoService } from '../../src/services/CarrinhoService';
import { SpecHelperIntegracao } from './SpecHelperIntegracao';

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
        const id = SpecHelperIntegracao.ID_EXISTENTE;
        
        let carrinho = await servico.adicionarItem(id, 2);
        SpecHelperIntegracao.validarCarrinhoDTO(carrinho);
        
        let itemInserido = SpecHelperIntegracao.localizarNoCarrinho(carrinho, id);
        SpecHelperIntegracao.validarPresenca(itemInserido);
        SpecHelperIntegracao.validarValor(itemInserido?.quantidade, 2);

        carrinho = await servico.atualizarQuantidade(id, 5);
        itemInserido = SpecHelperIntegracao.localizarNoCarrinho(carrinho, id);
        SpecHelperIntegracao.validarValor(itemInserido?.quantidade, 5);

        carrinho = await servico.obterCarrinho();
        SpecHelperIntegracao.validarCarrinhoDTO(carrinho);

        carrinho = await servico.removerItem(id);
        itemInserido = SpecHelperIntegracao.localizarNoCarrinho(carrinho, id);
        SpecHelperIntegracao.validarAusencia(itemInserido);
    });

    it('deve lançar um erro ao tentar adicionar um item que não existe no banco', async () => {
        const servico = new CarrinhoService();
        await SpecHelperIntegracao.esperarErro(servico.adicionarItem(SpecHelperIntegracao.ID_INEXISTENTE, 1));
    });

    it('deve lançar um erro ao tentar atualizar quantidade para um valor inválido (negativo)', async () => {
        const servico = new CarrinhoService();
        const id = SpecHelperIntegracao.ID_EXISTENTE;
        await servico.adicionarItem(id, 1);
        await SpecHelperIntegracao.esperarErro(servico.atualizarQuantidade(id, -5));
    });

    it('deve lançar erro ao tentar adicionar mais de 10 unidades', async () => {
        const servico = new CarrinhoService();
        const id = SpecHelperIntegracao.ID_EXISTENTE;
        const QUANTIDADE_INVALIDA = 11;
        
        await SpecHelperIntegracao.esperarErro(servico.adicionarItem(id, QUANTIDADE_INVALIDA));
    });

    it('deve garantir que o carrinho está vazio e o total é zero após a remoção do último item', async () => {
        const servico = new CarrinhoService();
        const id = SpecHelperIntegracao.ID_EXISTENTE;

        await servico.adicionarItem(id, 1);
        await servico.removerItem(id);
        
        const carrinho = await servico.obterCarrinho();
        
        SpecHelperIntegracao.validarTamanho(carrinho.itens, 0);
        SpecHelperIntegracao.validarValor(carrinho.totalGeral, 0);
    });

    it('deve retornar a quantidade exata de um item via obterQuantidadeItem', async () => {
        const servico = new CarrinhoService();
        const id = SpecHelperIntegracao.ID_EXISTENTE;
        const QTD_ADICIONADA = 3;
        
        await servico.adicionarItem(id, QTD_ADICIONADA);
        const qtdRetornada = await servico.obterQuantidadeItem(id);
        
        SpecHelperIntegracao.validarValor(qtdRetornada, QTD_ADICIONADA);
    });

    it('deve retornar 0 para itens que não estão no carrinho via obterQuantidadeItem', async () => {
        const servico = new CarrinhoService();
        const ID_INEXISTENTE_NO_CARRINHO = 99; 
        
        const qtd = await servico.obterQuantidadeItem(ID_INEXISTENTE_NO_CARRINHO);
        
        SpecHelperIntegracao.validarValor(qtd, 0);
    });
});