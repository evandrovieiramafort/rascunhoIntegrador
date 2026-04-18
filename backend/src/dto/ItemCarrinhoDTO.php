<?php

namespace App\Dto;

class ItemCarrinhoDTO {
    public function __construct(
        public readonly ItemDTO $item,
        public readonly int $quantidade,
        public readonly float $subtotal
    ) {}
}