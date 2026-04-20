<?php

namespace App\Exceptions;

class EntidadeNaoEncontradaException extends DominioException {
    public function __construct(string $entidade, string|int $id) {
        parent::__construct("{$entidade} com ID {$id} não encontrado.");
    }
}