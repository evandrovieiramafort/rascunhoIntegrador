<?php

namespace App\Dto;

class CarrinhoDTO {
    public function __construct(
        public readonly string $id,
        public readonly array $itens,
        public readonly float $totalGeral
    ) {}
}