<?php

use App\Repositories\RepositorioCategoriaEmBDR;
use App\Models\CategoriaProduto;
use App\Exceptions\RepositorioException;
use App\Test\SpecHelper;


describe('RepositorioCategoriaEmBDR', function () {
    beforeAll(function () {
        $this->pdo = SpecHelper::prepararBancoDeDados();
        $this->repo = new RepositorioCategoriaEmBDR($this->pdo);
    });

    afterAll(function () {
        $this->repo = null;
        $this->pdo = null; 
    });

    describe('#obterCategorias - Cenários de Sucesso', function () {
        it('deve retornar exatamente 5 categorias de acordo com o script de população', function () {
            $resultado = $this->repo->obterCategorias();
            expect(count($resultado))->toBe(5);
        });

        it('deve retornar uma lista contendo apenas instâncias de CategoriaProduto', function () {
            $resultado = $this->repo->obterCategorias();
            foreach ($resultado as $categoria) {
                expect($categoria)->toBeAnInstanceOf(CategoriaProduto::class);
            }
        });

        it('deve mapear corretamente as propriedades do banco para o modelo', function () {
            $categorias = $this->repo->obterCategorias();
            $primeiraCategoria = $categorias[0];

            expect($primeiraCategoria->getId())->toBeGreaterThan(0);
            expect($primeiraCategoria->getTipoProduto())->not->toBeEmpty();
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

        it('deve lançar RepositorioException em caso de erro de sintaxe SQL ou falha no PDO', function () {
            $this->pdo = null; 
            $repoErro = new RepositorioCategoriaEmBDR($this->pdo);

            $closure = function () use ($repoErro) {
                $repoErro->obterCategorias();
            };

            expect($closure)->toThrow(new RepositorioException('Conexão com o banco de dados não disponível.'));
        });
    });
});