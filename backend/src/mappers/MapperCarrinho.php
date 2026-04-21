<?php

namespace App\Mappers;

use App\Models\Carrinho;
use App\Dto\CarrinhoDTO;

class MapperCarrinho {
    public static function paraDTO(Carrinho $carrinho): CarrinhoDTO {
        return new CarrinhoDTO(
            $carrinho->getId(),
            MapperItemCarrinho::paraListaDTO($carrinho->getItens()),
            (float) $carrinho->getTotalGeral()
        );
    }
}