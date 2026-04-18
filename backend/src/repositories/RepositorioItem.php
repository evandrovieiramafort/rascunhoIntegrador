<?php

namespace App\Repositories;

use App\Models\Item;

interface RepositorioItem {
    /**
     * @return Item[]
     */
    public function obterTodosOsItens(int $pagina): array;
    public function contarTotalItens(): int;
    public function ObterPorId(int $id): ?Item;
}