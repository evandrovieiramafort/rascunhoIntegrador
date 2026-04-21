<?php

namespace App\Dto;

class PaginacaoDTO {
    /**
     * @param list<ItemDTO> $itens
     */
    public function __construct(
        public readonly array $itens,
        public readonly int $paginaAtual,
        public readonly int $totalPaginas
    ) {}
}