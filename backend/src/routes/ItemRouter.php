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

    $app->get(
        '/item/:id',
        function (HttpRequest $req, HttpResponse $res) use ($pdo) {

            $servico = new ItemService(new RepositorioItemEmBDR($pdo));
            $id = (int) $req->param('id');

            try {
                $resultado = $servico->ObterPorId($id);
                $res->status(200)->json($resultado);
            } catch (RepositorioException $e) {
                $res->status(500)->json(['mensagem' => $e->getMessage()]);
            } catch (DominioException $e) {
                $res->status(404)->json(['mensagem' => $e->getMessage()]);
            }
        }
    );

    $app->patch(
        '/item/:id/estoque',
        function (HttpRequest $req, HttpResponse $res) use ($pdo) {
            $repo = new RepositorioItemEmBDR($pdo);
            $id = (int) $req->param('id');
            $dados = (array) $req->body();
            $quantidadeDesejada = (int) ($dados['quantidade'] ?? 0);

            try {
                $item = $repo->ObterPorId($id);
                if (!$item) {
                    return $res->status(404)->json(['mensagem' => 'Item não encontrado']);
                }
                $novoEstoque = $item->getQuantidadeEstoque() - $quantidadeDesejada;

                if ($novoEstoque < 0) {
                    return $res->status(400)->json(['mensagem' => 'Estoque insuficiente']);
                }

                $repo->atualizarEstoque($id, $novoEstoque);
                $res->status(200)->json(['mensagem' => 'Estoque atualizado', 'novo_estoque' => $novoEstoque]);
            } catch (Exception $e) {
                $res->status(500)->json(['mensagem' => $e->getMessage()]);
            }
        }
    );
};
