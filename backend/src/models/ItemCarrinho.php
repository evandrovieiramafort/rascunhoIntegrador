<?php

namespace App\Models;

class ItemCarrinho {
    public function __construct(
        private string $carrinhoId,
        private Item $item,
        private int $quantidade,
        private float $subtotal
    ) {}

    public function getCarrinhoId(): string {
        return $this->carrinhoId;
    }

    public function getItem(): Item {
        return $this->item;
    }

    public function getQuantidade(): int {
        return $this->quantidade;
    }

    public function getSubtotal(): float {
        return $this->subtotal;
    }
}