<?php

use App\Test\SpecHelper;

describe('CarrinhoRouter', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::resetarBancoDeDados();
    });

    describe('GET /carrinho', function () {
        it('deve retornar status 200 ao obter o carrinho vazio ou existente', function () {
            $fakeRes = SpecHelper::testarRota('/carrinho', 'GET', 'CarrinhoRouter.php', $this->pdo);
            expect($fakeRes->isStatus(200))->toBe(true);
        });
    });

    describe('POST /carrinho/item', function () {
        it('deve retornar status 200 ao adicionar um item válido', function () {
            $corpo = ['item_id' => 1, 'quantidade' => 2];
            $fakeRes = SpecHelper::testarRota('/carrinho/item', 'POST', 'CarrinhoRouter.php', $this->pdo, $corpo);
            expect($fakeRes->isStatus(200))->toBe(true);
        });
    });

    describe('PUT /carrinho/item/:id', function () {
        it('deve retornar status 200 ao atualizar a quantidade de um item', function () {
            $corpo = ['quantidade' => 5];
            $fakeRes = SpecHelper::testarRota('/carrinho/item/1', 'PUT', 'CarrinhoRouter.php', $this->pdo, $corpo);
            expect($fakeRes->isStatus(200))->toBe(true);
        });
    });

    describe('DELETE /carrinho/item/:id', function () {
        it('deve retornar status 200 ao remover um item do carrinho', function () {
            $fakeRes = SpecHelper::testarRota('/carrinho/item/1', 'DELETE', 'CarrinhoRouter.php', $this->pdo);
            expect($fakeRes->isStatus(200))->toBe(true);
        });
    });
});