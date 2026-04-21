<?php

namespace App\Repositories;

use App\Models\Item;
use App\Exceptions\RepositorioException;
use PDO;
use PDOException;

class RepositorioItemEmBDR implements RepositorioItem {
    public function __construct(private ?PDO $pdo) {}

    private function getPdo(): PDO {
        if (!$this->pdo) {
            throw new RepositorioException('Conexão com o banco de dados não disponível.');
        }
        return $this->pdo;
    }

    public function obterTodosOsItens(int $pagina = 1): array {
        try {
            $limite = 6;
            $offset = ($pagina - 1) * $limite;

            $ps = $this->getPdo()->prepare(Queries::ITEM_BUSCAR_MAIS_VENDIDOS);
            $ps->bindValue(':limite', $limite, PDO::PARAM_INT);
            $ps->bindValue(':offset', $offset, PDO::PARAM_INT);
            $ps->execute();

            /** @var list<array{id: int|string, categoria_id: int|string, foto: string, descricao: string, descricao_detalhada: string, periodo_lancamento: string, preco_venda: float|string, percentual_desconto: float|string, quantidade_estoque: int|string}> $resultados */
            $resultados = $ps->fetchAll(PDO::FETCH_ASSOC);
            $itens = [];

            foreach ($resultados as $res) {
                $itens[] = new Item(
                    (int)$res['id'],
                    (int)$res['categoria_id'],
                    $res['foto'],
                    $res['descricao'],
                    $res['descricao_detalhada'],
                    $res['periodo_lancamento'],
                    (float)$res['preco_venda'],
                    (float)$res['percentual_desconto'],
                    (int)$res['quantidade_estoque']
                );
            }

            return $itens;
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao buscar itens.', 0, $e);
        }
    }

    public function contarTotalItens(): int {
        try {
            $ps = $this->getPdo()->prepare(Queries::ITEM_CONTAR_TOTAL);
            $ps->execute();
            $resultado = $ps->fetchColumn();
            return $resultado !== false ? (int) $resultado : 0;
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao contar total de itens.', 0, $e);
        }
    }

    public function ObterPorId(int $id): ?Item {
        try {
            $ps = $this->getPdo()->prepare(Queries::ITEM_BUSCAR_POR_ID);
            $ps->execute([$id]);

            /** @var array{id: int|string, categoria_id: int|string, foto: string, descricao: string, descricao_detalhada: string, periodo_lancamento: string, preco_venda: float|string, percentual_desconto: float|string, quantidade_estoque: int|string}|false $res */
            $res = $ps->fetch(PDO::FETCH_ASSOC);

            if ($res === false) return null;

            return new Item(
                (int)$res['id'],
                (int)$res['categoria_id'],
                $res['foto'],
                $res['descricao'],
                $res['descricao_detalhada'],
                $res['periodo_lancamento'],
                (float)$res['preco_venda'],
                (float)$res['percentual_desconto'],
                (int)$res['quantidade_estoque']
            );
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao buscar item.', 0, $e);
        }
    }

    public function atualizarEstoque(int $id, int $novaQuantidade): void {
        try {
            $ps = $this->getPdo()->prepare(Queries::ITEM_ATUALIZAR_QUANTIDADE_ESTOQUE);
            $ps->execute([$novaQuantidade, $id]);
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao atualizar o estoque.', 0, $e);
        }
    }
}