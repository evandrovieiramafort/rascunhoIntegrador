<?php
require_once 'vendor/autoload.php';

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

$app->get('/', function ($req, $res) {
    $res->redirect('/itens/1');
});

$rotas = [
    __DIR__ . '/src/routes/item.php',
];

foreach ($rotas as $r) {
    $f = require_once $r;
    $f($app, $pdo);
}

$app->listen();
