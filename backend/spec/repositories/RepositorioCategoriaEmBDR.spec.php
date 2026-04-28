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
        SpecHelper::limparDependencias($this->repo, $this->pdo);
    });

    describe('#obterCategorias - Cenários de Sucesso', function () {
        it('deve retornar exatamente 5 categorias de acordo com o script de população', function () {
            $resultado = $this->repo->obterCategorias();
            SpecHelper::validarColecao($resultado, 5);
        });

        it('deve retornar uma lista contendo apenas instâncias de CategoriaProduto', function () {
            $resultado = $this->repo->obterCategorias();
            SpecHelper::validarColecao($resultado, 5, CategoriaProduto::class);
        });

        it('deve mapear corretamente as propriedades do banco para o modelo', function () {
            $categorias = $this->repo->obterCategorias();
            $primeiraCategoria = $categorias[0];

            SpecHelper::validarAtributos($primeiraCategoria, [
                'id' => 5,
                'tipoProduto' => 'Bermudas'
            ]);
        });
    });

    describe('#obterCategorias - Cenários de Falha', function () {
        it('deve lançar RepositorioException quando a conexão com o banco for nula', function () {
            $repoSemPdo = new RepositorioCategoriaEmBDR(null);
            $closure = fn() => $repoSemPdo->obterCategorias();

            SpecHelper::esperarExcecao(
                $closure, 
                RepositorioException::class, 
                'Conexão com o banco de dados não disponível.'
            );
        });

        it('deve lançar RepositorioException em caso de erro de sintaxe SQL ou falha no PDO', function () {
            $this->pdo = null; 
            $repoErro = new RepositorioCategoriaEmBDR($this->pdo);
            $closure = fn() => $repoErro->obterCategorias();

            SpecHelper::esperarExcecao(
                $closure, 
                RepositorioException::class, 
                'Conexão com o banco de dados não disponível.'
            );
        });
    });
});