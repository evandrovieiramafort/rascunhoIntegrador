<?php

require_once 'vendor/autoload.php';

use phputil\router\{HttpRequest, HttpResponse, Router};
use App\Services\CarrinhoService;
use App\Repositories\RepositorioCarrinhoEmSessao;
use App\Repositories\RepositorioItemEmBDR;
use App\Exceptions\DominioException;

return function (Router $app, \PDO $pdo): void {
    $repoSessao = new RepositorioCarrinhoEmSessao();
    $repoItem = new RepositorioItemEmBDR($pdo);
    $servico = new CarrinhoService($repoSessao, $repoItem);

    $app->get('/carrinho', function (HttpRequest $req, HttpResponse $res) use ($servico) {
        try {
            $resultado = $servico->obterCarrinho((string) session_id());
            $res->status(200)->json($resultado);
        } catch (\Exception $e) {
            $res->status(500)->json(['mensagem' => $e->getMessage()]);
        }
    });

    $app->post('/carrinho/item', function (HttpRequest $req, HttpResponse $res) use ($servico) {
        try {
            /** @var array{item_id?: int|string, quantidade?: int|string} $dados */
            $dados = (array) $req->body();
            $itemId = (int) ($dados['item_id'] ?? 0);
            $quantidade = (int) ($dados['quantidade'] ?? 1);

            $resultado = $servico->adicionarItem((string) session_id(), $itemId, $quantidade);
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
            /** @var array{quantidade?: int|string} $dados */
            $dados = (array) $req->body();
            $quantidade = (int) ($dados['quantidade'] ?? 1);

            $resultado = $servico->atualizarQuantidade((string) session_id(), $itemId, $quantidade);
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
            $resultado = $servico->removerItem((string) session_id(), $itemId);
            $res->status(200)->json($resultado);
        } catch (DominioException $e) {
            $res->status(400)->json(['mensagem' => $e->getMessage()]);
        } catch (\Exception $e) {
            $res->status(500)->json(['mensagem' => $e->getMessage()]);
        }
    });
};