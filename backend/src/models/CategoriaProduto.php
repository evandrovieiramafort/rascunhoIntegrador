<?php

namespace App\Models;

class CategoriaProduto {
    public function __construct(
        private int $id,
        private string $tipoProduto
    ) {}

    public function getId(): int {
        return $this->id;
    }

    public function getTipoProduto(): string {
        return $this->tipoProduto;
    }
}