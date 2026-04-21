<?php

namespace App\Repositories;
use App\Models\CategoriaProduto;

interface RepositorioCategoria {
    /** @return list<CategoriaProduto> */
    public function obterCategorias(): array; 
}