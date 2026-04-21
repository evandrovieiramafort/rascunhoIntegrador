<?php

namespace App\Infra;

use PDO;
use Exception;

function conectarAoDB(string $nomeDB): PDO {
    $caminhoEnv = __DIR__ . '/../../env.php';
    
    if (!file_exists($caminhoEnv)) {
        throw new Exception("Arquivo env.php não encontrado na raiz do projeto.");
    }

    /** @var array{DB_HOST: string, DB_USER: string, DB_PASS: string} $env */
    $env = require $caminhoEnv;

    return new PDO(
        "mysql:dbname={$nomeDB};host={$env['DB_HOST']};charset=utf8mb4",
        $env['DB_USER'], 
        $env['DB_PASS'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
}