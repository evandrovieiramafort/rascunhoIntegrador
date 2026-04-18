<?php

namespace App\Models;
class Carrinho {
    public function __construct(
        private string $id,
        private float $totalGeral = 0.0
    ) {}

    public function getId(): string {
        return $this->id;
    }

    public function getTotalGeral(): float {
        return $this->totalGeral;
    }
}
