<?php

use App\Repositories\RepositorioCategoriaEmBDR;
use App\Exceptions\RepositorioException;
use function App\Infra\conectarAoDB;

describe('RepositorioCategoriaEmBDR', function () {
    beforeAll(function () {
        $this->pdo = conectarAoDB('cefetshop_bd_test');
        $this->pdo->exec(file_get_contents(__DIR__ . '/../../src/sql/cefetshop_bd_test.sql'));
        $this->pdo->exec(file_get_contents(__DIR__ . '/../../src/sql/script_populacao_test.sql'));
        $this->repo = new RepositorioCategoriaEmBDR($this->pdo);
    });

    describe('#obterCategorias - Cenários de Sucesso', function () {
        it('deve retornar exatamente 5 categorias', function () {
            $resultado = $this->repo->obterCategorias();
            $total = count($resultado);
            expect($total)->toBe(5);
        });
    });

    describe('#obterCategorias - Cenários de Falha', function () {
        it('deve lançar RepositorioException quando a conexão com o banco for nula', function () {
            $repoSemPdo = new RepositorioCategoriaEmBDR(null);

            $closure = function () use ($repoSemPdo) {
                $repoSemPdo->obterCategorias();
            };

            expect($closure)->toThrow(new RepositorioException('Conexão com o banco de dados não disponível.'));
        });
    });
});