<?php
require_once 'vendor/autoload.php';

use phputil\router\Router;
use function phputil\cors\cors;

$app = new Router();
$app->use( cors() );

$app->get( '/', function( $req, $res ) {
    $res->redirect( '/itens/1' );
} );

$rotas = [
    __DIR__ . '/src/routes/item.php',
];

foreach ( $rotas as $r ) {
    $f = require_once $r;
    $f( $app );
}

$app->listen();