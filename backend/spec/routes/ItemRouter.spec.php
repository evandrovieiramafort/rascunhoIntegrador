<?php

use App\Test\SpecHelper;

describe('ItemRouter', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::resetarBancoDeDados();
    });

    describe('GET /itens/:pagina', function () {
        it('deve retornar status 200', function () {
            $fakeRes = SpecHelper::testarRota('/itens/1', 'GET', 'ItemRouter.php', $this->pdo);
            expect($fakeRes->isStatus(200))->toBe(true);
        });
    });
});