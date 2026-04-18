<?php

use App\Services\ItemService;
use App\Repositories\RepositorioItemEmBDR;

return function( $app ) {

    $app->get( '/itens/:pagina', function( $req, $res )  {
        $service = new ItemService( new RepositorioItemEmBDR() );
        $itens = $service->buscarMaisVendidos( (int) $req->param('pagina') );
        $total = $service->contarTotalItens();
        $res->json([
            'itens' => $itens,
            'total' => $total
        ]);
    } );

    $app->get( '/item/:id', function( $req, $res )  {
        $service = new ItemService( new RepositorioItemEmBDR() );
        $item = $service->obterPorId( (int) $req->param('id') );
        $res->json([
            'item' => $item
        ]);
    } );

};