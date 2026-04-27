<?php

namespace App\Presenters;

use App\Repositories\RepositorioItem;
use App\Mappers\MapperItem;
use App\Dto\{PaginacaoDTO, ItemDTO};
use App\Exceptions\{NaoEncontradoException};
use App\Models\Item;

class ItemPresenter {
    private const ITENS_POR_PAGINA = 6;

    public function __construct(
        private readonly RepositorioItem $repositorio
    ) {}

    public function ObterTodosOsItens(int $pagina): PaginacaoDTO {
        $itensModel = $this->repositorio->obterTodosOsItens($pagina);
        
        if (empty($itensModel)) {
            throw NaoEncontradoException::paraBusca();
        }
        
        $totalItens = $this->repositorio->contarTotalItens();
        $totalPaginas = (int) ceil($totalItens / self::ITENS_POR_PAGINA);

        return new PaginacaoDTO(
            MapperItem::paraListaDTO($itensModel),
            $pagina,
            $totalPaginas
        );
    }

    public function ObterPorId(int $id): ItemDTO {
        return MapperItem::paraDTO($this->buscarItem($id));
    }

    public function buscarItem(int $id): Item {
        $item = $this->repositorio->obterPorId($id);
        if (!$item) {
            throw NaoEncontradoException::paraEntidade("Item", $id);
        }
        return $item;
    }
}