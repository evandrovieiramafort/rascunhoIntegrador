<?php

use App\Services\CarrinhoService;
use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Repositories\RepositorioItemEmBDR;
use App\Test\SpecHelper;

describe('CarrinhoService', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::resetarBancoDeDados();
        $this->repoCarrinho = new RepositorioCarrinhoEmSessao();
        $this->repoItem = new RepositorioItemEmBDR($this->pdo);
        $this->servico = new CarrinhoService($this->repoCarrinho, $this->repoItem);
    });

    beforeEach(function () {
        $_SESSION['carrinho'] = [];
    });

    describe('Regras de Quantidade e Estoque', function () {
        it('deve impedir a adição de mais de 10 unidades (Limite Fixo)', function () {
            $closure = function () {
                $this->servico->adicionarItem("sessao_teste", 1, 11);
            };

            expect($closure)->toThrow('Quantidade insuficiente em estoque para o item: Camiseta BSI.');
        });

        it('deve permitir adicionar apenas até o limite do estoque se ele for menor que 10', function () {
            $closure = function () {
                $this->servico->adicionarItem("sessao_teste", 9, 10); 
            };
            
            expect($closure)->toThrow('Quantidade insuficiente em estoque para o item: Moletom Out.');
        });
    });

    describe('Operações de Sucesso', function () {
        it('deve calcular o total do carrinho corretamente após adições válidas', function () {
            $res = $this->servico->adicionarItem("sessao_ok", 1, 2);
            
            expect($res->totalGeral)->toBe(90.0);
        });
    });
});