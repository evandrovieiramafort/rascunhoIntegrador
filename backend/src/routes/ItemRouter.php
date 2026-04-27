<?php

use phputil\router\{HttpRequest, HttpResponse, Router};
use App\Presenters\ItemPresenter;
use App\Repositories\RepositorioItemEmBDR;
use App\Exceptions\DominioException;
use App\Exceptions\NaoEncontradoException;

return function (Router $app, \PDO $pdo): void {
    
    $app->get('/itens/:pagina', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        $servico = new ItemPresenter(new RepositorioItemEmBDR($pdo));
        $pagina = (int) $req->param('pagina');

        try {
            $resultado = $servico->ObterTodosOsItens($pagina);
            $res->status(200)->json($resultado);
        } catch (NaoEncontradoException $e) {
            $res->status(404)->json(['mensagem' => $e->getMessage()]);
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (\Throwable $e) {
            $res->status(500)->json(['mensagem' => 'Erro interno no servidor.']);
        }
    });

    $app->get('/item/:id', function (HttpRequest $req, HttpResponse $res) use ($pdo) {
        $servico = new ItemPresenter(new RepositorioItemEmBDR($pdo));
        $id = (int) $req->param('id');

        try {
            $resultado = $servico->ObterPorId($id);
            $res->status(200)->json($resultado);
        } catch (NaoEncontradoException $e) {
            $res->status(404)->json(['mensagem' => $e->getMessage()]);
        } catch (DominioException $e) {
            $res->status(400)->json(['erros' => $e->getProblemas()]);
        } catch (\Throwable $e) {
            $res->status(500)->json(['mensagem' => 'Erro interno no servidor.']);
        }
    });
};