<?php

require_once 'vendor/autoload.php';

use phputil\router\{HttpRequest, HttpResponse};
use App\Services\CarrinhoService;
use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Repositories\RepositorioItemEmBDR;
use App\Exceptions\DominioException;

return function ($app, $pdo) {
    $repoSessao = new RepositorioCarrinhoEmSessao();
    $repoItem = new RepositorioItemEmBDR($pdo);
    $servico = new CarrinhoService($repoSessao, $repoItem);

    $app->get('/carrinho', function (HttpRequest $req, HttpResponse $res) use ($servico) {
        try {
            $resultado = $servico->obterCarrinho(session_id());
            $res->status(200)->json($resultado);
        } catch (\Exception $e) {
            $res->status(500)->json(['mensagem' => $e->getMessage()]);
        }
    });

    $app->post('/carrinho/item', function (HttpRequest $req, HttpResponse $res) use ($servico) {
        try {
            $dados = (array) $req->body();
            $itemId = (int) ($dados['item_id'] ?? 0);
            $quantidade = (int) ($dados['quantidade'] ?? 1);

            $resultado = $servico->adicionarItem(session_id(), $itemId, $quantidade);
            $res->status(200)->json($resultado);
        } catch (DominioException $e) {
            $res->status(400)->json(['mensagem' => $e->getMessage()]);
        } catch (\Exception $e) {
            $res->status(500)->json(['mensagem' => $e->getMessage()]);
        }
    });

    $app->put('/carrinho/item/:id', function (HttpRequest $req, HttpResponse $res) use ($servico) {
        try {
            $itemId = (int) $req->param('id');
            $dados = (array) $req->body();
            $quantidade = (int) ($dados['quantidade'] ?? 1);

            $resultado = $servico->atualizarQuantidade(session_id(), $itemId, $quantidade);
            $res->status(200)->json($resultado);
        } catch (DominioException $e) {
            $res->status(400)->json(['mensagem' => $e->getMessage()]);
        } catch (\Exception $e) {
            $res->status(500)->json(['mensagem' => $e->getMessage()]);
        }
    });

    $app->delete('/carrinho/item/:id', function (HttpRequest $req, HttpResponse $res) use ($servico) {
        try {
            $itemId = (int) $req->param('id');
            $resultado = $servico->removerItem(session_id(), $itemId);
            $res->status(200)->json($resultado);
        } catch (\Exception $e) {
            $res->status(500)->json(['mensagem' => $e->getMessage()]);
        }
    });
};