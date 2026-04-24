<?php

use App\Services\ItemService;
use App\Repositories\RepositorioItemEmBDR;
use App\Dto\PaginacaoDTO;
use App\Test\SpecHelper;

describe('ItemService', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::prepararBancoDeDados();
        $this->repo = new RepositorioItemEmBDR($this->pdo);
        $this->servico = new ItemService($this->repo);
    });

    afterAll(function () {
        $this->pdo = null;
    });

    describe('#ObterTodosOsItens', function () {
        it('deve retornar um PaginacaoDTO com todos os 6 itens da primeira página', function () {
            $resultado = $this->servico->ObterTodosOsItens(1);
            expect($resultado)->toBeAnInstanceOf(PaginacaoDTO::class);
            expect(count($resultado->itens))->toBe(6);
        });

        it('deve falhar se a página não possuir itens', function () {
            $closure = function () { $this->servico->ObterTodosOsItens(99); };
            expect($closure)->toThrow('A busca não retornou resultados.');
        });
    });

    describe('#ObterPorId', function () {
        it('deve retornar um ItemDTO ao buscar o ID 1', function () {
            $resultado = $this->servico->ObterPorId(1);
            expect($resultado->descricao)->toBe('Camiseta BSI');
        });

        it('deve falhar ao buscar um ID que não existe no banco', function () {
            $closure = function () { $this->servico->ObterPorId(9999); };
            expect($closure)->toThrow('Item com ID 9999 não encontrado.');
        });
    });
});