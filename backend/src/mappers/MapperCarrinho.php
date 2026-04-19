<?php

namespace App\Mappers;

use App\Models\Carrinho;
use App\Dto\CarrinhoDTO;
use App\Dto\ItemCarrinhoDTO;
use App\Mappers\MapperItem; // Usa o seu MapperItem já existente

class MapperCarrinho {

    public static function paraDTO(Carrinho $carrinho): CarrinhoDTO {
        $itensDto = [];
        
        foreach ($carrinho->getItens() as $itemCarrinho) {
            $itemDto = MapperItem::paraDTO($itemCarrinho->getItem());
            
            $itensDto[] = new ItemCarrinhoDTO(
                $itemDto,
                $itemCarrinho->getQuantidade(),
                $itemCarrinho->getSubtotal()
            );
        }

        return new CarrinhoDTO(
            $carrinho->getId(),
            $itensDto,
            $carrinho->getTotalGeral()
        );
    }
}