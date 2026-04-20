<?php

namespace App\Dto;

class ItemDTO {
    public function __construct(
        public readonly int $id,
        public readonly string $foto,
        public readonly string $descricao,
        public readonly string $descricaoDetalhada,
        public readonly float $precoVenda,
        public readonly string $periodoLancamento,
        public readonly float $percentualDesconto,
        public readonly float $precoFinal,
        public readonly int $quantidadeEstoque,
        public readonly bool $estaEsgotado
    ) {}
}