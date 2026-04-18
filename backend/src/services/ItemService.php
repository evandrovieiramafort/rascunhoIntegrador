<?php

namespace App\Services;

use App\Repositories\RepositorioItem;
use App\Mappers\MapperItem;
use App\Dto\PaginacaoDTO;
use App\Exceptions\DominioException;

class ItemService {
    public function __construct(
        private readonly RepositorioItem $repositorio
    ) {}

    public function ObterTodosOsItens(int $pagina): PaginacaoDTO {
        $itensModel = $this->repositorio->obterTodosOsItens($pagina);
        
        if($itensModel == 0 ){
            throw new DominioException("A busca retornou zero resultados!");
        }
        
        $totalItens = $this->repositorio->contarTotalItens();
        $totalPaginas = (int) ceil($totalItens / 6);

        return new PaginacaoDTO(
            MapperItem::paraListaDTO($itensModel),
            $pagina,
            $totalPaginas
        );
    }
}