<?php

namespace App\Mappers;

use App\Models\Carrinho;
use App\Dto\CarrinhoDTO;

class MapperCarrinho {
    public static function paraDTO(Carrinho $carrinho): CarrinhoDTO {
        $itensModel = $carrinho->getItens();
        $itensRevertidos = array_reverse($itensModel);

        return new CarrinhoDTO(
            $carrinho->getId(),
            MapperItemCarrinho::paraListaDTO($itensRevertidos),
            (float) $carrinho->getTotalGeral()
        );
    }
}