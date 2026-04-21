<?php

use App\Repositories\RepositorioCategoriaEmBDR;
use function App\Infra\conectarAoDB;
use App\Exceptions\RepositorioException;

describe('RepositorioCategoriaEmBDR', function () {
    beforeAll(function () {
        $this->pdo = conectarAoDB('cefetshop_bd_test');
        
        $caminhoSchema = __DIR__ . '/../../src/sql/cefetshop_bd_test.sql';
        $caminhoDados = __DIR__ . '/../../src/sql/script_populacao_test.sql';

        $this->pdo->exec(file_get_contents($caminhoSchema));
        $this->pdo->exec(file_get_contents($caminhoDados));

        $this->repo = new RepositorioCategoriaEmBDR($this->pdo);
    });

    describe('#obterCategorias - cenários de sucesso', function () {
        it('deve retornar exatamente 5 categorias', function () {
            $resultado = $this->repo->obterCategorias();
            
            /** @var mixed $total */
            $total = count($resultado);
            expect($total)->toBe(5);
        });

        it('deve conter a categoria "Canecas" entre os resultados', function () {
            $categorias = $this->repo->obterCategorias();
            
            /** @var mixed $nomes */
            $nomes = array_map(fn($c) => $c->getTipoProduto(), $categorias);
            expect($nomes)->toContain('Canecas');
        });
    });

    describe('#obterCategorias - Cenários de Falha', function () {
    it('deve lançar RepositorioException quando a conexão com o banco for nula', function () {
        $repoSemPdo = new RepositorioCategoriaEmBDR(null);

        $closure = function () use ($repoSemPdo) {
            $repoSemPdo->obterCategorias();
        };

        /** @var mixed $expectation */
        $expectation = expect($closure);

        $expectation->to->throw(new RepositorioException('Conexão com o banco de dados não disponível.')); 
    });
});
});