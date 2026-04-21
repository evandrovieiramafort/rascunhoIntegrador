<?php

namespace App\Repositories;

use App\Models\Carrinho;
use App\Models\ItemCarrinho;

class RepositorioCarrinhoEmSessao implements RepositorioCarrinho {
    public function __construct() {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start();
        }
        if (!isset($_SESSION['carrinho'])) {
            $_SESSION['carrinho'] = [];
        }
    }

    public function ObterCarrinhoPorId(string $id): ?Carrinho {
        /** @var array<string, string> $carrinhos */
        $carrinhos = $_SESSION['carrinho'] ?? [];
        if (isset($carrinhos[$id])) {
            $carrinho = unserialize($carrinhos[$id]);
            return $carrinho instanceof Carrinho ? $carrinho : null;
        }
        return null;
    }

    public function salvarCarrinho(Carrinho $carrinho): void {
        if (!isset($_SESSION['carrinho'])) {
            $_SESSION['carrinho'] = [];
        }
        /** @var array<string, string> $carrinhos */
        $carrinhos = $_SESSION['carrinho'];
        $carrinhos[$carrinho->getId()] = serialize($carrinho);
        $_SESSION['carrinho'] = $carrinhos;
    }

    public function adicionarItemAoCarrinho(ItemCarrinho $item): void {
        $carrinhoId = $item->getCarrinhoId();
        $carrinho = $this->ObterCarrinhoPorId($carrinhoId) ?? new Carrinho($carrinhoId);
        $carrinho->adicionarItem($item);
        $this->salvarCarrinho($carrinho);
    }

    public function removerItem(string $carrinhoId, int $itemId): void {
        $carrinho = $this->ObterCarrinhoPorId($carrinhoId);
        if ($carrinho) {
            $carrinho->removerItem($itemId);
            $this->salvarCarrinho($carrinho);
        }
    }

    /**
     * @return list<ItemCarrinho>
     */
    public function ObterItensDoCarrinho(string $carrinhoId): array {
        $carrinho = $this->ObterCarrinhoPorId($carrinhoId);
        return $carrinho ? $carrinho->getItens() : [];
    }
}