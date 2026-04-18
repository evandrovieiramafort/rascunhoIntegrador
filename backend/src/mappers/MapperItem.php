<?php

namespace App\Mappers;

use App\Models\Item;
use App\Dto\ItemDTO;

class MapperItem {

    public static function paraDTO(Item $item): ItemDTO {
        $precoFinal = $item->getPrecoVenda() * (1 - ($item->getPercentualDesconto() / 100));
        $estaEsgotado = $item->getQuantidadeEstoque() <= 0;

        return new ItemDTO(
            $item->getId(),
            $item->getFoto(),
            $item->getDescricao(),
            $item->getDescricaoDetalhada(),
            $item->getPrecoVenda(),
            $item->getPercentualDesconto(),
            (float) $precoFinal,
            $item->getQuantidadeEstoque(),
            $estaEsgotado
        );
    }

    /**
     * @param Item[] $itens
     * @return ItemDTO[]
     */
    public static function paraListaDTO(array $itens): array {
        $listaDTO = [];
        foreach ($itens as $item) {
            $listaDTO[] = self::paraDTO($item);
        }
        return $listaDTO;
    }
}