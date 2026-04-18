<?php

namespace App\Repositories;
use App\Models\CategoriaProduto;

interface RepositorioCategoria{

    /**
     * @return CategoriaProduto[]
     */
    public function obterCategorias(): array; 
}