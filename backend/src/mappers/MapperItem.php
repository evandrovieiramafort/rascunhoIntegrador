<?php

namespace App\Mappers;

use App\Models\Item;
use App\Dto\ItemDTO;

class MapperItem {
    public static function paraDTO(Item $item): ItemDTO {
        $desconto = $item->getPercentualDesconto() / 100;
        $precoVenda = (float) $item->getPrecoVenda();
        $precoFinal = $precoVenda * (1 - $desconto);
        
        return new ItemDTO(
            $item->getId(),
            $item->getFoto(),
            $item->getDescricao(),
            $item->getDescricaoDetalhada(),
            $precoVenda,
            $item->getPeriodoLancamento(),
            $item->getPercentualDesconto(),
            (float) $precoFinal,
            $item->getQuantidadeEstoque(),
            $item->getQuantidadeEstoque() <= 0
        );
    }

    public static function paraListaDTO(array $itensModel): array {
        return array_map(fn($item) => self::paraDTO($item), $itensModel);
    }
}