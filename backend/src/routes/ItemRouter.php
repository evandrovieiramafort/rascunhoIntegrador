<?php

use phputil\router\{HttpRequest, HttpResponse, Router};
use App\Services\ItemService;
use App\Repositories\RepositorioItemEmBDR;
use App\Exceptions\RepositorioException;
use App\Exceptions\DominioException;
use App\Exceptions\EntidadeNaoEncontradaException;
use App\Exceptions\FalhaNaBuscaException;

return function (Router $app, \PDO $pdo): void {
    $app->get(
        '/itens/:pagina',
        function (HttpRequest $req, HttpResponse $res) use ($pdo) {
            $servico = new ItemService(new RepositorioItemEmBDR($pdo));
            $pagina = (int) $req->param('pagina');

            try {
                $resultado = $servico->ObterTodosOsItens($pagina);
                $res->status(200)->json($resultado);
            } catch (EntidadeNaoEncontradaException $e) {
                $res->status(404)->json(['mensagem' => $e->getMessage()]);
            } catch (FalhaNaBuscaException $e) {
                $res->status(404)->json(['mensagem' => $e->getMessage()]);
            } catch (DominioException $e) {
                $res->status(400)->json(['mensagem' => $e->getMessage()]);
            } catch (RepositorioException $e) {
                $res->status(500)->json(['mensagem' => 'Erro interno de processamento de dados.']);
            } catch (\Throwable $e) {
                $res->status(500)->json(['mensagem' => 'Ocorreu um erro inesperado no servidor.']);
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
            } catch (EntidadeNaoEncontradaException $e) {
                $res->status(404)->json(['mensagem' => $e->getMessage()]);
            } catch (DominioException $e) {
                $res->status(400)->json(['mensagem' => $e->getMessage()]);
            } catch (RepositorioException $e) {
                $res->status(500)->json(['mensagem' => 'Erro interno de processamento de dados.']);
            } catch (\Throwable $e) {
                $res->status(500)->json(['mensagem' => 'Ocorreu um erro inesperado no servidor.']);
            }
        }
    );
};