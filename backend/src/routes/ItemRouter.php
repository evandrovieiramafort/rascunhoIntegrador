<?php

require_once 'vendor/autoload.php';

use phputil\router\{HttpRequest, HttpResponse};
use App\Services\ItemService;
use App\Repositories\RepositorioItemEmBDR;
use App\Exceptions\RepositorioException;
use App\Exceptions\DominioException;



return function ($app, $pdo) {
    $app->get(
        '/itens/:pagina',
        function (HttpRequest $req, HttpResponse $res) use ($pdo) {

            $servico = new ItemService(new RepositorioItemEmBDR($pdo));
            $pagina = (int) $req->param('pagina');

            try {
                $resultado = $servico->ObterTodosOsItens($pagina);
                $res->status(200)->json($resultado);
            } catch (RepositorioException $e) {
                $res->status(500)->json(['mensagem' => $e->getMessage()]);
            } catch (DominioException $e) {
                $res->status(404)->json(['mensagem' => $e->getMessage()]);
            }
        }
    );
};
