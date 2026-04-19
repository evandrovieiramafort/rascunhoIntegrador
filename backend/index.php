<?php
require_once 'vendor/autoload.php';
require_once __DIR__ . '/src/Infra/ConexaoDB.php';

use phputil\router\Router;
use function App\Infra\conectarAoDB;
use function phputil\cors\cors;

const NOME_DB = "cefetshop_bd_prd";

$pdo = null;
try {
    $pdo = conectarAoDB(NOME_DB);
} catch (PDOException $e) {
    http_response_code(500);
    die('Erro ao conectar com o banco de dados.');
}

$app = new Router();
$app->use(cors());

$rotas = [
    __DIR__ . '/src/routes/ItemRouter.php',
];

foreach ($rotas as $r) {
    $f = require_once $r;
    $f($app, $pdo);
}

$app->listen();