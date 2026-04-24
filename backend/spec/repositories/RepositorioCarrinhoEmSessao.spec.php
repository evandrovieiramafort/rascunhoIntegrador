<?php

use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Models\Carrinho;
use App\Test\SpecHelper;

describe('RepositorioCarrinhoEmSessao', function () {
    beforeEach(function () {
        SpecHelper::prepararSessao();
        $this->repo = new RepositorioCarrinhoEmSessao();
        $this->item1 = SpecHelper::criarItemFake(1, 'Item de Teste');
    });

    afterAll(function () {
        $this->repo = null;
    });

    describe('#salvarEConsultar', function () {
        it('deve salvar e recuperar um carrinho da sessão com sucesso', function () {
            $idSessao = 'sessao_valida_123';
            $carrinho = new Carrinho($idSessao);
            
            $this->repo->salvarCarrinho($carrinho);
            $recuperado = $this->repo->ObterCarrinhoPorId($idSessao);
            
            expect($recuperado)->toBeAnInstanceOf(Carrinho::class);
            expect($recuperado->getId())->toBe($idSessao);
        });

        it('deve retornar null ao buscar um ID de carrinho que não existe na sessão', function () {
            $recuperado = $this->repo->ObterCarrinhoPorId('id_inexistente');
            expect($recuperado)->toBeNull();
        });

        it('deve retornar null se os dados na sessão estiverem corrompidos (Falha de Desserialização)', function () {
            $_SESSION['carrinho']['id_corrompido'] = serialize("Não é um objeto Carrinho");
            
            $resultado = $this->repo->ObterCarrinhoPorId('id_corrompido');
            expect($resultado)->toBeNull();
        });
    });

    describe('#manipulacaoDeItens', function () {
        it('deve adicionar um item a um novo carrinho e persistir na sessão', function () {
            $carrinhoId = 'carrinho_novo';
            
            $itemC = SpecHelper::criarItemCarrinhoFake($carrinhoId, $this->item1, 1);
            
            $this->repo->adicionarItemAoCarrinho($itemC);
            
            $itens = $this->repo->ObterItensDoCarrinho($carrinhoId);
            expect($itens)->toHaveLength(1);
            expect($itens[0]->getItem()->getId())->toBe(1);
        });

        it('deve remover um item existente de um carrinho na sessão', function () {
            $carrinhoId = 'sessao_com_item';
            $itemC = SpecHelper::criarItemCarrinhoFake($carrinhoId, $this->item1, 2);
            
            $this->repo->adicionarItemAoCarrinho($itemC);
            $this->repo->removerItem($carrinhoId, $this->item1->getId());
            
            $itens = $this->repo->ObterItensDoCarrinho($carrinhoId);
            expect($itens)->toBeEmpty();
        });

        it('não deve lançar exceção ao tentar remover um item de um carrinho inexistente', function () {
            $closure = function() {
                $this->repo->removerItem('carrinho_fantasma', 999);
            };
            
            expect($closure)->not->toThrow();
        });
    });

    describe('#ObterItensDoCarrinho', function () {
        it('deve retornar uma lista vazia ao obter itens de um carrinho inexistente', function () {
            $itens = $this->repo->ObterItensDoCarrinho('vazio');
            expect($itens)->toBe([]);
        });

        it('deve retornar todos os itens persistidos no carrinho corretamente', function () {
            $carrinhoId = 'carrinho_multi_itens';
            $item2 = SpecHelper::criarItemFake(2, 'Segundo Item');

            $itemC1 = SpecHelper::criarItemCarrinhoFake($carrinhoId, $this->item1, 1);
            $itemC2 = SpecHelper::criarItemCarrinhoFake($carrinhoId, $item2, 1);
            
            $this->repo->adicionarItemAoCarrinho($itemC1);
            $this->repo->adicionarItemAoCarrinho($itemC2);
            
            $itens = $this->repo->ObterItensDoCarrinho($carrinhoId);
            
            expect(count($itens))->toBe(2);
            expect($itens[0]->getItem()->getId())->toBe(1);
            expect($itens[1]->getItem()->getId())->toBe(2);
        });
    });
});