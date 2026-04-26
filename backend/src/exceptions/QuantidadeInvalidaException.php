<?php

namespace App\Exceptions;

class QuantidadeInvalidaException extends DominioException {
    public function __construct(string $nomeItem) {
        parent::__construct("Quantidade inválida para o item: {$nomeItem}.");
    }
}