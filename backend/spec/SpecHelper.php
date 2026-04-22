<?php
namespace App\Test;

use phputil\router\{FakeHttpRequest, FakeHttpResponse, Router};
use function App\Infra\conectarAoDB;

class SpecHelper {
    public static function resetarBancoDeDados(): \PDO {
        $pdo = conectarAoDB('cefetshop_bd_test');
        $baseDir = __DIR__ . '/../src/sql/';
        $pdo->exec(file_get_contents($baseDir . 'cefetshop_bd_test.sql'));
        $pdo->exec(file_get_contents($baseDir . 'script_populacao_test.sql'));
        return $pdo;
    }

    public static function testarRota(string $caminho, string $metodo, string $arquivoRota, \PDO $pdo, array $corpo = []): FakeHttpResponse {
        $app = new Router();
        $registrarRotas = require __DIR__ . '/../src/routes/' . $arquivoRota;
        $registrarRotas($app, $pdo);

        $fakeReq = new FakeHttpRequest();
        $fakeReq->withURL($caminho)->withMethod($metodo);
        if (!empty($corpo)) {
            $fakeReq->withBody($corpo);
        }
        
        $fakeRes = new FakeHttpResponse();
        $app->listen(['req' => $fakeReq, 'res' => $fakeRes]);
        
        return $fakeRes;
    }
}