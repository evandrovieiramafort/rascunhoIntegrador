<?php

use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Models\Carrinho;
use App\Models\Item;
use App\Models\ItemCarrinho;
use App\Test\SpecHelper;

describe('RepositorioCarrinhoEmSessao', function () {
    beforeEach(function () {
        SpecHelper::prepararSessao();
        $this->repo = new RepositorioCarrinhoEmSessao();
        $this->item1 = SpecHelper::criarMock(Item::class, [
            'id' => SpecHelper::ID_EXISTENTE, 
            'descricao' => 'Item de Teste'
        ]);
    });

    afterAll(function () {
        SpecHelper::limparDependencias($this->repo);
    });

    describe('#salvarEConsultar', function () {
        describe('#salvarEConsultar', function () {
        it('deve retornar null ao buscar um ID de carrinho que não existe na sessão', function () {
            $recuperado = $this->repo->ObterCarrinhoPorId(SpecHelper::ID_INEXISTENTE);
            SpecHelper::validarAusencia($recuperado);
        });

        it('deve retornar null se os dados na sessão estiverem corrompidos', function () {
            $_SESSION['carrinho']['id_corrompido'] = serialize("Não é um objeto Carrinho");
            
            $resultado = $this->repo->ObterCarrinhoPorId('id_corrompido');
            SpecHelper::validarAusencia($resultado);
        });
    });
    });

    describe('#manipulacaoDeItens', function () {
        it('deve adicionar um item a um novo carrinho e persistir na sessão', function () {
            $carrinhoId = 'carrinho_novo';
            
            $itemC = SpecHelper::criarMock(ItemCarrinho::class, [
                'carrinhoId' => $carrinhoId, 
                'item' => $this->item1, 
                'quantidade' => 1
            ]);
            
            $this->repo->adicionarItemAoCarrinho($itemC);
            
            $itens = $this->repo->ObterItensDoCarrinho($carrinhoId);
            SpecHelper::validarColecao($itens, 1, ItemCarrinho::class);
            SpecHelper::validarAtributos($itens[0]->getItem(), ['id' => SpecHelper::ID_EXISTENTE]);
        });

        it('deve remover um item existente de um carrinho na sessão', function () {
            $carrinhoId = 'sessao_com_item';
            $itemC = SpecHelper::criarMock(ItemCarrinho::class, [
                'carrinhoId' => $carrinhoId, 
                'item' => $this->item1, 
                'quantidade' => 2
            ]);
            
            $this->repo->adicionarItemAoCarrinho($itemC);
            $this->repo->removerItem($carrinhoId, SpecHelper::ID_EXISTENTE);
            
            $itens = $this->repo->ObterItensDoCarrinho($carrinhoId);
            SpecHelper::validarColecao($itens, 0);
        });

        describe('#manipulacaoDeItens', function () {
        it('não deve lançar exceção ao tentar remover um item de um carrinho inexistente', function () {
            $closure = fn() => $this->repo->removerItem('carrinho_fantasma', SpecHelper::ID_INEXISTENTE);
            
            SpecHelper::esperarSucesso($closure);
        });
    });
    });

    describe('#ObterItensDoCarrinho', function () {
        it('deve retornar uma lista vazia ao obter itens de um carrinho inexistente', function () {
            $itens = $this->repo->ObterItensDoCarrinho('vazio');
            SpecHelper::validarColecao($itens, 0);
        });

        it('deve retornar todos os itens persistidos no carrinho corretamente', function () {
            $carrinhoId = 'carrinho_multi_itens';
            $idSecundario = SpecHelper::ID_SECUNDARIO; 
            
            $item2 = SpecHelper::criarMock(Item::class, [
                'id' => $idSecundario, 
                'descricao' => 'Segundo Item'
            ]);

            $itemC1 = SpecHelper::criarMock(ItemCarrinho::class, [
                'carrinhoId' => $carrinhoId, 
                'item' => $this->item1, 
                'quantidade' => 1
            ]);
            
            $itemC2 = SpecHelper::criarMock(ItemCarrinho::class, [
                'carrinhoId' => $carrinhoId, 
                'item' => $item2, 
                'quantidade' => 1
            ]);
            
            $this->repo->adicionarItemAoCarrinho($itemC1);
            $this->repo->adicionarItemAoCarrinho($itemC2);
            
            $itens = $this->repo->ObterItensDoCarrinho($carrinhoId);
            
            SpecHelper::validarColecao($itens, 2, ItemCarrinho::class);
            SpecHelper::validarAtributos($itens[0]->getItem(), ['id' => SpecHelper::ID_EXISTENTE]);
            SpecHelper::validarAtributos($itens[1]->getItem(), ['id' => $idSecundario]);
        });
    });
});