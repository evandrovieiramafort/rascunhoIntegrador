<?php

use App\Services\CarrinhoService;
use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Repositories\RepositorioItemEmBDR;
use App\Exceptions\NaoEncontradoException;
use App\Exceptions\DominioException;
use App\Exceptions\EstoqueInsuficienteException;
use App\Test\SpecHelper;

describe('CarrinhoService', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::prepararBancoDeDados();
        $this->repoCarrinho = new RepositorioCarrinhoEmSessao();
        $this->repoItem = new RepositorioItemEmBDR($this->pdo);
        $this->servico = new CarrinhoService($this->repoCarrinho, $this->repoItem);

        $this->ID_CAMISETA_BSI = 1;
        $this->ID_MOLETOM_OUT = 9;
        $this->ID_PRODUTO_SECUNDARIO = 2;
        $this->ID_INEXISTENTE = 9999;
    });

    beforeEach(function () {
        SpecHelper::prepararSessao();
    });

    describe('#obterCarrinho', function () {
        it('deve retornar um DTO de carrinho vazio quando a sessão não possuir dados', function () {
            $res = $this->servico->obterCarrinho("sessao_nova");
            expect($res->itens)->toBeEmpty();
            expect($res->totalGeral)->toBe(0.0);
        });
    });

    describe('Validações de Regras de Negócio', function () {
        it('deve impedir a adição de mais de 10 unidades (limite global do serviço)', function () {
            $closure = fn() => $this->servico->adicionarItem("sessao", $this->ID_CAMISETA_BSI, 11);
            expect($closure)->toThrow(new EstoqueInsuficienteException('Camiseta BSI'));
        });

        it('deve lançar exceção para quantidades nulas ou negativas na adição', function () {
            $closure = fn() => $this->servico->adicionarItem("sessao", $this->ID_CAMISETA_BSI, 0);
            expect($closure)->toThrow(new DominioException("A quantidade deve ser maior do que zero"));
        });

        it('deve validar o estoque real quando for menor que o limite de 10 unidades', function () {
            $closure = fn() => $this->servico->adicionarItem("sessao", $this->ID_MOLETOM_OUT, 10);
            expect($closure)->toThrow(new EstoqueInsuficienteException('Moletom Out'));
        });
    });

    describe('Gestão de Entidades', function () {
        it('deve falhar ao tentar manipular um item que não existe no catálogo', function () {
            $id = $this->ID_INEXISTENTE;
            $closure = fn() => $this->servico->adicionarItem("sessao", $id, 1);
            expect($closure)->toThrow(NaoEncontradoException::paraEntidade("Item", $id));
        });

        it('deve falhar ao tentar atualizar um carrinho que ainda não foi persistido', function () {
            $sessao = "carrinho_fantasma";
            $closure = fn() => $this->servico->atualizarQuantidade($sessao, $this->ID_CAMISETA_BSI, 5);
            expect($closure)->toThrow(NaoEncontradoException::paraEntidade("Carrinho", $sessao));
        });
    });

    describe('Fluxos de Persistência e Cálculo', function () {
        it('deve acumular a quantidade e calcular o total corretamente para itens repetidos', function () {
            $this->servico->adicionarItem("sessao_acumulo", $this->ID_CAMISETA_BSI, 2);
            $res = $this->servico->adicionarItem("sessao_acumulo", $this->ID_CAMISETA_BSI, 1);
            
            expect(count($res->itens))->toBe(1);
            expect($res->itens[0]->quantidade)->toBe(3);
            expect($res->totalGeral)->toBe(135.0); 
        });

        it('deve remover o registro do item quando a atualização define quantidade zero', function () {
            $this->servico->adicionarItem("sessao_limpeza", $this->ID_CAMISETA_BSI, 1);
            $res = $this->servico->atualizarQuantidade("sessao_limpeza", $this->ID_CAMISETA_BSI, 0);
            
            expect($res->itens)->toBeEmpty();
        });
    });

    describe('#removerItem', function () {
        it('deve remover um item específico mantendo os demais no carrinho', function () {
            $this->servico->adicionarItem("sessao_remocao", $this->ID_CAMISETA_BSI, 1);
            $this->servico->adicionarItem("sessao_remocao", $this->ID_PRODUTO_SECUNDARIO, 1);
            
            $res = $this->servico->removerItem("sessao_remocao", $this->ID_CAMISETA_BSI);
            
            expect(count($res->itens))->toBe(1);
            expect($res->itens[0]->item->id)->toBe($this->ID_PRODUTO_SECUNDARIO);
        });
    });
});