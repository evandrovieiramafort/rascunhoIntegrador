<?php

namespace App\Services;

use App\Repositories\RepositorioItem;
use App\Mappers\MapperItem;
use App\Dto\PaginacaoDTO;
use App\Exceptions\EntidadeNaoEncontradaException;
use App\Exceptions\FalhaNaBuscaException;
use App\Models\Item;

class ItemService {
    public function __construct(
        private readonly RepositorioItem $repositorio
    ) {}

    public function ObterTodosOsItens(int $pagina): PaginacaoDTO {
        $itensModel = $this->repositorio->obterTodosOsItens($pagina);
        
        if (empty($itensModel)) {
            throw new FalhaNaBuscaException();
        }
        
        $totalItens = $this->repositorio->contarTotalItens();
        $totalPaginas = (int) ceil($totalItens / 6);

        return new PaginacaoDTO(
            MapperItem::paraListaDTO($itensModel),
            $pagina,
            $totalPaginas
        );
    }

    public function ObterPorId(int $id) {
        return MapperItem::paraDTO($this->buscarItem($id));
    }

    public function buscarItem(int $id): Item {
        $item = $this->repositorio->obterPorId($id);
        if (!$item) {
            throw new EntidadeNaoEncontradaException("Item", $id);
        }
        return $item;
    }
}