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
        $this->repo = null;
        $this->pdo = null; 
    });

    describe('#contarTotalItens', function () {
        it('deve retornar o total de 12 itens cadastrados no script de população', function () {
            $total = $this->repo->contarTotalItens();
            expect($total)->toBe(12);
        });
    });

    describe('#obterTodosOsItens', function () {
        it('deve retornar exatamente 6 itens na primeira página (limite hardcoded)', function () {
            $itens = $this->repo->obterTodosOsItens(1);
            expect(count($itens))->toBe(6);
            expect($itens[0])->toBeAnInstanceOf(Item::class);
        });

        it('deve retornar os itens restantes na segunda página', function () {
            $itens = $this->repo->obterTodosOsItens(2);
            expect(count($itens))->toBe(6);
        });

        it('deve retornar um array vazio ao buscar uma página sem resultados', function () {
            $itens = $this->repo->obterTodosOsItens(99);
            expect($itens)->toBe([]);
        });
    });

    describe('#ObterPorId', function () {
        it('deve retornar o item "Camiseta BSI" ao buscar pelo ID 1', function () {
            $item = $this->repo->ObterPorId(1);
            expect($item)->toBeAnInstanceOf(Item::class);
            expect($item->getDescricao())->toBe('Camiseta BSI');
        });

        it('deve retornar null ao buscar por um ID inexistente (Caso de Falha)', function () {
            $item = $this->repo->ObterPorId(9999);
            expect($item)->toBeNull();
        });

        it('deve retornar null ao buscar por um ID negativo ou inválido', function () {
            $item = $this->repo->ObterPorId(-1);
            expect($item)->toBeNull();
        });
    });
});