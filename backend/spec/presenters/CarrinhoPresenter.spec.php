<?php

use App\Presenters\CarrinhoPresenter;
use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Repositories\RepositorioItemEmBDR;
use App\Exceptions\NaoEncontradoException;
use App\Exceptions\DominioException;
use App\Test\SpecHelper;

describe('CarrinhoPresenter', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::prepararBancoDeDados();
        $this->repoCarrinho = new RepositorioCarrinhoEmSessao();
        $this->repoItem = new RepositorioItemEmBDR($this->pdo);
        $this->servico = new CarrinhoPresenter($this->repoCarrinho, $this->repoItem);
    });

    beforeEach(function () {
        SpecHelper::prepararSessao();
    });

    afterAll(function () {
        SpecHelper::limparDependencias($this->pdo, $this->repoCarrinho, $this->repoItem, $this->servico);
    });

    describe('#obterCarrinho', function () {
        it('deve retornar um DTO de carrinho vazio quando a sessão não possuir dados', function () {
            $res = $this->servico->obterCarrinho("sessao_nova");
            
            SpecHelper::validarColecao($res->itens, 0);
            SpecHelper::validarAtributos($res, ['totalGeral' => 0.0]);
        });
    });

    describe('Validações de Regras de Negócio', function () {
        it('deve impedir a adição de mais de 10 unidades (limite global do sistema)', function () {
            $closure = fn() => $this->servico->adicionarItem("sessao", SpecHelper::ID_EXISTENTE, 11);
            SpecHelper::esperarExcecao($closure, DominioException::class, "Quantidade inválida para o item Camiseta BSI");
        });

        it('deve lançar exceção para quantidades nulas ou negativas na adição', function () {
            $closure = fn() => $this->servico->adicionarItem("sessao", SpecHelper::ID_EXISTENTE, 0);
            SpecHelper::esperarExcecao($closure, DominioException::class, "Quantidade inválida para o item Camiseta BSI");
        });

        it('deve validar o estoque real quando for menor que o limite de 10 unidades', function () {
            $closure = fn() => $this->servico->adicionarItem("sessao", SpecHelper::ID_MOLETOM_POUCO_ESTOQUE, 10);
            SpecHelper::esperarExcecao($closure, DominioException::class, "Quantidade inválida para o item Moletom Out");
        });
    });

    describe('Gestão de Entidades', function () {
        it('deve falhar ao tentar manipular um item que não existe no catálogo', function () {
            $id = SpecHelper::ID_INEXISTENTE;
            $closure = fn() => $this->servico->adicionarItem("sessao", $id, 1);
            SpecHelper::esperarExcecao($closure, NaoEncontradoException::class, "Item", $id);
        });

        it('deve falhar ao tentar atualizar um carrinho que ainda não foi persistido', function () {
            $sessao = "carrinho_fantasma";
            $closure = fn() => $this->servico->atualizarQuantidade($sessao, SpecHelper::ID_EXISTENTE, 5);
            SpecHelper::esperarExcecao($closure, NaoEncontradoException::class, "Carrinho", $sessao);
        });
    });

    describe('Fluxos de Persistência e Cálculo', function () {
        it('deve acumular a quantidade e calcular o total corretamente para itens repetidos', function () {
            $id = SpecHelper::ID_EXISTENTE;
            $this->servico->adicionarItem("sessao_acumulo", $id, 2);
            $res = $this->servico->adicionarItem("sessao_acumulo", $id, 1);
            
            SpecHelper::validarColecao($res->itens, 1);
            SpecHelper::validarAtributos($res->itens[0], ['quantidade' => 3]);
            SpecHelper::validarAtributos($res, ['totalGeral' => 135.0]);
        });

        it('deve remover o registro do item quando a atualização define quantidade zero', function () {
            $id = SpecHelper::ID_EXISTENTE;
            $this->servico->adicionarItem("sessao_limpeza", $id, 1);
            $res = $this->servico->atualizarQuantidade("sessao_limpeza", $id, 0);
            
            SpecHelper::validarColecao($res->itens, 0);
        });
    });

    describe('#removerItem', function () {
        it('deve remover um item específico mantendo os demais no carrinho', function () {
            $id1 = SpecHelper::ID_EXISTENTE;
            $id2 = SpecHelper::ID_SECUNDARIO;

            $this->servico->adicionarItem("sessao_remocao", $id1, 1);
            $this->servico->adicionarItem("sessao_remocao", $id2, 1);
            
            $res = $this->servico->removerItem("sessao_remocao", $id1);
            
            SpecHelper::validarColecao($res->itens, 1);
            SpecHelper::validarAtributos($res->itens[0]->item, ['id' => $id2]);
        });
    });
});