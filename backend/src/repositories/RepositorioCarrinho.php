<?php

namespace App\Repositories;

use App\Models\Carrinho;
use App\Models\ItemCarrinho;

interface RepositorioCarrinho {
    public function ObterCarrinhoPorId(string $id): ?Carrinho;
    public function salvarCarrinho(Carrinho $carrinho): void;
    public function adicionarItemAoCarrinho(ItemCarrinho $item): void;
    public function removerItem(string $carrinhoId, int $itemId): void;
    /** @return list<ItemCarrinho> */
    public function ObterItensDoCarrinho(string $carrinhoId): array;
}