<?php

namespace App\Infra;

use PDO;

function conectarAoDB(string $nomeDB) {
    return new PDO(
        "mysql:dbname={$nomeDB};host=localhost;charset=utf8mb4",
        'root', '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
}

?>