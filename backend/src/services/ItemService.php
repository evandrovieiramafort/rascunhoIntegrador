<?php

namespace App\Services;

use App\Models\Item;
use App\Repositories\RepositorioItem;
use App\Repositories\RepositorioItemEmBDR;

class ItemService {

    public function __construct(
        private RepositorioItemEmBDR $repositorio
    ) {
    }

    public function buscarMaisVendidos(int $pagina = 1): array
    {
        return $this->repositorio->buscarMaisVendidos($pagina);
    }

    public function contarTotalItens(): int
    {
        return $this->repositorio->contarTotalItens();
    }

    public function obterPorId(int $id): ?Item
    {
        return $this->repositorio->obterPorId($id);
    }
}