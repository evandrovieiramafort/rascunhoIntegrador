<?php

namespace App\Dto;

class PaginacaoDTO {
    public function __construct(
        public readonly array $itens,
        public readonly int $paginaAtual,
        public readonly int $totalPaginas
    ) {}
}