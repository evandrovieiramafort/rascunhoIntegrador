<?php

namespace App\Exceptions;

class FalhaNaBuscaException extends DominioException {
    public function __construct() {
        parent::__construct("A busca não retornou resultados.");
    }
}