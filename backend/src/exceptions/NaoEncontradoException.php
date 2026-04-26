<?php

namespace App\Exceptions;

// Agora herda de DominioException, garantindo que o Router saiba lidar com ela
class NaoEncontradoException extends DominioException {
    
    public function __construct(string $mensagem = "O recurso solicitado não foi encontrado.") {
        parent::__construct($mensagem);
    }


    public static function paraEntidade(string $entidade, string|int $id): self {
        return new self("{$entidade} com ID {$id} não encontrado.");
    }

    public static function paraBusca(): self {
        return new self("A busca não retornou resultados.");
    }
}