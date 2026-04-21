<?php

namespace App\Mappers;

use App\Models\ItemCarrinho;
use App\Dto\ItemCarrinhoDTO;

class MapperItemCarrinho {
    public static function paraDTO(ItemCarrinho $itemCarrinho): ItemCarrinhoDTO {
        return new ItemCarrinhoDTO(
            MapperItem::paraDTO($itemCarrinho->getItem()),
            $itemCarrinho->getQuantidade(),
            (float) $itemCarrinho->getSubtotal()
        );
    }

    /**
     * @param list<ItemCarrinho> $itens
     * @return list<ItemCarrinhoDTO>
     */
    public static function paraListaDTO(array $itens): array {
        $listaDTO = [];
        foreach ($itens as $item) {
            $listaDTO[] = self::paraDTO($item);
        }
        return $listaDTO;
    }
}