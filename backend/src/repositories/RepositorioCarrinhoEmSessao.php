<?php

namespace App\Repositories;

use App\Models\Carrinho;
use App\Models\ItemCarrinho;

class RepositorioCarrinhoEmSessao implements RepositorioCarrinho
{
    public function __construct()
    {
        if (!isset($_SESSION['carrinho'])) {
            $_SESSION['carrinho'] = [];
        }
    }

    public function ObterCarrinhoPorId(string $id): ?Carrinho
    {
        if (isset($_SESSION['carrinho'][$id])) {
            return unserialize($_SESSION['carrinho'][$id]);
        }
        return null;
    }

    public function salvarCarrinho(Carrinho $carrinho): void
    {
        $_SESSION['carrinho'][$carrinho->getId()] = serialize($carrinho);
    }

    public function adicionarItemAoCarrinho(ItemCarrinho $item): void
    {
        $carrinhoId = $item->getCarrinhoId();
        $carrinho = $this->ObterCarrinhoPorId($carrinhoId) ?? new Carrinho($carrinhoId);
        $carrinho->adicionarItem($item);
        $this->salvarCarrinho($carrinho);
    }

    public function removerItem(string $carrinhoId, int $itemId): void
    {
        $carrinho = $this->ObterCarrinhoPorId($carrinhoId);
        if ($carrinho) {
            $carrinho->removerItem($itemId);
            $this->salvarCarrinho($carrinho);
        }
    }

    public function ObterItensDoCarrinho(string $carrinhoId): array
    {
        $carrinho = $this->ObterCarrinhoPorId($carrinhoId);
        return $carrinho ? $carrinho->getItens() : [];
    }
}