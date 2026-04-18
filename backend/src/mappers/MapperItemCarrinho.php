<?php


namespace App\Mappers;

use App\Models\ItemCarrinho;
use App\Dto\ItemCarrinhoDTO;

class MapperItemCarrinho {

    public static function paraDTO(ItemCarrinho $itemCarrinho): ItemCarrinhoDTO {
        $itemDto = MapperItem::paraDTO($itemCarrinho->getItem());

        return new ItemCarrinhoDTO(
            $itemDto,
            $itemCarrinho->getQuantidade(),
            $itemCarrinho->getSubtotal()
        );
    }

    /**
     * @param ItemCarrinho[] $itens
     * @return ItemCarrinhoDTO[]
     */
    public static function paraListaDTO(array $itens): array {
        $listaDTO = [];
        foreach ($itens as $item) {
            $listaDTO[] = self::paraDTO($item);
        }
        return $listaDTO;
    }
}