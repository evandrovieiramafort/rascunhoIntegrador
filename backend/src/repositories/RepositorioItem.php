<?php

namespace App\Repositories;

use App\Models\Item;

interface RepositorioItem {
    /** @return list<Item> */
    public function obterTodosOsItens(int $pagina): array;
    public function contarTotalItens(): int;
    public function ObterPorId(int $id): ?Item;
    public function atualizarEstoque(int $id, int $novaQuantidade): void;
}