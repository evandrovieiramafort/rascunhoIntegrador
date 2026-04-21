<?php

use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Models\Carrinho;

describe('RepositorioCarrinhoEmSessao', function () {
    beforeEach(function () {
        if (!isset($_SESSION)) {
            $_SESSION = [];
        }
        $_SESSION['carrinho'] = [];
        $this->repo = new RepositorioCarrinhoEmSessao();
    });

    it('deve salvar e recuperar um carrinho da sessão', function () {
        $idSessao = 'teste_123';
        $carrinho = new Carrinho($idSessao);
        
        $this->repo->salvarCarrinho($carrinho);
        
        $recuperado = $this->repo->ObterCarrinhoPorId($idSessao);
        expect($recuperado)->toBeAnInstanceOf(Carrinho::class);
        expect($recuperado->getId())->toBe($idSessao);
    });

    it('deve retornar uma lista vazia ao obter itens de um carrinho inexistente', function () {
        /** @var mixed $itens */
        $itens = $this->repo->ObterItensDoCarrinho('vazio');
        expect($itens)->toBe([]);
    });
});