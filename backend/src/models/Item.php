<?php

namespace App\Models;

class Item {
    public function __construct(
        public int $id,
        public int $categoriaId,
        public string $foto,
        public string $descricao,
        public string $descricaoDetalhada,
        public string $periodoLancamento,
        public float $precoVenda,
        public float $percentualDesconto,
        public int $quantidadeEstoque
    ) {}

    public function getId(): int {
        return $this->id;
    }

    public function getCategoriaId(): int {
        return $this->categoriaId;
    }

    public function getFoto(): string {
        return $this->foto;
    }

    public function getDescricao(): string {
        return $this->descricao;
    }

    public function getDescricaoDetalhada(): string {
        return $this->descricaoDetalhada;
    }

    public function getPeriodoLancamento(): string {
        return $this->periodoLancamento;
    }

    public function getPrecoVenda(): float {
        return $this->precoVenda;
    }

    public function getPercentualDesconto(): float {
        return $this->percentualDesconto;
    }

    public function getQuantidadeEstoque(): int {
        return $this->quantidadeEstoque;
    }
}

