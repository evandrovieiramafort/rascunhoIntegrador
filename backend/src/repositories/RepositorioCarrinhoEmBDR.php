<?php

namespace App\Repositories;

use App\Models\Carrinho;
use App\Models\ItemCarrinho;
use App\Models\Item;
use App\Exceptions\RepositorioException;
use PDO;
use PDOException;

class RepositorioCarrinhoEmBDR implements RepositorioCarrinho {

    public function __construct(private ?PDO $pdo) {}

    public function ObterCarrinhoPorId(string $id): ?Carrinho {
        try {
            $ps = $this->pdo->prepare(Queries::CARRINHO_BUSCAR_POR_ID);
            $ps->execute([$id]);
            $resultado = $ps->fetch(PDO::FETCH_ASSOC);

            if ($resultado === false) {
                return null;
            }

            return new Carrinho($resultado['id'], (float)$resultado['total_geral']);
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao obter carrinho por ID.', 0, $e);
        }
    }

    public function salvarCarrinho(Carrinho $carrinho): void {
        try {
            $ps = $this->pdo->prepare(Queries::CARRINHO_SALVAR);
            $ps->execute([$carrinho->getId(), $carrinho->getTotalGeral()]);
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao salvar o carrinho.', 0, $e);
        }
    }

    public function adicionarItemAoCarrinho(ItemCarrinho $item): void {
        try {
            $ps = $this->pdo->prepare(Queries::CARRINHO_ADICIONAR_ITEM);
            $ps->execute([
                $item->getCarrinhoId(),
                $item->getItem()->getId(),
                $item->getQuantidade(),
                $item->getSubtotal()
            ]);
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao adicionar item ao carrinho.', 0, $e);
        }
    }

    public function removerItem(string $carrinhoId, int $itemId): void {
        try {
            $ps = $this->pdo->prepare(Queries::CARRINHO_REMOVER_ITEM);
            $ps->execute([$carrinhoId, $itemId]);
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao remover item do carrinho.', 0, $e);
        }
    }

    public function ObterItensDoCarrinho(string $carrinhoId): array {
        try {
            $ps = $this->pdo->prepare(Queries::CARRINHO_BUSCAR_ITENS);
            $ps->execute([$carrinhoId]);
            
            $resultados = $ps->fetchAll(PDO::FETCH_ASSOC);
            $itensNoCarrinho = [];

            foreach ($resultados as $resultado) {
                $item = new Item(
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
                
                $itensNoCarrinho[] = new ItemCarrinho(
                    $resultado['carrinho_id'], 
                    $item, 
                    (int)$resultado['quantidade'], 
                    (float)$resultado['subtotal']
                );
            }

            return $itensNoCarrinho;
        } catch (PDOException $e) {
            throw new RepositorioException('Erro ao obter itens do carrinho.', 0, $e);
        }
    }
}