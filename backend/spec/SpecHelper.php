<?php
namespace App\Test;

use function App\Infra\conectarAoDB;

class SpecHelper {
    public static function resetarBancoDeDados(): \PDO {
        $pdo = conectarAoDB('cefetshop_bd_test');
        $baseDir = __DIR__ . '/../src/sql/';
        $pdo->exec(file_get_contents($baseDir . 'cefetshop_bd_test.sql'));
        $pdo->exec(file_get_contents($baseDir . 'script_populacao_test.sql'));
        return $pdo;
    }
}