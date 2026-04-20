<?php

namespace App\Exceptions;

class EstoqueInsuficienteException extends DominioException {
    public function __construct(string $nomeItem) {
        parent::__construct("Quantidade insuficiente em estoque para o item: {$nomeItem}.");
    }
}