<?php

use App\Presenters\ItemPresenter;
use App\Repositories\RepositorioItemEmBDR;
use App\Dto\PaginacaoDTO;
use App\Dto\ItemDTO;
use App\Exceptions\NaoEncontradoException;
use App\Test\SpecHelper;

describe('ItemPresenter', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::prepararBancoDeDados();
        $this->repo = new RepositorioItemEmBDR($this->pdo);
        $this->servico = new ItemPresenter($this->repo);
    });

    afterAll(fn() => SpecHelper::limparDependencias($this->pdo, $this->repo, $this->servico));

    describe('#ObterTodosOsItens', function () {
        it('deve retornar um PaginacaoDTO com a quantidade correta de itens da primeira página', function () {
            $resultado = $this->servico->ObterTodosOsItens(1);
            
            expect($resultado)->toBeAnInstanceOf(PaginacaoDTO::class);
            SpecHelper::validarColecao($resultado->itens, SpecHelper::LIMITE_ITENS_PAGINA, ItemDTO::class);
        });

        it('deve falhar se a página não possuir itens', function () {
            $chamada = fn() => $this->servico->ObterTodosOsItens(99);
            SpecHelper::esperarExcecao($chamada, NaoEncontradoException::class);
        });
    });

    describe('#ObterPorId', function () {
        it('deve retornar um ItemDTO ao buscar um ID existente', function () {
            $id = SpecHelper::ID_EXISTENTE;
            $resultado = $this->servico->ObterPorId($id);
            
            expect($resultado)->toBeAnInstanceOf(ItemDTO::class);
            SpecHelper::validarAtributos($resultado, [
                'descricao' => 'Camiseta BSI'
            ]);
        });

        it('deve falhar ao buscar um ID que não existe no banco', function () {
            $id = SpecHelper::ID_INEXISTENTE;
            $chamada = fn() => $this->servico->ObterPorId($id);
            
            SpecHelper::esperarExcecao($chamada, NaoEncontradoException::class, "Item", $id);
        });
    });
});