<?php

use App\Repositories\RepositorioItemEmBDR;
use App\Models\Item;
use App\Test\SpecHelper;

describe('RepositorioItemEmBDR', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::prepararBancoDeDados();
        $this->repo = new RepositorioItemEmBDR($this->pdo);
    });

    afterAll(function () {
        SpecHelper::limparDependencias($this->repo, $this->pdo);
    });

    describe('#contarTotalItens', function () {
        it('deve retornar o total de 12 itens cadastrados', function () {
            $total = $this->repo->contarTotalItens();
            expect($total)->toBe(12);
        });
    });

    describe('#obterTodosOsItens', function () {
        it('deve retornar exatamente 6 itens na primeira página', function () {
            $itens = $this->repo->obterTodosOsItens(1);
            SpecHelper::validarColecao($itens, SpecHelper::LIMITE_PAGINACAO, Item::class);
        });

        it('deve retornar os itens restantes na segunda página', function () {
            $itens = $this->repo->obterTodosOsItens(2);
            SpecHelper::validarColecao($itens, SpecHelper::LIMITE_PAGINACAO);
        });

        it('deve retornar um array vazio ao buscar uma página sem resultados', function () {
            $itens = $this->repo->obterTodosOsItens(99);
            SpecHelper::validarColecao($itens, 0);
        });
    });

    describe('#ObterPorId', function () {
        it('deve retornar o item "Camiseta BSI" ao buscar pelo ID 1', function () {
            $item = $this->repo->ObterPorId(SpecHelper::ID_EXISTENTE);
            expect($item)->toBeAnInstanceOf(Item::class);
            SpecHelper::validarAtributos($item, ['descricao' => 'Camiseta BSI']);
        });

        it('deve retornar null ao buscar por um ID inexistente', function () {
            $item = $this->repo->ObterPorId(SpecHelper::ID_INEXISTENTE);
            SpecHelper::validarAusencia($item);
        });

        it('deve retornar null ao buscar por um ID negativo ou inválido', function () {
            $item = $this->repo->ObterPorId(-1);
            SpecHelper::validarAusencia($item);
        });
    });
});
