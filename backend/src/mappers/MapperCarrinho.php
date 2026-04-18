<?php

namespace App\Mappers;

use App\Models\Carrinho;
use App\Dto\CarrinhoDTO;

class MapperCarrinho {

    /**
     * @param Carrinho $carrinho
     * @param \App\Dto\ItemCarrinhoDTO[] $itensDto
     */
    public static function paraDTO(Carrinho $carrinho, array $itensDto): CarrinhoDTO {
        return new CarrinhoDTO(
            $carrinho->getId(),
            $itensDto,
            $carrinho->getTotalGeral()
        );
    }
}