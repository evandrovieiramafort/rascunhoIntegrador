<?php

namespace App\Repositories;

use App\Models\Item;
use App\Exceptions\RepositorioException;
use PDO;
use PDOException;

class ItemRepositorioEmBDR implements RepositorioItem
{

    public function __construct(private ?PDO $pdo) {}

    public function buscarMaisVendidos(int $pagina): array
    {
        try {
            $limite = 6;
            $offset = ($pagina - 1) * $limite;

            $ps = $this->pdo->prepare(Queries::ITEM_BUSCAR_MAIS_VENDIDOS);
            $ps->bindValue(':limite', $limite, PDO::PARAM_INT);
            $ps->bindValue(':offset', $offset, PDO::PARAM_INT);
            $ps->execute();

            $resultados = $ps->fetchAll(PDO::FETCH_ASSOC);
            $itens = [];

            foreach ($resultados as $resultado) {
                $itens[] = new Item(
                    (int)$resultado['id'],
                    (int)$resultado['categoria_id'],
                    $resultado['foto'],
                    $resultado['descricao'],
                    $resultado['descricao_detalhada'],
                    $resultado['periodo_lancamento'],
                    (float)$resultado['preco_venda'],
                    (float)$resultado['percentual_desconto'],
                    (int)$resultado['quantidade_estoque']
                );
            }

            return $itens;
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao buscar itens mais vendidos.', 0, $e);
        }
    }

    public function contarTotalItens(): int
    {
        try {
            $ps = $this->pdo->prepare(Queries::ITEM_CONTAR_TOTAL);
            $ps->execute();

            $resultado = $ps->fetchColumn();

            return $resultado !== false ? (int) $resultado : 0;
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao contar total de itens.', 0, $e);
        }
    }

    public function ObterPorId(int $id): ?Item
    {
        try {
            $ps = $this->pdo->prepare(Queries::ITEM_BUSCAR_POR_ID);
            $ps->execute([$id]);

            $resultado = $ps->fetch(PDO::FETCH_ASSOC);

            if ($resultado === false) {
                return null;
            }

            return new Item(
                (int)$resultado['id'],
                (int)$resultado['categoria_id'],
                $resultado['foto'],
                $resultado['descricao'],
                $resultado['descricao_detalhada'],
                $resultado['periodo_lancamento'],
                (float)$resultado['preco_venda'],
                (float)$resultado['percentual_desconto'],
                (int)$resultado['quantidade_estoque']
            );
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao buscar item por ID.', 0, $e);
        }
    }
}
