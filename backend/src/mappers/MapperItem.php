<?php

namespace App\Mappers;

use App\Models\Item;
use App\Dto\ItemDTO;

class MapperItem {
    public static function paraDTO(Item $item): ItemDTO {
        $desconto = (float) $item->getPercentualDesconto() / 100;
        $precoVenda = (float) $item->getPrecoVenda();
        $precoFinal = $precoVenda * (1 - $desconto);
        
        return new ItemDTO(
            $item->getId(),
            $item->getFoto(),
            $item->getDescricao(),
            $item->getDescricaoDetalhada(),
            $precoVenda,
            $item->getPeriodoLancamento(),
            (float) $item->getPercentualDesconto(),
            (float) $precoFinal,
            $item->getQuantidadeEstoque(),
            $item->getQuantidadeEstoque() <= 0
        );
    }

    /**
     * @param list<Item> $itensModel
     * @return list<ItemDTO>
     */
    public static function paraListaDTO(array $itensModel): array {
        return array_map(fn(Item $item) => self::paraDTO($item), $itensModel);
    }
}