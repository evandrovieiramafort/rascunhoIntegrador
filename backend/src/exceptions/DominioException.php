<?php

namespace App\Exceptions;

use RuntimeException;

const SEPARADOR = '|';

class DominioException extends RuntimeException {

    /**
     * @param string[] $problemas
     */
    public static function comProblemas(array $problemas): DominioException {
        return new DominioException(implode(SEPARADOR, $problemas));
    }

    /**
     * @return string[]
     */
    public function getProblemas() : array {
        return explode(SEPARADOR, $this->getMessage());
    }
}

?>