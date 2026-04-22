<?php

use App\Repositories\RepositorioItemEmBDR;
use App\Models\Item;
use function App\Infra\conectarAoDB;

describe('RepositorioItemEmBDR', function () {
    beforeAll(function () {
        $this->pdo = conectarAoDB('cefetshop_bd_test');
        $this->pdo->exec(file_get_contents(__DIR__ . '/../../src/sql/cefetshop_bd_test.sql'));
        $this->pdo->exec(file_get_contents(__DIR__ . '/../../src/sql/script_populacao_test.sql'));
        $this->repo = new RepositorioItemEmBDR($this->pdo);
    });

    describe('#contarTotalItems', function () {
        it('deve retornar o total de 12 itens cadastrados', function () {
            $total = $this->repo->contarTotalItens();
            expect($total)->toBe(12);
        });
    });

    describe('#ObterPorId', function () {
        it('deve retornar o item "Camiseta BSI" ao buscar pelo ID 1', function () {
            $item = $this->repo->ObterPorId(1);
            expect($item)->toBeAnInstanceOf(Item::class);
            expect($item->getDescricao())->toBe('Camiseta BSI');
        });
    });
});