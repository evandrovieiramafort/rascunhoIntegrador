<?php

namespace App\Repositories;

use App\Models\CategoriaProduto;
use App\Exceptions\RepositorioException;
use PDO;
use PDOException;

class RepositorioCategoriaEmBDR implements RepositorioCategoria {
    public function __construct(private ?PDO $pdo) {}

    public function obterCategorias(): array {
        if (!$this->pdo) {
            throw new RepositorioException('Conexão com o banco de dados não disponível.');
        }

        try {
            $ps = $this->pdo->prepare(Queries::CATEGORIA_BUSCAR_TODAS);
            $ps->execute();
            
            /** @var list<array{id: int|string, tipo_produto: string}> $resultados */
            $resultados = $ps->fetchAll(PDO::FETCH_ASSOC);
            $categorias = [];

            foreach ($resultados as $resultado) {
                $categorias[] = new CategoriaProduto(
                    (int)$resultado['id'],
                    $resultado['tipo_produto']
                );
            }

            return $categorias;
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao obter categorias.', 0, $e);
        }
    }
}